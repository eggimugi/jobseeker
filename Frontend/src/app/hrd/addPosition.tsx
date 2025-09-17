"use client";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { useState, useEffect } from "react";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { jobPositionApi, companyProfileApi } from "@/utils/hrdApi";
import { JobPosition, JobPositionValidationErrors } from "@/types/hrd";

export default function AddPosition() {
  const { user, token } = useAuth();
  const { isProfileComplete } = useProfileCompletion();

  const [formData, setFormData] = useState<
    Omit<JobPosition, "id" | "companyId" | "createdAt" | "updatedAt">
  >({
    position_name: "",
    description: "",
    submsission_start_date: "",
    submission_end_date: "",
    capacity: 1,
  });

  const [errors, setErrors] = useState<JobPositionValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;

      try {
        const companies = await companyProfileApi.getCompanyProfileByUser(
          user.id,
          token
        );
        console.log(user.id);
        
        console.log(companies);
        
        if (!companies.success || !companies.data) {
          console.warn("No company found for this user");
          setLoading(false);
          return;
        }

        const companyId = companies.data.id;
        if (!companyId) {
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log("Error loading profile: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;
    if (!isProfileComplete) {
      alert("Please complete your profile before submitting your portfolio.");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const companies = await companyProfileApi.getCompanyProfileByUser(
        user.id,
        token
      );
      if (!companies.success || !companies.data) {
        alert("No society found for this user");
        setLoading(false);
        return;
      }

      const societyId = companies.data.id;
      if (!societyId) {
        setLoading(false);
        return;
      }
      let response;
      if (isEditing && profileId) {
        response = await jobPositionApi.updateJobPosition(
          profileId,
          formData,
          token
        );
      } else {
        response = await jobPositionApi.createJobPosition(formData, token);
      }
      if (response.success) {
        setSuccessMessage(
          `✅ Portofolio ${isEditing ? "updated" : "created"} successfully!`
        );
        setErrorMessage("");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsEditing(true);
        if (response.data && response.data.id) {
          setProfileId(response.data.id);
        }
      } else {
        if (response.message.includes("Validation error") && response.data) {
          setErrors({
            position_name: "Position name is required",
            capacity: "Capacity must be a positive number",
          });
        } else {
          setErrorMessage(
            response.message || "❌ An error occurred. Please try again."
          );
          setSuccessMessage("");
          setTimeout(() => setErrorMessage(""), 3000);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Add New Job Position</h2>
          {!isProfileComplete && (
            <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
              Please complete your profile before adding job positions.
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="position_name"
              >
                Position Name
              </label>
              <input
                type="text"
                id="position_name"
                name="position_name"
                value={formData.position_name}
                onChange={handleChange}
                className={`w-full border ${
                  errors.position_name ? "border-red-500" : "border-gray-300"
                } p-2 rounded`}
                disabled={!isProfileComplete || loading}
              />
              {errors.position_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.position_name}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } p-2 rounded`}
                disabled={!isProfileComplete || loading}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="submission_start_date"
              >
                Submission Start Date
              </label>
              <input
                type="date"
                id="submission_start_date"
                name="submission_start_date"
                value={formData.submsission_start_date}
                onChange={handleChange}
                className={`w-full border ${
                  errors.submsission_start_date
                    ? "border-red-500"
                    : "border-gray-300"
                } p-2 rounded`}
                disabled={!isProfileComplete || loading}
              />
              {errors.submsission_start_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.submsission_start_date}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="submission_end_date"
              >
                Submission End Date
              </label>
              <input
                type="date"
                id="submission_end_date"
                name="submission_end_date"
                value={formData.submission_end_date}
                onChange={handleChange}
                className={`w-full border ${
                  errors.submission_end_date
                    ? "border-red-500"
                    : "border-gray-300"
                } p-2 rounded`}
                disabled={!isProfileComplete || loading}
              />
              {errors.submission_end_date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.submission_end_date}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="capacity"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                className={`w-full border ${
                  errors.capacity ? "border-red-500" : "border-gray-300"
                } p-2 rounded`}
                disabled={!isProfileComplete || loading}
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                className={`w-full bg-blue-500 text-white p-2 rounded ${
                  !isProfileComplete || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={!isProfileComplete || loading}
              >
                {loading ? "Submitting..." : "Add Position"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
