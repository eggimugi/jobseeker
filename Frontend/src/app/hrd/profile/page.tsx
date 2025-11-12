"use client";
import { useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import NavbarHRD from "../navbarHRD";
import LoadingSpinner from "@/components/loadingSpinner";
import ProfileViewMode from "@/components/profileViewMode";
import ProfileEditMode from "@/components/profileEditMode";
import { useProfileData } from "@/hooks/useCompanyProfile";

export default function ProfileHRD() {
  const { user, token } = useAuth();
  const [viewMode, setViewMode] = useState<"view" | "edit">("view");

  const {
    formData,
    errors,
    logoPreview,
    isEditing,
    loading,
    initialLoading,
    handleChange,
    handleBlur,
    handleSubmit,
    setLocalLogo,
    setFieldValue
  } = useProfileData(user, token);

  const handleLogoChange = (preview: string | File | null) => {
    if (preview instanceof File) {
      setLocalLogo(preview);
    } else if (preview === null) {
      setLocalLogo(null);
    }
    // Ignore string type as we're using localLogo for new uploads
  };

  const handleSetFieldValue = (name: string, value: unknown) => {
    setFieldValue(name as keyof typeof formData, value);
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarHRD />
        <main className="pt-10">
          {viewMode === "view" && isEditing ? (
            <ProfileViewMode
              formData={formData}
              logoPreview={logoPreview}
              onEdit={() => setViewMode("edit")}
            />
          ) : (
            <ProfileEditMode
              formData={formData}
              errors={errors}
              logoPreview={logoPreview}
              isEditing={isEditing}
              loading={loading}
              setFieldValue={handleSetFieldValue}
              handleChange={handleChange}
              handleBlur={handleBlur}
              handleSubmit={handleSubmit}
              setLogoPreview={handleLogoChange}
              onCancel={isEditing ? () => setViewMode("view") : undefined}
            />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}