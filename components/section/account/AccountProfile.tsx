"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  UserCheck,
  Edit3,
  Save,
  X,
  QrCode,
  Download,
  RefreshCw,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

interface AccountProfileProps {
  role: "STUDENT" | "ADMIN" | "MASTER";
}

interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role?: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    phone?: string;
  };
}

interface UserQRCodeData {
  qrCode: string;
  qrCodeData: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function AccountProfile({ role }: AccountProfileProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [qrData, setQrData] = useState<UserQRCodeData | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrGenerating, setQrGenerating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  });

  const { user: authUser, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authUser && !authLoading) {
      loadUserProfile();
      fetchQRCode();
    }
  }, [authUser?.id, authLoading]);

  const loadUserProfile = async () => {
    try {
      if (!authUser) {
        toast.error("Failed to load user profile");
        return;
      }

      setUser({
        ...authUser,
        full_name: authUser.user_metadata?.full_name || "",
        phone: authUser.user_metadata?.phone || "",
        role: authUser.app_metadata?.role || role,
      });
      setFormData({
        full_name:
          authUser.user_metadata?.full_name ||
          authUser.email?.split("@")[0] ||
          "",
        phone: authUser.user_metadata?.phone || "",
      });
    } catch (error) {
      console.error("Error loading user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Use a secure API endpoint instead of direct supabase.auth.updateUser
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
      loadUserProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name:
        user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
      phone: user?.user_metadata?.phone || "",
    });
    setIsEditing(false);
  };

  const fetchQRCode = async () => {
    setQrLoading(true);
    try {
      const response = await fetch("/api/user/qr-code");
      if (response.ok) {
        const data = await response.json();
        setQrData(data);
      } else if (response.status === 404) {
        // QR code doesn't exist yet
        setQrData(null);
      } else {
        console.error("Failed to fetch QR code");
      }
    } catch (error) {
      console.error("Error fetching QR code:", error);
    } finally {
      setQrLoading(false);
    }
  };

  const generateQRCode = async () => {
    setQrGenerating(true);
    try {
      const response = await fetch("/api/user/qr-code", {
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
      setQrGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrData) return;

    const link = document.createElement("a");
    link.href = `data:image/png;base64,${qrData.qrCode}`;
    link.download = `${qrData.user.firstName}-${qrData.user.lastName}-qr-code.png`;
    link.click();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "MASTER":
        return "destructive";
      case "ADMIN":
        return "default";
      case "STUDENT":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Failed to load user profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={user.user_metadata?.full_name || "User"}
                />
                <AvatarFallback className="text-lg">
                  {user.user_metadata?.full_name
                    ? user.user_metadata.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "User"}
                  </CardTitle>
                  <Badge variant={getRoleBadgeVariant(user.role || role)}>
                    {user.role || role}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email || "No email"}
                </CardDescription>
              </div>
            </div>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => setIsEditing(!isEditing)}
              disabled={saving}
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Profile Information
          </CardTitle>
          <CardDescription>
            Manage your account details and personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              {isEditing ? (
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user.user_metadata?.full_name || "Not provided"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="Enter your mobile number"
                />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone || "Not provided"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email || "No email"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <UserCheck className="h-4 w-4 text-muted-foreground" />
                <Badge variant={getRoleBadgeVariant(user.role || role)}>
                  {user.role || role}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joined">Member Since</Label>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Personal QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Personal QR Code
          </CardTitle>
          <CardDescription>
            Your unique QR code for event and identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !qrData ? (
            <div className="text-center py-8">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                You don't have a personal QR code yet.
              </p>
              <Button onClick={generateQRCode} disabled={qrGenerating}>
                {qrGenerating ? (
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
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline">{user.full_name}</Badge>
                <Badge variant="secondary">{user.email}</Badge>
              </div>

              <div className="bg-white p-6 rounded-lg inline-block border-2 border-dashed border-primary/20">
                <Image
                  width={200}
                  height={200}
                  src={`data:image/png;base64,${qrData.qrCode}`}
                  alt="Personal QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Show this QR code to event staff for quick access at any
                  registered event.
                </p>
                <p className="text-xs text-muted-foreground">
                  QR code has lifetime validity and contains encrypted
                  identification data.
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

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  How to use:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 text-left space-y-1">
                  <li>• Save this QR code to your phone</li>
                  <li>• Show it to event staff when checking in</li>
                  <li>• Make sure you're registered for the event first</li>
                  <li>• The QR code has lifetime validity - no expiration</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security and authentication settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/reset-password")}
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
