import IconButton from '@components/form/IconButton';
import LoadingIcon from '@icons/Loading';
import SignIcon from '@icons/Sign';
import * as React from 'react';
import { formatDate, getUrlExtension } from '../../../../helper';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import DownloadIcon from '../../../../partials/Icons/Download';
import EditIcon from '../../../../partials/Icons/Edit';
import EyeIcon from '../../../../partials/Icons/Eye';
import PageTableTD from '../../../../partials/Table/PageTableTD';

export interface ClientGeneralNoteListItemProps {
    note: GeneralNote,
    onEditClick?: (data: GeneralNote) => void,
    onViewClick?: (data: GeneralNote) => void,
    onSignClick?: (data: GeneralNote) => void,
}

async function download(fileName: string, url: string) {
    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.blob();
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(data);
        const ext = getUrlExtension(fileName) ? '' : getUrlExtension(url);
        a.setAttribute('download', `${fileName}${ext ? '.' + ext : ''}`);
        a.click();
    } catch (error) {
        console.error(error);
    }
}

const ClientGeneralNoteListItem: React.FC<ClientGeneralNoteListItemProps> = ({
    note,
    onEditClick = () => { },
    onViewClick = () => { },
    onSignClick = () => { },
}) => {
    const [downloading, setDownloading] = React.useState(false);

    async function onDownloadClick() {
        if (downloading || !(note.files?.length && note.files[0].url)) return;
        setDownloading(true);
        for (let index = 0; index < note.files.length; index++) {
            const el = note.files[index];
            if (!el.url) continue;
            const name = note.filenames?.length ? note.filenames[index] : note.filename ? note.filename : note.title;
            await download(name, el.url);
        }
        setDownloading(false);
    }

    return (
        <>
            <tr className="md:hidden">
                {mobileListItem()}
            </tr>
            <tr className="hidden md:table-row hover:bg-primary/5">
                {desktopListItem()}
            </tr>
        </>

    );
    function desktopListItem() {
        return (
            <>
                <PageTableTD>
                    <p className='break-all'>{note.title}</p>
                </PageTableTD>
                <PageTableTD>
                    <div className="flex pl-2 break-all">
                        <p>{formatDate(note?.created_at, "YYYY-MM-DD") || '-'}</p>
                    </div>
                </PageTableTD>

                <PageTableTD>
                    <div className="pl-2 break-all">
                        {
                            (note.files?.length === 1 && note.filename) ?
                                <span className="text-sm">{note.filename ? note.filename : '-'}</span>
                                : !!note.files?.length
                                    ? note.files.map((v, index) => <span key={`file_${note.id}_${v.id}`} className="text-sm">{note.filenames?.length ? (note.filenames[index] ? note.filenames[index] : note.filename ?? '-') : '-'}<br /></span>)
                                    : <span className="text-sm">{note.filename ? note.filename : '-'}</span>
                        }
                    </div>
                </PageTableTD>
                <PageTableTD>
                    <p className={`text-sm uppercase ${note?.signed_at ? "" : 'text-error'}`}>{note?.signed_at ? strings.Signed : strings.unsigned}</p>
                </PageTableTD>
                <PageTableTD>
                    <div className="flex justify-end pr-4 items-center space-x-0.5">
                        {!note?.signed_at
                            ? (
                                <>
                                    <IconButton onClick={() => onSignClick(note)} children={<SignIcon />} />
                                    <IconButton onClick={() => onEditClick(note)} children={<EditIcon />} />
                                </>
                            ) : ''
                        }
                        {(note.files?.length && note.files[0].url) ? <IconButton onClick={onDownloadClick} children={downloading ? <LoadingIcon /> : <DownloadIcon />} /> : <></>}
                        <IconButton onClick={() => onViewClick(note)} children={<EyeIcon />} />
                    </div>
                </PageTableTD>
            </>
        )
    }


    function mobileListItem() {
        return (
            <PageTableTD>
                <div className="py-2">
                    <div className="flex justify-between">
                        <p className={`text-xs uppercase ${note?.signed_at ? "" : 'text-error'}`}>{note?.signed_at ? strings.Signed : strings.unsigned}</p>
                        <p className='text-xs font-medium'>{formatDate(note?.created_at, "YYYY-MM-DD") || '-'}</p>
                    </div>
                    <p className='break-all mt-1'>{note.title}</p>
                    <div className="flex items-center space-x-0.5 mt-1">
                        {!note?.signed_at
                            ? (
                                <>
                                    <IconButton onClick={() => onSignClick(note)} children={<SignIcon />} />
                                    <IconButton onClick={() => onEditClick(note)} children={<EditIcon />} />
                                </>
                            ) : ''
                        }
                        {(note.files?.length && note.files[0].url) ? <IconButton onClick={onDownloadClick} children={downloading ? <LoadingIcon /> : <DownloadIcon />} /> : <></>}
                        <IconButton onClick={() => onViewClick(note)} children={<EyeIcon />} />
                    </div>
                </div>
            </PageTableTD>
        )
    }
}



export default ClientGeneralNoteListItem;