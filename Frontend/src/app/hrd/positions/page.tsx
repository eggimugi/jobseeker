"use client";
import { ProtectedRoute } from "@/components/protectedRoute";
import SectionHeader from "@/components/pageHeader";
import NavbarHRD from "../navbarHRD";
import { jobPositionApi } from "@/utils/hrdApi";
import { JobPosition } from "@/types/hrd";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";

export default function AddPosition() {
  const { token } = useAuth();
  const router = useRouter();
  const [positions, setPositions] = useState<JobPosition[]>([]);
  const [allPositions, setAllPositions] = useState<JobPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      if (!token) return;
      const response = await jobPositionApi.getJobPositions(token);

      if (response.data) {
        setPositions(response.data);
        setAllPositions(response.data);
      }
    };
    fetchPositions();
  }, [token]);

  const handleAddPosition = () => {
    router.push("/hrd/positions/add-positions");
  };

  const handleDetail = (position: JobPosition) => {
    setSelectedPosition(position);
    setShowDetailModal(true);
  };

  const handleEdit = (id: number) => {
    router.push(`/hrd/positions/${id}/edit`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId || !token) return;
    try {
      await jobPositionApi.deleteJobPosition(deleteId, token);
      setPositions(positions.filter((p) => p.id !== deleteId));
      setShowDeleteModal(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarHRD />
        <main className="pt-10">
          <SectionHeader
            indicator="Add Position"
            title={
              <>
                Ready to find your next{" "}
                <span className="text-orange-600 italic">hero</span>?
              </>
            }
            description="Fill out the form below to post a new job position and attract top talent to your company."
            editDescription="Update your job position details"
            isEditing={false}
          />

          <header className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Manage Job Positions
            </h1>
            <div className="flex gap-3 mt-3 md:mt-0">
              <input
                type="text"
                placeholder="Search position..."
                value={searchTerm}
                onChange={(e) => {
                  const term = e.target.value.toLowerCase();
                  setSearchTerm(term);

                  if (term === "") {
                    setPositions(allPositions);
                  } else {
                    const filtered = allPositions.filter((p) =>
                      p.position_name.toLowerCase().includes(term)
                    );
                    setPositions(filtered);
                  }
                }}
                className="border rounded px-3 py-2 text-sm"
              />
              <button
                onClick={handleAddPosition}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                + Add Position
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {positions.map((position) => (
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
                    {new Date(
                      position.submission_end_date
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDetail(position)}
                    className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleEdit(position.id)}
                    className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-orange-600 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(position.id)}
                    className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Detail Modal */}
        {showDetailModal && selectedPosition && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border">
              <h2 className="text-xl font-bold mb-4">
                {selectedPosition.position_name}
              </h2>
              <div className="space-y-3">
                <p>
                  <strong>Company:</strong> {selectedPosition.company.name}
                </p>
                <p>
                  <strong>Address:</strong> {selectedPosition.company.address}
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedPosition.capacity}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(
                    selectedPosition.submission_end_date
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Description:</strong> {selectedPosition.description}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-6 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h2 className="text-lg font-bold mb-4">Delete Position?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this position?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                >
                  No
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
