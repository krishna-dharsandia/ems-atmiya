"use client";

import { useAtom } from "jotai";
import FormDialog from "./FormDialog";
import { createAdminDialogAtom, createDepartmentDialogAtom, createMasterDialogAtom, createProgramDialogAtom, createStudentDialogAtom } from "@/store/form-dialog";
import { DepartmentForm } from "@/components/section/master/departments/DepartmentForm";
import { ProgramForm } from "@/components/section/master/programs/ProgramForm";
import { StudentForm } from "@/components/section/master/students/StudentForm";
import { AdminForm } from "@/components/section/master/admins/AdminForm";
import { MasterForm } from "@/components/section/master/masters/MasterForm";

export default function FormDialogContainer() {
  const [createDepartmentDialog, setCreateDepartmentDialog] = useAtom(createDepartmentDialogAtom);
  const [createProgramDialog, setCreateProgramDialog] = useAtom(createProgramDialogAtom);

  const [createStudentDialog, setCreateStudentDialog] = useAtom(createStudentDialogAtom);
  const [createAdminDialog, setCreateAdminDialog] = useAtom(createAdminDialogAtom);
  const [createMasterDialog, setCreateMasterDialog] = useAtom(createMasterDialogAtom);

  return (
    <>
      <FormDialog open={createDepartmentDialog} onOpenChange={setCreateDepartmentDialog} title="Create Department">
        <DepartmentForm />
      </FormDialog>
      <FormDialog open={createProgramDialog} onOpenChange={setCreateProgramDialog} title="Create Program">
        <ProgramForm />
      </FormDialog>

      <FormDialog open={createStudentDialog} onOpenChange={setCreateStudentDialog} title="Create Student">
        <StudentForm isFormOpen={createStudentDialog} setIsFormOpen={setCreateStudentDialog} />
      </FormDialog>
      <FormDialog open={createAdminDialog} onOpenChange={setCreateAdminDialog} title="Create Admin">
        <AdminForm />
      </FormDialog>
      <FormDialog open={createMasterDialog} onOpenChange={setCreateMasterDialog} title="Create Master">
        <MasterForm />
      </FormDialog>
    </>
  );
}
