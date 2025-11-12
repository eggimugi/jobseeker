import Image from "next/image";
import SectionHeader from "@/components/pageHeader";
import { InfoCard } from "@/components/profile/infoCards";
import ContactList from "@/components/profile/contactList";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Edit3,
} from "lucide-react";
import { CompanyProfile } from "@/types/profile";
import { getIndustryLabel, getCompanySizeLabel } from "@/utils/getLabelValue";
import capitalizeSentences from "@/utils/capitalizeSentence";

interface ProfileViewModeProps {
  formData: CompanyProfile;
  logoPreview: string | null;
  userEmail?: string;
  onEdit: () => void;
}

export default function ProfileViewMode({
  formData,
  logoPreview,
  userEmail,
  onEdit,
}: ProfileViewModeProps) {
  return (
    <>
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center">
        <SectionHeader
          indicator="Profile"
          title={
            <>
              Your company profile,{" "}
              <span className="text-orange-600 italic">
                showcase your brand!
              </span>
            </>
          }
          description="This is how job seekers see your company."
          isEditing={false}
        />
        <button
          onClick={onEdit}
          className="flex items-center gap-2 bg-transparent text-black border px-6 py-3 rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
        >
          <Edit3 size={18} />
          Edit Profile
        </button>
      </div>

      {/* Company Card */}
      <div className="overflow-hidden">
        <div className="pb-8">
          {/* Logo & Company Header */}
          <div className="flex mt-12 mb-6 bg-orange-600 p-6 rounded-xl text-white">
            <div className="w-20 h-20 rounded-xl border-3 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Company Logo"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building2 size={48}/>
              )}
            </div>
            <div className="flex flex-col ml-5 justify-end">
              <h2 className="text-3xl font-bold mb-2 capitalize">
                {formData.name}
              </h2>
              <p className="flex gap-2 mb-1 capitalize">
                <MapPin size={16} />
                {formData.address}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <InfoCard
              icon={<Building2 size={24} className="text-orange-600" />}
              label="Industry"
              value={getIndustryLabel(formData.industry)}
            />
            <InfoCard
              icon={<Calendar size={24} className="text-orange-600" />}
              label="Founded"
              value={formData.foundedYear || "N/A"}
            />
            <InfoCard
              icon={<Building2 size={24} className="text-orange-600" />}
              label="Company Size"
              value={getCompanySizeLabel(formData.companySize)}
            />
            <InfoCard
              icon={<Phone size={24} className="text-orange-600" />}
              label="Active Jobs"
              value="5"
            />
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">About Us</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {formData.description ? capitalizeSentences(formData.description) : "No description provided."}
            </p>
          </div>

          {/* Contact Information */}
          <ContactList
            title="Contact Information"
            contacts={[
              {
                icon: <Phone size={20} className="text-white" />,
                label: "Phone",
                value: formData.phone,
              },
              {
                icon: <Mail size={20} className="text-white" />,
                label: "Email",
                value: userEmail || "N/A",
              },
              {
                icon: <MapPin size={20} className="text-white" />,
                label: "Address",
                value: formData.address,
              },
              {
                icon: <Globe size={20} className="text-white" />,
                label: "Website",
                value: formData.website || "N/A",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}