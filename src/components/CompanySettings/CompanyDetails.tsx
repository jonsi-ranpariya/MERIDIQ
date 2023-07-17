
import Avatar from '@components/avatar/Avatar';
import Button from '@components/form/Button';
import Heading from '@components/heading/Heading';
import api from '@configs/api';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import React from 'react';
import { renderAddress } from '../../helper';
import useAuth from '../../hooks/useAuth';
import strings from '../../lang/Lang';
import EditIcon from '../../partials/Icons/Edit';
import MailIcon from '../../partials/Icons/Mail';
import MapPinIcon from '../../partials/Icons/MapPin';
import PhoneIcon from '../../partials/Icons/Phone';
const CompanyEditModal = React.lazy(() => import('./CompanyEditModal'))

interface CompanyDetailsProps {

}

const CompanyDetails = (props: CompanyDetailsProps) => {
    const { user } = useAuth();
    const [openEditModal, setOpenEditModal] = React.useState(false);

    return (
        <>
            <ModalSuspense>
                {
                    openEditModal &&
                    <CompanyEditModal openModal={openEditModal} handleClose={() => setOpenEditModal(false)} />
                }
            </ModalSuspense>
            <div className=''>
                <div className="flex justify-between items-start flex-col md:flex-row mb-6 gap-3">
                    <Heading text={strings.companyInformation} variant="headingTitle" />
                    <Button size='small' onClick={() => setOpenEditModal(true)}>
                        <EditIcon className="mr-2" />
                        {strings.EditCompany}
                    </Button>
                </div>
                <div className="">
                    <Avatar className="w-20 h-20" src={user?.company?.profile_photo ? api.storageUrl(user?.company?.profile_photo) : undefined} />
                    <h3 className="font-bold text-xl mt-4 mb-3">{user?.company?.company_name}</h3>
                    <div className="space-y-1.5">
                        {user?.company?.mobile_number
                            ? (
                                <p className="break-all">
                                    <PhoneIcon className="inline-block mr-2 text-xl text-primary" />
                                    {user?.company?.country_code ? `+${user?.company?.country_code}` : ''} {user?.company?.mobile_number}
                                </p>
                            )
                            : <></>}
                        {user?.company?.email
                            ? (
                                <p className="break-all">
                                    <MailIcon className="inline-block mr-2 text-xl text-primary" />
                                    {user?.company?.email}
                                </p>
                            )
                            : ''}
                        {
                            user?.company?.street_address ||
                                user?.company?.zip_code ||
                                user?.company?.city ||
                                user?.company?.state ||
                                user?.company?.country
                                ? (
                                    <p className="row-span-2 break-words">
                                        <MapPinIcon className="mr-2 mb-1 text-xl inline-block text-primary" />
                                        {renderAddress(user?.company)}
                                    </p>
                                )
                                : ''}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CompanyDetails;
