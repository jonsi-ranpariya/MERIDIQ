import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../../../configs/api";
import { makeXMLRequest } from "../../../../../helper";
import useEditor from "../../../../../hooks/useEditor";
import { getExportParams } from "../../../../../hooks/useExportParams";
import { useScale } from "../../../../../hooks/useScale";
import useSideBar from "../../../../../hooks/useSideBar";
import strings from "../../../../../lang/Lang";
import MediaIcon from "../../../../../partials/Icons/ClientProfile/Media";
import Button from '@components/form/Button';
import ButtonGroup from '../components/button/SideBySideButtons';
import DownloadIcon from "../components/icons/Download";
import FullscreenIcon from "../components/icons/Fullscreen";
import ImageSlider from "../components/slider/ImageSlider";
import SideBySide from "../components/slider/SideBySide";
import { openFullscreen } from "../helpers/image";
import BackToClientDashboard from "../../sections/BackToClientDashboard";

export interface DownloadProps {

}

const Download: FC<DownloadProps> = () => {

  const { beforeImage, afterImage, fullscreen } = useEditor()
  const { clientId }: { clientId?: string } = useParams();

  const beforeImageUrl = useMemo(() => beforeImage ? URL.createObjectURL(beforeImage) : "", [beforeImage])
  const afterImageUrl = useMemo(() => afterImage ? URL.createObjectURL(afterImage) : "", [afterImage])

  const [sideBySide, setSideBySide] = useState(false)

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const scale = useScale()
  const { sideBarSticked } = useSideBar();

  const onDownload = () => {
    if (loading) return;
    setLoading(true)
    const node = document.getElementById('slider-wrapper') as HTMLDivElement;
    const exportParams = getExportParams(node, scale)
    import('dom-to-image')
      .then(async ({ default: domtoimage }) => {
        domtoimage.toBlob(node, exportParams).then((dataUrl) => {
          domtoimage.toBlob(node, exportParams).then((dataUrl1) => {
            const meta = sideBySide ? 'side_by_side' : '50_50';

            const a = document.createElement('a');
            a.href = URL.createObjectURL(dataUrl1);
            a.setAttribute('download', `MERIDIQ_before_after_${meta}.png`);
            a.click();
            setLoading(false)
          })
        }).catch((err) => {
          alert('Oops! something went wrong')
          console.log('Oops! something went wrong', err);
          setLoading(false)
        })
      })
  }

  const onSaveToMedia = () => {
    if (saving) return;
    setSaving(true)
    const node = document.getElementById('slider-wrapper') as HTMLDivElement;
    const exportParams = getExportParams(node, scale)
    import('dom-to-image')
      .then(async ({ default: domtoimage }) => {
        domtoimage.toBlob(node, exportParams).then((dataUrl) => {
          domtoimage.toBlob(node, exportParams).then(async (dataUrl1) => {
            const meta = sideBySide ? 'side_by_side' : '50_50';

            const formData = new FormData();
            const file = new File(
              [dataUrl1],
              `MERIDIQ_before_after_${meta}.png`,
              {
                type: dataUrl1.type,
                lastModified: new Date().getTime()
              }
            )

            formData.set(`files[0]`, file);

            const response = await makeXMLRequest(
              'POST',
              api.clientMediaStore.replace(':id', clientId!),
              formData,
              (e) => {},
            );

            const data = JSON.parse(response.response);
            if (data.status === '1') {
              toast.success(data.message);
            } else {
              toast.error(data.message || 'server error, please contact admin.');
            }
            setSaving(false)
          })
        }).catch((err) => {
          alert('Oops! something went wrong')
          console.log('Oops! something went wrong', err);
          setSaving(false)
        })
      })
  }

  const onFullScreen = () => {
    const wrapper = document.getElementById('fullScreenWrapper') as HTMLDivElement;
    openFullscreen(wrapper);
  }

  const imageLoaded = beforeImageUrl && afterImageUrl
  const onSlider = () => setSideBySide(false)
  const onSideBySide = () => setSideBySide(true)

  return (
    <div>
      <BackToClientDashboard />
      <div className={`flex-grow mx-auto ${fullscreen && 'h-screen'} flex items-center justify-center ${(loading || saving) && 'downloading'}`}>
        {(imageLoaded && !sideBySide) && <ImageSlider beforeImageUrl={beforeImageUrl} afterImageUrl={afterImageUrl} />}
        {(imageLoaded && sideBySide) && <SideBySide beforeImageUrl={beforeImageUrl} afterImageUrl={afterImageUrl} />}
      </div>

      <div className={`flex space-x-2 flex-wrap justify-center items-center z-[9999] py-2 bg-white dark:bg-gray-800 w-full fixed bottom-0 left-0 ${sideBarSticked ? 'lg:ml-14 lg:pr-14' : 'lg:ml-72 lg:pr-72'}`}>
        <Button onClick={onFullScreen}>
          <span className="hidden sm:inline-block">{strings.fullscreen}</span>
          <span className="inline sm:hidden text-lg"><FullscreenIcon /></span>
        </Button>
        <ButtonGroup>
          <ButtonGroup.Button selected={!sideBySide} onClick={onSlider}>50|50</ButtonGroup.Button>
          <ButtonGroup.Button selected={sideBySide} onClick={onSideBySide}>Side by Side</ButtonGroup.Button>
        </ButtonGroup>
        <Button loading={loading} onClick={onDownload}>
          <span className="hidden sm:inline-block">{strings.download}</span>
          <span className="inline sm:hidden text-lg"><DownloadIcon /></span>
        </Button>
        <Button loading={saving} onClick={onSaveToMedia}>
          <span className="hidden sm:inline-block">{strings.add_to_client_media}</span>
          <span className="inline sm:hidden text-lg"><MediaIcon /></span>
        </Button>
      </div>
    </div >
  );
}

export default Download;