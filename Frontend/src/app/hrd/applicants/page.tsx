"use client";

import { ProtectedRoute } from "@/components/protectedRoute";
import { useEffect, useMemo, useState } from "react";
import { applicationApi } from "@/utils/hrdApi";
import { useAuth } from "@/context/authContext";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  Calendar,
} from "lucide-react";
import { Application } from "@/types/hrd";
import NavbarHRD from "../navbarHRD";
import SectionHeader from "@/components/pageHeader";

export default function ApplicantsManagementPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [positionFilter, setPositionFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);
  const [statusUpdateError, setStatusUpdateError] = useState<string | null>(
    null
  );

  // Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Application | null>(null);

  const statusOptionsDisplay = ["Waiting", "Accepted", "Rejected"];

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await applicationApi.getApplications(token);
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          setError(response.message || "Failed to fetch applications");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  // derive unique positions for filter dropdown
  const positions = useMemo(() => {
    const setPos = new Set<string>();
    applications.forEach((a) => {
      const pos = a.available_position?.position_name ?? "Unspecified";
      setPos.add(pos);
    });
    return ["All", ...Array.from(setPos)];
  }, [applications]);

  // map backend status -> display
  const displayStatus = (status: string) =>
    status === "Pending" ? "Waiting" : status;

  // map display status -> backend status
  const mapToApiStatus = (display: string) =>
    display === "Waiting" ? "Pending" : display;

  const handleStatusUpdate = async (
    id: number,
    displayStatusChoice: string
  ) => {
    if (!token) return;
    const apiStatus = mapToApiStatus(displayStatusChoice);
    setUpdatingStatusId(id);
    setStatusUpdateError(null);
    setOpenDropdown(null);
    try {
      const response = await applicationApi.updateApplicationStatus(
        id,
        apiStatus,
        token
      );
      if (response.success && response.data) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: response.data?.status || apiStatus }
              : app
          )
        );
      } else {
        setStatusUpdateError(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      setStatusUpdateError("An error occurred while updating status");
    } finally {
      // small UX delay
      await new Promise((r) => setTimeout(r, 600));
      setUpdatingStatusId(null);
    }
  };

  const toggleDropdown = (id: number) =>
    setOpenDropdown((prev) => (prev === id ? null : id));

  const handleViewDetails = (app: Application) => {
    setSelectedApplicant(app);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplicant(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filter / search / sort
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = applications.filter((a) => {
      const name = (a.society?.name ?? "").toLowerCase();
      const pos = (a.available_position?.position_name ?? "").toLowerCase();
      const matchSearch = q === "" || name.includes(q) || pos.includes(q);
      const matchPosition =
        positionFilter === "All" ||
        (a.available_position?.position_name ?? "Unspecified") ===
          positionFilter;
      return matchSearch && matchPosition;
    });

    list.sort((a, b) => {
      const da = new Date(a.apply_date).getTime();
      const db = new Date(b.apply_date).getTime();
      return sortOrder === "desc" ? db - da : da - db;
    });

    return list;
  }, [applications, positionFilter, searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applicants...</p>
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
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarHRD />
        <main className="pt-10">
          <SectionHeader
            indicator="Applicants"
            title={
              <>
                Manage Your{" "}
                <span className="text-orange-600 italic">Applicants</span>
              </>
            }
            description="Review and manage applicants for your job postings."
          />

          <section className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter by position</label>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
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
                  placeholder="Search applicant or position..."
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
              <p className="text-gray-600">No applicants found.</p>
            ) : (
              <div className="space-y-4">
                {/* Responsive list: table on xl, cards on mobile */}
                <div className="hidden xl:block">
                  <div className="grid grid-cols-12 gap-4 items-center bg-orange-600 text-white px-5 py-3 rounded-full font-semibold">
                    <div className="col-span-2">Applicant</div>
                    <div className="col-span-3">Phone Number</div>
                    <div className="col-span-2">Position</div>
                    <div className="col-span-2">Apply Date</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1">Action</div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {filtered.map((app) => (
                      <div
                        key={app.id}
                        className="grid grid-cols-12 gap-4 items-center border rounded-full px-5 py-3"
                      >
                        <div className="col-span-2 font-semibold">
                          {app.society?.name ?? "N/A"}
                        </div>
                        <div className="col-span-3">
                          {app.society?.phone ?? ""}
                        </div>
                        <div className="col-span-2">
                          {app.available_position?.position_name ?? "N/A"}
                        </div>

                        <div className="col-span-2">
                          {formatDate(app.apply_date)}
                        </div>

                        <div className="col-span-2">
                          <div className="relative inline-block">
                            <button
                              onClick={() => toggleDropdown(app.id)}
                              disabled={updatingStatusId === app.id}
                              className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                                app.status === "Accepted"
                                  ? "text-green-600 bg-green-50"
                                  : app.status === "Rejected"
                                  ? "text-red-600 bg-red-50"
                                  : "text-orange-600 bg-orange-50"
                              } disabled:opacity-50`}
                            >
                              {displayStatus(app.status)}
                              <ChevronDown className="inline-block ml-2 w-4 h-4" />
                            </button>

                            {openDropdown === app.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute z-20 mt-2 bg-white border rounded shadow min-w-[160px] overflow-hidden">
                                  {statusOptionsDisplay.map((s) => (
                                    <button
                                      key={s}
                                      onClick={() =>
                                        handleStatusUpdate(app.id, s)
                                      }
                                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                        displayStatus(app.status) === s
                                          ? "bg-gray-50"
                                          : ""
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          {statusUpdateError && (
                            <div className="text-red-500 text-xs mt-1">
                              {statusUpdateError}
                            </div>
                          )}
                        </div>

                        <div className="col-span-1">
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

                {/* Mobile */}
                <div className="xl:hidden space-y-3">
                  {filtered.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white border rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">
                            {app.society?.name ?? "N/A"}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {app.available_position?.position_name ?? "N/A"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(app.apply_date)}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div>
                            <button
                              onClick={() => toggleDropdown(app.id)}
                              className={`px-3 py-1.5 rounded-lg text-sm ${
                                app.status === "Accepted"
                                  ? "text-green-600 bg-green-50"
                                  : app.status === "Rejected"
                                  ? "text-red-600 bg-red-50"
                                  : "text-orange-600 bg-orange-50"
                              }`}
                            >
                              {displayStatus(app.status)}{" "}
                              <ChevronDown className="inline-block w-3 h-3" />
                            </button>
                            {openDropdown === app.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setOpenDropdown(null)}
                                />
                                <div className="absolute right-4 mt-2 bg-white border rounded shadow z-20 overflow-hidden">
                                  {statusOptionsDisplay.map((s) => (
                                    <button
                                      key={s}
                                      onClick={() =>
                                        handleStatusUpdate(app.id, s)
                                      }
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>

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

          {/* Simple pagination placeholders */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-gray-600 text-sm">
              Showing {filtered.length} of {applications.length} applicants
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

          {/* Applicant Details Modal */}
          {isModalOpen && selectedApplicant && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-md px-4">
              <div className="bg-white max-w-4xl w-full rounded-lg overflow-auto max-h-[90vh] p-6 border shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-orange-600">
                      {selectedApplicant.society?.name ?? "Applicant"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Applied for:{" "}
                      <span className="font-medium">
                        {selectedApplicant.available_position?.position_name ??
                          "N/A"}
                      </span>
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedApplicant.apply_date)}
                  </div>
                </div>

                {/* Content Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left sidebar */}
                  <aside className="space-y-4 md:col-span-1">
                    <div className="border rounded p-3">
                      <h4 className="font-semibold">Contact</h4>
                      <p className="text-sm">
                        {selectedApplicant.society?.phone ?? "-"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedApplicant.society?.address ?? "-"}
                      </p>
                    </div>

                    <div className="border rounded p-3">
                      <h4 className="font-semibold">Status</h4>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            selectedApplicant.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : selectedApplicant.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {displayStatus(selectedApplicant.status)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedApplicant.id, "Accepted");
                          closeModal();
                        }}
                        disabled={updatingStatusId === selectedApplicant.id}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedApplicant.id, "Rejected");
                          closeModal();
                        }}
                        disabled={updatingStatusId === selectedApplicant.id}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => closeModal()}
                        className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                      >
                        Close
                      </button>
                    </div>
                  </aside>

                  {/* Right content */}
                  <section className="md:col-span-2 space-y-6">
                    {/* Applicant Info */}
                    <div className="border rounded p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">
                        Applicant Information
                      </h3>
                      <p>
                        <strong>Date of Birth:</strong>{" "}
                        {formatDate(selectedApplicant.society?.date_of_birth)}
                      </p>
                      <p>
                        <strong>Gender:</strong>{" "}
                        {selectedApplicant.society?.gender ?? "-"}
                      </p>
                    </div>

                    {/* Position Info */}
                    <div className="border rounded p-4">
                      <h3 className="font-semibold text-lg mb-3 text-gray-700">
                        Position Details
                      </h3>
                      <p>
                        <strong>Position:</strong>{" "}
                        {selectedApplicant.available_position?.position_name ??
                          "N/A"}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedApplicant.available_position?.description ??
                          "-"}
                      </p>
                      <p>
                        <strong>Capacity:</strong>{" "}
                        {selectedApplicant.available_position?.capacity}
                      </p>
                      <p>
                        <strong>Submission Deadline:</strong>{" "}
                        {formatDate(
                          selectedApplicant.available_position
                            ?.submission_end_date
                        )}
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
