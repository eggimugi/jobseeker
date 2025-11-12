import { JobPosition } from "@/types/hrd";

interface JobPositionsCardProps {
    position: JobPosition;
    onDetail: (position: JobPosition) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

export const JobPositionsCard: React.FC<JobPositionsCardProps> = ({
    position,
    onDetail,
    onEdit,
    onDelete,
}) => {
    
    return (
        <div
            key={position.id}
            className="bg-white border border-gray-400 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
                {position.position_name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {position.description}
            </p>
            <p className="text-xs text-gray-500 mb-4">
                {position.company.name} • {position.company.address}
            </p>
            <div className="flex gap-2 mb-4">
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                    {position.capacity} slot{position.capacity > 1 ? "s" : ""}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {new Date(position.submission_end_date).toLocaleDateString()}
                </span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => onDetail(position)}
                    className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-orange-600 hover:text-white transition-colors"
                >
                    Detail
                </button>
                {onEdit && (
                    <button
                        onClick={() => onEdit(position.id)}
                        className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-orange-600 hover:text-white transition-colors"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete(position.id)}
                        className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-red-600 hover:text-white transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};
