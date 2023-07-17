
export interface PortalTitleProps {
    title: string,
}

const PortalTitle: React.FC<PortalTitleProps> = ({
    title,
}) => {
    return (
        <p className="text-center text-xl font-semibold">{title}</p>
    );
}

export default PortalTitle;