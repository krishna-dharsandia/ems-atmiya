"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DownloadCertificateButtonProps {
  eventId: string;
  disabled?: boolean;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export default function DownloadCertificateButton({
  eventId,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
}: DownloadCertificateButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Create a URL for the certificate download API endpoint
      const url = `/api/events/${eventId}/certificate`;

      // Open the URL in a new tab to trigger the download
      // This approach works better than fetch for downloading files
      window.open(url, '_blank');

      toast.success("Certificate download started");
    } catch (error) {
      console.error("Error downloading certificate:", error);
      toast.error("Failed to download certificate");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={disabled || isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          {showIcon && <FileDown className="mr-2 h-4 w-4" />}
          Download Certificate
        </>
      )}
    </Button>
  );
}
