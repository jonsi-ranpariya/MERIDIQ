import AddButton from '@components/form/AddButton';
import Button from '@components/form/Button';
import Heading from '@components/heading/Heading';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import Card from '@partials/Paper/PagePaper';
import * as React from 'react';
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import useSWR from "swr";
import api from "../../../../configs/api";
import { ClientMediasNoGroupByPaginatedResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import CustomShowText from '@partials/Error/CustomShowText';
import MediaNoteIcon from '@icons/MediaNote';
const ClientMediaModal = React.lazy(() => import('./ClientMediaModal'))

export interface ClientAftercareProps {

}

const ClientMedia: React.FC<ClientAftercareProps> = () => {

  const { clientId }: { clientId?: string } = useParams();

  const { data, mutate } = useSWR<ClientMediasNoGroupByPaginatedResponse>(api.clientMediaNoGroup(clientId))

  const [openModal, setOpenModal] = React.useState(false);

  return (
    <>
      <ModalSuspense>
        {openModal &&
          <ClientMediaModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            mutate={mutate}
          />
        }
      </ModalSuspense>
      <Card className='h-full'>
        <div className="flex justify-between">
          <Heading text={strings.media} variant="subHeader" count={data?.total} />
          <div className="flex space-x-2">
            <Link to={`/clients/${clientId}/before-after`}>
              <Button size='small'>{strings.beforeAfter}</Button>
            </Link>
            <AddButton onClick={() => setOpenModal(true)} />
          </div>
        </div>
        <div className="mt-2">
          {
            data?.data.length === 0 && <CustomShowText className="!py-6" text={strings.note_media} icon={<MediaNoteIcon />} >
              <AddButton onClick={() => setOpenModal(true)} />
            </CustomShowText>
          }
          <div className="grid grid-cols-5 gap-2 md:gap-4 relative">

            {data?.data.map((img, index) => {
              const isLast = (data.data.length - 1) === index
              return (
                <div className="relative" key={img.id}>
                  <img
                    src={api.storageUrl(img.thumbnail)}
                    className={`aspect-square object-cover ${isLast && ""} bg-gray-100 dark:bg-gray-800`}
                    alt={`client media ${img.id}`}
                  />
                  {isLast && ViewMore()}
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </>
  );

  function ViewMore() {
    return (
      <Link to={`/clients/${clientId}/media`} className=''>
        <span
          className='inset-0 text-center bg-primary/60 absolute text-white flex justify-center items-center'
        >
          <p className='w-min'>{strings.viewMore}</p>
        </span>
      </Link>

    );
  }
}

export default ClientMedia;