type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

export const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value }) => (
  <div className="bg-orange-50 rounded-lg p-4 text-center">
    <div className="flex justify-center mb-2 text-orange-600">{icon}</div>
    <p className="text-sm text-gray-600">{label}</p>
    <p className="font-bold text-gray-900">{value}</p>
  </div>
);
