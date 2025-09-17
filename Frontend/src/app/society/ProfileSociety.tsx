"use client";
import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { profileApi } from "@/utils/profileApi";
import { SocietyProfile, ValidationErrors } from "@/types/profile";
import {
  validateName,
  validateAddress,
  validatePhone,
  validateDateOfBirth,
} from "@/utils/validation";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";

export default function ProfileSociety() {
  const { user, token } = useAuth();
  const { checkProfileCompletion } = useProfileCompletion();

  const [formData, setFormData] = useState<
    Omit<SocietyProfile, "id" | "createdAt" | "updatedAt" | "userId">
  >({
    name: "",
    address: "",
    phone: "",
    date_of_birth: "",
    gender: "Male",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Load existing profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;

      try {
        const response = await profileApi.getSocietyProfile(user.id, token);
        if (response.success && response.data) {
          const profile = response.data as SocietyProfile;
          setFormData({
            name: profile.name || "",
            address: profile.address || "",
            phone: profile.phone || "",
            date_of_birth: profile.date_of_birth
              ? profile.date_of_birth.split("T")[0]
              : "",
            gender: profile.gender || "Male",
          });
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

  // Real-time validation
  const validateField = (name: keyof ValidationErrors, value: string) => {
    let error: string | null = null;

    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "address":
        error = validateAddress(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "date_of_birth":
        error = validateDateOfBirth(value);
        break;
      case "gender":
        if (!value) error = "Gender is required";
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only validate after user has typed something and moved away
    if (value.trim() !== "") {
      validateField(name as keyof ValidationErrors, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    validateField(name as keyof ValidationErrors, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: ValidationErrors = {};
    newErrors.name = validateName(formData.name);
    newErrors.address = validateAddress(formData.address);
    newErrors.phone = validatePhone(formData.phone);
    newErrors.date_of_birth = validateDateOfBirth(formData.date_of_birth);
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== null);
    if (hasErrors) return;

    setLoading(true);

    try {
      let response;
      if (isEditing && profileId) {
        response = await profileApi.updateSocietyProfile(
          profileId,
          formData,
          token!
        );
      } else {
        response = await profileApi.createSocietyProfile(formData, token!);
      }

      if (response.success && response.data) {
        await checkProfileCompletion();
        const profile = response.data as SocietyProfile;
        setFormData({
          name: profile.name || "",
          address: profile.address || "",
          phone: profile.phone || "",
          date_of_birth: profile.date_of_birth
            ? profile.date_of_birth.split("T")[0]
            : "",
          gender: profile.gender || "Male",
        });
        setProfileId(profile.id || null);
        setIsEditing(true);
      } else {;
        alert(response.message || "Failed to save profile");
      }
      console.log("create/update response:", response);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving your profile");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      {/* Profile */}
      <div className="flex flex-col justify-center items-center mt-20 text-xl">
        {/* Hook */}
        <header className="text-center">
          <p>
            <span className="text-orange-600 font-black">—</span> Profile
          </p>
          <h1 className="text-4xl font-bold mt-2">
            Tell us about yourself,{" "}
            <span className="text-orange-600 italic">don’t be shy!</span>
          </h1>
          <p className="text-gray-600">
            {isEditing
              ? "Let the world see the amazing you!"
              : "Please fill in your details to continue"}
          </p>
        </header>

        {/* Content */}
        <div className="flex w-full mt-15 space-x-8">
          {/* left Side */}
          <div className="flex-2/5 flex justify-center items-center relative">
            <img src="/images/Images1.svg" alt="Images 1" className="h-[95%]" />
            <img
              src="/images/Images1.svg"
              alt="Images 1"
              className="absolute w-50 h-30 object-cover top-0 right-10"
            />
            <img
              src="/images/Images1.svg"
              alt="Images 1"
              className="absolute w-50 h-30 object-cover bottom-0 left-10"
            />
          </div>
          {/* Right Side */}
          <div className="flex-3/5 text-base">
            <div className="border rounded-lg w-full h-full p-6">
              <form
                className="flex flex-col h-full justify-between space-y-6"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col">
                  <div className="flex-1 flex flex-row space-x-12">
                    <div className="flex-1">
                      <label htmlFor="name" className="block mb-1">
                        What should we call you?
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                        placeholder="Ex. John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label htmlFor="phone" className="block mb-1">
                        Got a phone number?
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="number"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                        placeholder="Ex. 085123456789"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 mt-8">
                    <label htmlFor="address" className="block mb-1">
                      Where are you right now?
                    </label>
                    <input
                      id="address"
                      name="address"
                      required
                      type="text"
                      value={formData.address}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                      placeholder="Ex. St. Danau Ranau, Malang"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="flex-1 flex flex-row space-x-12 mt-8">
                    <div className="flex-1">
                      <label htmlFor="date" className="block mb-1">
                        Date of Birth
                      </label>
                      <input
                        id="date"
                        name="date_of_birth"
                        type="date"
                        required
                        value={formData.date_of_birth}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                        placeholder="Ex. 1990-01-01"
                      />
                      {errors.date_of_birth && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.date_of_birth}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label htmlFor="gender" className="block mb-1">
                        Male or Female?
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.gender}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white font-medium px-4 py-1 rounded cursor-pointer hover:bg-gray-800 transition"
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Profile"
                    : "Save Profile"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
