import { useState, useEffect } from "react";
import { profileApi } from "@/utils/profileApi";
import { CompanyProfile } from "@/types/profile";
import {
  nameSchema,
  addressSchema,
  phoneSchema,
  descriptionSchema,
  websiteSchema,
  foundedYearSchema,
  industrySchema,
  companySizeSchema,
  logoSchema,
} from "@/utils/validation";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useFormValidation } from "@/hooks/useFormValidation";
import { User } from "@/types/auth";

export function useProfileData(user: User | null, token: string | null) {
  const { checkProfileCompletion } = useProfileCompletion();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ dua state terpisah
  const [serverLogo, setServerLogo] = useState<string | null>(null);
  const [localLogo, setLocalLogo] = useState<File | null>(null);

  // ✅ computed value untuk tampilan preview
  const logoPreview = localLogo
    ? URL.createObjectURL(localLogo)
    : serverLogo
    ? `${process.env.NEXT_PUBLIC_API_URL}/company-logo/${serverLogo}`
    : null;

  // ✅ handle submit
  const handleFormSubmit = async (data: CompanyProfile) => {
    setLoading(true);

    try {
      const profileData = {
        ...data,
        logo: localLogo || serverLogo, // pakai file baru kalau ada, kalau enggak pakai yang lama
      };

      const response =
        isEditing && profileId
          ? await profileApi.updateCompanyProfile(
              profileId,
              profileData,
              token!
            )
          : await profileApi.createCompanyProfile(profileData, token!);

      if (response.success && response.data) {
        await checkProfileCompletion();
        const profile = response.data as CompanyProfile;

        resetForm({
          name: profile.name || "",
          address: profile.address || "",
          phone: profile.phone || "",
          description: profile.description || "",
          website: profile.website || "",
          foundedYear: profile.foundedYear || 0,
          industry: profile.industry || "",
          companySize: profile.companySize || "",
          logo: null,
        });

        setServerLogo(typeof profile.logo === "string" ? profile.logo : null);
        setLocalLogo(null);
        setProfileId(profile.id || null);
        setIsEditing(true);
        alert("Profile saved successfully!");
      } else {
        alert(response.message || "Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ form validation hook
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  } = useFormValidation({
    schemas: {
      name: nameSchema,
      address: addressSchema,
      phone: phoneSchema,
      description: descriptionSchema,
      website: websiteSchema,
      foundedYear: foundedYearSchema,
      industry: industrySchema,
      companySize: companySizeSchema,
      logo: logoSchema,
    },
    initialValues: {
      name: "",
      address: "",
      phone: "",
      description: "",
      website: "",
      foundedYear: 0,
      industry: "",
      companySize: "",
      logo: null,
    },
    onSubmit: handleFormSubmit,
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;

      try {
        const response = await profileApi.getCompanyProfile(user.id, token);
        if (response.success && response.data) {
          const profile = response.data as CompanyProfile;

          resetForm({
            name: profile.name || "",
            address: profile.address || "",
            phone: profile.phone || "",
            description: profile.description || "",
            website: profile.website || "",
            foundedYear: profile.foundedYear || 0,
            industry: profile.industry || "",
            companySize: profile.companySize || "",
            logo: null,
          });

          setServerLogo(typeof profile.logo === "string" ? profile.logo : null);
          setProfileId(profile.id || null);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, [user, token]);

  return {
    formData,
    errors,
    logoPreview,
    localLogo,
    serverLogo,
    setLocalLogo,
    isEditing,
    loading,
    initialLoading,
    profileId,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  };
}
