"use client";

import { Heading } from "@/components/global/heading/Heading";
import { EventFeedbackTable } from "@/components/section/master/events/details/feedbacks/EventFeedback";
import { EventRegistrationTable } from "@/components/section/master/events/details/registrations/EventRegistration";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import { Separator } from "@/components/ui/separator";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { use, useEffect, useState } from "react";
import { FileDown } from "lucide-react";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const setCurrentBreadcrumb = useSetAtom(sidebarBreadcrumbs);

  useEffect(() => {
    setCurrentBreadcrumb([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
      { label: "Event Details", href: `/master/events/details/${id}` },
    ]);
  });

  if (!id) {
    return <div>Error: Event ID is required for editing.</div>;
  }

  // Export logic
  const [exportType, setExportType] = useState<'registrations' | 'feedbacks' | 'both'>('both');

  async function fetchData(id: string) {
    const [registrations, feedbacks] = await Promise.all([
      fetch(`/api/events/details/registrations?id=${id}`).then(res => res.json()),
      fetch(`/api/events/details/feedbacks?id=${id}`).then(res => res.json()),
    ]);
    return { registrations, feedbacks };
  }

  // Format registration data according to requirements
  function formatRegistrations(registrations: any[]) {
    return registrations.map((reg: any) => {
      const base = {
        'First Name': reg.firstName,
        'Last Name': reg.lastName,
        'Role': reg.role,
        'Attended': reg.attended ? 'Yes' : 'No',
        'registrationID': reg.registrationID,
      };
      if (reg.role === 'Student') {
        return {
          ...base,
          'Department Name': reg.departmentName,
          'Program Name': reg.programName,
          'Current Year & Semester': `${reg.currentYear} / ${reg.currentSemester}`,
          'Registration Number': reg.registrationNumber,
        };
      } else if (reg.role === 'Admin') {
        return {
          ...base,
          'Department Name': reg.departmentName,
          'Program Name': reg.programName,
          'Position': reg.position,
        };
      }
      return base;
    });
  }

  // Format feedback data (add registration info if needed)
  function formatFeedbacks(feedbacks: any[]) {
    return feedbacks.map((fb: any) => {
      // Assuming feedback object has registration info or user info
      const base = {
        'First Name': fb.firstName,
        'Last Name': fb.lastName,
        'Role': fb.role,
        'Attended': fb.attended ? 'Yes' : 'No',
        'registrationID': fb.registrationID,
        'Feedback': fb.feedback,
      };
      if (fb.role === 'Student') {
        return {
          ...base,
          'Department Name': fb.departmentName,
          'Program Name': fb.programName,
          'Current Year & Semester': `${fb.currentYear} / ${fb.currentSemester}`,
          'Registration Number': fb.registrationNumber,
        };
      } else if (fb.role === 'Admin') {
        return {
          ...base,
          'Department Name': fb.departmentName,
          'Program Name': fb.programName,
          'Position': fb.position,
        };
      }
      return base;
    });
  }

  function exportData(data: any, format: "xlsx" | "csv" | "pdf", filename: string) {
    let regData = formatRegistrations(data.registrations);
    let fbData = formatFeedbacks(data.feedbacks);

    if (exportType === 'registrations') {
      fbData = [];
    } else if (exportType === 'feedbacks') {
      regData = [];
    }

    if (format === "xlsx") {
      const wb = XLSX.utils.book_new();
      if (regData.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(regData), "Registrations");
      if (fbData.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(fbData), "Feedbacks");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } else if (format === "csv") {
      let csv = '';
      if (regData.length) csv += `Registrations\n${Papa.unparse(regData)}\n\n`;
      if (fbData.length) csv += `Feedbacks\n${Papa.unparse(fbData)}\n`;
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
    } else if (format === "pdf") {
      const doc = new jsPDF();
      let y = 10;
      if (regData.length) {
        doc.setFontSize(14);
        doc.text("Registrations", 10, y);
        y += 10;
        doc.setFontSize(10);
        regData.forEach((row: any) => {
          doc.text(Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', '), 10, y);
          y += 8;
        });
        y += 10;
      }
      if (fbData.length) {
        doc.setFontSize(14);
        doc.text("Feedbacks", 10, y);
        y += 10;
        doc.setFontSize(10);
        fbData.forEach((row: any) => {
          doc.text(Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(', '), 10, y);
          y += 8;
        });
      }
      doc.save(`${filename}.pdf`);
    }
  }

  async function handleExport(format: "xlsx" | "csv" | "pdf") {
    const data = await fetchData(id);
    exportData(data, format, `event_${id}_data`);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Event Details`} description="Manage Event Details" />
        <div className="flex gap-2 items-center">
          <select
            value={exportType}
            onChange={e => setExportType(e.target.value as any)}
            style={{ height: 36 }}
          >
            <option value="registrations">Registrations Only</option>
            <option value="feedbacks">Feedbacks Only</option>
            <option value="both">Both</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>Export as XLSX</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator />

      <EventRegistrationTable id={id} />

      <EventFeedbackTable id={id} />
    </>
  );
}
