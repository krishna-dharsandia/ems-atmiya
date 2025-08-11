"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import HackathonDetail, { HackathonDetailProps, Team } from "@/components/section/student/hackathons/HackathonDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";

export default function HackathonDetailPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  type HackathonData = {
    hackathon: HackathonDetailProps["hackathon"];
    userTeam?: Team;
    pendingInvites?: { teamId: string; teamName: string }[];
  };

  const [hackathonData, setHackathonData] = useState<HackathonData | null>(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchHackathonAndUserData = async () => {
      try {
        // Fetch current user data
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData.user) {
          throw new Error("Failed to authenticate user");
        }

        const userResponse = await fetch(`/api/student/${authData.user.id}`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await userResponse.json();
        setCurrentUser(userData.user);

        // Fetch hackathon data
        const hackathonResponse = await fetch(`/api/hackathons/${params.id}`);

        if (!hackathonResponse.ok) {
          if (hackathonResponse.status === 404) {
            notFound();
          }
          throw new Error("Failed to fetch hackathon details");
        }

        const data = await hackathonResponse.json();
        setHackathonData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load hackathon details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathonAndUserData();
  }, [params.id, supabase.auth]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
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

  if (!hackathonData || !currentUser) return null;

  return (
    <HackathonDetail
      hackathon={hackathonData.hackathon}
      currentUser={currentUser}
      userTeam={hackathonData.userTeam || null}
      pendingInvites={hackathonData.pendingInvites || []}
    />
  );
}
