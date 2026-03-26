import { Link } from "wouter";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import logoUrl from "@assets/M3B_Realty_3D_logo1_1772507923825.jpeg";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "#about", label: "About Us" },
    { href: "#properties", label: "Properties" },
    { href: "#marketing-team", label: "The Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/">
          <span className="flex items-center gap-2 cursor-pointer">
            <img src={logoUrl} alt="M3B Realty Logo" className="h-16 w-auto object-contain" />
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-navy transition-colors font-heading"
            >
              {link.label}
            </a>
          ))}
          <Button className="bg-red hover:bg-red/90 text-white font-heading">
            <a href="#contact">Get in Touch</a>
          </Button>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-navy" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col gap-6 pt-12">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground/80 hover:text-navy font-heading"
                >
                  {link.label}
                </a>
              ))}
              <Button className="w-full bg-red hover:bg-red/90 text-white mt-4 font-heading" asChild>
                <a href="#contact" onClick={() => setIsOpen(false)}>Get in Touch</a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
