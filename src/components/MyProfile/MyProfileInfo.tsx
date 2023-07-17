import Avatar from "@components/avatar/Avatar";
import IconButton from "@components/form/IconButton";
import Heading from "@components/heading/Heading";
import api from "@configs/api";
import LoadingIcon from "@icons/Loading";
import Button from '@components/form/Button';
import React, { lazy, useState } from "react";
import { generateUserFullName, userRole } from "../../helper";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";
import EditIcon from "../../partials/Icons/Edit";
import Card from "../../partials/Paper/PagePaper";
import ModalSuspense from "@partials/Loadings/ModalLoading";

const MyProfileChangePassword = lazy(() => import("./MyProfileChangePassword"));
const MyProfileEditModal = lazy(() => import("./MyProfileEditModal"));

export interface MyProfileInfoProps {

}

const MyProfileInfo: React.FC<MyProfileInfoProps> = () => {

    const { user, mutate } = useAuth();
    const [openEditModal, setOpenEditModal] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)

    if (!user) {
        return <MyProfileInfoSkeleton />
    }

    return (
        <Card>
            <ModalSuspense>
                {
                    openEditModal &&
                    <MyProfileEditModal
                        mutate={mutate}
                        selectedUser={user}
                        openModal={openEditModal}
                        handleClose={() => setOpenEditModal(false)}
                    />
                }
                {
                    openChangePassword &&
                    <MyProfileChangePassword
                        isOpen={openChangePassword}
                        onClose={() => setOpenChangePassword(false)}
                    />
                }
            </ModalSuspense>
            <div className="flex space-x-3">
                <Avatar src={user?.profile_photo ? api.storageUrl(user.profile_photo) : undefined} className="h-16 lg:h-20 xl:h-24 " />
                <div className="flex-grow">
                    <div className="flex items-start justify-between">
                        <div className="">
                            <Heading text={generateUserFullName(user)} variant="bigTitle" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">{user?.email}</p>
                            <p className="text-primary dark:text-primaryLight text-sm">{userRole(user)}</p>
                        </div>
                        <IconButton
                            onClick={() => setOpenEditModal(true)}
                            children={<EditIcon />}
                        />
                    </div>
                    <div className="flex gap-3 mt-3 flex-wrap">
                        <Button
                            size='small'
                            variant={"ghost"}
                            onClick={() => setOpenChangePassword(true)}
                        >
                            {strings.ChangePassword}
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function MyProfileInfoSkeleton() {
    return (
        <div className='w-full flex justify-center py-8 lg:py-12 items-center space-x-2'>
            <LoadingIcon className='text-primary text-xl' />
            <p className='text-mediumGray'>{strings.Loading}...</p>
        </div>
    );
}

export default MyProfileInfo;