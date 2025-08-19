
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Star, Globe, Clock } from "lucide-react";

export function StatsSection() {
  const stats = [
    {
      icon: Calendar,
      number: "100+",
      label: "Events Created",
      description: "Successfully managed events across various industries"
    },
    {
      icon: Users,
      number: "15K+",
      label: "Total Registrations",
      description: "Attendees registered through our platform"
    },
    {
      icon: Globe,
      number: "85+",
      label: "Countries Reached",
      description: "Global events managed worldwide"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Average rating from our satisfied clients"
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Success Rate",
      description: "Events completed successfully"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Support Available",
      description: "Round-the-clock customer assistance"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Event Manager, TechCorp",
      content: "EventFlow transformed how we manage our corporate events. The analytics and automation features saved us countless hours.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "University Administrator",
      content: "Managing student events became so much easier. The registration system and real-time tracking are game-changers.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Director",
      content: "The integration capabilities and custom branding options helped us maintain our brand identity throughout the event experience.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5
    }
  ]; return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Trusted by Organizations
            <span className="block text-primary">
              Worldwide
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See why thousands of organizations choose EventFlow for their event management needs.
          </p>
        </div>                {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {stats.map((stat) => (
            <Card key={stat.label} className="group hover:shadow-lg transition-all duration-300 border-border overflow-hidden">
              <CardContent className="p-6 relative">
                <div className="flex items-center mb-4">
                  <div className={`bg-primary w-12 h-12 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm font-semibold text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>                {/* Testimonials */}
        {/* <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            What Our Customers Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="border-border hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-primary fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center">
                    <Image
                      width={40}
                      height={40}
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div> */}
        {/* Trust Indicators */}
        {/* <div className="text-center">
          <h4 className="text-lg font-semibold text-muted-foreground mb-8">Trusted by leading organizations</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "TechCorp", "University", "StartupHub", "EventPro", "MegaCorp", "Innovation"
            ].map((company) => (
              <div key={company} className="text-center">
                <div className="bg-muted h-12 w-24 mx-auto rounded-lg flex items-center justify-center border border-border">
                  <span className="text-muted-foreground font-semibold text-sm">{company}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}
