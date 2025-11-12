"use client";
import { use, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { useRouter } from "next/navigation";
import { applicationApi } from "@/utils/hrdApi";
import { jobPositionApi } from "@/utils/hrdApi";
import NavbarHRD from "./navbarHRD";
import SectionHeader from "@/components/pageHeader";
import StatsOverview from "@/components/statsOverview";
import ShortcutButton from "@/components/shortcutButton";
import ApplicantActivityChart from "./applicantsChart";
import FooterHRD from "./footerHRD";

export default function HRDDashboard() {
  const { user, token } = useAuth();
  const { isProfileComplete, profile } = useProfileCompletion();
  const router = useRouter();
  const [stats, setStats] = useState({
    openPositions: 0,
    totalApplicants: 0,
    awaitingReview: 0,
    hiresMade: 0,
    notApproved: 0,
  });

  const displayName =
    isProfileComplete && profile?.name ? profile.name : user?.name;

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const [applicationsRes, positionsRes] = await Promise.all([
          applicationApi.getApplications(token),
          jobPositionApi.getJobPositions(token),
        ]);

        const applications = applicationsRes.data || [];
        const positions = positionsRes.data || [];

        const openPositions = positions.length;
        const totalApplicants = applications.length;
        const awaitingReview = applications.filter(
          (app) => app.status === "Pending"
        ).length;
        const hiresMade = applications.filter(
          (app) => app.status === "Accepted"
        ).length;
        const notApproved = applications.filter(
          (app) => app.status === "Rejected"
        ).length;

        setStats({
          openPositions,
          totalApplicants,
          awaitingReview,
          hiresMade,
          notApproved,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        {/* Navbar */}
        <NavbarHRD />

        <main className="pt-10">
          {/* Header Section */}
          <SectionHeader
            indicator="Home"
            title={
              <>
                Welcome back,{" "}
                <span className="text-orange-600 italic">
                  {displayName || "Heroic HRD"}!
                </span>
              </>
            }
            description="Manage your job postings and applicants all in one place."
          />

          {/* Quick Stats */}
          <StatsOverview
            title="journey"
            stats={[
              {
                label: "Open",
                subLabel: "Positions",
                value: stats.openPositions,
              },
              {
                label: "Total",
                subLabel: "Applicants",
                value: stats.totalApplicants,
              },
              {
                label: "Awaiting",
                subLabel: "Review",
                value: stats.awaitingReview,
              },
              { label: "Hires", subLabel: "Made", value: stats.hiresMade },
              { label: "Not", subLabel: "Approved", value: stats.notApproved },
            ]}
            onMoreDetails={() => {
              alert("More details clicked!");
            }}
          />

          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Shortcuts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ShortcutButton
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20v-1a4 4 0 014-4h8a4 4 0 014 4v1"
                    />
                  </svg>
                }
                title="Profile Settings"
                description="Update your company profile"
                color="orange"
                onClick={() => router.push("/hrd/profile")}
                ariaLabel="Go to Applicants"
              />

              <ShortcutButton
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                }
                title="Add Position"
                description="Create a new job posting"
                color="orange"
                onClick={() => router.push("/hrd/positions")}
                ariaLabel="Go to Add Position"
              />

              <ShortcutButton
                icon={
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
                    />
                  </svg>
                }
                title="Applicants"
                description="Review and manage candidates"
                color="orange"
                onClick={() => router.push("/hrd/applicants")}
                ariaLabel="Go to Applicants"
              />
            </div>
          </section>

          <section className="mt-10">
            <ApplicantActivityChart />
          </section>

          <FooterHRD />
        </main>
      </div>
    </ProtectedRoute>
  );
}
