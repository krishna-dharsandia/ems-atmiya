"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import MasterHackathonDetail, { MasterHackathonDetailProps } from "@/components/section/master/hackathons/details/MasterHackathonDetail";

export default function MasterHackathonDetailPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hackathonData, setHackathonData] = useState<MasterHackathonDetailProps["hackathon"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchHackathonData = async () => {
      try {
        // Authenticate user
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData.user) {
          throw new Error("Failed to authenticate user");
        }

        // Fetch hackathon data with teams
        const hackathonResponse = await fetch(`/api/hackathons/${params.id}?includeMasterDetails=true`);

        if (!hackathonResponse.ok) {
          if (hackathonResponse.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch hackathon details");
        }

        const data = await hackathonResponse.json();
        setHackathonData(data.hackathon);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load hackathon details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathonData();
  }, [params.id, supabase.auth]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="w-full h-64" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button
            className="mt-2 text-red-600 underline"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!hackathonData) return null;

  return <MasterHackathonDetail hackathon={hackathonData} />;
}
