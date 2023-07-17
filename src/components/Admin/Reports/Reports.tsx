import CalendarSelect from '@components/Calendar/Custom/CalendarSelect';
import Button from '@components/form/Button';
import Error from '@components/form/Error';
import Heading from '@components/heading/Heading';
import LoadingIcon from '@icons/Loading';
import { ModalLoading } from '@partials/Loadings/ModalLoading';
import dayjs from 'dayjs';
import { Suspense, useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import useSWR from 'swr';
import api from '../../../configs/api';
import { commonFetch } from '../../../helper';
import useLocalStorage from '../../../hooks/useLocalStorage';
import useTheme from '../../../hooks/useTheme';
import { BoxDataResponse, GraphDataResponse } from '../../../interfaces/common';
import GraphData from '../../../interfaces/model/graph';
import strings from '../../../lang/Lang';
import Card from '../../../partials/Paper/PagePaper';

const options = {
    chart: {
        type: 'bar',
        height: 350,
    },
    dataLabels: {
        enabled: false,
    },
    markers: {
        size: 0,
        style: 'hollow',
    },
    xaxis: {
        type: 'datetime',
        // min: new Date('01 Mar 2012').getTime(),
        // type: 'category',
        tickPlacement: 'on',
        // labels: {
        //     format: 'yyyy',
        // },
        axisTicks: {
            show: false,
        },
    },
    tooltip: {
        x: {
            format: 'yyyy MMM dd',
        },
    },
    // fill: {
    //     type: 'gradient',
    //     gradient: {
    //         shadeIntensity: 1,
    //         opacityFrom: 0.7,
    //         opacityTo: 0.9,
    //         stops: [0, 100],
    //     },
    // },
};

function Reports() {
    const { storedValue: startDate, setStorageValue: setStartDate } = useLocalStorage('metrics_start_date', dayjs().subtract(90, 'days').toDate());
    const { storedValue: endDate, setStorageValue: setEndDate } = useLocalStorage('metrics_end_date', new Date());
    const [graphParams, setGraphParams] = useState(new URLSearchParams());

    const { isDark } = useTheme();

    const boxUrl = useMemo(() => {
        const newUrl = new URL(api.dashboard_box);
        const params = new URLSearchParams();
        params.set('start_date', dayjs(startDate || new Date()).format('YYYY-MM-DD'));
        params.set('end_date', dayjs(endDate || new Date()).format('YYYY-MM-DD'));

        newUrl.search = params.toString();
        return newUrl;
    }, [startDate, endDate]);

    const graphUrl = useMemo(() => {
        const newUrl = new URL(api.dashboard_graph);
        const params = graphParams;
        params.set('start_date', dayjs(startDate || new Date()).format('YYYY-MM-DD'));
        params.set('end_date', dayjs(endDate || new Date()).format('YYYY-MM-DD'));

        newUrl.search = params.toString();
        return newUrl;
    }, [startDate, endDate, graphParams]);

    const { data: boxData, error: boxError } = useSWR<BoxDataResponse, Error>(boxUrl.toString(), commonFetch);
    const isBoxDataLoading = !boxData && !boxError;

    const { data: graphData, error: graphError } = useSWR<GraphDataResponse, Error>(graphUrl.toString(), commonFetch);
    const isGraphDataLoading = !graphData && !graphError;

    const [graphs, setGraphs] = useState<GraphData[]>([]);

    const error = boxError || graphError;

    useEffect(() => {
        if (graphData?.data) {
            setGraphs(graphData.data);
        }
    }, [graphData, setGraphs])

    return (
        <>
            <div className="">
                {(isBoxDataLoading || isGraphDataLoading) && <ModalLoading />}
                <Heading text={strings.reports} variant="bigTitle" className='mb-4' />
                <Card className='mb-8'>
                    <div className="grid md:grid-cols-2 gap-6 mb-2">
                        <CalendarSelect
                            selectedDate={dayjs(startDate || new Date()).format('YYYY-MM-DD')}
                            onChange={(date) => setStartDate(new Date(date))}
                            inputProps={{
                                label: strings.start_date,
                                placeholder: strings.Date,
                            }}
                        />
                        <CalendarSelect
                            selectedDate={dayjs(endDate || new Date()).format('YYYY-MM-DD')}
                            onChange={(date) => setEndDate(new Date(date))}
                            inputProps={{
                                label: strings.end_date,
                                placeholder: strings.Date,
                            }}
                        />
                    </div>
                    <Error error={error?.message} />
                </Card>
                <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-4 gap-6 mt-2 mb-8">

                    <Card className="col-span-4 md:col-span-2 lg:col-span-1 text-center">
                        <h2 className="text-4xl font-bold">{boxData?.data?.total_company || 0}</h2>
                        <p className="font-medium text-gray-500 dark:text-gray-400">{strings.Companies}</p>
                    </Card>

                    <Card className="col-span-4 md:col-span-2 lg:col-span-1 text-center">
                        <h2 className="text-4xl font-bold">{boxData?.data?.total_users || 0}</h2>
                        <p className="font-medium text-gray-500 dark:text-gray-400">{strings.Users}</p>
                    </Card>

                    <Card className="col-span-4 md:col-span-2 lg:col-span-1 text-center">
                        <h2 className="text-4xl font-bold">{boxData?.data?.total_clients || 0}</h2>
                        <p className="font-medium text-gray-500 dark:text-gray-400">{strings.master_Clients}</p>
                    </Card>

                    <Card className="col-span-4 md:col-span-2 lg:col-span-1 text-center">
                        <h2 className="text-4xl font-bold">{boxData?.data?.total_treatment || 0}</h2>
                        <p className="font-medium text-gray-500 dark:text-gray-400">{strings.master_ProductsTreatments}</p>
                    </Card>
                    <Suspense fallback={<LoadingIcon />}>

                        {graphs?.map((data, index) => (
                            <Card className="col-span-4 lg:col-span-2" key={index}>
                                <div className="grid grid-flow-col grid-cols-3 place-items-center mb-2">
                                    <Button
                                        size="small"
                                        variant={graphUrl.searchParams.get(`data[${index}][filter]`) === 'day' ? 'filled' : 'outlined'}
                                        onClick={() => {
                                            const newSearchParams = new URLSearchParams(graphParams);
                                            newSearchParams.set(`data[${index}][filter]`, 'day');
                                            setGraphParams(newSearchParams);
                                        }}
                                    >
                                        Day
                                    </Button>

                                    <Button
                                        size="small"
                                        variant={graphUrl.searchParams.get(`data[${index}][filter]`) === 'week' ? 'filled' : 'outlined'}
                                        onClick={() => {
                                            const newSearchParams = new URLSearchParams(graphParams);
                                            newSearchParams.set(`data[${index}][filter]`, 'week');
                                            setGraphParams(newSearchParams);
                                        }}
                                    >
                                        Week
                                    </Button>

                                    <Button
                                        size="small"
                                        variant={graphUrl.searchParams.get(`data[${index}][filter]`) === 'month' || !graphUrl.searchParams.get(`data[${index}][filter]`) ? 'filled' : 'outlined'}
                                        onClick={() => {
                                            const newSearchParams = new URLSearchParams(graphParams);
                                            newSearchParams.set(`data[${index}][filter]`, 'month');
                                            setGraphParams(newSearchParams);
                                        }}
                                    >
                                        Month
                                    </Button>
                                </div>
                                <ReactApexChart
                                    options={{
                                        theme: {
                                            mode: isDark ? 'dark' : 'light',
                                            palette: 'palette1',
                                        },
                                        ...options,
                                        ...data.data,
                                    }}
                                    series={data.data.series}
                                    type={data?.data?.chart?.type || 'bar'}
                                />
                            </Card>
                        ))}
                    </Suspense>

                </div>
            </div>
        </>
    );
}

export default Reports;
