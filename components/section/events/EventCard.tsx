import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EventMode } from "@prisma/client";
import { format } from "date-fns";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

export interface Event {
  id: string;
  name: string;
  description: string;
  start_date: Date;
  address: string | null;
  poster_url: string;
  price: number;
  mode: EventMode;
}

export default function EventCard({ id, name, description, start_date, address, poster_url, price, mode }: Event) {
  const imageUrl = getImageUrl(poster_url, "event-posters");

  return (
    <Card className="overflow-hidden pt-0 z-10">
      <div className="relative h-48">
        <Image src={imageUrl} alt={name} fill className="object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <Badge className="bg-primary text-primary-foreground">{mode}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 line-clamp-1 text-xl font-bold">{name}</h3>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(start_date), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{address}</span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="font-bold">{price <= 0 ? "Free" : `$${price}`}</div>
        <Link href={`/events/${id}`}>
          <Button size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
