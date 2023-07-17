import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../configs/api';
import { generateUserFullName } from '../../../helper';
import { User } from '../../../interfaces/model/user';
import strings from '../../../lang/Lang';
import DeleteIcon from '../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../partials/MaterialModal/DeleteModal';

export interface UserDeleteModalProps {
  open?: boolean,
  handleClose?: () => void,
  selectedUser?: User,
  mutate: () => Promise<any>,
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedUser, mutate }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const onClose = () => {
    if (isSubmitting) return;
    handleClose()
  }

  const onSubmit = async () => {
    setIsSubmitting(true)
    const response = await fetch(`${api.clientDelete.replace(':id', selectedUser?.id.toString() || '')}`, {
      method: 'DELETE',
      headers: {
        "Accept": 'application/json',
        'X-CSRF-TOKEN': 'test',
        'X-App-Locale': strings.getLanguage(),
        'Content-Type': 'application/json',
      },
      credentials: "include",
    })

    const data = await response.json();

    if (response.status === 401) {
      navigate('/');
    }

    if (data.status === '1') {
      await mutate();
      toast.success(data.message);
      handleClose();
    } else {
      toast.error(data.message || 'server error, please contact admin.');
    }
    setIsSubmitting(false);

    handleClose();
  }

  return (
    <DeleteModal
      open={open}
      handleClose={onClose}
      icon={
        <div className="flex flex-col items-center">
          <DeleteIcon className="mb-2" />
          <p className="text-base font-bold mt-2">{`${strings.INACTIVATE_CLIENT_1} ${generateUserFullName(selectedUser)}?`}</p>
        </div>
      }
      text={``}
      submitButton={
        <Button
          fullWidth
          className=""
          loading={!!isSubmitting}
          disabled={!!isSubmitting}
          onClick={onSubmit}
        >{strings.Submit}
        </Button>
      }
    />
  );
}

export default UserDeleteModal;