import React, { ReactNode } from "react";

interface SectionHeaderProps {
  indicator: string;
  title: string | ReactNode;
  description?: string;
  editDescription?: string;
  isEditing?: boolean;
}

const SectionHeader = ({
  indicator,
  title,
  description,
  editDescription,
  isEditing = false,
}: SectionHeaderProps) => (
  <header className="mb-8 md:mb-10">
    <p className="text-base md:text-lg mb-3">
      <span className="text-2xl text-orange-600 font-black">—</span> {indicator}
    </p>
    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
      {title}
    </h1>
    {(description || editDescription) && (
      <p className="text-sm md:text-base text-gray-600">
        {isEditing && editDescription ? editDescription : description}
      </p>
    )}
  </header>
);

export default SectionHeader;


