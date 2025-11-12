import {
  INDUSTRY_OPTIONS,
  COMPANY_SIZE_OPTIONS,
} from "@/components/form/basicInformation";

export function getIndustryLabel(value?: string): string {
  if (!value) return "N/A";
  return INDUSTRY_OPTIONS.find((opt) => opt.value === value)?.label || value;
}

export function getCompanySizeLabel(value?: string): string {
  if (!value) return "N/A";
  return (
    COMPANY_SIZE_OPTIONS.find((opt) => opt.value === value)?.label || value
  );
}
