// components/StatsOverview.tsx
"use client";
import React from "react";

interface StatItem {
  label: string;
  subLabel?: string;
  value: number | string;
  isPercentage?: boolean;
}

interface StatsOverviewProps {
  title: string;
  stats: StatItem[];
  onMoreDetails?: () => void;
}

export default function StatsOverview({
  title,
  stats,
  onMoreDetails,
}: StatsOverviewProps) {
  return (
    <div className="mt-5 text-base md:text-xl">
      <p className="font-bold">
        Here&apos;s your <span className="text-orange-600 italic">{title}</span> so
        far:
      </p>

      {/* Desktop & Tablet */}
      <div className="hidden md:flex justify-between items-center px-4 lg:px-8 py-4 bg-orange-600 mt-5 rounded gap-4">
        <ul className="flex flex-wrap gap-4 lg:gap-12">
          {stats.map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="font-bold text-white text-4xl">
                {item.value}{item.isPercentage ? "%" : ""}
              </span>
              <span className="text-white ms-2 leading-4 lg:leading-5 text-sm lg:text-base">
                {item.label} <br /> {item.subLabel}
              </span>
            </li>
          ))}
        </ul>
        {onMoreDetails && (
          <button
            onClick={onMoreDetails}
            className="border-2 border-white text-white rounded-full px-4 py-2 font-medium text-sm lg:text-base whitespace-nowrap hover:bg-white hover:text-orange-600 transition-colors"
          >
            More Details
          </button>
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden bg-orange-600 mt-5 rounded p-4">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((item, i) => (
            <div
              key={i}
              className={`bg-white/10 rounded-lg p-3 ${
                i === stats.length - 1 ? "col-span-2" : ""
              }`}
            >
              <span className="font-bold text-white text-xl block">
                {item.value}
              </span>
              <span className="text-white text-sm mt-1 block">
                {item.label} {item.subLabel}
              </span>
            </div>
          ))}
        </div>
        {onMoreDetails && (
          <button
            onClick={onMoreDetails}
            className="w-full mt-4 border-2 border-white text-white rounded-full px-4 py-3 font-medium hover:bg-white hover:text-orange-600 transition-colors"
          >
            More Details
          </button>
        )}
      </div>
    </div>
  );
}
