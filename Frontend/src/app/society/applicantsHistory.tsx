import { useEffect, useState } from "react";
import { applicantsHistoryApi } from "@/utils/societyApi";
import { useAuth } from "@/context/authContext";
import { PositionApplied } from "@/types/society";
import { ProtectedRoute } from "@/components/protectedRoute";

export default function ApplicantsHistory() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<PositionApplied[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

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
        console.log(response.data);

        setApplications(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch applications.");
      }
    } catch (err) {
      setError("An error occurred while fetching applications.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="flex flex-col justify-center mt-20 text-xl">
        <header className="">
          <p>
            <span className="text-orange-600 font-black">—</span> My
            Applications
          </p>
          <h1 className="text-4xl font-bold mt-2">
            Your <span className="text-orange-600 italic">quest</span> & their{" "}
            <span className="text-orange-600 italic">status</span>
          </h1>
          <p className="mt-2">
            {" "}
            Track where you’ve applied and see how it’s going!
          </p>
        </header>

        {loading ? (
          <p>Loading applications...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <>
            <main className="flex flex-col w-full mt-10">
              <div className="flex gap-10 bg-orange-600 text-base text-white w-full font-semibold justify-between items-center px-5 py-3 rounded-full">
                <div className="flex-1 flex gap-3 items-center">
                  <p className="w-[300px]">Position</p>
                  <p>Company</p>
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <p className="w-[250px]">Apply Date</p>
                  <p className="w-[250px]">Status</p>
                  <p className="w-[135px]">Action</p>
                </div>
              </div>
              <ul className="space-y-4 mt-4">
                {paginatedApplications.map((app) => (
                  <li
                    key={app.id}
                    className="border px-4 py-2 rounded-full shadow flex gap-10 text-base"
                  >
                    <div className="flex-1 flex gap-3 items-center">
                      <p className="w-[300px]">
                        {app.available_position?.position_name ||
                          "Unknown Position"}
                      </p>
                      <p>
                        {app.available_position?.company?.name ||
                          "Unknown Company"}
                      </p>
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <p className="w-[250px]">
                        {new Date(app.apply_date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="w-[250px]">
                        {app.status === "Pending" && (
                          <span className="flex items-center gap-2 text-yellow-500 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"/>
                            {app.status}
                          </span>
                        )}
                        {app.status === "Accepted" && (
                          <span className="flex items-center text-green-500 font-semibold">
                            <span className="w-2 h-2 rounded-full bg-green-500"/>
                            {app.status}
                          </span>
                        )}
                        {app.status === "Rejected" && (
                          <span className="text-red-500 font-semibold">
                            {app.status}
                          </span>
                        )}
                      </p>
                      <p>
                        <button className="bg-black rounded-full px-4 py-2 text-white font-bold">
                          View Details
                        </button>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </main>
          </>
        )}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-white hover:border hover:text-black disabled:opacity-50 cursor-pointer"
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
