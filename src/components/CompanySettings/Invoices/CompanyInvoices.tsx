import Heading from '@components/heading/Heading';
import Skeleton from '@components/Skeleton/Skeleton';
import { FC } from "react";
import useSWR from "swr";
import api from "../../../configs/api";
import { commonFetch, getUnitKeyToValue } from "../../../helper";
import { InvoiceResponse } from "../../../interfaces/common";
import strings from "../../../lang/Lang";
import Table from "../../../partials/Table/PageTable";
import SubscriptionSettings from "../../Settings/SubscriptionSettings";
import CompanyBillingDetail from "./CompanyBillingDetail";
import CompanyCardDetail from './CompanyCardDetail';
import InvoiceListItem from "./InvoiceListItem";

export interface CompanyInvoicesProps {

}

const CompanyInvoices: FC<CompanyInvoicesProps> = () => {
  const { data, error, mutate } = useSWR<InvoiceResponse, Error>(
    api.subscriptionInvoices,
    commonFetch
  );

  const loading = !data && !error;

  return (
    <div className="">
      <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <CompanyBillingDetail />
        <CompanyCardDetail />
        <SubscriptionSettings />
      </div>
      <div className="mt-6">
        <Heading text={strings.companyInvoices} variant='headingTitle' className='mb-4' />
        <Table>
          <Table.Head>
            <Table.Th removeWidth>{strings.Date}</Table.Th>
            <Table.Th removeWidth>{strings.invoiceNo}</Table.Th>
            <Table.Th removeWidth>{strings.amount}</Table.Th>
            <Table.Th removeWidth>{strings.status}</Table.Th>
            <Table.Th removeWidth>{strings.Download}</Table.Th>
          </Table.Head>
          <Table.Body>
            {loading
              ? <InvoiceSkeleton limit={6} />
              : data
                ? <>
                  {data.data.map((a) => {
                    return <InvoiceListItem
                      key={a.id || Date.now()}
                      pdf={a.pdf}
                      plan={a.items?.length && a.items[a.items.length - 1].plan ? a.items[a.items.length - 1].plan : undefined}
                      cost={`${getUnitKeyToValue(a.currency)}${a.total}`}
                      date={a.paid_at ?? a.created}
                      number={a.number}
                      status={a.status}
                      tax={a.tax ? `VAT: ${getUnitKeyToValue(a.currency)}${a.tax}` : undefined}
                      mutate={mutate}
                      id={a.id}
                    />
                  })}
                </>
                : <></>
            }
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}

function InvoiceSkeleton({ limit }: { limit: number }) {
  return (
    <>
      {[...Array(limit)].map((_, index) => {
        return (
          <tr key={index}>
            <td><Skeleton className="h-10 " /></td>
            <td><Skeleton className="h-10 " /></td>
            <td><Skeleton className="h-10 " /></td>
            <td><Skeleton className="h-10 " /></td>
            <td><Skeleton className="h-10  w-32" /></td>
            <td className="flex">
              <Skeleton className="h-9 w-9" variant="circular" />
            </td>
          </tr>
        );
      })}
    </>
  );
}


export default CompanyInvoices;