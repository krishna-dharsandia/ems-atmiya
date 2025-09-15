'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import { useParams, useRouter } from 'next/navigation';
import { TeamManagement } from "@/components/section/student/participations/TeamManagement";
import { Hackathon, HackathonTeam } from "@/types/hackathon";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const errorData = await response.json().catch(() => null);
    (error as any).info = errorData;
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
};

export default function TeamManagementPage() {
  const router = useRouter();
  const { id: hackathonId } = useParams<{ id: string }>();

  const { data, error, isLoading, mutate } = useSWR(
    `/api/student/participation/${hackathonId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
      refreshInterval: 30000, // Revalidate every 30 seconds
    }
  );

  useEffect(() => {
    // Handle authentication errors
    if (error && error.status === 401) {
      router.push('/login');
      return;
    }

    // Handle student not found errors
    if (error && error.status === 404 && error.info?.error === 'Student not found') {
      router.push('/onboarding');
      return;
    }

    // Handle hackathon not found errors
    if (error && error.status === 404 && error.info?.error === 'Hackathon not found') {
      router.push('/not-found');
      return;
    }

    // Handle no team found errors
    if (error && error.status === 404 && error.info?.error === 'No team found for this student in this hackathon') {
      router.push(`/hackathons/${hackathonId}`);
      return;
    }
  }, [error, router, hackathonId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-48 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !error.status) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-muted-foreground">
            Failed to load team management. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // If we have data, render the component
  if (data) {
    return (
      <ErrorBoundary>
        <TeamManagement
          hackathon={data.hackathon as Hackathon}
          team={data.team as HackathonTeam}
          isTeamOwner={data.isTeamOwner}
          studentId={data.studentId}
          currentUser={data.currentUser}
          mutate={mutate}
        />
      </ErrorBoundary>
    );
  }

  return null;
}
