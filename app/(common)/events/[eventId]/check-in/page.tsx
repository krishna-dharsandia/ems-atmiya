"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, QrCode } from "lucide-react";
import { toast } from "sonner";

interface EventData {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  start_time: string;
  end_time?: string;
  address?: string;
  mode: "ONLINE" | "OFFLINE";
  poster_url: string;
  organizer_name: string;
  current_registration_count: number;
}

export default function EventCheckInPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      checkRegistrationStatus();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        toast.error("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/registration/status`);
      if (response.ok) {
        const data = await response.json();
        setIsRegistered(data.isRegistered);
      }
    } catch (error) {
      console.error("Error checking registration:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: "POST",
      });
      
      if (response.ok) {
        toast.success("Successfully registered for the event!");
        setIsRegistered(true);
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Failed to register for the event");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-muted-foreground">
              The event you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        {/* Event Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <CardTitle className="text-3xl mb-2">{event.name}</CardTitle>
                <CardDescription className="text-lg">
                  {event.description}
                </CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={event.mode === "ONLINE" ? "secondary" : "default"}>
                  {event.mode}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>
                  {formatDate(event.start_date)}
                  {event.end_date && event.end_date !== event.start_date && 
                    ` - ${formatDate(event.end_date)}`
                  }
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </span>
              </div>

              {event.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{event.address}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>{event.current_registration_count} registered</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Organized by: <span className="font-medium">{event.organizer_name}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Check-in Instructions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-6 w-6" />
              Event Check-in
            </CardTitle>
            <CardDescription>
              You&apos;ve scanned the event QR code! Here&apos;s how to proceed with check-in:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!isRegistered ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Registration Required
                  </h3>
                  <p className="text-yellow-700 mb-4">
                    You need to register for this event before you can check in.
                  </p>
                  <Button onClick={handleRegister} className="w-full">
                    Register for Event
                  </Button>
                </div>
              ) : (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ You&apos;re Registered!
                  </h3>
                  <p className="text-green-700 mb-4">
                    Great! You&apos;re registered for this event. To complete check-in, 
                    please show your personal QR code to the event staff, or they 
                    can search for you manually.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-800">Next steps:</p>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Show your personal QR code to event staff</li>
                      <li>• Or provide your name/email for manual check-in</li>
                      <li>• Wait for staff to confirm your attendance</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  For Event Staff
                </h3>
                <p className="text-blue-700 text-sm">
                  Use the admin panel to scan attendee QR codes or search for 
                  attendees manually to mark them as present.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Poster */}
        {event.poster_url && (
          <Card>
            <CardContent className="p-6">
              <img 
                src={event.poster_url} 
                alt={event.name}
                className="w-full h-auto rounded-lg"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
