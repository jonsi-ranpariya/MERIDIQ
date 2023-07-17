import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import Moveable from "react-moveable";
import useEditor from "../../../../../../hooks/useEditor";
import { getExportParams } from "../../../../../../hooks/useExportParams";
import { useScale } from "../../../../../../hooks/useScale";
import useSideBar from "../../../../../../hooks/useSideBar";
import strings from "../../../../../../lang/Lang";
import Button from '@components/form/Button';
import { isiOS } from "../../helpers/image";
import ButtonGroup from '../button/SideBySideButtons';

export interface movableProps {
  image: File | Blob
  beforeImage?: File | Blob,
  onNext: () => void,
  onBack: () => void,
  setImage: Dispatch<SetStateAction<File | Blob | undefined>>
}

// const tempImageUrl = 'https://i.picsum.photos/id/193/800/1000.jpg?hmac=z5Bc8udHYu6GNr8aoh2-ovJShdOijye0E59kPGWsic0';

// export type RefType = 

const Movable: FC<movableProps> = ({
  image,
  beforeImage,
  setImage,
  onNext,
  onBack
}) => {

  const [imageLoading, setImageLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState(false)

  const { aspectRatio, setAspectRatio, wrapperSize } = useEditor()

  const url = useMemo(() => image && URL.createObjectURL(image), [image])
  const beforeImageUrl = useMemo(() => beforeImage && URL.createObjectURL(beforeImage), [beforeImage])

  const target = document.getElementById('editor-image')
  const scale = useScale()
  const { sideBarSticked } = useSideBar();


  const removeClass = (value: boolean) => {
    const node = document.getElementById('editor-image') as HTMLDivElement | undefined
    const hideControlsWrapper = document.getElementById('hide-controls-wrapper') as HTMLDivElement | undefined

    if (value) {
      hideControlsWrapper?.classList.add('hide-controls')
      node?.classList.remove('opacity-60')
    } else {
      hideControlsWrapper?.classList.remove('hide-controls')
      node?.classList.add('opacity-60')
    }
  }

  const iOSGenerateImage = async () => {
    const node = document.getElementById('editor-wrapper') as HTMLDivElement
    const exportParams = getExportParams(node, scale)

    const dataUrl = await import('html2canvas')
      .then(async ({ default: html2canvas }) => {
        return await html2canvas(node, {
          windowHeight: exportParams.height,
          windowWidth: exportParams.width,
        })
      });
    dataUrl.toBlob((blob) => {
      if (blob) {
        if (beforeImageUrl) {
          removeClass(false)
        }
        setImage(blob)
        onNext()
      }
      setLoading(false)
    })
  }

  const onNextIn = () => {
    if (loading) return;
    setLoading(true)
    removeClass(true)
    if (isiOS()) {
      iOSGenerateImage()
      return;
    }

    const node = document.getElementById('editor-wrapper') as HTMLDivElement
    const exportParams = getExportParams(node, scale)
    import('dom-to-image')
      .then(async ({ default: domtoimage }) => {
        domtoimage.toBlob(node, exportParams).then((dataUrl) => {
          setImage(dataUrl)
          onNext()
          setLoading(false)
          if (beforeImageUrl) {
            removeClass(false)
          }
        }).catch(function (error) {
          alert('Oops, something went wrong!')
          console.error('oops, something went wrong!', error)
          setLoading(false)
          if (beforeImageUrl) {
            removeClass(false)
          }
        });
      });
  }

  useEffect(() => {
    const body = document.body
    body.style.overflow = 'hidden'
    return () => {
      body.style.overflow = ''
    }
  }, [])

  return (
    <div className="flex flex-col overflow-hidden">
      <div id="hide-controls-wrapper" className={`p-2 flex-grow flex justify-center pb-14 items-center ${loading && 'hide-controls'}`}>
        <div className="bg-white dark:bg-gray-800">
          <div id='editor-wrapper' className="overflow-hidden" style={{ aspectRatio: aspectRatio, height: wrapperSize?.height, width: wrapperSize?.width }}>
            {
              (!!beforeImageUrl && !loading) &&
              <img src={beforeImageUrl} alt="Before" className="absolute" style={{ height: wrapperSize?.height, width: wrapperSize?.width }} />
            }
            <img
              src={url}
              alt={url}
              id="editor-image"
              className={`${(!!beforeImageUrl && !loading) && 'opacity-60'}`}
              onLoad={() => setImageLoading(false)}
            />
            {imageLoading ? <p>Loading ...</p> :
              <Moveable
                target={target}
                container={null}
                origin={false}

                /* draggable */
                draggable={loading ? false : true}
                throttleDrag={0}
                onDrag={({ target, transform }) => target!.style.transform = transform}

                /* When resize or scale, keeps a ratio of the width, height. */
                keepRatio={true}
                scalable={true}
                onScale={({ target, transform }) => target!.style.transform = transform}

                /* rotatable */
                rotatable={true}
                throttleRotate={0}
                onRotate={({ target, transform, }) => target!.style.transform = transform}
                pinchable={true}
              />
            }
          </div>
        </div>
      </div>

      <div className={`flex space-x-2 justify-center items-center z-[9999] py-2 bg-white dark:bg-gray-800 w-full fixed bottom-0 left-0 ${sideBarSticked ? 'lg:ml-14 lg:pr-14' : 'lg:ml-72 lg:pr-72'}`}>
        <Button onClick={onBack}>
          {strings.back}
        </Button>
        {
          !beforeImageUrl &&
          <ButtonGroup>
            <ButtonGroup.Button selected={aspectRatio === "1/1"} onClick={() => setAspectRatio('1/1')}>
              1:1
            </ButtonGroup.Button>
            <ButtonGroup.Button selected={aspectRatio === "16/9"} onClick={() => setAspectRatio('16/9')}>
              16:9
            </ButtonGroup.Button>
          </ButtonGroup>
        }
        <Button loading={loading} onClick={onNextIn}>
          {strings.next}
        </Button>
      </div>
    </div>
  );
}

export default Movable;