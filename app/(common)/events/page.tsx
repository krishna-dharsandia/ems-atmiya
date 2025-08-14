"use client";

import EventCard from "@/components/section/events/EventCard";
import { fetcher } from "@/fetcher";
import { EventMode, EventStatus, EventType } from "@prisma/client";
import useSWR from "swr";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/global/navigation-bar/LandingHeader";

type Event = {
  id: string;
  name: string;
  description: string;
  mode: EventMode;
  address: string | null;
  ticket_price: number;
  start_date: Date;
  start_time: Date;
  end_time: Date | null;
  event_type: EventType;
  status: EventStatus;
  poster_url: string;
};

export default function Page() {
  const { data, isLoading, error } = useSWR<Event[]>("/api/events", fetcher);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  // Filter and search logic
  const filteredEvents = useMemo(() => {
    if (!data) return [];
    return data.filter((event) => {
      const matchesSearch = event.name.toLowerCase().includes(search.toLowerCase()) || event.description.toLowerCase().includes(search.toLowerCase());
      const matchesMode = mode === "all" || mode === "" ? true : event.mode === mode;
      const matchesType = type === "all" || type === "" ? true : event.event_type === type;
      const matchesStatus = status === "all" || status === "" ? true : event.status === status;
      return matchesSearch && matchesMode && matchesType && matchesStatus;
    });
  }, [data, search, mode, type, status]);

  return (
    <div className="min-h-svh">
      <LandingHeader />
      <div className="bg-background pt-6 px-4 pb-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64 rounded-full" />
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger className="w-full sm:w-40 rounded-full">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="OFFLINE">Offline</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full sm:w-40 rounded-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="CULTURAL">Cultural</SelectItem>
                  <SelectItem value="SPORTS">Sports</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-40 rounded-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setMode("");
                  setType("");
                  setStatus("");
                }}
                className="rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          {isLoading || !data ? (
            <div className="flex justify-center items-center h-64 text-lg font-medium">Loading events...</div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-lg font-medium text-destructive">Failed to load events data</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.length === 0 ? (
                <div className="col-span-full text-center text-muted-foreground py-16">No events found.</div>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    name={event.name}
                    description={event.description}
                    poster_url={event.poster_url}
                    address={event.address}
                    start_date={event.start_date}
                    mode={event.mode}
                    price={event.ticket_price}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
