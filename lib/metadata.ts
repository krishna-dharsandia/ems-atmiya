import { Metadata } from 'next';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  type?: 'website' | 'event' | 'hackathon';
  image?: string;
  url?: string;
}

export function generateMetadata({
  title = "Event Management System - Atmiya University",
  description = "A comprehensive platform to manage events, registrations, and tickets for Atmiya University. Streamline your event management with our modern EMS solution.",
  keywords = ["event management", "university events", "registration system", "ticket management", "Atmiya University", "EMS"],
  type = 'website',
  image = '/images/og-thumbnail.png',
  url = '/'
}: GenerateMetadataProps = {}): Metadata {
  const baseUrl = 'https://events.adsc-atmiya.in';
  
  return {
    title,
    description,
    keywords,
    authors: [{ name: "Atmiya University" }],
    creator: "Atmiya University",
    publisher: "Atmiya University",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
         openGraph: {
       type: 'website',
       locale: 'en_US',
       url: `${baseUrl}${url}`,
       siteName: 'EMS - Atmiya University',
       title,
       description,
       images: [
         {
           url: image,
           width: 1200,
           height: 630,
           alt: title,
         },
         {
           url: '/images/og-thumbnail-square.png',
           width: 600,
           height: 600,
           alt: title,
         },
       ],
     },
     twitter: {
       card: 'summary_large_image',
       site: '@atmiyauniversity',
       creator: '@atmiyauniversity',
       title,
       description,
       images: [image],
     },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Predefined metadata for common pages
export const metadata = {
  home: generateMetadata({
    title: "Event Management System - Atmiya University",
    description: "A comprehensive platform to manage events, registrations, and tickets for Atmiya University. Streamline your event management with our modern EMS solution.",
    url: '/',
  }),
  
  events: generateMetadata({
    title: "Events - EMS Atmiya University",
    description: "Discover and register for exciting events at Atmiya University. From academic seminars to cultural festivals, find your next opportunity.",
    keywords: ["events", "university events", "event registration", "academic events", "cultural events"],
    url: '/events',
  }),
  
  hackathons: generateMetadata({
    title: "Hackathons - EMS Atmiya University",
    description: "Join innovative hackathons and coding competitions at Atmiya University. Build, create, and compete with fellow students.",
    keywords: ["hackathons", "coding competitions", "innovation", "technology", "programming"],
    type: 'hackathon',
    url: '/hackathons',
  }),
  
  login: generateMetadata({
    title: "Login - EMS Atmiya University",
    description: "Access your EMS account to manage events, registrations, and more.",
    keywords: ["login", "authentication", "user account", "EMS login"],
    url: '/login',
  }),
  
  register: generateMetadata({
    title: "Register - EMS Atmiya University",
    description: "Create your EMS account to start managing and participating in events at Atmiya University.",
    keywords: ["register", "sign up", "create account", "EMS registration"],
    url: '/register',
  }),
};

// Function to generate event-specific metadata
export function generateEventMetadata(event: {
  title: string;
  description: string;
  date: string;
  location?: string;
  image?: string;
  id: string;
}) {
  // Use the unified API with eventId for dynamic data fetching
  const ogImageUrl = event.image || `/api/og?eventId=${event.id}`;
  
  return generateMetadata({
    title: `${event.title} - EMS Atmiya University`,
    description: event.description,
    keywords: ["event", "university event", "registration", event.title.toLowerCase()],
    type: 'event',
    image: ogImageUrl,
    url: `/events/${event.id}`,
  });
}

// Function to generate hackathon-specific metadata
export function generateHackathonMetadata(hackathon: {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image?: string;
  id: string;
}) {
  // Use the unified API with hackathonId for dynamic data fetching
  const ogImageUrl = hackathon.image || `/api/og?hackathonId=${hackathon.id}`;
  
  return generateMetadata({
    title: `${hackathon.title} - EMS Atmiya University`,
    description: hackathon.description,
    keywords: ["hackathon", "coding competition", "innovation", hackathon.title.toLowerCase()],
    type: 'hackathon',
    image: ogImageUrl,
    url: `/hackathons/${hackathon.id}`,
  });
}
