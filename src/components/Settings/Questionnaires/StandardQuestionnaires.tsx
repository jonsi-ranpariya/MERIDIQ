import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../configs/api';
import { commonFetch, saveSetting } from '../../../helper';
import { SettingResponse, SettingTypes } from '../../../interfaces/common';
import strings from '../../../lang/Lang';
import SettingQuestionnerItem from '../../../partials/Setting/Questionary/SettingQuestionnerItem';
const StandardQuestionnairesViewModal = React.lazy(() => import('./StandardQuestionnairesViewModal'));

export interface StandardQuestionnairesProps {

}

const StandardQuestionnaires: React.FC<StandardQuestionnairesProps> = () => {
    const { data, mutate, error } = useSWR<SettingResponse, Error>(api.setting, commonFetch);
    const [savingSetting, setSavingSetting] = React.useState(false);
    const [isViewModalOpen, setViewModalOpen] = React.useState(false);
    const [whichModal, setWhichModal] = React.useState('');
    const loading = !data && !error;

    const navigate = useNavigate();


    const handleChange = async (key: string, val: boolean) => {
        if (savingSetting) return;
        setSavingSetting(true);
        const data = await saveSetting({
            key: key as SettingTypes,
            value: val ? '1' : '0',
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
        <div>
            <ModalSuspense>
                {
                    (isViewModalOpen && whichModal) &&
                    <StandardQuestionnairesViewModal
                        isModalOpen={isViewModalOpen}
                        handleClose={() => {
                            setViewModalOpen(false);
                            setWhichModal('');
                        }}
                        modalType={whichModal}
                    />
                }
            </ModalSuspense>
            <div className="pb-1">
                <Heading variant='headingTitle' text={strings.standard_questionnaires} />
            </div>
            <div className="divide-y dark:divide-gray-700">
                {loading ? (
                    <>
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                        <Skeleton variant="rectangular" className="rounded mb-2 h-12" />
                    </>
                ) : (
                    <>

                        <SettingQuestionnerItem
                            title={strings.HealthQuestionnaire}
                            name={api.SHOW_HEALTH_QUESTIONNAIRE as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SHOW_HEALTH_QUESTIONNAIRE && setting.value === '1')}
                            onViewClick={() => {
                                setWhichModal('health');
                                setViewModalOpen(true);
                            }}
                        />
                        <SettingQuestionnerItem
                            title={strings.Aestethicinterest}
                            name={api.SHOW_AESTHETIC_INTEREST as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SHOW_AESTHETIC_INTEREST && setting.value === '1')}
                            onViewClick={() => {
                                setWhichModal('aesthetic');
                                setViewModalOpen(true);
                            }}
                        />
                        <SettingQuestionnerItem
                            title={strings.setting_covid19}
                            name={api.SHOW_COVID_19 as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SHOW_COVID_19 && setting.value === '1')}
                            onViewClick={() => {
                                setWhichModal('covid19');
                                setViewModalOpen(true);
                            }}
                        />
                        <SettingQuestionnerItem
                            showView={false}
                            title={strings.setting_loc}
                            name={api.SHOW_LETTER_OF_CONSENT as SettingTypes}
                            onChange={handleChange}
                            checked={!!data?.data.find((setting) => setting.key === api.SHOW_LETTER_OF_CONSENT && setting.value === '1')}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default StandardQuestionnaires;