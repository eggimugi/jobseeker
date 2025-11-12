"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { profileApi } from "@/utils/profileApi";
import { SocietyProfile } from "@/types/profile";
import {
  nameSchema,
  addressSchema,
  phoneSchema,
  dateOfBirthSchema,
  genderSchema,
} from "@/utils/validation";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import NavbarSociety from "../../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import DecorativeImages from "@/components/decorativeImages";
import InputField from "@/components/form/inputField";
import SelectField from "@/components/form/selectField";

export default function EditProfileSocietyPage() {
  const { user, token } = useAuth();
  const { checkProfileCompletion } = useProfileCompletion();

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [profileId, setProfileId] = useState<number | null>(null);

  const handleFormSubmit = async (data: SocietyProfile) => {
    if (!profileId) {
      alert("Profile not found. Please reload the page.");
      return;
    }

    setLoading(true);
    try {
      const response = await profileApi.updateSocietyProfile(
        profileId,
        data,
        token!
      );
      if (response.success && response.data) {
        await checkProfileCompletion();
        alert("Profile updated successfully!");
      } else {
        alert(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile");
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
    resetForm,
  } = useFormValidation({
    schemas: {
      name: nameSchema,
      address: addressSchema,
      phone: phoneSchema,
      date_of_birth: dateOfBirthSchema,
      gender: genderSchema,
    },
    initialValues: {
      name: "",
      address: "",
      phone: "",
      date_of_birth: "",
      gender: "Male",
    },
    onSubmit: handleFormSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !token) return;

      try {
        const response = await profileApi.getSocietyProfile(token);
        if (response.success && response.data) {
          const profile = response.data as SocietyProfile;
          resetForm({
            name: profile.name || "",
            address: profile.address || "",
            phone: profile.phone || "",
            date_of_birth: profile.date_of_birth
              ? profile.date_of_birth.split("T")[0]
              : "",
            gender: profile.gender || "Male",
          });
          setProfileId(profile.id || null);
        } else {
          alert("Profile data not found.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [user, token]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white px-12 py-12">
        <NavbarSociety />
        <main className="pt-10">
          <SectionHeader
            indicator="Edit Profile"
            title={
              <>
                Edit your profile,{" "}
                <span className="text-orange-600 italic">{user?.name}!</span>
              </>
            }
            description="Keep your profile up-to-date to attract more quests!"
          />

          <div className="flex flex-col lg:flex-row lg:space-x-12">
            <div className="lg:w-1/3 flex justify-center items-stretch">
              <DecorativeImages />
            </div>

            <div className="lg:w-2/3 border rounded-lg p-4 md:p-6 lg:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex space-x-12">
                  <div className="flex-1">
                    <InputField
                      id="name"
                      name="name"
                      label="Society Name"
                      value={formData.name}
                      error={errors.name as string | undefined}
                      placeholder="Ex. John Doe"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      value={formData.phone}
                      error={errors.phone as string | undefined}
                      placeholder="Ex. +1234567890"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <InputField
                  id="address"
                  name="address"
                  label="Address"
                  value={formData.address}
                  error={errors.address as string | undefined}
                  placeholder="Ex. 123 Main St, City"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div className="flex space-x-12">
                  <div className="flex-1">
                    <InputField
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      label="Date of Birth"
                      value={formData.date_of_birth}
                      error={errors.date_of_birth as string | undefined}
                      placeholder="Select your date of birth"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="flex-1">
                    <SelectField
                      label="Male or Female"
                      name="gender"
                      value={formData.gender}
                      options={[
                        { value: "Male", label: "Male" },
                        { value: "Female", label: "Female" },
                      ]}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-black text-white p-2 rounded ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
