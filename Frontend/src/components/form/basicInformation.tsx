import InputField from "@/components/form/inputField";
import TextAreaField from "@/components/form/textareaField";
import SelectField from "@/components/form/selectField";
import { CompanyProfile } from "@/types/profile";

interface BasicInformationSectionProps {
  formData: CompanyProfile;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const INDUSTRY_OPTIONS = [
  { label: "Technology", value: "tech" },
  { label: "Education", value: "edu" },
  { label: "Healthcare", value: "health" },
];

export const COMPANY_SIZE_OPTIONS = [
  { label: "1-10 employees", value: "SIZE_1_10" },
  { label: "11-50 employees", value: "SIZE_11_50" },
  { label: "51-200 employees", value: "SIZE_51_200" },
  { label: "201-500 employees", value: "SIZE_201_500" },
  { label: "501-1000 employees", value: "SIZE_501_1000" },
  { label: "1000+ employees", value: "SIZE_1001_PLUS" },
];

export default function BasicInformationSection({
  formData,
  errors,
  handleChange,
  handleBlur,
}: BasicInformationSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Basic Information</h3>

      <InputField
        id="name"
        name="name"
        label="Company Name"
        value={formData.name}
        error={errors.name}
        placeholder="Ex. PT. Inovasi Digital Indonesia"
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <SelectField
          label="Industry"
          name="industry"
          value={formData.industry || ""}
          options={INDUSTRY_OPTIONS}
          onChange={handleChange}
        />

        <SelectField
          label="Company Size"
          name="companySize"
          value={formData.companySize || ""}
          options={COMPANY_SIZE_OPTIONS}
          onChange={handleChange}
        />
      </div>

      <InputField
        id="foundedYear"
        name="foundedYear"
        type="number"
        label="Founded Year"
        value={formData.foundedYear || 0}
        placeholder="Ex. 2015"
        onChange={handleChange}
      />

      <TextAreaField
        id="description"
        name="description"
        label="Company Description"
        value={formData.description}
        error={errors.description}
        placeholder="Tell job seekers about your company culture, mission, values, and what makes it a great place to work..."
        onChange={handleChange}
        onBlur={handleBlur}
        rows={6}
        showCharCount
        minChars={20}
      />
    </div>
  );
}
