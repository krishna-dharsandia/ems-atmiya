import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, GraduationCap, BookOpen, Award } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] dark:[mask-image:linear-gradient(180deg,black,rgba(0,0,0,0))]" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* University Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-8 border border-primary/20">
            <GraduationCap className="w-4 h-4 mr-2" />
            Atmiya University Event Portal
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Discover & Join
            <span className="block text-primary">
              Campus Events
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Stay connected with Atmiya University&apos;s vibrant campus life. Discover workshops, seminars,
            cultural events, and academic competitions happening around you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/events">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Browse Events
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-border hover:border-primary px-8 py-4 text-lg font-semibold transition-all duration-200"
              >
                <Users className="mr-2 h-5 w-5" />
                Join Community
              </Button>
            </Link>
          </div>          {/* University Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">500+</div>
              <div className="text-muted-foreground">Events This Year</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">15K+</div>
              <div className="text-muted-foreground">Student Participants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">15+</div>
              <div className="text-muted-foreground">Active Clubs</div>
            </div>
          </div>
        </div>
      </div>      {/* Featured Event Categories */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300">
            <div className="bg-primary p-6">
              <BookOpen className="w-8 h-8 text-primary-foreground mb-2" />
              <h3 className="text-primary-foreground font-semibold text-lg">Academic Events</h3>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground">Workshops, seminars, guest lectures and academic competitions to enhance your learning.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300">
            <div className="bg-secondary p-6">
              <Users className="w-8 h-8 text-secondary-foreground mb-2" />
              <h3 className="text-secondary-foreground font-semibold text-lg">Cultural Events</h3>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground">Festivals, performances, art exhibitions and cultural celebrations throughout the year.</p>
            </div>
          </div>

          <div className="bg-card rounded-xl shadow-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300">
            <div className="bg-accent p-6">
              <Award className="w-8 h-8 text-accent-foreground mb-2" />
              <h3 className="text-accent-foreground font-semibold text-lg">Competitions</h3>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground">Sports competitions, hackathons, debate tournaments and skill-based contests.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
