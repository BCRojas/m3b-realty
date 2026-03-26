import { Card, CardContent } from "./ui/card";
import { MapPin, Bed, Bath, SquareSquare } from "lucide-react";
import house1 from "../assets/images/house_1.jpg";
import house2 from "../assets/images/house_2.jpg";
import house3 from "../assets/images/house_3.jpg";
import { Button } from "./ui/button";

const properties = [
  {
    id: 1,
    title: "Modern Minimalist Villa",
    price: "₱ 12,500,000",
    address: "Ecoland, Davao City",
    beds: 4,
    baths: 3,
    sqm: 250,
    image: house1,
    status: "For Sale"
  },
  {
    id: 2,
    title: "Luxury Condominium",
    price: "₱ 8,200,000",
    address: "Bajada, Davao City",
    beds: 2,
    baths: 2,
    sqm: 110,
    image: house2,
    status: "For Sale"
  },
  {
    id: 3,
    title: "Spacious Family Home",
    price: "₱ 15,000,000",
    address: "Matina, Davao City",
    beds: 5,
    baths: 4,
    sqm: 320,
    image: house3,
    status: "Just Listed"
  }
];

export default function FeaturedProperties() {
  return (
    <section id="properties" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-red tracking-wider uppercase mb-2 font-heading">Discover</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-navy font-heading">
            Featured Properties
          </h3>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto font-sans">
            Explore our handpicked selection of premium properties available in Davao's most sought-after neighborhoods.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Card key={property.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-card">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-yellow text-navy font-bold px-3 py-1 rounded-sm text-sm">
                  {property.status}
                </div>
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-60" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-2xl font-bold font-heading">{property.price}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h4 className="text-xl font-bold text-navy mb-2 line-clamp-1 font-heading group-hover:text-red transition-colors">
                  {property.title}
                </h4>
                <div className="flex items-center text-muted-foreground mb-4 font-sans text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-red" />
                  {property.address}
                </div>
                
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-border/50">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Bed className="h-5 w-5 text-navy/70" />
                    <span className="text-sm font-medium">{property.beds} Beds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-border/50">
                    <Bath className="h-5 w-5 text-navy/70" />
                    <span className="text-sm font-medium">{property.baths} Baths</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <SquareSquare className="h-5 w-5 text-navy/70" />
                    <span className="text-sm font-medium">{property.sqm} sqm</span>
                  </div>
                </div>
                <Button className="w-full mt-4 bg-navy hover:bg-navy/90 text-white group-hover:bg-red transition-colors">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
