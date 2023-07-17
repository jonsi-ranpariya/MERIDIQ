export interface PageTableTHProps extends React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement> {
    children?: React.ReactNode[] | React.ReactNode,
    removeWidth?: boolean
}

const PageTableTH: React.FC<PageTableTHProps> = ({
    children,
    removeWidth = false,
    className,
    ...props
}) => {
    return (
        <th  {...props} className={`hidden md:table-cell ${className}`}>
            <p className="uppercase font-medium text-sm text-mediumGray">{children}</p>
        </th>
    );
}

export default PageTableTH;