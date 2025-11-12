import React from "react";

interface Position {
  position_name: string;
  company: {
    name: string;
    address: string;
  };
  capacity: number;
  submission_end_date: string;
  description: string;
}

interface ModalProps {
  isOpen: boolean;
  position: Position;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, position, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border">
        <h2 className="text-xl font-bold mb-4">{position.position_name}</h2>
        <div className="space-y-3">
          <p>
            <strong>Company:</strong> {position.company.name}
          </p>
          <p>
            <strong>Address:</strong> {position.company.address}
          </p>
          <p>
            <strong>Capacity:</strong> {position.capacity}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(position.submission_end_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Description:</strong> {position.description}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full mt-6 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};
