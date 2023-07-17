export interface PageTableTDProps extends React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement> {
    children?: React.ReactNode[] | React.ReactNode,
}

const PageTableTD: React.FC<PageTableTDProps> = ({
    children,
    ...props
}) => {
    return (
        <td className="px-2 py-2" {...props}>
            {children}
        </td>
    );
}

export default PageTableTD;