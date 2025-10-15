import { Link, useLocation } from "react-router-dom";
import { Settings, Home, Wrench, Calendar, Info, Phone } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Services", path: "/#services", icon: Wrench },
    { name: "Book Now", path: "/book", icon: Calendar },
    { name: "About Us", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Phone },
  ];

  return (
    <header className="bg-secondary border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            <span className="text-white">Bike Service</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 transition-colors ${
                    isActive ? "text-primary" : "text-gray-300 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <Link to="/book">
            <Button className="bg-primary hover:bg-red-700">Book Service</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
