import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataChartsProps {
  chartData: Array<{
    day: string;
    accepted: number;
    pending: number;
    rejected: number;
  }>;
}

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
        {payload.map((entry: TooltipPayload, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DataCharts: React.FC<DataChartsProps> = ({ chartData }) => {
  const stats = useMemo(() => {
    const total = chartData.reduce(
      (sum, day) => sum + day.accepted + day.pending + day.rejected,
      0
    );
    const accepted = chartData.reduce((sum, day) => sum + day.accepted, 0);
    const pending = chartData.reduce((sum, day) => sum + day.pending, 0);
    const rejected = chartData.reduce((sum, day) => sum + day.rejected, 0);
    return { total, accepted, pending, rejected };
  }, [chartData]);

  const mostActiveDay = useMemo(() => {
    if (chartData.length === 0) return "-";
    const max = chartData.reduce((prev, current) => {
      const prevTotal = prev.accepted + prev.pending + prev.rejected;
      const currentTotal =
        current.accepted + current.pending + current.rejected;
      return currentTotal > prevTotal ? current : prev;
    });
    return max.day;
  }, [chartData]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Applicant Activity
          </h2>
          <p className="text-sm text-gray-500 mt-1">Last 7 days overview</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">
              {stats.accepted}
            </p>
            <p className="text-xs text-gray-500">Accepted</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
            <p className="text-xs text-gray-500">Rejected</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
          <XAxis dataKey="day" stroke="#888" style={{ fontSize: "12px" }} />
          <YAxis stroke="#888" style={{ fontSize: "12px" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
            iconType="circle"
          />
          <Bar
            dataKey="accepted"
            fill="#f97316"
            name="Accepted"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="pending"
            fill="#fbbf24"
            name="Pending"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="rejected"
            fill="#f87171"
            name="Rejected"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="w-1 h-10 bg-orange-600 rounded mr-3" />
          <div>
            <p className="text-sm text-gray-500 leading-tight">
              Most Active Day
            </p>
            <p className="text-lg font-bold text-orange-600">{mostActiveDay}</p>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="w-1 h-10 bg-orange-600 rounded mr-3" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Acceptance Rate</p>
            <p className="text-lg font-bold text-orange-600">
              {stats.total > 0
                ? Math.round((stats.accepted / stats.total) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="w-1 h-10 bg-orange-600 rounded mr-3" />
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending Review</p>
            <p className="text-lg font-bold text-orange-600">
              {stats.pending} applicants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
