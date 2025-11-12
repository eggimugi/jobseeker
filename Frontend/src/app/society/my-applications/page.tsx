"use client";
import { useEffect, useState, useMemo } from "react";
import { applicantsHistoryApi } from "@/utils/societyApi";
import { useAuth } from "@/context/authContext";
import { PositionApplied } from "@/types/society";
import { ProtectedRoute } from "@/components/protectedRoute";
import NavbarSociety from "../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import { ChevronLeft, ChevronRight, Search, Calendar } from "lucide-react";

export default function ApplicantsHistory() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<PositionApplied[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<PositionApplied | null>(null);

  const statusOptions = ["All", "Pending", "Accepted", "Rejected"];

  const fetchApplications = async () => {
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await applicantsHistoryApi.getApplicantsHistory(token);
      if (response.success && response.data) {
        setApplications(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch applications.");
      }
    } catch (err) {
      setError("An error occurred while fetching applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleViewDetails = (app: PositionApplied) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  // Filter / search / sort
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = applications.filter((a) => {
      const position = (
        a.available_position?.position_name ?? ""
      ).toLowerCase();
      const company = (a.available_position?.company?.name ?? "").toLowerCase();
      const matchSearch = q === "" || position.includes(q) || company.includes(q);
      const matchStatus =
        statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchStatus;
    });

    list.sort((a, b) => {
      const da = new Date(a.apply_date).getTime();
      const db = new Date(b.apply_date).getTime();
      return sortOrder === "desc" ? db - da : da - db;
    });

    return list;
  }, [applications, statusFilter, searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarSociety />
        <main className="pt-10">
          <SectionHeader
            indicator="My Applications"
            title={
              <>
                Your <span className="text-orange-600 italic">quest</span> &
                their <span className="text-orange-600 italic">status</span>
              </>
            }
            description="Track where you've applied and see how it's going!"
          />

          <section className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search position or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border rounded text-sm w-64"
                />
              </div>

              <button
                onClick={() =>
                  setSortOrder((s) => (s === "desc" ? "asc" : "desc"))
                }
                className="border rounded px-3 py-2 text-sm flex items-center gap-2"
                title="Sort by apply date"
              >
                <Calendar className="w-4 h-4" />
                Sort: {sortOrder === "desc" ? "Newest" : "Oldest"}
              </button>
            </div>
          </section>

          <main>
            {filtered.length === 0 ? (
              <p className="text-gray-600">No applications found.</p>
            ) : (
              <div className="space-y-4">
                {/* Desktop View */}
                <div className="hidden xl:block">
                  <div className="grid grid-cols-12 gap-4 items-center bg-orange-600 text-white px-5 py-3 rounded-full font-semibold">
                    <div className="col-span-3">Position</div>
                    <div className="col-span-3">Company</div>
                    <div className="col-span-2">Apply Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Action</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {filtered.map((app) => (
                      <div
                        key={app.id}
                        className="grid grid-cols-12 gap-4 items-center border rounded-full px-5 py-3"
                      >
                        <div className="col-span-3 font-semibold">
                          {app.available_position?.position_name || "N/A"}
                        </div>
                        <div className="col-span-3">
                          {app.available_position?.company?.name || "N/A"}
                        </div>
                        <div className="col-span-2">
                          {formatDate(app.apply_date)}
                        </div>
                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
                              app.status === "Accepted"
                                ? "text-green-600 bg-green-50"
                                : app.status === "Rejected"
                                ? "text-red-600 bg-red-50"
                                : "text-orange-600 bg-orange-50"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                app.status === "Accepted"
                                  ? "bg-green-600"
                                  : app.status === "Rejected"
                                  ? "bg-red-600"
                                  : "bg-orange-600"
                              }`}
                            />
                            {app.status}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="bg-black text-white px-4 py-2 rounded-full text-sm"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile View */}
                <div className="xl:hidden space-y-3">
                  {filtered.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white border rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {app.available_position?.position_name || "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {app.available_position?.company?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(app.apply_date)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                              app.status === "Accepted"
                                ? "text-green-600 bg-green-50"
                                : app.status === "Rejected"
                                ? "text-red-600 bg-red-50"
                                : "text-orange-600 bg-orange-50"
                            }`}
                          >
                            {app.status}
                          </span>

                          <button
                            onClick={() => handleViewDetails(app)}
                            className="bg-black text-white px-4 py-2 rounded-full text-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600 text-sm">
              Showing {filtered.length} of {applications.length} applications
            </p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                <ChevronLeft />
              </button>
              <button className="w-10 h-10 rounded-full border flex items-center justify-center">
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Application Details Modal */}
          {isModalOpen && selectedApplication && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md px-4">
              <div className="bg-white max-w-4xl w-full rounded-lg overflow-auto max-h-[90vh] p-6 border shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-orange-600">
                      {selectedApplication.available_position?.position_name ||
                        "Position"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Company:{" "}
                      <span className="font-medium">
                        {selectedApplication.available_position?.company
                          ?.name || "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedApplication.apply_date)}
                  </div>
                </div>

                {/* Content Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left sidebar */}
                  <aside className="space-y-4 md:col-span-1">
                    <div className="border rounded p-3">
                      <h4 className="font-semibold">Status</h4>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedApplication.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : selectedApplication.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {selectedApplication.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={closeModal}
                      className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                    >
                      Close
                    </button>
                  </aside>

                  {/* Right content */}
                  <section className="md:col-span-2 space-y-6">
                    {/* Position Info */}
                    <div className="border rounded p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">
                        Position Details
                      </h3>
                      <p>
                        <strong>Position:</strong>{" "}
                        {selectedApplication.available_position
                          ?.position_name || "N/A"}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedApplication.available_position?.description ||
                          "-"}
                      </p>
                      <p>
                        <strong>Capacity:</strong>{" "}
                        {selectedApplication.available_position?.capacity}
                      </p>
                      <p>
                        <strong>Submission Deadline:</strong>{" "}
                        {formatDate(
                          selectedApplication.available_position
                            ?.submission_end_date
                        )}
                      </p>
                    </div>

                    {/* Company Info */}
                    <div className="border rounded p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">
                        Company Information
                      </h3>
                      <p>
                        <strong>Company:</strong>{" "}
                        {selectedApplication.available_position?.company
                          ?.name || "N/A"}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {selectedApplication.available_position?.company
                          ?.address || "-"}
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}