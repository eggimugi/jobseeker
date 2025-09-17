import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { ProtectedRoute } from "@/components/protectedRoute";

export default function NavbarHRD() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <ProtectedRoute allowedRoles={["HRD"]}>
      <nav className="bg-white shadow-sm px-12 rounded-full">
        <div className="flex justify-between h-16 items-center">
          <Link href="/society/dashboard" className="font-bold text-xl">
            Job<span className="text-orange-600 italic">Seeker</span>
          </Link>
          <ul className="flex space-x-10 font-medium">
            <li>
              <a href="">Home</a>
            </li>
            <li>
              <a onClick={() => router.push("/society/profile")}>Profile</a>
            </li>
            <li>
              <a href="">Applicants</a>
            </li>
            <li>
              <a href="">Add Positions</a>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            <p className="border border-black rounded-full px-4 py-2 font-medium">
              HRD
            </p>
            <button
              onClick={logout}
              className="bg-black text-white font-semibold px-4 py-2 rounded-full hover:bg-red-700 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </ProtectedRoute>
  );
}
