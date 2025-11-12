"use client";
import { useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import SectionHeader from "@/components/pageHeader";
import NavbarHRD from "../../navbarHRD";
import InputField from "@/components/form/inputField";
import TextAreaField from "@/components/form/textareaField";
import DecorativeImages from "@/components/decorativeImages";
import { useAuth } from "@/context/authContext";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { jobPositionApi, companyProfileApi } from "@/utils/hrdApi";
import { JobPosition } from "@/types/hrd";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  positionNameSchema,
  descriptionSchema,
  submissionDateSchema,
  capacitySchema,
} from "@/utils/validation";

type SchemaShape = {
  position_name: typeof positionNameSchema;
  description: typeof descriptionSchema;
  submission_start_date: typeof submissionDateSchema;
  submission_end_date: typeof submissionDateSchema;
  capacity: typeof capacitySchema;
};

export default function AddPosition() {
  const { user, token } = useAuth();
  const { isProfileComplete } = useProfileCompletion();

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const schemas: SchemaShape = {
    position_name: positionNameSchema,
    description: descriptionSchema,
    submission_start_date: submissionDateSchema,
    submission_end_date: submissionDateSchema,
    capacity: capacitySchema,
  };

  const initialValues = {
    position_name: "",
    description: "",
    submission_start_date: "",
    submission_end_date: "",
    capacity: "1",
  };

  const onSubmit = async (data: typeof initialValues) => {
    if (!user || !token) return;
    if (!isProfileComplete) {
      alert("Please complete your profile before submitting a job position.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    try {
      const companies = await companyProfileApi.getCompanyProfileByUser(
        user.id,
        token
      );
      if (!companies.success || !companies.data) {
        setErrorMessage("No company found for this user.");
        setLoading(false);
        return;
      }

      const companyId = companies.data.id;
      if (!companyId) {
        setErrorMessage("Invalid company id.");
        setLoading(false);
        return;
      }

      const payload = {
        position_name: data.position_name,
        description: data.description,
        submission_start_date: data.submission_start_date,
        submission_end_date: data.submission_end_date,
        capacity: Number(data.capacity),
      } as Omit<JobPosition, "id" | "companyId" | "createdAt" | "updatedAt">;

      const response = await jobPositionApi.createJobPosition(payload, token);
      if (response.success) {
        setSuccessMessage("✅ Position created successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        // reset form by forcing setFieldValue below
        // (useFormValidation.resetForm isn't exported here so we set fields manually)
        setFieldValue("position_name", "");
        setFieldValue("description", "");
        setFieldValue("submission_start_date", "");
        setFieldValue("submission_end_date", "");
        setFieldValue("capacity", "1");
      } else {
        setErrorMessage(response.message || "Failed to create position.");
      }
    } catch (err) {
      console.error("Create position error:", err);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormValidation({
    schemas,
    initialValues,
    onSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarHRD />
        <main className="pt-10">
          <SectionHeader
            indicator="Add Position"
            title={
              <>
                Ready to find your{" "}
                <span className="text-orange-600 italic">next hero?</span>
              </>
            }
            description="Fill out the form below to post a new job position and attract top talent to your company."
            editDescription="Update your job position details"
            isEditing={false}
          />
          <div className="mt-8">
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
            <div className="flex flex-col lg:flex-row lg:space-x-12">
              <div className="lg:w-1/3 flex justify-center items-stretch">
                <DecorativeImages />
              </div>

              <div className="lg:w-2/3 border rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex space-x-12">
                    <div className="flex-1">
                      <InputField
                        id="position_name"
                        name="position_name"
                        label="Position Name"
                        value={formData.position_name}
                        error={errors.position_name as string | undefined}
                        placeholder="Ex. Frontend Developer"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isProfileComplete || loading}
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        id="capacity"
                        name="capacity"
                        type="number"
                        label="Capacity"
                        value={String(formData.capacity)}
                        error={errors.capacity as string | undefined}
                        placeholder="Ex. 5"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isProfileComplete || loading}
                      />
                    </div>
                  </div>
                  <div className="flex space-x-12">
                    <div className="flex-1">
                      <InputField
                        id="submission_start_date"
                        name="submission_start_date"
                        type="date"
                        label="When does the quest begin?"
                        value={formData.submission_start_date}
                        error={
                          errors.submission_start_date as string | undefined
                        }
                        placeholder="Select start date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isProfileComplete || loading}
                      />
                    </div>
                    <div className="flex-1">
                      <InputField
                        id="submission_end_date"
                        name="submission_end_date"
                        type="date"
                        label="When does the quest end?"
                        value={formData.submission_end_date}
                        error={errors.submission_end_date as string | undefined}
                        placeholder="Select end date"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isProfileComplete || loading}
                      />
                    </div>
                  </div>
                  <div>
                    <TextAreaField
                      id="description"
                      name="description"
                      label="Job Description"
                      value={formData.description}
                      error={errors.description as string | undefined}
                      placeholder="Describe the role, responsibilities, and qualifications..."
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      disabled={!isProfileComplete || loading}
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className={`w-full bg-black text-white p-2 rounded ${
                        !isProfileComplete || loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-800"
                      }`}
                      disabled={!isProfileComplete || loading}
                    >
                      {loading ? "Submitting..." : "Hire Hero"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
