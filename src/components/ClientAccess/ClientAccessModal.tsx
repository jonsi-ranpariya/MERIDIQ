import api from "@configs/api";
import LoadingIcon from "@icons/Loading";
import { ClientAccessesResponse, UsersResponse } from "@interface/common";
import { Client } from "@interface/model/client";
import strings from "@lang/Lang";
import Modal from "@partials/MaterialModal/Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import ClientAccessModalListItem from "./ClientAccessModalListItem";

export interface ClientAccessModalProps {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedClient: Client
}

const ClientAccessModal: React.FC<ClientAccessModalProps> = ({
  openModal,
  setOpenModal,
  selectedClient,
}) => {

  const [loading, setLoading] = useState(false)
  const { data: userData, isLoading: userLoading } = useSWR<UsersResponse>(api.userAll, {
    refreshInterval: 20000,
    revalidateOnFocus: false,
    revalidateIfStale: false,
  })
  const { data, error } = useSWR<ClientAccessesResponse>(api.singleClientsAccesses(selectedClient?.id))

  const isLoading = !data && !error;

  const handleModalClose = async () => {
    if (loading) return;
    setOpenModal(false)
  }

  const onChange = async (userId: number) => {
    if (loading) return;
    setLoading(true)
    const response = await fetch(api.clientAccessStore(userId), {
      method: 'POST',
      headers: {
        "Accept": 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': 'test',
        'Content-Type': 'application/json',
        'X-App-Locale': strings.getLanguage(),
      },
      credentials: "include",
      body: JSON.stringify({
        client_ids: [selectedClient.id],
      }),
    });

    const data = await response.json();
    if (data.status === '1') {
      toast.success(strings.client_access_changed_successfully);
    } else {
      toast.error(data.message || 'please try again.');
    }
    setLoading(false);
  }

  return (
    <Modal
      open={openModal}
      handleClose={handleModalClose}
      title={strings.managedBy}
      loading={isLoading}
    >
      <div className="space-y-2 p-6">
        {
          (userLoading)
            ? <div className="flex justify-center">
              <LoadingIcon className="text-primary" />
            </div>
            : userData?.data.map((user) => <ClientAccessModalListItem
              key={`ClientAccessModalListItem_${user.id}_${selectedClient.id}`}
              user={user}
              selected={data?.data.includes(user.id) ?? false}
              onChange={onChange}
            />
            )
        }
      </div>
    </Modal>
  );
}

export default ClientAccessModal;