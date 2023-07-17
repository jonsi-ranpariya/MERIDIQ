import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import api from "../../../../configs/api";
import { commonFetch } from "../../../../helper";
import { ClientResponse } from "../../../../interfaces/common";
import strings from "../../../../lang/Lang";
import MediaIcon from "../../../../partials/Icons/ClientProfile/Media";
import ClientInfoItem from "../ClientInfoItem";

export interface ClientBeforeAfterImageProps {

}

const ClientBeforeAfterImage: FC<ClientBeforeAfterImageProps> = () => {

  const { clientId }: { clientId?: string } = useParams();
  const { data, error } = useSWR<ClientResponse, Error>(
    api.clientSingle(clientId),
    commonFetch
  );
  const navigate = useNavigate();
  const loading = !data && !error;

  return (
    <ClientInfoItem
      loading={loading}
      text={strings.beforeAfter}
      icon={<MediaIcon />}
      addText={strings.add}
      onClick={() => navigate(`/clients/${clientId}/before-after`)}
    />
  );
}

export default ClientBeforeAfterImage;