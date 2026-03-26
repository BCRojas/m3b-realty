import { useEffect } from "react";
import { Facebook, Instagram, Twitter, Users } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import logoUrl from "@assets/M3B_Realty_3D_logo1_1772507923825.jpeg";

export default function Footer() {
  const queryClient = useQueryClient();

  const { data } = useQuery<{ count: number }>({
    queryKey: ["/api/visitors"],
    queryFn: async () => {
      const res = await fetch("/api/visitors");
      if (!res.ok) throw new Error("Failed to fetch visitor count");
      return res.json();
    },
  });

  const incrementMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/visitors/increment", { method: "POST" });
      if (!res.ok) throw new Error("Failed to increment");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visitors"] });
    },
  });

  useEffect(() => {
    const visited = sessionStorage.getItem("m3b_visited");
    if (!visited) {
      incrementMutation.mutate();
      sessionStorage.setItem("m3b_visited", "true");
    }
  }, []);

  const visitorCount = data?.count ?? 0;

  return (
    <footer className="bg-navy pt-16 pb-8 border-t border-white/10 text-white/80">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <div className="bg-white p-2 rounded-lg inline-block mb-6">
              <img src={logoUrl} alt="M3B Realty Logo" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed mb-6 font-sans">
              Your trusted partner in discovering the perfect property in Davao City. We are committed to excellence, integrity, and client satisfaction.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-yellow transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-yellow transition-colors">About Us</a></li>
              <li><a href="#properties" className="hover:text-yellow transition-colors">Properties</a></li>
              <li><a href="#contact" className="hover:text-yellow transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading uppercase text-sm tracking-wider">Services</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-yellow transition-colors">Property Sales</a></li>
              <li><a href="#" className="hover:text-yellow transition-colors">Property Management</a></li>
              <li><a href="#" className="hover:text-yellow transition-colors">Real Estate Consulting</a></li>
              <li><a href="#" className="hover:text-yellow transition-colors">Market Analysis</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 font-heading uppercase text-sm tracking-wider">Visitor Counter</h4>
            <p className="text-sm mb-4">Number of users who have visited our website.</p>
            <div className="bg-white/10 border border-white/20 p-4 rounded-md inline-flex items-center gap-4">
              <div className="p-2 bg-yellow/20 rounded-full">
                <Users className="text-yellow w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white tracking-widest font-heading" data-testid="text-visitor-count">
                  {visitorCount.toLocaleString()}
                </span>
                <span className="text-xs text-white/70 uppercase tracking-wider">Total Visitors</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} M3B Realty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
