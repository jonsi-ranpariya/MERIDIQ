import IconButton from '@components/form/IconButton';
import ChevronIcon from "../Icons/Chevron";

export interface PortalHeaderProps {
    title: string,
    onBackClick?: () => void
}

const PortalHeader: React.FC<PortalHeaderProps> = ({
    title,
    onBackClick = () => {},
}) => {
    return (
        <div className="relative border-b dark:border-gray-700 my-2 flex justify-center items-center">
            <IconButton className="absolute left-0 outline-none" onClick={onBackClick}>
                <ChevronIcon side="left" />
            </IconButton>
            <p className="text-center font-bold text-2xl py-2 col-span-7">{title}</p>
        </div>
    );
}

export default PortalHeader;