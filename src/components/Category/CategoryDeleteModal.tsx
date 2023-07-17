import Button from '@components/form/Button';
import PowerIcon from '@partials/Icons/Power';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { Category } from '../../interfaces/model/category';
import strings from '../../lang/Lang';
import DeleteModal from '../../partials/MaterialModal/DeleteModal';

export interface CategoryDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedCategory?: Category,
    mutate: () => Promise<any>,
}

const CategoryDeleteModal: React.FC<CategoryDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedCategory, mutate }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();
    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose()
            }}
            icon={<PowerIcon slash={selectedCategory?.is_active} />
            }
            text={`${strings.Are_you_sure_you_want_to} ${selectedCategory?.is_active ? strings.InActive.toLocaleLowerCase() : strings.Active.toLocaleLowerCase()} ${selectedCategory?.name}`}

            submitButton={
                <Button
                    loading={isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        const response = await fetch(`${api.categoryDelete(selectedCategory?.id)}`, {
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
                    }}
                >{strings.Submit}
                </Button>
            }
        />
    );
}

export default CategoryDeleteModal;