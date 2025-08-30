import { metadata } from "@/lib/metadata";

export const pageMetadata = metadata.events;

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
