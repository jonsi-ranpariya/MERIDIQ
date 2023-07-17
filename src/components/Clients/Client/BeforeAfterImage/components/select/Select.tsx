import LoadingIcon from "@icons/Loading";
import Dropzone from "dropzone";
import { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import useSWRInfinite from 'swr/infinite';
import api from "../../../../../../configs/api";
import { commonFetch } from "../../../../../../helper";
import { CommonModelPaginatedResponse, Error } from "../../../../../../interfaces/common";
import { File as ModelFile } from "../../../../../../interfaces/model/File";
import { MediaData } from "../../../../../../interfaces/model/media_data";
import strings from "../../../../../../lang/Lang";
import Button from '@components/form/Button';
import Card from "../../../../../../partials/Paper/PagePaper";

export const toBase64 = async (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = (error) => reject(error);
});

export interface SelectProps {
  image?: File | Blob
  setImage: Dispatch<SetStateAction<File | Blob | undefined>>
  text: string,
  onNext: () => void
}

const Select: FC<SelectProps> = ({
  image,
  text,
  setImage,
  onNext = () => {},
}) => {

  const [selectedImage, setSelectedImage] = useState<string>()
  const [loading, setLoading] = useState<number>()

  const { clientId }: {
    clientId?: string
  } = useParams()

  const { data: mediaData, error: mediaError, size, setSize } = useSWRInfinite<CommonModelPaginatedResponse<MediaData>, Error>((pageIndex) => {
    return api.clientMedia(clientId, pageIndex + 1)
  }, commonFetch);

  const isLoadingInitialData = !mediaData && !mediaError;
  const isEmpty = mediaData?.[0].data.length === 0;
  const isLoadingMore = isLoadingInitialData || (size > 0 && mediaData && typeof mediaData[size - 1] === "undefined");
  const isReachingEnd = isEmpty || (mediaData && mediaData[mediaData.length - 1]?.data.length < 5);

  const files = useMemo(() => mediaData?.flatMap(m => m.data.flatMap(v => v.data)) ?? [], [mediaData]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string>()
  const [myDropzone, setMyDropzone] = useState<Dropzone>();

  useEffect(() => {
    Dropzone.autoDiscover = false

    console.log(myDropzone);
    if (!myDropzone) {
      setMyDropzone(new Dropzone("#form-select", {
        url: '/api/some',
        acceptedFiles: '.jpg,.jpeg,.png',
        autoProcessQueue: false,
        maxFiles: 1,
        uploadMultiple: false,
      }));
    }

    return () => {
      if (myDropzone) {
        myDropzone.files = []
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  myDropzone?.on("maxfilesexceeded", function (file) {
    myDropzone.removeAllFiles();
    myDropzone.addFile(file);
  });

  myDropzone?.on("addedfile", async (file) => {
    if (!file) return
    setImage(file)

    await toBase64(file).then((val) => {
      setSelectedImage(val)
      onNext()
    })
  });

  async function selectMediaImage(file: ModelFile) {
    if (loading !== undefined) return;
    setLoading(file.id)
    const response = await fetch(file.url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });

    const data = await response.blob();
    setImage(data)

    await toBase64(data).then((val) => {
      setSelectedImage(val)
      setLoading(undefined)
      onNext()
    })
  }

  return (
    <div className="h-screen">
      <Card>
        <div className="flex flex-col h-full">
          <p className='mb-2 text-sm text-center'>{text}</p>
          <button
            aria-label="asdasd"
            id="form-select"
            className="border-gray-500 flex-grow inline-block h-full w-full p-4 text-center border border-dashed dark:hover:bg-gray-800 dark:hover:border-gray-400 hover:bg-gray-100 hover:border-black rounded-md min-h-[40vh]"
          >
            {selectedImage
              ? <img src={selectedImage} className="border border-gray-600 max-h-80 max-w-96" alt="Selected" />
              : <p>{strings.clientBeforeAfterSelectText}</p>
            }
          </button>
          {
            error?.length &&
            <p className="text-red-500 mt-4">{error}</p>
          }
        </div>
        <div className="pt-4">
          <h4 className="mb-1 font-medium text-lg">{strings.clientMediaSelect}</h4>
          {files.length === 0 && <p className="text-gray-500">{strings.no_data}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {files.map(file =>
              <div className="relative" key={`image_file_${file.id}`}>
                <img
                  className="bg-gray-200 dark:bg-gray-800 rounded w-full h-36 object-contain cursor-pointer hover:opacity-90 transition-all"
                  src={`${api.storage}${file.thumbnail ?? file.filename}`}
                  alt={file.thumbnail ?? file.filename}
                  loading="lazy"
                  onClick={() => selectMediaImage(file)}
                />
                {
                  loading === file.id &&
                  <span className="absolute z-10 bg-black/30 inset-0 flex justify-center items-center">
                    <LoadingIcon />
                  </span>
                }
              </div>
            )}
          </div>
          {(mediaData && !error && !isEmpty && !isReachingEnd) && <Button
            className="mt-4"
            loading={isLoadingMore}
            disabled={isLoadingMore}
            onClick={() => setSize(size + 1)}
          >
            {strings.loadMore}
          </Button>}
        </div>
      </Card>
    </div>
  );
}

export default Select;