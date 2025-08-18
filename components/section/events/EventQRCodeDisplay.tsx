"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, QrCode, Share2, Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface EventQRCodeProps {
  eventId: string;
  eventName: string;
}

interface QRCodeData {
  qrCode: string;
  qrCodeData: string;
  urlQrCode?: string;
  event: {
    name: string;
    date: string;
  };
}

export function EventQRCodeDisplay({ eventId, eventName }: EventQRCodeProps) {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchQRCode();
  }, [eventId]);

  const fetchQRCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events/${eventId}/qr-code`);
      if (response.ok) {
        const data = await response.json();
        setQrData(data);
      } else if (response.status === 404) {
        // QR code doesn't exist yet
        setQrData(null);
      } else {
        toast.error("Failed to fetch QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
      toast.error("Failed to fetch QR code");
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`/api/events/${eventId}/qr-code`, {
        method: "POST",
      });
      
      if (response.ok) {
        const data = await response.json();
        setQrData(data);
        toast.success("QR code generated successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  };

  const downloadQRCode = (qrCode: string, filename: string) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrCode}`;
    link.download = `${filename}.png`;
    link.click();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const shareQRCode = async () => {
    const baseUrl = window.location.origin;
    const eventUrl = `${baseUrl}/events/${eventId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${eventName}`,
          text: `${eventName}`,
          url: eventUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard(eventUrl);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!qrData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-6 w-6" />
            Event QR Code
          </CardTitle>
          <CardDescription>
            Generate a QR code for {eventName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No QR code has been generated for this event yet.
            </p>
            <Button onClick={generateQRCode} disabled={generating}>
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-6 w-6" />
          Event QR Code
        </CardTitle>
        <CardDescription>
          QR codes for {qrData.event.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">Quick Access</TabsTrigger>
            <TabsTrigger value="data">Secure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                URL-Based QR Code
              </Badge>
              {qrData.urlQrCode && (
                <div className="bg-white p-4 rounded-lg inline-block border">
                  <img 
                    src={`data:image/png;base64,${qrData.urlQrCode}`} 
                    alt="Event URL QR Code"
                    className="w-64 h-64 mx-auto"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground mt-4">
                Scan this QR code to go directly to the event page. 
                Perfect for printing on posters or sharing digitally.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                {qrData.urlQrCode && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadQRCode(qrData.urlQrCode!, `${eventName}-checkin-qr`)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={shareQRCode}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <div className="text-center">
              <Badge variant="default" className="mb-4">
                Secure Data QR Code
              </Badge>
              <div className="bg-white p-4 rounded-lg inline-block border">
                <img 
                  src={`data:image/png;base64,${qrData.qrCode}`} 
                  alt="Event Data QR Code"
                  className="w-64 h-64 mx-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                This QR code contains encrypted event data for secure access. 
                Use this with the admin scanner app for automated attendance tracking.
              </p>
              <div className="flex gap-2 justify-center mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadQRCode(qrData.qrCode, `${eventName}-secure-qr`)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(qrData.qrCodeData)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Data
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={fetchQRCode}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
