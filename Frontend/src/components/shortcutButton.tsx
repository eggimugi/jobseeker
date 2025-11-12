// components/ShortcutButton.tsx
"use client";
import React from "react";

interface ShortcutButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  ariaLabel: string;
}

export default function ShortcutButton({
  icon,
  title,
  description,
  color,
  onClick,
  ariaLabel,
}: ShortcutButtonProps) {
  const bgColor = `bg-${color}-50`;
  const borderColor = `border-${color}-100`;
  const textColor = `text-${color}-600`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-4 ${bgColor} border ${borderColor} rounded-lg hover:shadow-sm transition cursor-pointer`}
      aria-label={ariaLabel}
    >
      <div className={`w-6 h-6 ${textColor}`}>{icon}</div>
      <div className="text-left">
        <div className={`text-sm font-medium ${textColor}`}>{title}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </button>
  );
}
