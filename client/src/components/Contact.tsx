import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-navy relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-red/10 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-yellow/10 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-yellow tracking-wider uppercase mb-2 font-heading">Get In Touch</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white font-heading">
            Contact M3B Realty
          </h3>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto font-sans">
            Ready to find your next home or have questions about a property? Our team is here to assist you every step of the way.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-white/10 border-white/10 backdrop-blur-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-red/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-red" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Office Address</h4>
                  <p className="text-white/70 leading-relaxed text-sm">
                    Door 14, 2nd floor, Tolentino 2020<br />
                    Candelaria St. Ecoland<br />
                    Davao City, Philippines
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/10 backdrop-blur-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-yellow/20 rounded-lg">
                  <Phone className="w-6 h-6 text-yellow" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Phone</h4>
                  <p className="text-white/70 text-sm">
                    Smart: 0920 946 8365
                  </p>
                  <p className="text-white/70 text-sm">
                    Globe: 0917 165 8566
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/10 backdrop-blur-md">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 bg-blue-400/20 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Email</h4>
                  <p className="text-white/70 text-sm break-all">
                    m3brealtyhub.com
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl">
              <CardContent className="p-8">
                <h4 className="text-2xl font-bold text-navy mb-6 font-heading text-center">Connect With Us</h4>
                <div className="flex flex-col gap-4">
                  <Button asChild className="w-full h-14 text-lg bg-[#1877F2] hover:bg-[#1877F2]/90 text-white flex items-center justify-center gap-3">
                    <a href="https://www.facebook.com/m3brealtypropertymanagement" target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-6 h-6" />
                      Visit our Facebook Page
                    </a>
                  </Button>
                  
                  <Button asChild className="w-full h-14 text-lg bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] hover:opacity-90 text-white flex items-center justify-center gap-3 border-0">
                    <a href="https://www.instagram.com/m3brealty/" target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-6 h-6" />
                      Visit our Instagram Page
                    </a>
                  </Button>
                  
                  <Button asChild className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#25D366]/90 text-white flex items-center justify-center gap-3">
                    <a href="https://api.whatsapp.com/send?phone=639209468365" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-6 h-6" />
                      Message us on WhatsApp (+63 920 946 8365)
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Location Map */}
        <div className="mt-16 w-full h-[400px] rounded-xl overflow-hidden shadow-2xl relative z-10 border border-white/10">
          <iframe 
            src="https://maps.google.com/maps?q=Tolentino%202020,%20Candelaria%20St.%20Ecoland,%20Davao%20City,%20Philippines&t=&z=16&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="M3B Realty Location"
          />
        </div>
      </div>
    </section>
  );
}
