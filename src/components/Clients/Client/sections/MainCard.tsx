import Card from "@components/card";
import AddButton from "@components/form/AddButton";
import CustomTabs from "@components/form/CustomTabs";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import useLocalStorage from "@hooks/useLocalStorage";
import { usePaginationSWR } from "@hooks/usePaginationSWR";
import { ClientGeneralNotesPaginatedResponse, ClientLetterOfConsentPaginatedResponse, ClientProcedurePaginatedResponse, ClientResponse } from "@interface/common";
import strings from "@lang/Lang";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import { lazy, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";


export interface MainCardProps {

}

const ClientGeneralNote = lazy(() => import("../GeneralNotes/ClientGeneralNote"))
const ClientLetterOfConsent = lazy(() => import("../LetterOfConsents/ClientLetterOfConsent"))
const ClientProcedure = lazy(() => import("../Procedures/ClientProcedure"))
const ClientMainCardAddModal = lazy(() => import("./MainCardAddModal"))
const ClientLetterOfConsentModal = lazy(() => import("../LetterOfConsents/ClientLetterOfConsentModal"))
const ClientGeneralNoteModal = lazy(() => import("../GeneralNotes/ClientGeneralNoteModal"))

const ClientMainCard: React.FC<MainCardProps> = () => {

  const [openAddModal, setOpenAddModal] = useState(false)
  const [openGeneralNote, setopenGeneralNote] = useState(false)
  const [OpenLoC, setOpenLoC] = useState(false)
  const { clientId }: { clientId?: string } = useParams();
  const { data } = useSWR<ClientResponse, Error>(api.clientSingle(clientId));
  const { setStorageValue: setTab, storedValue: tab } = useLocalStorage<number | null>('client_info_tab', 0);

  const { data: generalNoteData, mutate: generalNotesMutate } = usePaginationSWR<ClientGeneralNotesPaginatedResponse, Error>(
    clientId ? api.clientGeneralNotes.replace(':id', clientId) : null,
    { filter: 'important', filterType: '!=', filterValue: null, limit: 3, }
  );

  const { data: letterOfConsentData, mutate: LOCMutate } = usePaginationSWR<ClientLetterOfConsentPaginatedResponse, Error>(api.clientLetterOfConsents(clientId), {
    limit: 3
  });
  const { data: procedureData } = usePaginationSWR<ClientProcedurePaginatedResponse, Error>(api.clientTreatments(clientId), {
    limit: 3
  });

  const tabs = [
    { text: strings.Procedures, tabCount: procedureData?.total, isSign: data?.data.treatments_unsigned_exists, Component: <ClientProcedure /> },
    { text: strings.GeneralNotes, tabCount: generalNoteData?.total, isSign: data?.data.general_notes_unsigned_exists, Component: <ClientGeneralNote /> },
    { text: strings.LettersofConsents, tabCount: letterOfConsentData?.total, isSign: data?.data.letter_of_consents_unsigned_exists, Component: <ClientLetterOfConsent /> },
  ];
  const loading = !procedureData || !letterOfConsentData || !generalNoteData;
  const procedureTotal = procedureData?.total ? procedureData.total : 0;
  const letterTotal = letterOfConsentData?.total ? letterOfConsentData.total : 0;
  const generalTotal = generalNoteData?.total ? generalNoteData.total : 0;
  const totalCount = procedureTotal + letterTotal + generalTotal;

  return (
    <>
      <ModalSuspense>
        {openAddModal &&
          <ClientMainCardAddModal
            openModal={openAddModal}
            key={"main_modal"}
            handleClose={() => setOpenAddModal(false)}
            onLoCClick={() => { setOpenAddModal(false); setTimeout(() => setOpenLoC(true), 100) }}
            onGeneralNotesClick={() => { setOpenAddModal(false); setTimeout(() => setopenGeneralNote(true), 100) }}
          />
        }
        {openGeneralNote &&
          <ClientGeneralNoteModal key={`general_modal`} openModal={openGeneralNote} setOpenModal={setopenGeneralNote} mutate={generalNotesMutate} />
        }
        {OpenLoC &&
          <ClientLetterOfConsentModal key={`loc_modal`} openModal={OpenLoC} setOpenModal={setOpenLoC} mutate={LOCMutate} />
        }
      </ModalSuspense>
      <Card>
        <div className="px-2 py-1 flex justify-between">
          <Heading text={strings.records} variant="subHeader" count={loading ? "" : totalCount} />
          {tab === 0 ? procedureData?.data.length ?
            <AddButton onClick={() => setOpenAddModal(true)} /> : "" : ""
          }
          {tab === 1 ? generalNoteData?.data.length ?
            <AddButton onClick={() => setOpenAddModal(true)} /> : "" : ""
          }
          {tab === 2 ? letterOfConsentData?.data.length ?
            <AddButton onClick={() => setOpenAddModal(true)} /> : "" : ""
          }
        </div>
        <CustomTabs
          tabs={tabs}
          selectedIndex={tab}
          onChange={(index) => setTab(index === tab ? null : index)}
          removeSidePadding
        />
      </Card>
    </>
  );
}

export default ClientMainCard;