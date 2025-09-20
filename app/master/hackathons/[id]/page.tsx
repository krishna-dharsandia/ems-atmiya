"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/utils/supabase/client";
import MasterHackathonDetail, { MasterHackathonDetailProps } from "@/components/section/master/hackathons/details/MasterHackathonDetail";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editTeamSchema, EditTeamInput } from "@/schemas/team";
import { editTeamAction } from "./actions";

export default function MasterHackathonDetailPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [hackathonData, setHackathonData] = useState<MasterHackathonDetailProps["hackathon"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [editTeam, setEditTeam] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
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

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setIsDialogOpen(true);
  };

  const handleEditTeamClick = (team: any) => {
    setEditTeam(team);
    setEditForm({
      mentor: team.mentor,
      mentor_mail: team.mentor_mail,
      disqualified: team.disqualified,
      problemStatementId: team.problemStatement?.id || "",
      teamName: team.teamName,
      members: team.members.map((m: any) => m),
    });
    setIsEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedTeam(null);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
    setEditTeam(null);
    setEditForm({});
  };

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditTeamInput>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: editForm,
  });

  useEffect(() => {
    if (editTeam) {
      reset({
        id: editTeam.id,
        mentor: editTeam.mentor,
        mentor_mail: editTeam.mentor_mail,
        disqualified: editTeam.disqualified,
        problemStatementId: editTeam.problemStatement?.id || "",
        teamName: editTeam.teamName,
        members: editTeam.members.map((m: any) => ({
          id: m.id,
          studentId: m.studentId,
          attended: m.attended,
          student: m.student,
        })),
      });
    }
  }, [editTeam, reset]);

  const onEditSubmit = async (data: EditTeamInput) => {
    const result = await editTeamAction(data);
    if (result.success) {
      setIsEditDialogOpen(false);
      setEditTeam(null);
      reset();
    } else {
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-full sm:w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="w-full h-48 sm:h-64" />
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
          <div className="space-y-6 mt-6 md:mt-0">
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

  return (
    <>
      <MasterHackathonDetail
        hackathon={hackathonData}
        onTeamClick={handleTeamClick}
        onEditTeamClick={handleEditTeamClick}
      />
      {/* View Team Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogClose onClick={handleDialogClose} />
          </DialogHeader>
          {selectedTeam ? (
            <div className="space-y-4">
              <div>
                <strong>Team ID:</strong> {selectedTeam.id}
              </div>
              <div>
                <strong>Mentor Name:</strong> {selectedTeam.mentor}
              </div>
              <div>
                <strong>Mentor Email:</strong> {selectedTeam.mentor_mail}
              </div>
              <div>
                <strong>Team Name:</strong> {selectedTeam.teamName}
              </div>
              <div>
                <strong>Team Leader:</strong> {
                  selectedTeam.members.find((m: any) => m.studentId === selectedTeam.leaderId)
                    ? `${selectedTeam.members.find((m: any) => m.studentId === selectedTeam.leaderId).student?.user?.firstName} ${selectedTeam.members.find((m: any) => m.studentId === selectedTeam.leaderId).student?.user?.lastName} (${selectedTeam.members.find((m: any) => m.studentId === selectedTeam.leaderId).student?.user?.email})`
                    : "Not selected"
                }
              </div>
              <div>
                <strong>Problem Statement:</strong> {selectedTeam.problemStatement ? `${selectedTeam.problemStatement.code}: ${selectedTeam.problemStatement.title}` : "Not selected"}
              </div>
              <div>
                <strong>Members:</strong>
                <ul className="list-disc ml-6">
                  {selectedTeam.members.map((member: any) => (
                    <li key={member.id}>
                      {member.student?.user?.firstName} {member.student?.user?.lastName} ({member.student?.user?.email})
                      {member.attended && <span className="ml-2 text-green-600">(Attended)</span>}
                    </li>
                  ))}
                </ul>
              </div>
              {selectedTeam.submissionUrl && (
                <div>
                  <strong>Submission:</strong> <a href={selectedTeam.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View Submission</a>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogClose onClick={handleEditDialogClose} />
          </DialogHeader>
          {editTeam && (
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <input type="hidden" {...register("id")} />
              <div className="space-y-2">
                <Label htmlFor="mentor">Mentor Name</Label>
                <Input id="mentor" {...register("mentor")} />
                {errors.mentor && <p className="text-red-500 text-xs">{errors.mentor.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mentor_mail">Mentor Email</Label>
                <Input id="mentor_mail" type="email" {...register("mentor_mail")} />
                {errors.mentor_mail && <p className="text-red-500 text-xs">{errors.mentor_mail.message}</p>}
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="disqualified"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="disqualified"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="disqualified">Disqualified</Label>
                {errors.disqualified && <p className="text-red-500 text-xs">{errors.disqualified.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="problemStatementId">Problem Statement</Label>
                <Controller
                  name="problemStatementId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger id="problemStatementId">
                        <SelectValue placeholder="Select Problem Statement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {hackathonData?.problemStatements?.map((ps: any) => (
                          <SelectItem key={ps.id} value={ps.id}>{ps.code}: {ps.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.problemStatementId && <p className="text-red-500 text-xs">{errors.problemStatementId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input id="teamName" {...register("teamName")} />
                {errors.teamName && <p className="text-red-500 text-xs">{errors.teamName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="leaderId">Team Leader</Label>
                <Controller
                  name="leaderId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value || ""} onValueChange={field.onChange}>
                      <SelectTrigger id="leaderId">
                        <SelectValue placeholder="Select Team Leader" />
                      </SelectTrigger>
                      <SelectContent>
                        {control._formValues.members?.map((member: any) => (
                          <SelectItem key={member.studentId} value={member.studentId}>
                            {member.student?.user?.firstName} {member.student?.user?.lastName} ({member.student?.user?.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.leaderId && <p className="text-red-500 text-xs">{errors.leaderId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Members</Label>
                <div className="overflow-x-auto" style={{ maxHeight: 300, overflowY: 'auto' }}>
                  <table className="min-w-full border text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Attended</th>
                        <th className="p-2 text-left">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {control._formValues.members?.map((member: any, idx: number) => (
                        <tr key={member.id} className="border-t">
                          <td className="p-2">{member.student?.user?.firstName} {member.student?.user?.lastName}</td>
                          <td className="p-2">{member.student?.user?.email}</td>
                          <td className="p-2">
                            <Controller
                              name={`members.${idx}.attended`}
                              control={control}
                              render={({ field }) => (
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              )}
                            />
                          </td>
                          <td className="p-2">
                            <Button type="button" variant="destructive" size="sm" onClick={() => {
                              const newMembers = [...control._formValues.members];
                              newMembers.splice(idx, 1);
                              setValue("members", newMembers);
                            }}>Remove</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {errors.members && <p className="text-red-500 text-xs">{errors.members.message}</p>}
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleEditDialogClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>Save</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
