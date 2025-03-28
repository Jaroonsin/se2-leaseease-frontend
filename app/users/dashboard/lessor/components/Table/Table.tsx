import ReviewTable from './ReviewTable';
import RequestTable from './RequestTable';
import LesseeTable from './LesseeTable';
interface TableProps {
    tableType: string;
}

export interface eachtableProps {
    rowsPerPage: number;
    currentPage: number;
}

const Table: React.FC<TableProps> = ({ tableType }) => {
    const table = tableType == 'Request' ? <RequestTable /> : tableType == 'Lessee' ? <LesseeTable /> : <ReviewTable />;

    return (
        <div className="flex flex-col w-[72.72vw] h-[45vh] rounded-lg border border-slate-200 bg-white">{table}</div>
    );
};

export default Table;
