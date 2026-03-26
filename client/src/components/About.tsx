import { Card, CardContent } from "./ui/card";
import { CheckCircle2 } from "lucide-react";
import logoUrl from "@assets/M3B_Realty_3D_logo1_1772507923825.jpeg";
import ceoImageUrl from "@assets/Brendon_in_suit_1772591990434.png";

export default function About() {
  const benefits = [
    "Expert Local Knowledge of Davao City",
    "Comprehensive Property Listings",
    "Personalized Client Service",
    "Trusted Negotiation Support",
  ];

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 space-y-24">
        {/* Company Overview */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 bg-yellow/10 rounded-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <Card className="relative border-0 shadow-2xl overflow-hidden rounded-2xl bg-white">
              <CardContent className="p-12 flex justify-center items-center h-full min-h-[400px]">
                <img 
                  src={logoUrl} 
                  alt="M3B Realty Logo" 
                  className="w-full max-w-[400px] object-contain drop-shadow-xl" 
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col space-y-6 order-1 lg:order-2">
            <div>
              <h2 className="text-sm font-bold text-red tracking-wider uppercase mb-2 font-heading">About Us</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-navy font-heading leading-tight">
                Building Trust Through Real Estate Excellence
              </h3>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed font-sans">
              M3B Realty is a premier real estate company based in the heart of Davao City. We are dedicated to connecting families, individuals, and investors with properties that match their visions for the future. 
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed font-sans">
              With a deep understanding of the local market and a commitment to integrity, we simplify the buying and selling process, ensuring a seamless experience from start to finish.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="text-yellow h-6 w-6 flex-shrink-0" />
                  <span className="font-medium text-navy/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CEO Profile */}
        <div className="grid lg:grid-cols-2 gap-12 items-center pt-12 border-t border-border/50">
          <div className="flex flex-col space-y-6">
            <div>
              <h2 className="text-sm font-bold text-red tracking-wider uppercase mb-2 font-heading">Leadership</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-navy font-heading leading-tight">
                Brendon C. Rojas, REB
              </h3>
              <p className="text-xl font-medium text-navy/80 mt-2 font-heading">Chief Executive Officer</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed font-sans">
                As a distinguished Real Estate Broker with a robust half-decade of licensed practice and a comprehensive ten-year tenure navigating the intricate dynamics of the real estate sector, Brendon brings unparalleled strategic oversight and market acumen to M3B Realty. His extensive background ensures that our clientele receives premier advisory services grounded in empirical market data and proven negotiation methodologies.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed font-sans">
                Beyond his executive leadership in property brokerage, Brendon serves as a dedicated educator within the School of Real Estate Management, demonstrating his commitment to elevating industry standards and cultivating the next generation of real estate professionals. This pedagogical role, augmented by his substantive expertise as an Information Technology professional, empowers our firm to integrate cutting-edge technological solutions with traditional real estate practices, optimizing operational efficiency and client satisfaction across all our portfolios.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-navy/5 rounded-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500"></div>
            <Card className="relative border-0 shadow-xl overflow-hidden rounded-2xl">
              <img 
                src={ceoImageUrl} 
                alt="Brendon C. Rojas, REB - CEO of M3B Realty" 
                className="w-full h-[500px] object-cover object-top"
              />
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
}
