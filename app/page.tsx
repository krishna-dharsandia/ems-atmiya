import { HeroSection } from "@/components/section/landing/HeroSection";
import { FeaturesSection } from "@/components/section/landing/FeaturesSection";
import { StatsSection } from "@/components/section/landing/StatsSection";
import { CTASection } from "@/components/section/landing/CTASection";
import { LandingHeader } from "@/components/global/navigation-bar/LandingHeader";
import { LandingFooter } from "@/components/global/LandingFooter";
import { metadata } from "@/lib/metadata";

export { metadata };

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
