export interface PageTableHeadProps {
    children?: React.ReactNode[] | React.ReactNode,
}

const PageTableHead: React.FC<PageTableHeadProps> = ({
    children,
}) => {
    return (
        <thead className="text-left">
            <tr>
                {children}
            </tr>
        </thead>
    );
}

export default PageTableHead;