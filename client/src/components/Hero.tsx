import { Button } from "./ui/button";
import heroImg from "../assets/images/hero.jpg";

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="absolute inset-0 bg-navy/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 to-transparent" />
      </div>
      <div className="container relative z-10 mx-auto px-4 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <span className="inline-block py-1 px-3 rounded-full bg-yellow/20 text-yellow font-bold tracking-wider uppercase mb-6 font-heading border border-yellow/30 text-[18px]">
          Welcome to M3B Realty
        </span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mb-6 leading-tight drop-shadow-lg">
          Find Your Dream Home in <span className="text-yellow"> Davao Region </span>
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-sans font-light drop-shadow-md">
          Your trusted partner in Real Estate. We provide expert guidance to help you discover the perfect property that fits your lifestyle and investment goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button size="lg" className="bg-red hover:bg-red/90 text-white text-lg px-8 h-14 rounded-sm font-heading shadow-lg shadow-red/20 transition-all hover:-translate-y-1">
            <a href="#properties">Explore Properties</a>
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-lg px-8 h-14 rounded-sm font-heading backdrop-blur-sm transition-all hover:-translate-y-1">
            <a href="#contact">Contact Us</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
