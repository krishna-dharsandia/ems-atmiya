import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Calendar } from "lucide-react";

export function LandingFooter() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        university: [
            { name: "About Atmiya", href: "#about" },
            { name: "Admissions", href: "#admissions" },
            { name: "Academics", href: "#academics" },
            { name: "Campus Life", href: "#campus" },
        ],
        student: [
            { name: "Event Calendar", href: "/events" },
            { name: "Student Portal", href: "#portal" },
            { name: "Clubs & Societies", href: "#clubs" },
            { name: "Help & Support", href: "#support" },
        ],
        resources: [
            { name: "Event Guidelines", href: "#guidelines" },
            { name: "Registration Help", href: "#help" },
            { name: "Contact Us", href: "#contact" },
            { name: "Feedback", href: "#feedback" },
        ],
    };

    const socialLinks = [
        { name: "Facebook", icon: Facebook, href: "#" },
        { name: "Twitter", icon: Twitter, href: "#" },
        { name: "Instagram", icon: Instagram, href: "#" },
        { name: "LinkedIn", icon: Linkedin, href: "#" },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                                <Calendar className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">EventFlow</span>
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            Modern event management platform that helps organizations create, manage, and track events seamlessly.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center text-gray-400">
                                <Mail className="h-4 w-4 mr-2" />
                                <span className="text-sm">contact@eventflow.com</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <Phone className="h-4 w-4 mr-2" />
                                <span className="text-sm">+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="text-sm">San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* University Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">University</h3>
                        <ul className="space-y-2">
                            {footerLinks.university.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resource</h3>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Student</h3>
                        <ul className="space-y-2">
                            {footerLinks.student.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col lg:flex-row justify-between items-center">
                        <div className="mb-4 lg:mb-0">
                            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
                            <p className="text-gray-400">Get the latest updates about new features and events.</p>
                        </div>
                        <div className="flex space-x-2 w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
                            />
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center">
                    <div className="text-gray-400 text-sm mb-4 lg:mb-0">
                        © {currentYear} EventFlow. All rights reserved.
                    </div>
                    <div className="flex space-x-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                className="text-gray-400 hover:text-white transition-colors duration-200"
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
