"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { portofolioApi } from "@/utils/societyApi";
import { Portofolio } from "@/types/society";
import NavbarSociety from "../../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import InputField from "@/components/form/inputField";
import TextAreaField from "@/components/form/textareaField";

export default function EditPortfolio() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const id = params.id as string;

  const [portfolio, setPortfolio] = useState<Portofolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skill: "",
    description: "",
    file: undefined as File | undefined,
  });

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!token || !id) {
        setLoading(false);
        return;
      }

      try {
        const response = await portofolioApi.getPortofoliosById(
          Number(id),
          token
        );
        if (response.data) {
          setPortfolio(response.data);
          setFormData({
            skill: response.data.skill,
            description: response.data.description,
            file: undefined,
          });
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [token, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
      console.log("Selected file:", file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    setSubmitting(true);
    try {
      await portofolioApi.updatePortofolio(Number(id), formData, token);
      router.push(`/society/portfolio/${id}`);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        <NavbarSociety />
        <main className="pt-10">
          <SectionHeader
            indicator="Edit Portfolio"
            title="Update your portfolio details"
            description="Make changes to showcase your skills better"
          />

          <form
            onSubmit={handleSubmit}
            className="mt-8 border rounded-lg p-4 md:p-6 lg:p-8 shadow-sm"
          >
            <div className="mb-6">
              <InputField
                id="skill"
                name="skill"
                label="What's your skill?"
                placeholder="Enter your skill"
                value={formData.skill}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <TextAreaField
                id="description"
                name="description"
                label="Description"
                placeholder="Describe your portfolio"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-sm md:text-base font-medium text-gray-700">
                Portfolio File
              </label>

              <div className="flex items-center justify-between border border-gray-300 rounded-lg p-3 hover:border-blue-500 transition duration-200">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                >
                  Choose File
                </label>
                <span className="text-gray-600 text-sm truncate ml-3">
                  {formData.file ? formData.file.name : "No file selected"}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Allowed formats: PDF, JPG, JPEG, PNG, DOC (max 2 MB)
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}
