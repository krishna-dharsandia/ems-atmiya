import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the correct image URL for Supabase storage
 * @param url - The URL or path from the database
 * @param bucket - The storage bucket name
 * @returns The correct public URL
 */
export function getImageUrl(url: string | null | undefined, bucket: string = "event-posters"): string {
  if (!url) return "/placeholder.svg";
  
  if (url.startsWith('http')) {
    return url;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL is not defined in environment variables');
    return "/placeholder.svg";
  }
  
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${url}`;
}
