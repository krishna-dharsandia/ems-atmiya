import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Users,
    Bell,
    Shield,
    BookOpen,
    Award,
    GraduationCap,
    UserCheck,
    CheckCircle,
    MapPin,
    Star
} from "lucide-react";

export function FeaturesSection() {
    const features = [
        {
            icon: Calendar,
            title: "Event Discovery",
            description: "Browse and discover exciting events happening across campus departments and clubs.",
            highlights: ["Event calendar", "Category filtering", "Search events", "Event details"]
        },
        {
            icon: Users,
            title: "Easy Registration",
            description: "Quick and seamless registration process for all university events with instant confirmation.",
            highlights: ["One-click registration", "QR code tickets", "Waitlist support", "Group registration"]
        },
        {
            icon: Bell,
            title: "Smart Notifications",
            description: "Stay updated with event reminders, updates, and announcements via email and SMS.",
            highlights: ["Event reminders", "Update notifications", "Schedule changes", "Important announcements"]
        },
        {
            icon: BookOpen,
            title: "Academic Events",
            description: "Participate in workshops, seminars, guest lectures, and skill development programs.",
            highlights: ["Workshops", "Guest lectures", "Skill programs", "Certificate courses"]
        },
        {
            icon: Award,
            title: "Competitions & Contests",
            description: "Join exciting competitions, hackathons, debates, and showcase your talents.",
            highlights: ["Technical contests", "Cultural competitions", "Sports events", "Skill challenges"]
        },
        {
            icon: GraduationCap,
            title: "Student Clubs",
            description: "Connect with various student clubs and societies to expand your network and interests.",
            highlights: ["Club activities", "Society events", "Networking", "Interest groups"]
        },
        {
            icon: MapPin,
            title: "Campus Integration",
            description: "All events integrated with campus facilities, venues, and academic calendar.",
            highlights: ["Venue information", "Campus map", "Facility booking", "Schedule coordination"]
        },
        {
            icon: Shield,
            title: "Secure & Private",
            description: "Your personal information and registration data is secure and GDPR compliant.",
            highlights: ["Data protection", "Privacy controls", "Secure payments", "GDPR compliant"]
        }
    ];

    const processes = [
        {
            icon: Calendar,
            title: "Discover Events",
            description: "Browse upcoming events in your field of interest"
        },
        {
            icon: UserCheck,
            title: "Register Instantly",
            description: "Quick registration with student credentials"
        },
        {
            icon: Bell,
            title: "Get Notified",
            description: "Receive updates and reminders about your events"
        },
        {
            icon: Star,
            title: "Participate & Learn",
            description: "Attend events and enhance your skills"
        }
    ];
    return (
        <section id="features" className="py-20 lg:py-32 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                        Everything You Need for
                        <span className="block text-primary">
                            Campus Life
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Discover, participate, and stay connected with Atmiya University&apos;s vibrant campus community
                        through our comprehensive event management platform.
                    </p>
                </div>        {/* How It Works */}
                <div className="mb-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
                        How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processes.map((process, index) => (
                            <div key={process.title} className="text-center relative">
                                {index < processes.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-[50%] w-full h-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 z-0" />
                                )}
                                <div className="relative z-10">
                                    <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <process.icon className="w-8 h-8 text-primary-foreground" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-foreground mb-2">{process.title}</h4>
                                    <p className="text-muted-foreground">{process.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>        {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {features.map((feature) => (
                        <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
                            <CardContent className="p-6">
                                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{feature.description}</p>
                                <ul className="space-y-2">
                                    {feature.highlights.map((highlight) => (
                                        <li key={highlight} className="flex items-center text-sm text-muted-foreground">
                                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>        {/* Bottom CTA */}
                <div className="text-center mt-16">
                    <div className="bg-muted/50 rounded-2xl p-8 md:p-12 border border-border">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                            Ready to Get Involved?
                        </h3>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of Atmiya University students already participating in campus events and building lasting connections.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200">
                                Browse Events
                            </button>
                            <button className="border border-border text-foreground px-8 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-all duration-200">
                                Join Community
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
