"use client";
import { useEffect, useState } from "react";
import { applyPositionApi } from "@/utils/societyApi";
import { jobPositionApi } from "@/utils/hrdApi";
import { useAuth } from "@/context/authContext";
import {
  Search,
  Calendar,
  Users,
  Building2,
  Filter,
  MapPin,
} from "lucide-react";
import { ProtectedRoute } from "@/components/protectedRoute";
import NavbarSociety from "../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import { JobPosition } from "@/types/hrd";
import { Modal } from "@/components/Modal";

export default function ApplyJob() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<JobPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<JobPosition[]>([]);
  const [applyingJobs, setApplyingJobs] = useState(new Set());
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) return;
      try {
        const response = await jobPositionApi.getAllJobPositions(token);
        console.log(response);

        if (response.success && response.data) {
          setJobs(response.data); // aman, karena sudah dicek
        } else {
          console.error("Failed to fetch jobs:", response.message);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
      setLoading(false);
    };
    fetchJobs();
  }, [token]);

  useEffect(() => {
    let filtered = jobs.filter(
      (job) =>
        job.position_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company?.name ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    if (showActiveOnly) {
      const currentDate = new Date().toISOString().split("T")[0];
      filtered = filtered.filter(
        (job) => job.submission_end_date >= currentDate
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, showActiveOnly]);

  const isJobActive = (submission_end_date: string) => {
    const currentDate = new Date();
    const endDate = new Date(submission_end_date);
    return endDate >= currentDate;
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("us-US", options);
  };

  const handleApply = async (jobId: number) => {
    if (!token) return;
    try {
      setApplyingJobs((prev) => new Set([...prev, jobId]));

      const response = await applyPositionApi.applyToPosition(jobId, token);
      if (response.success) {
        alert("Successfully applied to the position!");
      } else {
        alert("Failed to apply: " + response.message);
      }

      setApplyingJobs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    } catch (error) {
      console.error("Error applying to job:", error);
      const httpError = error as { response?: { status: number } };
      if (httpError.response?.status === 401) {
        alert("Please login again");
      } else if (httpError.response?.status === 404) {
        alert(
          "Position not found or you are not registered as a society member"
        );
      } else if (httpError.response?.status === 400) {
        alert("Invalid position ID");
      } else {
        alert("Failed to apply. Please try again.");
      }
    }
  };

  const handleDetail = (position: JobPosition) => {
    setSelectedPosition(position);
    setShowDetailModal(true);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        <NavbarSociety />
        <main className="mt-10">
          <SectionHeader
            indicator="Find Jobs"
            title={
              <>
                Find <span className="text-orange-600 italic">new quests!</span>
              </>
            }
            description="Explore active job openings that match your skills."
          />

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by position or company name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showActiveOnly}
                    onChange={(e) => setShowActiveOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Active positions only
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Job Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No positions found matching your criteria
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isActive = isJobActive(job.submission_end_date);
                const isApplying = applyingJobs.has(job.id);

                return (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="bg-orange-600 rounded-full p-3">
                            <Building2 className="h-6 w-6 text-white" />
                          </div>

                          <div className="">
                            <h3 className="text-lg font-bold text-gray-900">
                              {job.company?.name}
                            </h3>
                            <div className="flex">
                              <MapPin className="text-orange-600 h-5 w-5 mr-2" />
                              <h3 className="text-base text-gray-900">
                                {job.company?.address}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isActive ? "Active" : "Expired"}
                        </span>
                      </div>

                      <div className="border-t border-gray-300 my-3"></div>

                      <div className="flex flex-col mb-3 mt-2">
                        <div className="flex items-center text-orange-600 text-base font-medium">
                          <span>{job.position_name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Users className="h-4 w-4" />
                          <span>
                            {job.capacity} Hero{job.capacity > 1 ? "es" : ""}{" "}
                            Needed
                          </span>
                          <p>|</p>
                          <button
                            onClick={() => {
                              handleDetail(job);
                            }}
                            className="text-orange-600 hover:text-orange-600 cursor-pointer font-medium"
                          >
                            See details
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm mt-4">
                        {job.submission_start_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {formatDate(job.submission_start_date)} -{" "}
                              {formatDate(
                                job.submission_end_date ||
                                  job.submission_end_date
                              )}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={!isActive || isApplying}
                          className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                            isActive
                              ? "bg-orange-600 text-white hover:bg-orange-700 focus:ring-2 focus:ring-orange-500"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {isApplying ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Applying...</span>
                            </div>
                          ) : isActive ? (
                            "Apply"
                          ) : (
                            "Expired"
                          )}
                        </button>
                      </div>

                      {/* {job.description && (
                        <p className="text-gray-700 mb-4">{job.description}</p>
                      )} */}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Summary */}
          <div className="mt-8 text-center text-gray-600">
            <p>
              Showing {filteredJobs.length} of {jobs.length} available positions
            </p>
          </div>
        </main>
        {/* Detail Modal */}
        {showDetailModal && selectedPosition && (
          <Modal
            isOpen={showDetailModal}
            position={selectedPosition}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
