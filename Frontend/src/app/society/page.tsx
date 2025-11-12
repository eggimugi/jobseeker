"use client";
import { useEffect, useMemo, useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { jobPositionApi } from "@/utils/hrdApi";
import { applyPositionApi } from "@/utils/societyApi";
import { JobPosition } from "@/types/hrd";
import { PositionApplied } from "@/types/society";
import NavbarSociety from "./navbarSociety";
import SectionHeader from "@/components/pageHeader";
import StatsOverview from "@/components/statsOverview";
import { JobPositionsCard } from "@/components/JobPositionsCard";
import { Modal } from "@/components/Modal";
import { DataCharts } from "@/components/DataCharts";
import FooterSociety from "./footerSociety";

export default function SocietyDashboard() {
  const { user, token } = useAuth();
  const [availableJobs, setAvailableJobs] = useState<JobPosition[]>([]);
  const [appliedPositions, setAppliedPositions] = useState<PositionApplied[]>(
    []
  );
  const [stats, setStats] = useState({
    sent: 0,
    accepted: 0,
    waiting: 0,
    rejected: 0,
  });
  const [selectedPosition, setSelectedPosition] = useState<JobPosition | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [allJobsRes, appliedRes] = await Promise.all([
          jobPositionApi.getAllJobPositions(token),
          applyPositionApi.getSocietyAppliedPositions(token),
        ]);

        const allJobs = allJobsRes.data || [];
        const applied = appliedRes.data || [];

        setAvailableJobs(allJobs);
        setAppliedPositions(applied);

        const sent = applied.length;
        const accepted = applied.filter((a) => a.status === "Accepted").length;
        const waiting = applied.filter((a) => a.status === "Pending").length;
        const rejected = applied.filter((a) => a.status === "Rejected").length;

        setStats({ sent, accepted, waiting, rejected });
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token]);

  const chartData = useMemo(() => {
    const now = new Date();
    const last7Days: {
      day: string;
      date: string;
      total: number;
      accepted: number;
      pending: number;
      rejected: number;
    }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = date.toISOString().split("T")[0];

      last7Days.push({
        day: dayName,
        date: dateStr,
        total: 0,
        accepted: 0,
        pending: 0,
        rejected: 0,
      });
    }

    appliedPositions.forEach((app) => {
      const appDate = new Date(app.apply_date).toISOString().split("T")[0];
      const dayData = last7Days.find((d) => d.date === appDate);
      if (dayData) {
        dayData.total++;
        if (app.status === "Accepted") dayData.accepted++;
        else if (app.status === "Pending") dayData.pending++;
        else if (app.status === "Rejected") dayData.rejected++;
      }
    });

    return last7Days;
  }, [appliedPositions]);

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
          {/* Header Section */}
          <SectionHeader
            indicator="Home"
            title={
              <>
                Welcome back,{" "}
                <span className="text-orange-600 italic">{user?.name}!</span>
              </>
            }
            description="Ready to find your next quest? Let’s go!"
          />

          {/* Quick Stats */}
          <StatsOverview
            title="adventure progress"
            stats={[
              { label: "Applications", subLabel: "Sent", value: stats.sent },
              { label: "Status", subLabel: "Accepted", value: stats.accepted },
              { label: "Still", subLabel: "Waiting", value: stats.waiting },
              { label: "Not", subLabel: "This Time", value: stats.rejected },
            ]}
            onMoreDetails={() => {
              alert("More details clicked!");
            }}
          />

          {/* Progress Chart */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6">Your Progress</h3>
            <DataCharts chartData={chartData} />
          </div>

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

          <FooterSociety />
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
