import SortIcon from "@icons/Sort"
import PageTableTH from "./PageTableTH"

export interface PageTableTHSortProps extends React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement> {
    children?: React.ReactNode[] | React.ReactNode,
    hasSorting?: boolean,
    removeWidth?: boolean
    sort?: 'asc' | 'desc' | '' | boolean,
}

const PageTableTHSort: React.FC<PageTableTHSortProps> = ({
    children,
    className,
    removeWidth = false,
    sort = '',
    ...props
}) => {

    return (
        <PageTableTH className={` ${className} cursor-pointer`} {...props}>
            <span className="flex items-center space-x-2">
                <span className="uppercase">{children}</span>
                <span className="text-lg">
                    <SortIcon sort={sort} className="text-xs" />
                </span>
            </span>
        </PageTableTH>
    );
}

export default PageTableTHSort;