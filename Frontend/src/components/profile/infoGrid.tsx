import { ReactNode } from "react";

interface InfoGridProps {
  items: { icon: ReactNode; label: string; value: string | number }[];
}

export default function InfoGrid({ items }: InfoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col items-start"
        >
          <div className="mb-2">{item.icon}</div>
          <p className="text-sm text-gray-600">{item.label}</p>
          <p className="text-lg font-bold text-orange-600">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
