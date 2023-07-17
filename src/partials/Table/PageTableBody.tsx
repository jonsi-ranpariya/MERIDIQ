export interface PageTableBodyProps {
    children?: React.ReactNode[] | React.ReactNode,
}

const PageTableBody: React.FC<PageTableBodyProps> = ({
    children,
}) => {
    return (
        <tbody className="divide-y dark:divide-gray-700">
            {children}
        </tbody>
    );
}

export default PageTableBody;