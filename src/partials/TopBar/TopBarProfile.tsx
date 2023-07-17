import Avatar from '@components/avatar/Avatar';
import { Menu, Transition } from '@headlessui/react';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { generateUserFullName } from '../../helper';
import useAuth from '../../hooks/useAuth';
import strings from '../../lang/Lang';
import DownIcon from '../Icons/Down';

export interface TopBarProfileProps {

}

const TopBarProfile: React.FC<TopBarProfileProps> = () => {

    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const { user, mutate } = useAuth();
    function onMyProfileClick() {
        navigate(user?.user_role === 'master_admin' ? '/admin/profile' : '/profile');
    }

    async function onLogoutClick() {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch(api.logout, {
                method: "GET",
                headers: {
                    "Accept": 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': 'test',
                    'X-App-Locale': strings.getLanguage(),
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.status === 401) {
                toast.error(data.message || "Unauthorized", {});
            }

            await mutate();
            if (data.status === '1') {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    const isSuperUser = user?.user_role === 'master_admin';

    return (
        <div className="flex items-center">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="md:mr-1 flex items-center"
                    >
                        <Avatar className="w-8 h-8 md:w-10 md:h-10" src={user?.profile_photo ? `${process.env.REACT_APP_STORAGE_PATH}/${user?.profile_photo}` : undefined} />
                        <div className="ml-3 mr-2 hidden md:block text-left">
                            <span className="font-semibold capitalize">{generateUserFullName(user || undefined)}</span>
                            {
                                !isSuperUser && <span className="hidden font-medium text-xs md:block text-primary dark:text-gray-500">{user?.company?.storage_usage} {strings?.used}</span>
                            }
                        </div>
                        <DownIcon className="ml-1 md:ml-0 hidden md:block" />
                    </Menu.Button>
                </div>
                <Transition
                    className="absolute w-48 right-0 mt-2 py-1.5 divide-y divide-gray-100 rounded-md bg-white dark:bg-dimGray dark:divide-gray-700 shadow-card outline-none"
                    enter="transition-all duration-300"
                    enterFrom="top-[90%] opacity-0"
                    enterTo="top-full opacity-100"
                    leave="transition-all ease-out duration-75"
                    leaveFrom="top-full opacity-100"
                    leaveTo="top-[90%] opacity-0"
                >
                    <Menu.Items>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${active ? 'bg-primary/5 dark:bg-gray-800' : ''} active:bg-primary/10 text-gray-900 dark:text-white block w-full text-left py-2 px-4 text-sm`}
                                    onClick={onMyProfileClick}
                                >
                                    {strings.my_profile}
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={`${active ? 'bg-primary/5 dark:bg-gray-800' : ''} active:bg-primary/10 text-gray-900 dark:text-white block w-full text-left py-2 px-4 text-sm`}
                                    onClick={onLogoutClick}
                                >
                                    {strings.Logout}
                                </button>
                            )}
                        </Menu.Item>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}

export default TopBarProfile;