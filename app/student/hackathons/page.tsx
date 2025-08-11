"use client";

import { useEffect, useState } from "react";
import { HackathonList } from "@/components/section/student/hackathons/HackathonList";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudentHackathonsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("/api/hackathons");

        if (!response.ok) {
          throw new Error("Failed to fetch hackathons");
        }

        const data = await response.json();
        setHackathons(data.hackathons);
        setUserRegistrations(data.userRegistrations || {});
      } catch (err) {
        console.error("Error fetching hackathons:", err);
        setError("Failed to load hackathons. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 flex-grow" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hackathons</h1>
        <p className="text-muted-foreground">
          Discover and participate in hackathons to showcase your skills and win prizes
        </p>
      </div>

      <HackathonList
        hackathons={hackathons}
        userRegistrations={userRegistrations}
      />
    </div>
  );
}
