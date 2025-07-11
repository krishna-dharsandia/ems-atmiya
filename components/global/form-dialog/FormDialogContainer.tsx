"use client";

import { useAtom } from "jotai";
import FormDialog from "./FormDialog";
import { createDepartmentDialogAtom, createProgramDialogAtom } from "@/store/form-dialog";
import { DepartmentForm } from "@/components/section/master/departments/DepartmentForm";
import { ProgramForm } from "@/components/section/master/programs/ProgramForm";

export default function FormDialogContainer() {
  const [createDepartmentDialog, setCreateDepartmentDialog] = useAtom(createDepartmentDialogAtom);
  const [createProgramDialog, setCreateProgramDialog] = useAtom(createProgramDialogAtom);

  return (
    <>
      <FormDialog open={createDepartmentDialog} onOpenChange={setCreateDepartmentDialog} title="Create Department">
        <DepartmentForm />
      </FormDialog>
      <FormDialog open={createProgramDialog} onOpenChange={setCreateProgramDialog} title="Create Program">
        <ProgramForm />
      </FormDialog>
    </>
  );
}
