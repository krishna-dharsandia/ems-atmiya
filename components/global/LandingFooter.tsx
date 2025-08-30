import Link from "next/link";
import { Mail, MapPin, Instagram, Linkedin, Calendar, Globe } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    university: [
      { name: "About Atmiya", href: "https://atmiyauni.ac.in/about-university" },
      { name: "Admissions", href: "https://atmiyauni.ac.in/after-12th-undergraduate-ug-programs" },
      { name: "Academics", href: "https://atmiyauni.ac.in/academics" },
      { name: "Campus Life", href: "https://atmiyauni.ac.in/campus-life" },
    ],
    student: [
      { name: "Event Calendar", href: "/events" },
      { name: "Student Portal", href: "https://cms.atmiya.edu.in/" },
      { name: "Clubs & Societies", href: "https://atmiyauni.ac.in/student_corner_new" },
      { name: "Help & Support", href: "#" },
    ],
    resources: [
      { name: "Privacy Policy", href: "/legal/privacy" },
      { name: "Terms Of Service", href: "/legal/terms" },
      { name: "Cookies Policy", href: "/legal/cookies" },
    ],
  };

  const socialLinks = [
    { name: "Website", icon: Globe, href: "https://events.adsc-atmiya.in" },
    { name: "Instagram", icon: Instagram, href: "https://www.instagram.com/adsc.atmiya" },
    { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/adsc-atmiya-university" },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">EMS</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Event Management System (EMS)
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">adsc@atmiyauni.ac.in</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">Rajkot, GJ</span>
              </div>
            </div>
          </div>                    {/* University Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">University</h3>
            <ul className="space-y-2">
              {footerLinks.university.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Student</h3>
            <ul className="space-y-2">
              {footerLinks.student.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>                {/* Newsletter Section */}
        {/*  <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-lg font-semibold mb-2 text-foreground">Stay Updated</h3>
              <p className="text-muted-foreground">Get the latest updates about new features and events.</p>
            </div>
            <div className="flex space-x-2 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder-muted-foreground"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Subscribe
              </Button>
            </div>
          </div>
        </div>  */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <div className="text-muted-foreground text-sm mb-4 lg:mb-0">
            © {currentYear} EMS. All rights reserved. Made with <span role="img" aria-label="love">❤️</span> by <a href="https://adsc-atmiya.in" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">ADSC</a>.
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
