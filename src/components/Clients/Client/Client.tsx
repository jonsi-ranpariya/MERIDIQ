import LoadingIcon from '@icons/Loading';
import strings from '@lang/Lang';
import MaterialBreadcrumbs from '@partials/Breadcrumbs/MaterialBreadcrumbs';
import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch } from "../../../helper";
import { ClientResponse } from "../../../interfaces/common";
import FullPageError from "../../../partials/Error/FullPageError";
import ClientAftercare from './Aftercare/ClientAftercare';
import ClientInfo from "./ClientInfo";
import ClientMedia from './Media/ClientMedia';
import ClientQuestionnerSection from './Questionaries/ClientQuestionnerSection';
import ClientMainCard from './sections/MainCard';

export interface ClientProps {}

const Client: React.FC<ClientProps> = () => {
  const { clientId }: { clientId?: string } = useParams();

  const { data, error } = useSWR<ClientResponse, Error>(
    api.clientSingle(clientId),
    commonFetch
  );

  const loading = !data && !error;

  if (error) {
    return <FullPageError code={error?.status || 500} message={error.message || 'server error'} />
  }
  if (loading) {
    return <ClientSkeleton />
  }

  return (
    <div className='space-y-6'>
      <div className="">
        <MaterialBreadcrumbs />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientInfo />
        <div className="row-start-3 lg:row-start-auto">
          <ClientMedia />
        </div>
        <div className="lg:col-span-2">
          <ClientMainCard />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ClientQuestionnerSection />
        </div>
        <ClientAftercare />
      </div>
    </div>
  );
};


export const ClientSkeleton = () => {
  return (
    <div className='w-full flex justify-center py-8 lg:py-12 items-center space-x-2'>
      <LoadingIcon className='text-primary text-xl' />
      <p className='text-mediumGray'>{strings.Loading}...</p>
    </div>
  )
}


export default Client;
