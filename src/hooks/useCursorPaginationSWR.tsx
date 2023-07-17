import React, { useMemo, useReducer } from 'react'
import { useEffect } from 'react';
import useSWR from 'swr';
import { commonFetch } from '../helper';
import { CommonModelPaginatedResponse } from '../interfaces/common';
import useDebounce from './useDebounce';

export type FilterType = '=' | '!=';
export type OrderDirection = 'asc' | 'desc';
interface useCursorPaginationSWRProps {
    filter?: string,
    filterType?: FilterType,
    filterValue?: string | null | number,
    orderBy?: string,
    orderDirection?: OrderDirection,
    limit?: number,
    search?: string,

    defaultFilter?: { [value: string]: any },
}

export interface useCursorPaginationSWRResponse<T, Y> {
    data?: T[],
    setData: React.Dispatch<React.SetStateAction<T[]>>,

    error?: Y,
    filterData: (filter: string, filterType: FilterType, filterValue: string | null | number) => void,
    orderData: (orderBy: string, orderDirection: OrderDirection) => void

    loadMore: () => void,
    reload: () => void,

    setLimit: (data: number) => void,
    loading: boolean,
    hasMore: boolean,

    page: number,
    limit: number,

    search?: string,
    setSearch: React.Dispatch<React.SetStateAction<string | undefined>>,

    filter?: string,
    filterType: FilterType,
    filterValue?: string | null | number,

    orderBy?: string,
    orderDirection: OrderDirection,
    url: string,
}


export const useCursorPaginationSWR = <T, Y>(url: string, initialOptions?: useCursorPaginationSWRProps): useCursorPaginationSWRResponse<T, Y> => {

    const [data, setData] = React.useState<T[]>([]);
    const [hasMore, setHasMore] = React.useState<boolean>(true);

    const [page, setPage] = React.useState(1);
    const [limit] = React.useState(initialOptions?.limit || 20);

    const [search, setSearch] = React.useState(initialOptions?.search);
    const debouncedSearch = useDebounce(search, 300);

    const [filter, setFilter] = React.useState(initialOptions?.filter);
    const [filterType, setFilterType] = React.useState<FilterType>(initialOptions?.filterType || '=');
    const [filterValue, setFilterValue] = React.useState<string | null | number | undefined>(initialOptions?.filterValue);

    const [orderBy, setOrderBy] = React.useState(initialOptions?.orderBy);
    const [orderDirection, setOrderDirection] = React.useState<OrderDirection>(initialOptions?.orderDirection || 'asc');

    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const newUrl = useMemo(() => {
        const newUrl = new URL(url);
        const params = new URLSearchParams();

        params.set('key', Date.now().toString());
        params.set('page', page.toString());
        params.set('per_page', limit.toString());

        if (orderBy) {
            params.set('orderBy', orderBy);
            params.set('orderDirection', orderDirection);
        }
        if (filter) {
            params.set('filter', filter);
            params.set('filter_type', filterType);
            if (!!filterValue) {
                params.set('filter_value', filterValue?.toString() || '');
            }
        }

        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        }

        newUrl.search = params.toString();
        return newUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, page, limit, orderBy, orderDirection, filter, filterType, filterValue, debouncedSearch, ignored]);

    const filterData = (filter: string | undefined, filterType: FilterType, filterValue: string | null | number) => {
        setFilter(filter);
        setFilterType(filterType);
        setFilterValue(filterValue);
    }

    const orderData = (orderBy: string, orderDirection: OrderDirection) => {
        setOrderBy(orderBy);
        setOrderDirection(orderDirection);
    }

    const loadMore = () => {
        if (hasMore) {
            setPage((page) => page + 1);
        }
    }

    const reload = () => {
        setData(() => []);
        setPage(() => 1);
        forceUpdate();
    }

    const setLimit = (data: number) => {
        setLimit(data);
    }

    const { data: responseData, error } = useSWR<CommonModelPaginatedResponse<T>, Y>(newUrl.toString(), commonFetch);
    const loading = !responseData && !error;

    useEffect(() => {
        if (responseData?.status === '1' && responseData?.data?.length) {
            setData((newData) => ([...newData, ...responseData.data]))
        }

        if (responseData?.status === '1' && !responseData?.data?.length) {
            setHasMore(false);
        }
    }, [responseData, setHasMore, setData]);

    return {
        data,
        setData,

        error,
        filterData,
        orderData,

        loadMore,
        reload,

        setLimit,
        loading,
        hasMore,

        page,
        limit,

        setSearch,
        search,

        filter,
        filterType,
        filterValue,
        orderBy,
        orderDirection,
        url: newUrl.toString(),
    };
}
