import * as React from 'react';
import api from '../../configs/api';

export interface ViewModalTextItemProps {
    title: string,
    value?: string | null,
    image?: boolean,
    imagesArray?: string[],
    show?: boolean,
    showIfEmpty?: boolean,
    html?: boolean,
}

const ViewModalTextItem: React.FC<ViewModalTextItemProps> = ({
    title,
    value,
    image = false,
    show = true,
    html = false,
    showIfEmpty = false,
    imagesArray = [],
}) => {

    if (!show) {
        return <></>;
    }

    if (showIfEmpty || value || imagesArray.length) {
        return (
            <div className="mb-4">
                <p className="text-primary dark:text-primaryLight uppercase text-sm">{title}</p>
                {returnValueHtml()}
            </div>
        )
    }

    return <></>;

    function returnValueHtml() {

        if (imagesArray.length) {
            return imagesArray.map((image) => {
                return <img key={image} src={`${api.storage}${image}` || ''} alt={title} className="w-auto mb-2 border dark:border-dimGray rounded" />
            })
        }

        if (image) {
            return <img src={value || ''} alt={title} className="w-auto max-h-40 border dark:bg-gray-800 dark:border-gray-700" />
        }

        if (html) {
            return <div className="prose-sm" dangerouslySetInnerHTML={{ __html: value || '' }} />
        }

        return <p className="break-all" style={{ whiteSpace: 'pre-wrap' }}>{value || '-'}</p>
    }
}

export default ViewModalTextItem;