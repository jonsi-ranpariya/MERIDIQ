import PageTableBody from "./PageTableBody";
import PageTableHead from "./PageTableHead";
import PageTableTD from "./PageTableTD";
import PageTableTH from "./PageTableTH";
import PageTableTHSort from "./PageTableTHSort";

export interface PageTableProps extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
    children?: React.ReactNode[] | React.ReactNode,
    removeMargin?: boolean,
}

const Table = ({
    children,
    ...props
}: PageTableProps) => {
    return (
        <div className={`overflow-x-auto w-full`}>
            <table className={`w-full`} {...props}>
                {children}
            </table>
        </div>
    );
}

Table.Body = PageTableBody
Table.Head = PageTableHead
Table.Td = PageTableTD
Table.Th = PageTableTH
Table.ThSort = PageTableTHSort

export default Table;