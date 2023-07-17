import Card from "@components/card";
import AddButton from "@components/form/AddButton";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import { usePaginationSWR } from "@hooks/usePaginationSWR";
import { ClientQuestionaryPaginatedResponse } from "@interface/common";
import strings from "@lang/Lang";
import ModalSuspense from "@partials/Loadings/ModalLoading";
import { lazy, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClientQuestionariesAllTabSection from "./ClientQuestionariesAll";

const ClientAestheticInterestModal = lazy(() => import("./AestethicInterest/ClientAestheticInterestModal"))
const ClientCovid19QuestionaryModal = lazy(() => import("./Covid19Questionary/ClientCovid19QuestionaryModal"))
const ClientHealthQuestionaryModal = lazy(() => import("./HealthQuestionary/ClientHealthQuestionaryModal"))
const ClientQuestionnerSectionAddModal = lazy(() => import("./ClientQuestionnerSectionAddModal"))

export interface ClientQuestionnerSectionProps {

}

const ClientQuestionnerSection: React.FC<ClientQuestionnerSectionProps> = () => {

  const [openModal, setOpenModal] = useState(false)
  const [openHealthModal, setOpenHealthModal] = useState(false)
  const [openAestheticModal, setOpenAestheticModal] = useState(false)
  const [openCovidModal, setOpenCovidModal] = useState(false)
  const navigate = useNavigate()

  const { clientId }: { clientId?: string, questionnaireId?: string } = useParams();

  const { data, mutate } = usePaginationSWR<ClientQuestionaryPaginatedResponse, Error>(api.clientQuestionnaireDataAll(clientId), {
    limit: 5
  });

  return (
    <>
      <ModalSuspense>
        {openModal &&
          <ClientQuestionnerSectionAddModal
            openModal={openModal}
            setOpenModal={setOpenModal}
            onHealthClick={() => { setOpenModal(false); setOpenHealthModal(true) }}
            onAestheticClick={() => { setOpenModal(false); setOpenAestheticModal(true) }}
            onCovidClick={() => { setOpenModal(false); setOpenCovidModal(true) }}
            onCustomClick={() => { setOpenModal(false); navigate(`/clients/${clientId}/client-questionnaires`) }}
          />
        }
        {openHealthModal &&
          <ClientHealthQuestionaryModal
            openModal={openHealthModal}
            setOpenModal={setOpenHealthModal}
            mutate={async () => { await mutate() }}
          />
        }
        {openCovidModal &&
          <ClientCovid19QuestionaryModal
            openModal={openCovidModal}
            setOpenModal={setOpenCovidModal}
            mutate={async () => { await mutate() }}
          />
        }
        {openAestheticModal &&
          <ClientAestheticInterestModal
            openModal={openAestheticModal}
            setOpenModal={setOpenAestheticModal}
            mutate={async () => { await mutate() }}
          />
        }
      </ModalSuspense>
      <Card>
        <div className="px-2 py-1 flex justify-between items-start">
          <Heading text={strings.Questionnaires} variant="subHeader" count={data?.total} />
          <AddButton onClick={() => setOpenModal(true)} />
        </div>
        <ClientQuestionariesAllTabSection />
      </Card>
    </>

  );
}

export default ClientQuestionnerSection;