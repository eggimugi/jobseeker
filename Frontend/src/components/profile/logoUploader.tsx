import { Upload, Camera } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface LogoUploaderProps {
  preview?: string | null;
  onChange: (file: File | null) => void;
  label: string;
}

export default function LogoUploader({
  preview,
  onChange,
  label,
}: LogoUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
    e.target.value = "";
  };

  useEffect(() => {
  console.log("🔄 Logo preview updated:", preview);
}, [preview]);


  return (
    <div className="flex flex-col gap-2 border-b pb-8">
      {label && <p className="text-lg font-bold text-gray-900 mb-4">{label}</p>}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="relative w-32 h-32 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
            {preview ? (
              <Image
                key={preview}
                src={preview}
                alt="Preview"
                fill
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={32} className="text-gray-400" />
            )}
          </div>
          <label className="absolute -bottom-2 -right-2 bg-orange-600 text-white p-2 rounded-full cursor-pointer hover:bg-orange-700 transition-colors">
            <Upload size={18} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Upload your {label?.toLowerCase()} to make your profile stand out
          </p>
          <p className="text-xs text-gray-600 mb-1">
            Recommended: Square image, at least 400x400px, PNG or JPG
          </p>
          <p className="text-xs text-gray-600 mb-1">Max size: 2MB</p>
        </div>
      </div>
    </div>
  );
}
