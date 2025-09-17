"use client";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useAuth } from "@/context/authContext";
import { useState, useEffect, use } from "react";
import { Portofolio, PortofolioValidationErrors } from "@/types/society";
import { portofolioApi, societyApi } from "@/utils/societyApi";
import { Upload } from "lucide-react";

export default function PortofolioSociety() {
  const { user, token } = useAuth();
  const { isProfileComplete } = useProfileCompletion();

  const [formData, setFormData] = useState<
    Omit<Portofolio, "id" | "createdAt" | "updatedAt" | "societyId">
  >({
    skill: "",
    description: "",
    file: "",
  });

  const [errors, setErrors] = useState<PortofolioValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileId, setProfileId] = useState<number | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      if (!user || !token) return;

      try {
        const societies = await societyApi.getSocietiesByUser(user.id, token);
        if (!societies.success || !societies.data) {
          console.warn("No society found for this user");
          setInitialLoading(false);
          return;
        }

        const societyId = societies.data.id;
        if (!societyId) {
          setInitialLoading(false);
          return;
        }

        const response = await portofolioApi.getPortofolios(societyId, token);
        if (response.success && response.data) {
          const portofolio = response.data as Portofolio;
          setFormData({
            skill: portofolio.skill || "",
            description: portofolio.description || "",
            file: "",
          });
          setProfileId(portofolio.id || null);
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
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
      const societies = await societyApi.getSocietiesByUser(user.id, token);
      if (!societies.success || !societies.data) {
        alert("No society found for this user");
        setLoading(false);
        return;
      }

      const societyId = societies.data.id;
      if (!societyId) {
        setLoading(false);
        return;
      }
      let response;
      if (isEditing && profileId) {
        response = await portofolioApi.updatePortofolio(
          profileId,
          formData,
          token
        );
      } else {
        response = await portofolioApi.createPortofolio(
          { ...formData, societyId },
          token
        );
      }
      if (response.success) {
        setSuccessMsg(
          `✅ Portofolio ${isEditing ? "updated" : "created"} successfully!`
        );
        setErrorMsg("");
        setTimeout(() => setSuccessMsg(""), 3000);
        setIsEditing(true);
        if (response.data && response.data.id) {
          setProfileId(response.data.id);
        }
      } else {
        if (response.message.includes("Validation error") && response.data) {
          setErrors(response.data as PortofolioValidationErrors);
        } else {
          setErrorMsg(
            response.message || "❌ An error occurred. Please try again."
          );
          setSuccessMsg("");
          setTimeout(() => setErrorMsg(""), 3000);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="flex flex-col justify-center mt-20 text-xl">
        {/* Hook */}
        <header>
          <p>
            <span className="text-orange-600 font-black">—</span> Portofolio
          </p>
          <h1 className="text-4xl font-bold mt-2">
            Show off your{" "}
            <span className="text-orange-600 italic">awesome skills!</span>
          </h1>
          <p className="mt-2">
            {" "}
            Complete your portfolio to increase your chances!
          </p>
        </header>

        {/* Content */}
        <div className="flex w-full mt-10 space-x-8 text-base">
          {/* left Side */}
          <div className="flex-3/5">
            <div className="border rounded-lg w-full h-full p-6">
              {successMsg && (
                <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 border border-green-400">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-400">
                  {errorMsg}
                </div>
              )}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <fieldset disabled={!isProfileComplete || loading}>
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <label htmlFor="skill" className="block mb-1">
                        What's your skill?
                      </label>
                      <input
                        id="skill"
                        name="skill"
                        type="text"
                        required
                        value={formData.skill}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                        placeholder="Ex. Frontend Developer"
                      />
                      {errors.skill && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.skill}
                        </p>
                      )}
                    </div>
                    <div className="flex-1 mt-8">
                      <label htmlFor="description" className="block mb-1">
                        Tell companies what makes you’re amazing!
                      </label>
                      <input
                        id="description"
                        name="description"
                        type="text"
                        required
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full border-b border-gray-300 bg-transparent outline-none py-1 text-sm"
                        placeholder="Ex. I've learned frontend since i was 15 years old..."
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="flex-1 mt-8">
                      <label htmlFor="file" className="block mb-1">
                        Upload your Curriculum Vitae!
                      </label>
                      <Upload
                        className="mx-auto mb-2 text-gray-400"
                        size={32}
                      />
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800"
                      >
                        {formData.file instanceof File
                          ? formData.file.name
                          : "Klik untuk upload file"}
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Support: Images, PDF, DOC, DOCX
                      </p>
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
                      ? "Update Portofolio"
                      : "Upload Portofolio"}
                  </button>
                </fieldset>
              </form>
              {!isProfileComplete && (
                <p className="text-red-500 text-sm mt-4">
                  ⚠️ Lengkapi profilmu terlebih dahulu untuk mengunggah
                  portofolio.
                </p>
              )}
            </div>
          </div>
          {/* Right Side */}
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
