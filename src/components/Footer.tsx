import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-white border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-4 text-primary">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@bikeservice.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 9831234567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>123 Bike Street, City, State 110001</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-primary">Quick Links</h3>
            <div className="space-y-2">
              <a href="/" className="block hover:text-primary transition-colors">
                Home
              </a>
              <a href="/#services" className="block hover:text-primary transition-colors">
                Services
              </a>
              <a href="/book" className="block hover:text-primary transition-colors">
                Book Now
              </a>
              <a href="/about" className="block hover:text-primary transition-colors">
                About Us
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-primary">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gray-700 rounded-lg hover:bg-primary transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© 2025 Bike Service | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
