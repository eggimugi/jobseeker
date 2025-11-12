"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { profileApi } from "@/utils/profileApi";
import { CompanyProfile, SocietyProfile } from "@/types/profile";

interface UseProfileCompletionReturn {
  isProfileComplete: boolean;
  profile: CompanyProfile | SocietyProfile | null;
  loading: boolean;
  checkProfileCompletion: () => Promise<void>;
}

export const useProfileCompletion = (): UseProfileCompletionReturn => {
  const { user, token } = useAuth();
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [profile, setProfile] = useState<
    CompanyProfile | SocietyProfile | null
  >(null);
  const [loading, setLoading] = useState(true);

  const checkProfileCompletion = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    try {
      let response;
      if (user.role === "HRD") {
        response = await profileApi.getCompanyProfile(user.id, token);
      } else {
        response = await profileApi.getSocietyProfile(token);
      }

      if (response.success && response.data) {
        setProfile(response.data);

        // Check if all required fields are filled
        const profileData = response.data;
        if (user.role === "HRD") {
          const companyData = profileData as CompanyProfile;
          const isComplete = !!(
            companyData.name?.trim() &&
            companyData.address?.trim() &&
            companyData.phone?.trim() &&
            companyData.description?.trim()
          );
          setIsProfileComplete(isComplete);
        } else {
          const societyData = profileData as SocietyProfile;
          const isComplete = !!(
            societyData.name?.trim() &&
            societyData.address?.trim() &&
            societyData.phone?.trim() &&
            societyData.date_of_birth &&
            societyData.gender
          );
          setIsProfileComplete(isComplete);
        }
      } else {
        setIsProfileComplete(false);
        setProfile(null);
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
      setIsProfileComplete(false);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProfileCompletion();
  }, [user, token]);

  return { isProfileComplete, profile, loading, checkProfileCompletion };
};
