import AddButton from '@components/form/AddButton';
import Pagination from '@components/form/Pagination';
import Skeleton from '@components/Skeleton/Skeleton';
import ModalSuspense from '@partials/Loadings/ModalLoading';
import * as React from 'react';
import api from '../../configs/api';
import { usePaginationSWR } from '../../hooks/usePaginationSWR';
import { TemplatesPaginatedResponse } from '../../interfaces/common';
import { Template } from '../../interfaces/model/template';
import strings from '../../lang/Lang';
import Table from '../../partials/Table/PageTable';
import TemplateListItem from './TemplateListItem';

const TemplateDeleteModal = React.lazy(() => import('./TemplateDeleteModal'))
const TemplateModal = React.lazy(() => import('./TemplateModal'))

export interface TemplatesProps {

}

export interface filterInterFace {
    page: ''
    per_page: ''
}

const Templates: React.FC<TemplatesProps> = () => {

    const [openModal, setOpenModal] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const { data, mutate, page, setPage, loading, orderBy, orderDirection, handleOrder } = usePaginationSWR<TemplatesPaginatedResponse, Error>(api.template, {
        defaultFilter: {
            'withTrashed': true,
            'withDefaultTemplate': true,
        }
    });

    const [selectedTemplate, setSelectedTemplate] = React.useState<Template>();

    return (
        <>
            <ModalSuspense>
                {deleteOpen &&
                    <TemplateDeleteModal
                        open={deleteOpen}
                        handleClose={() => setDeleteOpen(false)}
                        mutate={mutate}
                        selectedTemplate={selectedTemplate}
                    />
                }
                {openModal &&
                    <TemplateModal
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        mutate={mutate}
                        selectedTemplate={selectedTemplate}
                    />
                }
            </ModalSuspense>

            <div className="flex justify-end">
                <AddButton
                    onClick={() => {
                        setSelectedTemplate(undefined);
                        setOpenModal(true);
                    }}
                />
            </div>
            <Table>
                <Table.Head>
                    <Table.ThSort
                        sort={orderBy === 'name' && orderDirection}
                        onClick={() => handleOrder('name')}
                        children={strings.Image}
                    />
                    <Table.Th />
                </Table.Head>
                <Table.Body>
                    {data?.data.map((template) => (
                        <TemplateListItem
                            key={template.id}
                            template={template}
                            onEditClick={() => {
                                setSelectedTemplate(template);
                                setOpenModal(true);
                            }}
                            onDeleteClick={() => {
                                setSelectedTemplate(template);
                                setDeleteOpen(true);
                            }}
                        />
                    ))}
                    {loading && <TemplateSkeleton limit={10} />}
                </Table.Body>
            </Table>
            <Pagination
                pageSize={data?.per_page}
                totalCount={data?.total}
                currentPage={page}
                onPageChange={(page) => setPage(page)}
            />
        </>
    );
}

function TemplateSkeleton({ limit }: { limit: number }) {
    return (
        <>
            {[...Array(limit)].map((value, key) => {
                return (
                    <tr key={key}>
                        <td>
                            <div className="flex items-center">
                                <Skeleton className="h-10 mr-4 cursor-wait w-full" />
                            </div>
                        </td>
                        <td className="flex">
                            <Skeleton className="h-9 w-9 mx-1" variant="circular" />
                            <Skeleton className="h-9 w-9 ml-1" variant="circular" />
                        </td>
                    </tr>
                );
            })}
        </>
    );
}

export default Templates;