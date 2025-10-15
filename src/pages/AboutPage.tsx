import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Settings, Users, Award, Clock } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1623220988124-bcd1bad9a408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwc2VydmljZXxlbnwxfHx8fDE3NjAzNTU1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl mb-4 text-white">About Bike Service</h1>
          <p className="text-xl text-gray-200">Your trusted partner in bike care</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Company Story */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl mb-6 text-center text-foreground">Our Story</h2>
          <p className="text-lg text-muted-foreground text-center leading-relaxed">
            Founded in 2010, Bike Service has been providing exceptional motorcycle maintenance 
            and repair services for over 15 years. With a team of certified mechanics and 
            state-of-the-art equipment, we ensure your bike receives the best care possible. 
            Our commitment to quality, reliability, and customer satisfaction has made us the 
            preferred choice for thousands of bike owners.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-4xl mb-12 text-center text-foreground">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Expert Service</h3>
                <p className="text-muted-foreground">
                  Certified mechanics with years of experience
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Fast Turnaround</h3>
                <p className="text-muted-foreground">
                  Quick service without compromising quality
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Quality Parts</h3>
                <p className="text-muted-foreground">
                  Only genuine and premium quality spare parts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 text-foreground">Customer Focus</h3>
                <p className="text-muted-foreground">
                  Dedicated support and transparent pricing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-secondary text-white rounded-lg p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl mb-2 text-primary">15+</div>
              <div className="text-lg text-gray-300">Years Experience</div>
            </div>
            <div>
              <div className="text-5xl mb-2 text-primary">10,000+</div>
              <div className="text-lg text-gray-300">Happy Customers</div>
            </div>
            <div>
              <div className="text-5xl mb-2 text-primary">25+</div>
              <div className="text-lg text-gray-300">Expert Mechanics</div>
            </div>
            <div>
              <div className="text-5xl mb-2 text-primary">4</div>
              <div className="text-lg text-gray-300">Service Centers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
