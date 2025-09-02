"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDate } from "@/utils/functions/formatDate";
import { formatTime } from "@/utils/functions/formatTime";
import { Clock, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DownloadCertificateButton from "./DownloadCertificateButton";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    name: string;
    description: string;
    poster_url: string;
    start_date: Date;
    start_time: Date;
    mode: string;
    address?: string;
    status: string;
    certificate_template_url?: string | null;
  };
  userAttended?: boolean;
}

export default function EventCard({ event, userAttended = false }: EventCardProps) {
  const showCertificateButton =
    event.status === "COMPLETED" &&
    userAttended &&
    event.certificate_template_url;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video relative">
        <Image
          src={event.poster_url}
          alt={event.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge
            variant={
              event.status === "UPCOMING"
                ? "default"
                : event.status === "COMPLETED"
                ? "outline"
                : "destructive"
            }
          >
            {event.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex-1">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {event.description}
        </p>
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(event.start_time)}</span>
          </div>
          {event.mode === "OFFLINE" && event.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">{event.address}</span>
            </div>
          )}
        </div>
      </CardContent>

      {showCertificateButton && (
        <CardFooter className="p-4 pt-0">
          <DownloadCertificateButton
            eventId={event.id}
            variant="outline"
            className="w-full"
          />
        </CardFooter>
      )}
    </Card>
  );
}
