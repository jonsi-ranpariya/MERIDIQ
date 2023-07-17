import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../configs/api';
import { commonFetch, handleQuestionnaireActiveChange } from '../../../helper';
import { QuestionaryResponse } from '../../../interfaces/common';
import { Questionary } from '../../../interfaces/model/questionary';
import strings from '../../../lang/Lang';
import SettingQuestionnerItem from '../../../partials/Setting/Questionary/SettingQuestionnerItem';

const DynamicQuestionnairesViewModal = React.lazy(() => import('./DynamicQuestionnairesViewModal'))

export interface DynamicQuestionnairesProps {

}

const DynamicQuestionnaires: React.FC<DynamicQuestionnairesProps> = () => {
    const { data, mutate, error } = useSWR<QuestionaryResponse, Error>(`${api.questionnaires}?withTrashed=true`, commonFetch);
    const loading = !data && !error;
    const navigate = useNavigate();
    const [savingSetting, setSavingSetting] = React.useState(false);
    const [isViewModalOpen, setViewModalOpen] = React.useState(false);

    const [selectedQuestionnaire, setSelectedQuestionnaire] = React.useState<undefined | Questionary>();


    const handleChange = async (key: string, val: boolean) => {
        if (savingSetting) return;
        setSavingSetting(true);
        const data = await handleQuestionnaireActiveChange({
            id: parseInt(key),
            checked: val ? '1' : '0',
        });
        if (data.webStatus === 401) {
            navigate('/');
        }
        if (data.status === '1') {
            await mutate();
            toast.success(data.message);
        } else {
            toast.error(data.message || 'please try again');
        }
        setSavingSetting(false);
    };

    if (error) {
        return <> Error </>;
    }

    return (
        <div className=''>
            <Heading variant='headingTitle' text={strings.own_questionnaires} className="pb-1" />
            <ModalSuspense>
                {
                    (selectedQuestionnaire && isViewModalOpen) &&
                    <DynamicQuestionnairesViewModal
                        selectedQuestionary={selectedQuestionnaire}
                        isModalOpen={isViewModalOpen}
                        handleClose={() => {
                            setViewModalOpen(false);
                            setSelectedQuestionnaire(undefined);
                        }}
                    />
                }
            </ModalSuspense>
            <div className="divide-y dark:divide-gray-700">
                {loading ? (
                    <>
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    </>
                ) : ''}
                {data?.data.map((questionary) => {
                    return (
                        <SettingQuestionnerItem
                            key={questionary.id}
                            id={questionary.id}
                            title={questionary.title}
                            name={questionary.id.toString()}
                            onChange={handleChange}
                            checked={questionary.is_active}
                            onViewClick={() => {
                                setSelectedQuestionnaire(questionary);
                                setViewModalOpen(true);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default DynamicQuestionnaires;