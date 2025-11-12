import InputField from "@/components/form/inputField";
import { CompanyProfile } from "@/types/profile";

interface ContactInformationSectionProps {
  formData: CompanyProfile;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function ContactInformationSection({
  formData,
  errors,
  handleChange,
  handleBlur,
}: ContactInformationSectionProps) {
  return (
    <div className="space-y-6 border-t pt-8">
      <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>

      <div className="grid md:grid-cols-2 gap-6">
        <InputField
          id="phone"
          name="phone"
          type="tel"
          label="Phone Number"
          value={formData.phone}
          error={errors.phone}
          placeholder="Ex. 085123456789"
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <InputField
          id="website"
          name="website"
          type="url"
          label="Company Website"
          value={formData.website || ""}
          placeholder="Ex. https://yourcompany.com"
          onChange={handleChange}
        />
      </div>

      <InputField
        id="address"
        name="address"
        label="Office Address"
        value={formData.address}
        error={errors.address}
        placeholder="Ex. Jl. Sudirman No. 123, Jakarta Selatan"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
}
