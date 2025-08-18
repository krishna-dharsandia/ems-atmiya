"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, QrCode, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";

interface UserQRCodeData {
    qrCode: string;
    qrCodeData: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export function UserQRCodeDisplay() {
    const [qrData, setQrData] = useState<UserQRCodeData | null>(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchQRCode();
    }, []);

    const fetchQRCode = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user/qr-code`);
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
            const response = await fetch(`/api/user/qr-code`, {
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

    const downloadQRCode = () => {
        if (!qrData) return;

        const link = document.createElement("a");
        link.href = `data:image/png;base64,${qrData.qrCode}`;
        link.download = `${qrData.user.firstName}-${qrData.user.lastName}-qr-code.png`;
        link.click();
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
                        Your Personal QR Code
                    </CardTitle>
                    <CardDescription>
                        Generate your personal QR code for event
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                            You don't have a personal QR code yet.
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
                                    Generate My QR Code
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
                    Your Personal QR Code
                </CardTitle>
                <CardDescription>
                    Use this QR code for quick event
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Badge variant="outline">
                            {qrData.user.firstName} {qrData.user.lastName}
                        </Badge>
                        <Badge variant="secondary">
                            {qrData.user.email}
                        </Badge>
                    </div>

                    <div className="bg-white p-6 rounded-lg inline-block border-2 border-dashed border-primary/20">
                        <Image
                            width={256}
                            height={256}
                            src={`data:image/png;base64,${qrData.qrCode}`}
                            alt="Personal QR Code"
                            className="w-64 h-64 mx-auto"
                        />
                    </div>                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Show this QR code to event staff for quick access at any registered event.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            QR code has lifetime validity and contains encrypted identification data.
                        </p>
                    </div>

                    <div className="flex gap-2 justify-center">
                        <Button variant="outline" onClick={downloadQRCode}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button variant="outline" onClick={fetchQRCode}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">                        <h4 className="font-semibold text-blue-800 mb-2">How to use:</h4>
                        <ul className="text-sm text-blue-700 text-left space-y-1">
                            <li>• Save this QR code to your phone</li>
                            <li>• Show it to event staff when checking in</li>
                            <li>• Make sure you're registered for the event first</li>
                            <li>• The QR code has lifetime validity - no expiration</li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
