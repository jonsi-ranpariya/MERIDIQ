import Avatar from '@components/avatar/Avatar';
import IconButton from '@components/form/IconButton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { renderAddress } from '../../../../helper';
import { CompanyResponse } from '../../../../interfaces/common';
import EditIcon from '../../../../partials/Icons/Edit';
import MailIcon from '../../../../partials/Icons/Mail';
import MapPinIcon from '../../../../partials/Icons/MapPin';
import PhoneIcon from '../../../../partials/Icons/Phone';
import Card from '../../../../partials/Paper/PagePaper';
const CompanyEditModal = React.lazy(() => import('./CompanyEditModal'))

interface CompanyDetailsProps {

}

const CompanyDetails = (props: CompanyDetailsProps) => {

    const { companyId }: { companyId?: string } = useParams();

    const { data } = useSWR<CompanyResponse, Error>(api.companySingle.replace(":id", companyId || ""));

    const [openEditModal, setOpenEditModal] = React.useState(false);
    return (
        <Card>
            <ModalSuspense>
                {
                    openEditModal &&
                    <CompanyEditModal openModal={openEditModal} handleClose={() => setOpenEditModal(false)} />
                }
            </ModalSuspense>
            <div className="flex flex-col lg:flex-row lg:space-x-6">
                <Avatar className="w-20 h-20" src={data?.data?.profile_photo ? `${process.env.REACT_APP_STORAGE_PATH}/${data?.data?.profile_photo}` : undefined} />
                <div className="flex-grow">
                    <div className="flex space-x-4 items-center mb-3">
                        <h3 className="font-bold text-xl">{data?.data?.company_name}</h3>
                        <IconButton onClick={() => setOpenEditModal(true)}><EditIcon /></IconButton>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 grid gap-2 grid-flow-row">
                        {data?.data?.mobile_number
                            ? (
                                <p className="inline-block break-all">
                                    <PhoneIcon className="inline-block mr-2 text-xl" />
                                    {data?.data?.mobile_number}
                                </p>
                            )
                            : ''}
                        {data?.data?.email
                            ? (
                                <p className="inline-block break-all">
                                    <MailIcon className="inline-block mr-2 text-xl" />
                                    {data?.data?.email}
                                </p>
                            )
                            : ''}
                        {
                            data?.data?.street_address ||
                                data?.data?.zip_code ||
                                data?.data?.city ||
                                data?.data?.state ||
                                data?.data?.country
                                ? (
                                    <p className="inline-block break-words">
                                        <MapPinIcon className="mr-2 mb-1 text-xl inline-block" />
                                        {renderAddress(data.data)}
                                    </p>
                                )
                                : ''}
                    </div>
                </div>

            </div>
        </Card>
    )
}

export default CompanyDetails;
