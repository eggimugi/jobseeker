"use client";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protectedRoute";
import { useAuth } from "@/context/authContext";
import { portofolioApi } from "@/utils/societyApi";
import { Portofolio } from "@/types/society";
import NavbarSociety from "../navbarSociety";
import SectionHeader from "@/components/pageHeader";
import Link from "next/link";

export default function PortfolioSociety() {
  const { token } = useAuth();

  const [portfolios, setPortfolios] = useState<Portofolio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await portofolioApi.getPortofolios(token);
        setPortfolios(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [token]);

  return (
    <ProtectedRoute allowedRoles={["Society"]}>
      <div className="min-h-screen bg-white px-12 py-12">
        <NavbarSociety />
        <main className="pt-10">
          <SectionHeader
            indicator="Portfolio"
            title={
              <>
                Show off your{" "}
                <span className="text-orange-600 italic">awesome skills!</span>
              </>
            }
            description="Complete your portfolio to increase your chances!"
          />

          {loading ? (
            <p>Loading portfolios...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 mt-8">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  className="border rounded-lg p-4 shadow"
                >
                  <h3 className="text-lg font-semibold">{portfolio.skill}</h3>
                  <p className="text-gray-600">{portfolio.description}</p>
                  <div className="flex gap-3 mt-4">
                    <Link
                      href={`/society/portfolio/${portfolio.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Lihat Detail
                    </Link>
                    <Link
                      href={`/society/portfolio/${portfolio.id}/edit`}
                      className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
