"use client";

import { Heading } from "@/components/global/heading/Heading";
import { EventFeedbackTable } from "@/components/section/master/events/details/feedbacks/EventFeedback";
import { EventRegistrationTable } from "@/components/section/master/events/details/registrations/EventRegistration";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { sidebarBreadcrumbs } from "@/store/sidebar";
import { useSetAtom } from "jotai";
import { use, useEffect, useState } from "react";
import { FileDown, Download } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { fetcher } from "@/fetcher";
import { 
  exportToCSV, 
  exportToXLSX, 
  exportToPDF, 
  formatRegistrationData, 
  formatFeedbackData,
  type ExportData 
} from "@/utils/functions/exportUtils";

type ExportType = "registrations" | "feedbacks" | "both";
type ExportFormat = "xlsx" | "csv" | "pdf";

interface EventData {
  id: string;
  name: string;
  [key: string]: unknown;
}

interface RegistrationData {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    students?: Array<{
      registrationNumber?: string;
      department?: { name: string };
      program?: { name: string };
      currentSemester?: number;
      currentYear?: number;
    }>;
    admins?: Array<{
      department?: { name: string };
      program?: { name: string };
    }>;
  };
  attended: boolean;
  createdAt: string;
  [key: string]: unknown;
}

interface FeedbackData {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  rating: number;
  createdAt: string;
  [key: string]: unknown;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const setCurrentBreadcrumb = useSetAtom(sidebarBreadcrumbs);
  const [exportType, setExportType] = useState<ExportType>("registrations");
  const [isExporting, setIsExporting] = useState(false);

  // Fetch event details for filename
  const { data: eventData } = useSWR<EventData>(`/api/events/${id}`, fetcher);
  
  // Fetch registrations and feedbacks data
  const { data: registrations } = useSWR<RegistrationData[]>(
    (exportType === "registrations" || exportType === "both") ? `/api/events/details/registrations?id=${id}` : null,
    fetcher
  );
  
  const { data: feedbacks } = useSWR<FeedbackData[]>(
    (exportType === "feedbacks" || exportType === "both") ? `/api/events/details/feedbacks?id=${id}` : null,
    fetcher
  );

  useEffect(() => {
    setCurrentBreadcrumb([
      { label: "Dashboard", href: "/master" },
      { label: "Events", href: "/master/events" },
      { label: "Event Details", href: `/master/events/details/${id}` },
    ]);
  }, [id, setCurrentBreadcrumb]);

  if (!id) {
    return <div>Error: Event ID is required for editing.</div>;
  }

  const generateFilename = () => {
    const eventName = eventData?.name || "Event";
    const timestamp = new Date().toISOString().split('T')[0];
    const typeLabel = exportType === "both" ? "Complete" : exportType;
    return `${eventName}_${typeLabel}_${timestamp}`.replace(/[^a-zA-Z0-9_-]/g, '_');
  };

  const prepareExportData = (): ExportData => {
    const exportData: ExportData = {};
    
    if ((exportType === "registrations" || exportType === "both") && registrations) {
      exportData.registrations = formatRegistrationData(registrations as Record<string, unknown>[]);
    }
    
    if ((exportType === "feedbacks" || exportType === "both") && feedbacks) {
      exportData.feedbacks = formatFeedbackData(feedbacks as Record<string, unknown>[]);
    }
    
    return exportData;
  };

  const handleExport = async (format: ExportFormat) => {
    if (isExporting) return;
    
    try {
      setIsExporting(true);
      
      // Check if we have data to export
      const hasRegistrations = (exportType === "registrations" || exportType === "both") && 
                               registrations && registrations.length > 0;
      const hasFeedbacks = (exportType === "feedbacks" || exportType === "both") && 
                           feedbacks && feedbacks.length > 0;
      
      if (!hasRegistrations && !hasFeedbacks) {
        toast.error("No data available to export for the selected type.");
        return;
      }

      const filename = generateFilename();
      const exportData = prepareExportData();
      
      toast.info(`Preparing ${format.toUpperCase()} export...`);

      switch (format) {
        case "csv":
          exportToCSV(exportData, filename, exportType);
          break;
        case "xlsx":
          exportToXLSX(exportData, filename, exportType);
          break;
        case "pdf":
          await exportToPDF(exportData, filename, exportType, eventData?.name);
          break;
      }
      
      toast.success(`${format.toUpperCase()} export completed successfully!`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(`Failed to export ${format.toUpperCase()} file. Please try again.`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Event Details`} description="Manage Event Details" />
        <div className="flex gap-2 items-center">
          <Select value={exportType} onValueChange={(value: ExportType) => setExportType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select export type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="registrations">Registrations Only</SelectItem>
              <SelectItem value="feedbacks">Feedbacks Only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button disabled={isExporting}>
                {isExporting ? (
                  <>
                    <Download className="mr-2 h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("xlsx")}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as XLSX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
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
