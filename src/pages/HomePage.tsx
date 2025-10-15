import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { services } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1549636367-13c144c47063?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2FyYWdlJTIwd29ya3Nob3B8ZW58MXx8fHwxNzYwMzU1NTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Bike Service Workshop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl mb-4 text-white">
            Fast, Reliable & Professional<br />Bike Servicing
          </h1>
          <p className="text-xl mb-8 text-gray-200">
            Expert care for your motorcycle with state-of-the-art equipment
          </p>
          <Link to="/book">
            <Button size="lg" className="bg-primary hover:bg-red-700 text-lg px-8 py-6">
              Book Your Service Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4 text-foreground">Our Services</h2>
            <p className="text-muted-foreground">
              Choose from our comprehensive range of bike servicing options
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.id}
                  className="hover:shadow-xl transition-shadow duration-300 cursor-pointer border-2 hover:border-primary"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="mb-2 text-foreground">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      <Link to={`/book?service=${service.id}`} className="w-full">
                        <Button className="w-full bg-primary hover:bg-red-700">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center mb-12 text-white">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="mb-2 text-white">Fast Service</h3>
              <p className="text-gray-300">
                Quick turnaround without compromising quality
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">👨‍🔧</span>
              </div>
              <h3 className="mb-2 text-white">Expert Mechanics</h3>
              <p className="text-gray-300">
                Certified professionals with years of experience
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="mb-2 text-white">Affordable Pricing</h3>
              <p className="text-gray-300">
                Transparent pricing with no hidden costs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
