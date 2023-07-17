import Avatar from '@components/avatar/Avatar';
import Button from '@components/form/Button';
import IconButton from '@components/form/IconButton';
import Heading from '@components/heading/Heading';
import CheckCircleIcon from '@icons/CheckCirlce';
import ClientsIcon from '@icons/Clients';
import CloseIcon from '@partials/Icons/Close';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React, { lazy, useMemo } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import api from "../../../configs/api";
import { generateClientFullName } from "../../../helper";
import { ClientKindResponse, ClientResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import EditIcon from "../../../partials/Icons/Edit";
import Card from "../../../partials/Paper/PagePaper";
const ClientModal = lazy(() => import("../ClientModal"));

const ClientConsentModal = lazy(() => import("./Consent/ClientConsentModal"));
const ClientNextOfKindModal = lazy(() => import("./NextofKind/ClientNextOfKindModal"));
const ClientVerificationModal = lazy(() => import('./Verification/ClientVerificationModal'));

export interface ClientInfoProps { }

const ClientInfo: React.FC<ClientInfoProps> = () => {
    const { clientId }: { clientId?: string } = useParams();
    const [openModal, setOpenModal] = React.useState(false);
    const [openConsentModal, setOpenConsentModal] = React.useState(false);
    const [openNextKindModal, setNextKindOpenModal] = React.useState(false);
    const [openVerificationModal, setOpenVerificationModal] = React.useState(false);

    const { data, mutate } = useSWR<ClientResponse, Error>(api.clientSingle(clientId));
    const { data: kindData } = useSWR<ClientKindResponse, Error>(api.clientKind(clientId));

    const isVerified = useMemo(() => {
        const v = data?.data.verification;
        return [v?.has_id, v?.has_driving_license, v?.has_passport, v?.other].includes(1)
    }, [data]);

    const isNextToKinAdded = useMemo(() => {
        const v = kindData?.data;
        return [v?.email, v?.name, v?.phone, v?.relation].join("").trim().length
    }, [kindData]);

    return (
        <>
            <ModalSuspense>
                {openNextKindModal &&
                    <ClientNextOfKindModal
                        openModal={openNextKindModal}
                        mutate={mutate}
                        setOpenModal={setNextKindOpenModal}
                    />
                }
                {openConsentModal &&
                    <ClientConsentModal
                        openModal={openConsentModal}
                        mutate={mutate}
                        setOpenModal={setOpenConsentModal}
                        consent={data?.data?.consent}
                    />
                }
                {openVerificationModal &&
                    <ClientVerificationModal
                        openModal={openVerificationModal}
                        mutate={mutate}
                        setOpenModal={setOpenVerificationModal}
                        verification={data?.data.verification}
                    />
                }
                {openModal &&
                    <ClientModal
                        openModal={openModal}
                        mutate={mutate}
                        setOpenModal={setOpenModal}
                        selectedClient={data?.data}
                    />
                }
            </ModalSuspense>
            <Card>
                <div className="flex space-x-3">
                    <Avatar src={data?.data?.profile_picture ? api.storageUrl(data?.data?.profile_picture) : undefined} className="h-16 lg:h-20 xl:h-24 " />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <Heading text={generateClientFullName(data?.data)} variant="bigTitle" />
                            <IconButton onClick={() => setOpenModal(true)}>
                                <EditIcon />
                            </IconButton>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-all">{data?.data?.email}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-all">{data?.data?.country_code ? `+${data?.data.country_code}` : ""} {data?.data?.phone_number && data?.data?.phone_number}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-all">{data?.data?.social_security_number}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 break-all">{data?.data?.personal_id}</p>
                        <div className="hidden md:block">
                            {buttons()}
                        </div>
                    </div>
                </div>
                <div className="md:hidden">
                    {buttons()}
                </div>
            </Card>
        </>
    );

    function buttons() {
        return (
            <div className="flex gap-3 md:gap-4 mt-4 md:mt-3 flex-wrap">
                <Button
                    size='small'
                    variant={"ghost"}
                    color={data?.data?.consent?.verified_at ? 'success' : 'primary'}
                    onClick={() => setOpenConsentModal(val => !val)}
                >
                    {data?.data?.consent?.verified_at ? <CheckCircleIcon className='mr-1' /> : <CloseIcon className='mr-1' />}
                    <p>{strings.approved}</p>
                </Button>
                <Button
                    size="small"
                    variant='ghost'
                    color={isVerified ? 'success' : 'primary'}
                    onClick={() => setOpenVerificationModal(val => !val)}
                >
                    {isVerified ? <CheckCircleIcon className='mr-1' /> : <CloseIcon className='mr-1' />}
                    <p className='capitalize'>{isVerified ? strings.verified : strings.not_verified}</p>
                </Button>
                <Button
                    size="small"
                    variant="ghost"
                    color={isNextToKinAdded ? 'success' : 'primary'}
                    onClick={() => setNextKindOpenModal(val => !val)}
                >
                    <ClientsIcon className='md:text-xl text-base mr-1' />
                    <p>{strings.next_of_kind}</p>
                </Button>
            </div>
        )
    }
};

export default ClientInfo;
