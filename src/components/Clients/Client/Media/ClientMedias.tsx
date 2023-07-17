
import Card from "@components/card";
import AddButton from "@components/form/AddButton";
import Button from "@components/form/Button";
import Heading from "@components/heading/Heading";
import Skeleton from "@components/Skeleton/Skeleton";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'; // import plugin
import LocalizedFormat from 'dayjs/plugin/localizedFormat'; // import plugin
import relativeTime from 'dayjs/plugin/relativeTime'; // import plugin
import React, { useEffect, useState } from "react";
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { Link, useParams } from "react-router-dom";
import useSWRInfinite from 'swr/infinite';
import api from "../../../../configs/api";
import { commonFetch } from "../../../../helper";
import { CommonModelPaginatedResponse } from "../../../../interfaces/common";
import { File } from "../../../../interfaces/model/File";
import { MediaData } from "../../../../interfaces/model/media_data";
import strings from "../../../../lang/Lang";
import BackToClientDashboard from "../sections/BackToClientDashboard";
import ClientMediaImageItem from "./ClientMediaImageItem";
import ClientMediaListUL from "./ClientMediaListUL";
import ClientMediaTitle from "./ClientMediaTitle";

const ClientMediaModal = React.lazy(() => import("./ClientMediaModal"))
const ClientMediaDeleteModal = React.lazy(() => import("./ClientMediaDeleteModal"))

const Lightbox = React.lazy(() => import("react-image-lightbox"))

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(LocalizedFormat)

export interface ClientMediasProps {

}

const ClientMedias: React.FC<ClientMediasProps> = () => {
  const { clientId }: { clientId?: string } = useParams();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [openLightbox, setOpenLightbox] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: response, error, size, setSize, mutate } = useSWRInfinite<CommonModelPaginatedResponse<MediaData>, Error>((pageIndex) => {
    return api.clientMedia(clientId, pageIndex + 1)
  }, commonFetch);

  const [data, setData] = useState<MediaData[] | undefined>();
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    setData(response?.flatMap(dt => dt.data))
  }, [response])

  const urls = data?.flatMap((value, index) => {
    return value.data.map((file) => file.url);
  }) ?? [];

  const isLoadingInitialData = !response && !error;
  const isEmpty = response?.[0].data.length === 0;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && response && typeof response[size - 1] === "undefined");
  const isReachingEnd =
    isEmpty || (response && response[response.length - 1]?.data.length < 5);


  console.log("total", urls.length);

  return (
    <>
      <ModalSuspense>
        {
          openModal &&
          <ClientMediaModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            mutate={mutate}
          />
        }
        {
          deleteOpen &&
          <ClientMediaDeleteModal
            open={deleteOpen}
            handleClose={() => setDeleteOpen(false)}
            selectedFile={selectedFile}
            onSuccess={async () => {
              setData((data) => {
                return data?.map((mediaData) => {
                  const newMedias = mediaData.data.filter((file) => {
                    return file.id !== selectedFile?.id;
                  })
                  return {
                    date: mediaData.date,
                    data: newMedias,
                  };
                }).filter((data) => !!data.data.length);
              })
            }}
          />
        }
      </ModalSuspense>
      <BackToClientDashboard />
      <div className="mb-4">
        <Heading text={strings.media} variant="bigTitle" />
      </div>
      <Card>
        <div className="flex mb-4 justify-end space-x-3">
          <Link to={`/clients/${clientId}/before-after`}>
            <Button size='small'>{strings.beforeAfter}</Button>
          </Link>
          <AddButton onClick={() => setOpenModal(true)} />
        </div>
        <div className="masonry mb-8">
          {data?.map((media, upperIndex) => {
            return (
              <React.Fragment key={media.date}>
                <ClientMediaTitle title={dayjs(media.date).format('ddd, D MMM')} />
                <ClientMediaListUL>
                  {media.data.map((file, indexInner) => (
                    <ClientMediaImageItem
                      key={file.id}
                      url={file.thumbnail ? api.storageUrl(file.thumbnail) : api.storageUrl(file.filename)}
                      onDeleteClick={() => {
                        setSelectedFile(file);
                        setDeleteOpen(true);
                      }}
                      onImageClick={() => {
                        if (upperIndex === 0) {
                          setSelectedIndex(indexInner);
                          setOpenLightbox(true);
                          return;
                        }

                        let nextIndex = 0;
                        for (let i = 0; i < upperIndex; i++) {
                          nextIndex = nextIndex + data[i].data.length;
                        }
                        nextIndex = nextIndex + indexInner;

                        setSelectedIndex(nextIndex);
                        setOpenLightbox(true);
                      }}
                    />
                  ))}
                </ClientMediaListUL>
              </React.Fragment>
            );
          })}
          {isLoadingInitialData || isLoadingMore ? (
            <div className="mb-8 masonry">
              <Skeleton className="w-36 text-2xl" />
              <ul className="">
                <li className="w-40 h-screen max-h-[200px]"><Skeleton className="w-full h-full" /></li>
                <li className="w-56 h-screen max-h-[200px]"><Skeleton className="w-full h-full" /></li>
                <li className="w-64 h-screen max-h-[200px]"><Skeleton className="w-full h-full" /></li>
                <li className="w-40 h-screen max-h-[200px]"><Skeleton className="w-full h-full" /></li>
                <li />
              </ul>
            </div>
          ) : <></>}
        </div>
        {/* hasMore */}
        {(data && !error && !isEmpty && !isReachingEnd) && (
          <Button
            loading={isLoadingMore}
            disabled={isLoadingMore}
            onClick={() => setSize(size + 1)}
          >
            {strings.loadMore}
          </Button>
        )}

        <ModalSuspense>
          {openLightbox && (
            <Lightbox
              mainSrc={urls[selectedIndex]}
              nextSrc={urls[(selectedIndex + 1) % urls.length]}
              prevSrc={urls[(selectedIndex + urls.length - 1) % urls.length]}
              onCloseRequest={() => setOpenLightbox(false)}
              onMovePrevRequest={() => setSelectedIndex((selectedIndex + urls.length - 1) % urls.length)}
              onMoveNextRequest={() => setSelectedIndex((selectedIndex + 1) % urls.length)}
            />
          )}
        </ModalSuspense>
      </Card>
    </>
  );
}

export default ClientMedias;