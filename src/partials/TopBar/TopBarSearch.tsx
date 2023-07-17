import Avatar from '@components/avatar/Avatar';
import { Menu, Transition } from '@headlessui/react';
import LoadingIcon from '@icons/Loading';
import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import useSWRInfinite from "swr/infinite";
import api from "../../configs/api";
import { commonFetch, generateClientFullName } from "../../helper";
import useDebounce from "../../hooks/useDebounce";
import { ClientsPaginatedResponse } from "../../interfaces/common";
import strings from "../../lang/Lang";
import SearchIcon from "../Icons/Search";

export interface TopBarSearchProps {

}

const PAGE_SIZE = 8;

const TopBarSearch: React.FC<TopBarSearchProps> = () => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false)
    const debouncedSearch = useDebounce(search, 360);

    const { data, error, size, setSize } = useSWRInfinite<ClientsPaginatedResponse, Error>((pageIndex, previousPageData) => {
        if (!isOpen) return null;
        if (previousPageData?.data && previousPageData.next_page_url === null) return null;
        if (debouncedSearch) {
            return `${api.clients}?page=${pageIndex + 1}&per_page=${PAGE_SIZE}&search=${debouncedSearch}`;
        }
        return `${api.clients}?page=${pageIndex + 1}&per_page=${PAGE_SIZE}`;
    }, commonFetch);

    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === "undefined");

    const isEmpty = data?.[0]?.data?.length === 0;
    const isReachingEnd = isEmpty || (data && data[data.length - 1]?.data.length < PAGE_SIZE);

    const searchClientBox = useRef<HTMLDivElement>(null);
    const lastSecondBoxRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/clients?search=${encodeURI(search)}`);
        (document.getElementsByClassName('top_bar_search')[0] as HTMLInputElement)?.blur()
    }

    function onExitInput() {
        (document.getElementsByClassName('top_bar_search')[0] as HTMLInputElement)?.blur()
    }

    const list = useMemo(() => data?.flatMap((v) => v.data), [data])

    async function onScroll() {
        if (!isLoadingMore &&
            !isReachingEnd &&
            searchClientBox?.current
            && lastSecondBoxRef?.current
            && (
                searchClientBox.current.getBoundingClientRect().bottom
                > lastSecondBoxRef.current.getBoundingClientRect().top)
        ) {
            setSize((size) => size + 1);
        }
    }

    return (
        <div className="relative flex-grow w-full">
            <Menu>
                <form
                    onSubmit={formSubmit}
                    autoComplete="off"
                    className="m-0"
                >
                    <div className="relative flex items-center">
                        <span className="absolute hidden md:block left-2 pointer-events-none">
                            <SearchIcon className="text-2xl text-mediumGray" />
                        </span>
                        <Menu.Button
                            as='input'
                            type="text"
                            placeholder={`${strings.Search} ${strings.Clients.toLowerCase()}`}
                            className="top_bar_search pl-3 md:pl-10 w-full pr-3 py-2 bg-transparent placeholder:text-mediumGray outline-none rounded-lg"
                            value={search || ''}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === " ") {
                                    setSearch(e.currentTarget.value + " ");
                                }
                                return;
                            }}
                            onChange={async (event: any) => {
                                event.persist();
                                setSearch(event.currentTarget.value || '');
                                await setSize(1);
                                const element = document.getElementById('searchScroller');
                                if (element) element.scrollTo(0, 0);
                            }}
                        />
                    </div>
                </form>
                <Transition
                    className="absolute shadow-card dark:shadow-lg topBar-search transition-all mt-1 top-full w-full overflow-y-auto left-0 bg-white dark:bg-dimGray dark:ring-dark-400 rounded-md ring-gray-200"
                    enterFrom="h-0 invisible"
                    enterTo="h-96 visible"
                    leaveFrom="h-96 visible"
                    leaveTo="h-0 invisible"
                    id="searchScroller"
                    onScroll={onScroll}
                    ref={searchClientBox}
                    beforeLeave={onExitInput}
                    beforeEnter={() => setIsOpen(true)}
                    afterLeave={() => setIsOpen(false)}
                >
                    <Menu.Items className="divide-y divide-primary/10 p-2">
                        {list?.map((client, index) => (
                            <Menu.Item as="button" key={`${client.id}_${search || ''}`} className='block w-full' onClick={() => navigate(`/clients/${client.id}`)}>
                                {({ active }) => (
                                    <div ref={list.length - 2 === index ? lastSecondBoxRef : undefined}>
                                        <div className={`flex px-4 py-4 space-x-2 rounded-lg ${active ? 'bg-primary/5' : ''} hover:bg-primary/5 active:bg-primary/10 items-center w-full break-all cursor-pointer`} >
                                            <Avatar
                                                className="h-10 w-10"
                                                key={client?.profile_picture ? `${api.storage}${client?.profile_picture}` : `image_top_bar${index}`}
                                                src={client?.profile_picture ? `${api.storage}${client?.profile_picture}` : undefined}
                                                alt={`${generateClientFullName(client)} ${strings.ProfilePicture}`}
                                            />
                                            <p className="">{generateClientFullName(client)}</p>
                                        </div>
                                    </div>
                                )}
                            </Menu.Item>
                        ))}
                    </Menu.Items>
                    {isEmpty && <p className='text-center'>{strings.no_data}</p>}
                    {isLoadingInitialData && <TopBarSearchSkeleton />}
                    {(!isLoadingInitialData && isLoadingMore && !isReachingEnd) && <TopBarSearchSkeleton />}
                </Transition>
            </Menu>
        </div>
    );
}

function TopBarSearchSkeleton() {
    return (
        <div className='flex justify-center items-center space-x-2 pt-2 pb-6'>
            <LoadingIcon className='text-primary text-xl' />
            <p className='text-mediumGray'>{strings.Loading}...</p>
        </div>
    );
}
export default TopBarSearch;