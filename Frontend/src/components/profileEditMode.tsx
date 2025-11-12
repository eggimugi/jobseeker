import SectionHeader from "@/components/pageHeader";
import LogoUploader from "@/components/profile/logoUploader";
import { X } from "lucide-react";
import { CompanyProfile } from "@/types/profile";
import BasicInformationSection from "./form/basicInformation";
import ContactInformationSection from "./form/contactInformationSection";
import FormActions from "./form/formActions";

interface ProfileEditModeProps {
  formData: CompanyProfile;
  errors: Record<string, string>;
  logoPreview: string | null; // ✅ ubah jadi string | null karena sudah dikonversi di hook
  isEditing: boolean;
  loading: boolean;
  setFieldValue: <K extends keyof CompanyProfile>(
    name: K,
    value: CompanyProfile[K] | undefined
  ) => void;

  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setLogoPreview: (preview: string | File | null) => void;
  onCancel?: () => void;
}

export default function ProfileEditMode({
  formData,
  errors,
  logoPreview,
  isEditing,
  loading,
  setFieldValue,
  handleChange,
  handleBlur,
  handleSubmit,
  setLogoPreview,
  onCancel,
}: ProfileEditModeProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <SectionHeader
          indicator="Profile"
          title={
            <>
              {isEditing ? "Update" : "Create"} your company profile,{" "}
              <span className="text-orange-600 italic">
                showcase your brand!
              </span>
            </>
          }
          description={
            isEditing
              ? "Keep your company information up to date"
              : "Tell job seekers about your amazing company"
          }
          isEditing={false}
        />
        {isEditing && onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <X size={18} />
            Cancel
          </button>
        )}
      </div>

      {/* Form */}
      <div className="border rounded-xl p-6 lg:p-10 shadow-sm bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Logo Upload */}
          <LogoUploader
            label="Company Logo"
            preview={logoPreview} // ✅ langsung pass logoPreview, sudah dalam bentuk URL string
            onChange={(file) => {
              if (file) {
                setLogoPreview(file);
                setFieldValue("logo", file);
              } else {
                setLogoPreview(null);
                setFieldValue("logo", null);
              }
            }}
          />

          {/* Basic Information */}
          <BasicInformationSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          {/* Contact Information */}
          <ContactInformationSection
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
          />

          {/* Form Actions */}
          <FormActions
            loading={loading}
            isEditing={isEditing}
            onCancel={onCancel}
          />
        </form>
      </div>
    </div>
  );
}
