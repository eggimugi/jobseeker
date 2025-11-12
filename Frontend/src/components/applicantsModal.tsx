import React from "react";
import { X, User, Calendar, MapPin, Phone, Briefcase } from "lucide-react";
import { Application } from "@/types/hrd";

interface ApplicantDetailModalProps {
  applicant: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (applicationId: number, newStatus: string) => void;
  formatDate: (dateString: string) => string;
  calculateAge: (dateString: string) => number;
  getStatusBadgeColor: (status: string) => string;
}

const ApplicantDetailModal: React.FC<ApplicantDetailModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onStatusUpdate,
  formatDate,
  calculateAge,
  getStatusBadgeColor,
}) => {
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            Applicant Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
                {applicant.society.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Application ID: #{applicant.id}
              </p>
            </div>
            <span
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold w-fit ${getStatusBadgeColor(
                applicant.status
              )}`}
            >
              {applicant.status}
            </span>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-5 space-y-3 md:space-y-4">
            <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-2 md:mb-3">
              Personal Information
            </h4>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Gender</p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {applicant.society.gender}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">
                  Date of Birth
                </p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {formatDate(applicant.society.date_of_birth)}
                  <span className="text-gray-600 text-xs md:text-sm ml-2">
                    ({calculateAge(applicant.society.date_of_birth)} years old)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Address</p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {applicant.society.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Phone Number</p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {applicant.society.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Position Information */}
          <div className="bg-blue-50 rounded-lg p-4 md:p-5 space-y-3">
            <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-2 md:mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              Position Applied
            </h4>

            <div>
              <p className="text-xs md:text-sm text-gray-600">Position Name</p>
              <p className="text-base md:text-lg text-gray-900 font-semibold">
                {applicant.available_position.position_name}
              </p>
            </div>

            <div>
              <p className="text-xs md:text-sm text-gray-600">Description</p>
              <p className="text-sm md:text-base text-gray-900">
                {applicant.available_position.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-2">
              <div>
                <p className="text-xs md:text-sm text-gray-600">Capacity</p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {applicant.available_position.capacity} positions
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600">Apply Date</p>
                <p className="text-sm md:text-base text-gray-900 font-medium">
                  {formatDate(applicant.apply_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 md:p-5">
            <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-2 md:mb-3">
              Timeline
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-600">
                  Created at:
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-900">
                  {formatDate(applicant.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs md:text-sm text-gray-600">
                  Last updated:
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-900">
                  {formatDate(applicant.updatedAt)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between pt-2 border-t gap-1">
                <span className="text-xs md:text-sm text-gray-600">
                  Submission period:
                </span>
                <span className="text-xs md:text-sm font-medium text-gray-900">
                  {formatDate(
                    applicant.available_position.submission_start_date
                  )}{" "}
                  -{" "}
                  {formatDate(applicant.available_position.submission_end_date)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => {
                onStatusUpdate(applicant.id, "Accepted");
                onClose();
              }}
              className="flex-1 bg-green-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm md:text-base"
            >
              Accept Application
            </button>
            <button
              onClick={() => {
                onStatusUpdate(applicant.id, "Rejected");
                onClose();
              }}
              className="flex-1 bg-red-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm md:text-base"
            >
              Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetailModal;
