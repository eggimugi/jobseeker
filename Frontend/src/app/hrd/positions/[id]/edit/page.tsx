"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protectedRoute";
import SectionHeader from "@/components/pageHeader";
import NavbarHRD from "@/app/hrd/navbarHRD";
import { jobPositionApi } from "@/utils/hrdApi";
import { useAuth } from "@/context/authContext";
import { JobPosition } from "@/types/hrd";
import InputField from "@/components/form/inputField";
import TextAreaField from "@/components/form/textareaField";

export default function EditPositionPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const idParam = params?.id;
  const id = idParam ? Number(idParam) : null;

  const [position, setPosition] = useState<JobPosition | null>(null);
  const [positionName, setPositionName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState<number>(1);
  const [submissionStartDate, setSubmissionStartDate] = useState("");
  const [submissionEndDate, setSubmissionEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosition = async () => {
      if (!token || !id) return;
      setLoading(true);
      try {
        const resp = await jobPositionApi.getJobPositions(token);
        console.log(resp);

        if (resp?.data) {
          const data = resp.data.find((p) => p.id === id);
          if (!data) {
            setError("Posisi tidak ditemukan.");
            return;
          }
          setPosition(data);
          setPositionName(data.position_name ?? "");
          setDescription(data.description ?? "");
          setCapacity(data.capacity ?? 1);
          // format date for <input type="date">
          setSubmissionStartDate(
            data.submission_start_date
              ? new Date(data.submission_start_date).toISOString().slice(0, 10)
              : ""
          );
          setSubmissionEndDate(
            data.submission_end_date
              ? new Date(data.submission_end_date).toISOString().slice(0, 10)
              : ""
          );
        }
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data posisi.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosition();
  }, [token, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        position_name: positionName,
        description,
        capacity: Number(capacity),
        submission_end_date: submissionEndDate,
        // keep company info unchanged (backend biasanya membutuhkan company_id if editable)
      };
      await jobPositionApi.updateJobPosition(id, payload, token);
      router.push("/hrd/positions");
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/hrd/positions");
  };

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-12 py-6 lg:py-12">
        <NavbarHRD />
        <main className="pt-10">
          <SectionHeader
            indicator="Edit Position"
            title={
              <>
                Update job{" "}
                <span className="text-orange-600 italic">details</span>
              </>
            }
            description="Ubah data posisi pekerjaan lalu simpan perubahan."
            editDescription="Update your job position details"
            isEditing={true}
          />

          <div className="bg-white border rounded-lg p-6 mt-6">
            {loading ? (
              <p>Memuat data...</p>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : position ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                  <div className="md:col-span-2">
                    <InputField
                      id="positionName"
                      name="positionName"
                      label="Position Name"
                      value={positionName}
                      placeholder="Enter position name"
                      onChange={(e) => setPositionName(e.target.value)}
                      required
                    />
                  </div>

                  <InputField
                    id="capacity"
                    name="capacity"
                    type="number"
                    label="Capacity"
                    value={capacity}
                    placeholder="Enter capacity"
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <TextAreaField
                    id="description"
                    name="description"
                    label="Description"
                    value={description}
                    placeholder="Enter job description"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                  <InputField
                    id="submissionStartDate"
                    name="submissionStartDate"
                    type="date"
                    label="Submission Start Date"
                    placeholder="Select start date"
                    value={submissionStartDate}
                    onChange={(e) => setSubmissionStartDate(e.target.value)}
                    required
                  />

                  <InputField
                    id="submissionEndDate"
                    name="submissionEndDate"
                    type="date"
                    label="Submission End Date"
                    placeholder="Select end date"
                    value={submissionEndDate}
                    onChange={(e) => setSubmissionEndDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <p>Posisi tidak ditemukan.</p>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
