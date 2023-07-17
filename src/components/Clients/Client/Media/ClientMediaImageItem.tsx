import { DetailedHTMLProps, ImgHTMLAttributes, MouseEventHandler } from "react";
import DeleteIcon from "../../../../partials/Icons/Delete";

export interface ClientMediaImageItemProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  url: string,
  onDeleteClick?: MouseEventHandler<HTMLButtonElement> | undefined,
  onImageClick?: MouseEventHandler<HTMLImageElement> | undefined,
}

const ClientMediaImageItem: React.FC<ClientMediaImageItemProps> = ({
  url,
  onDeleteClick = () => { },
  onImageClick = () => { },
  ...props
}) => {
  return (
    <li className="group relative ">
      <button onClick={onDeleteClick} className="absolute outline-none right-1 top-1 p-1 hidden group-hover:block rounded-md bg-opacity-50 bg-black text-white">
        <DeleteIcon className="text-xl" />
      </button>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <img
        className="rounded border dark:border-gray-800 h-full cursor-pointer"
        onError={e => {
          if (e.currentTarget.parentElement) e.currentTarget.parentElement.style.display = 'none'
        }}
        onClick={onImageClick}
        src={url}
        loading="lazy"
        {...props}
      />
    </li>
  );
}

export default ClientMediaImageItem;