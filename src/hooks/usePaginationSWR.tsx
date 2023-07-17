import React, { useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr';
import { MutatorCallback } from 'swr';
import { commonFetch } from '../helper';
import useDebounce from './useDebounce';

export type FilterType = '=' | '!=';
export type OrderDirection = 'asc' | 'desc';
interface usePaginationSWRProps {
    filter?: string,
    filterType?: FilterType,
    filterValue?: string | null | number,
    orderBy?: string,
    orderDirection?: OrderDirection,
    limit?: number,
    search?: string,
    page?: number,

    defaultFilter?: { [value: string]: any },
}

export interface usePaginationSWRResponse<T, Y> {
    data?: T,
    mutate: (data?: T | Promise<T> | MutatorCallback<T> | undefined, shouldRevalidate?: boolean | undefined) => Promise<T | undefined>,
    error?: Y,
    filterData: (filter: string, filterType: FilterType, filterValue: string | null | number) => void,
    orderData: (orderBy: string, orderDirection: OrderDirection) => void
    nextPage: () => void,
    prevPage: () => void,
    setLimit: (data: number) => void,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    loading: boolean,
    page: number,
    limit: number,

    search?: string,
    setSearch: React.Dispatch<React.SetStateAction<string | undefined>>,

    filter?: string,
    filterType: FilterType,
    filterValue?: string | null | number,

    orderBy?: string,
    orderDirection: OrderDirection,
    handleOrder: (name: string) => void
    url?: string | null,

    defaultFilter?: { [value: string]: any },
}

export const usePaginationSWR = <T, Y>(url?: string | null, initialOptions?: usePaginationSWRProps): usePaginationSWRResponse<T, Y> => {

    const [page, setPage] = React.useState(initialOptions?.page || 1);
    const [limit] = React.useState(initialOptions?.limit || 20);

    const [search, setSearch] = React.useState(initialOptions?.search);
    const debouncedSearch = useDebounce(search, 300);

    const [filter, setFilter] = React.useState(initialOptions?.filter);
    const [filterType, setFilterType] = React.useState<FilterType>(initialOptions?.filterType || '=');
    const [filterValue, setFilterValue] = React.useState<string | null | number | undefined>(initialOptions?.filterValue);

    const [orderBy, setOrderBy] = React.useState(initialOptions?.orderBy);
    const [orderDirection, setOrderDirection] = React.useState<OrderDirection>(initialOptions?.orderDirection || 'asc');

    useEffect(() => {
        setPage(1)
    }, [debouncedSearch, filter, filterType, filterValue, orderBy, orderDirection])


    const newUrl = useMemo(() => {
        if (!url) return null;
        const newUrl = new URL(url);
        const params = newUrl.searchParams;

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

        if (initialOptions?.defaultFilter && Object.keys(initialOptions.defaultFilter).length) {
            for (const key in initialOptions.defaultFilter) {
                if (initialOptions.defaultFilter.hasOwnProperty(key)) {
                    params.set(key, initialOptions.defaultFilter[key]);
                }
            }
        }

        if (debouncedSearch) {
            params.set('search', debouncedSearch);
        }

        newUrl.search = params.toString();
        return newUrl.toString();
    }, [url, page, limit, orderBy, orderDirection, filter, filterType, filterValue, debouncedSearch, initialOptions]);

    const filterData = (filter: string | undefined, filterType: FilterType, filterValue: string | null | number) => {
        setFilter(filter);
        setFilterType(filterType);
        setFilterValue(filterValue);
    }

    const orderData = (orderBy: string, orderDirection: OrderDirection) => {
        setOrderBy(orderBy);
        setOrderDirection(orderDirection);
    }

    const nextPage = () => {
        setPage((page) => page + 1);
    }

    const prevPage = () => {
        setPage((page) => page - 1);
    }

    const setLimit = (data: number) => {
        setLimit(data);
    }

    const { data, mutate, error } = useSWR<T, Y>(newUrl, commonFetch);
    const loading = !data && !error;

    const handleOrder = useCallback((name: string) => {
        const alreadyAsc = (orderBy === name && (!orderDirection || orderDirection === 'asc'))
        orderData(name, alreadyAsc ? 'desc' : 'asc');
    }, [orderBy, orderDirection]);

    return {
        data,
        mutate,
        error,
        filterData,
        orderData,
        nextPage,
        prevPage,
        setLimit,
        setPage,
        loading,

        page,
        limit,

        setSearch,
        search,

        filter,
        filterType,
        filterValue,
        orderBy,
        orderDirection,
        handleOrder,
        url: newUrl,
        defaultFilter: initialOptions?.defaultFilter,
    };
}
