"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { profileApi } from "@/utils/profileApi";
import { jobPositionApi } from "@/utils/hrdApi";
import { SocietyProfile } from "@/types/profile";
import { JobPosition } from "@/types/hrd";
import NavbarSociety from "../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import ContactList from "@/components/profile/contactList";
import { JobPositionsCard } from "@/components/JobPositionsCard";
import { Modal } from "@/components/Modal";
import { MapPin, Phone, Calendar, User2, Mail } from "lucide-react";

export default function ProfileSociety() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<SocietyProfile | null>(null);
  const [availableJobs, setAvailableJobs] = useState<JobPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [allJobsRes, profileRes] = await Promise.all([
          jobPositionApi.getAllJobPositions(token),
          profileApi.getSocietyProfile(token),
        ]);

        const allJobs = allJobsRes.data || [];
        const profile = profileRes.data || null;

        setAvailableJobs(allJobs);
        setProfile(profile);
      } catch (err) {
        console.error("Error fetching society profile:", err);
      }
    };

    fetchData();
  }, [token]);

  const handleDetail = (position: JobPosition) => {
    setSelectedPosition(position);
    setShowDetailModal(true);
  };

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        {/* Navbar */}
        <NavbarSociety />
        <main className="pt-10">
          <SectionHeader
            indicator="Profile"
            title={
              <>
                Welcome back,{" "}
                <span className="text-orange-600 italic">{user?.name}!</span>
              </>
            }
            description="Ready to find your next quest? Let's go!"
          />

          {/* Profile Detail */}
          <section className="mt-8">
            <div className="flex items-center justify-between w-full bg-orange-600 p-6 mb-8 rounded text-white">
              <div className="flex">
                <div className="w-15 h-15 bg-white rounded flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-2xl">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
                  </span>
                </div>
                <div className="flex flex-col ml-5 justify-end">
                  <h2 className="text-2xl font-bold capitalize">
                    {profile?.name || "N/A"}
                  </h2>
                  <p className="flex items-center gap-2 capitalize">
                    <MapPin size={16} />
                    {profile?.address || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 border-2 border-white font-medium hover:bg-white hover:text-orange-600 rounded">
                  Edit Profile
                </button>
                <button className="px-4 py-2 border-2 border-white font-medium hover:bg-white hover:text-orange-600 rounded">
                  See My Portfolio
                </button>
              </div>
            </div>
            <ContactList
              title="Details Information"
              contacts={[
                {
                  icon: <Mail size={28} className="text-white" />,
                  label: "Email",
                  value: user?.email || "N/A",
                },
                {
                  icon: <Phone size={28} className="text-white" />,
                  label: "Phone",
                  value: profile?.phone || "N/A",
                },
                {
                  icon: <Calendar size={28} className="text-white" />,
                  label: "Date of Birth",
                  value: profile?.date_of_birth
                    ? new Date(profile.date_of_birth).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        }
                      )
                    : "N/A",
                },
                {
                  icon: <User2 size={28} className="text-white" />,
                  label: "Gender",
                  value: profile?.gender || "N/A",
                },
              ]}
            />
          </section>

          {/* Available Jobs */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">
              Available Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableJobs?.map((job) => (
                <JobPositionsCard
                  key={job.id}
                  position={{
                    id: job.id,
                    position_name: job.position_name,
                    description: job.description,
                    submission_start_date: job.submission_start_date,
                    submission_end_date: job.submission_end_date,
                    capacity: job.capacity,
                    companyId: job.companyId,
                    company: {
                      name: job.company.name,
                      address: job.company.address,
                    },
                  }}
                  onDetail={() => handleDetail(job)}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Detail Modal */}
        {showDetailModal && selectedPosition && (
          <Modal
            isOpen={showDetailModal}
            position={selectedPosition}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
