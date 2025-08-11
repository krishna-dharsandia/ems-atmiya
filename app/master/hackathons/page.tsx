"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { PlusCircle, Search, Edit, ExternalLink } from "lucide-react";

interface Hackathon {
  id: string;
  name: string;
  mode: "ONLINE" | "OFFLINE";
  start_date: string;
  end_date: string;
  registration_start_date: string;
  registration_end_date: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED" | "OTHER";
  created_at: string;
}

export default function ManageHackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("/api/hackathons");
        if (!response.ok) {
          throw new Error("Failed to fetch hackathons");
        }
        const data = await response.json();
        setHackathons(data.hackathons);
        setFilteredHackathons(data.hackathons);
      } catch (error) {
        console.error("Error fetching hackathons:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredHackathons(hackathons);
    } else {
      const filtered = hackathons.filter((hackathon) =>
        hackathon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHackathons(filtered);
    }
  }, [searchTerm, hackathons]);

  const createNewHackathon = () => {
    router.push("/master/hackathons/create");
  };

  const editHackathon = (id: string) => {
    router.push(`/master/hackathons/edit/${id}`);
  };

  const viewHackathon = (id: string) => {
    router.push(`/master/hackathons/${id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-6" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hackathons</h1>
        <Button onClick={createNewHackathon}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Hackathon
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Hackathons</CardTitle>
          <CardDescription>
            View, edit, or manage hackathons and their participants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search hackathons by name..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredHackathons.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No hackathons found matching your search"
                  : "No hackathons have been created yet"}
              </p>
              {searchTerm && (
                <Button
                  variant="link"
                  onClick={() => setSearchTerm("")}
                  className="mt-2"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHackathons.map((hackathon) => (
                    <TableRow key={hackathon.id}>
                      <TableCell className="font-medium">
                        {hackathon.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(hackathon.status)}>
                          {hackathon.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{hackathon.mode}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>
                            {format(new Date(hackathon.start_date), "MMM d, yyyy")} -{" "}
                            {format(new Date(hackathon.end_date), "MMM d, yyyy")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Registration: {format(new Date(hackathon.registration_start_date), "MMM d")} - {format(new Date(hackathon.registration_end_date), "MMM d")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => viewHackathon(hackathon.id)}
                            title="View hackathon details"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => editHackathon(hackathon.id)}
                            title="Edit hackathon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
