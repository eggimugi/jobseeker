import { Save } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

export default function FormActions({
  loading,
  isEditing,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex gap-4 pt-6">
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-orange-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Save size={18} />
        {loading ? "Saving..." : isEditing ? "Update Profile" : "Save Profile"}
      </button>

      {isEditing && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}