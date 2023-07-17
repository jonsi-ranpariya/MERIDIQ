
import IconButton from "@components/form/IconButton";
import LoadingIcon from "@icons/Loading";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../configs/api";
import { timeZone } from "../../../helper";
import useTranslation from "../../../hooks/useTranslation";
import { InvoiceStatus } from "../../../interfaces/model/invoice";
import { NewPlan } from "../../../interfaces/model/plan";
import strings from "../../../lang/Lang";
import DownloadIcon from "../../../partials/Icons/Download";

export interface InvoiceListItemProps {
  id: string,
  number?: string,
  tax?: string,
  cost: string,
  pdf: string,
  date: string,
  status: InvoiceStatus,
  plan?: NewPlan
  mutate?: () => void,
}

async function download(id: string, name: string) {
  const response = await fetch(api.subscriptionInvoiceDownload.replace(':id', id), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-App-Locale': strings.getLanguage(),
      'X-Time-Zone': timeZone(),
    },
    credentials: 'include',
  });

  const data = await response.blob();
  const url = window.URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.pdf`;
  document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
  a.click();
  a.remove();
}

const InvoiceListItem: FC<InvoiceListItemProps> = ({
  id,
  cost,
  date,
  pdf,
  number,
  status,
  tax,
  plan,
  mutate = () => {},
}) => {
  const [loading, setLoading] = useState(false);
  useTranslation();

  let statusHtml;
  switch (status) {
    case 'draft':
      statusHtml = <span className="uppercase text-sm text-gray-500 dark:text-gray-400">{strings.InvoiceStatusUpcoming}</span>;
      break;
    case 'void':
      statusHtml = <span className="uppercase text-sm text-gray-500 dark:text-gray-400">{strings.InvoiceStatusVoid}</span>;
      break;
    case 'uncollectible':
      statusHtml = <span className="uppercase text-sm text-gray-500 dark:text-gray-400">{strings.InvoiceStatusUncollectible}</span>;
      break;
    case 'paid':
      statusHtml = <span className="uppercase text-sm text-primary dark:text-primaryLight">{strings.InvoiceStatusPaid}</span>;
      break;
    default:
      statusHtml = <span className="uppercase text-sm text-yellow-600 dark:text-yellow-400">{strings.InvoiceStatusPending}</span>;
      break;
  }

  return (
    <tr>
      <td>
        <p className="py-2 whitespace-nowrap">{date}</p>
      </td>
      <td>
        <p className="whitespace-nowrap">{number}</p>
      </td>
      <td>
        <p>{cost} {tax ? `(${tax})` : ''}</p>
      </td>
      <td>
        <p>{statusHtml}</p>
      </td>
      <td>
        {status === 'paid' && !loading
          ? <IconButton onClick={async () => {
            if (loading) return;
            setLoading(true);
            await download(id, number ?? 'test');
            setLoading(false);
          }}>
            <DownloadIcon />
          </IconButton> : <></>}
        {status === 'open' && !loading
          ? <IconButton onClick={async () => {
            if (loading) return;
            setLoading(true);
            fetch(api.subscriptionInvoicePay.replace(':id', id), {
              method: 'GET',
              credentials: 'include',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-App-Locale': strings.getLanguage(),
              },
            })
              .then((response) => response.json())
              .then((data) => {
                mutate();
                if (data.status === '1' && data.data.paid) {
                  toast.success(strings.payment_completed);
                } else {
                  toast.error(strings.payment_failed);
                }
                setLoading(false)
              });
          }}>
            <p className="text-base">Pay</p>
          </IconButton> : <></>}
        {loading ? <IconButton><LoadingIcon /></IconButton> : <></>}
      </td>
    </tr>
  );
}

export default InvoiceListItem;