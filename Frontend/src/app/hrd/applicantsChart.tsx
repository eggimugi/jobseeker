import React, { useEffect, useMemo, useState } from "react";
import { applicationApi } from "@/utils/hrdApi";
import { useAuth } from "@/context/authContext";
import { Application } from "@/types/hrd";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import Link from "next/link";
import { DataCharts } from "@/components/DataCharts";

type Props = {
  applications?: Application[];
};

const ApplicantActivityChart: React.FC<Props> = ({
  applications: propsApplications,
}) => {
  const { token } = useAuth();
  const { isProfileComplete } = useProfileCompletion();
  const [applications, setApplications] = useState<Application[]>(
    propsApplications ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // if parent passed applications, use them; otherwise fetch
    if (propsApplications) {
      setApplications(propsApplications);
      return;
    }

    let cancelled = false;
    const fetchApplications = async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const response = await applicationApi.getApplications(token);
        const data = response.data;
        if (!cancelled) setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load applications";
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchApplications();
    return () => {
      cancelled = true;
    };
  }, [propsApplications, token]);

  // Process data untuk chart
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
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString("id-ID", { weekday: "short" });
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

    applications.forEach((app) => {
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
  }, [applications]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        Loading...
      </div>
    );
  }

  if (!isProfileComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6">
        <h2 className="text-2xl font-semibold mb-3">
          Complete Your Company Profile
        </h2>
        <p className="text-gray-600 max-w-md mb-6">
          To view your company statistics and applicants’ data, please complete
          your company profile first.
        </p>
        <Link
          href="/hrd/profile"
          className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 transition"
        >
          Complete Profile Now
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg border border-red-200 text-red-700">
        {error}
      </div>
    );
  }

  return <DataCharts chartData={chartData} />;
};

export default ApplicantActivityChart;
