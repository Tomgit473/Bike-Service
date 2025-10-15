import {
  Wrench,
  Zap,
  Bike,
  Battery,
  Cog,
  Package,
  Shield,
  Droplets,
  CircleDot,
  Gauge,
  Cable,
  Droplet,
} from "lucide-react";

export const services = [
  {
    id: "1",
    name: "General Service",
    description: "Complete bike checkup and maintenance",
    icon: Wrench,
  },
  {
    id: "2",
    name: "Custom Service",
    description: "Tailored service for your specific needs",
    icon: Zap,
  },
  {
    id: "3",
    name: "Bike Custom",
    description: "Customization and modifications",
    icon: Bike,
  },
  {
    id: "4",
    name: "Batteries",
    description: "Battery check and replacement",
    icon: Battery,
  },
  {
    id: "5",
    name: "Engine Works",
    description: "Engine repair and tuning",
    icon: Cog,
  },
  {
    id: "6",
    name: "Spare Parts",
    description: "Genuine spare parts installation",
    icon: Package,
  },
  {
    id: "7",
    name: "Maintenance",
    description: "Regular maintenance service",
    icon: Shield,
  },
  {
    id: "8",
    name: "Foam Wash",
    description: "Deep cleaning and foam wash",
    icon: Droplets,
  },
  {
    id: "9",
    name: "Tyre & Wheel",
    description: "Tyre replacement and wheel alignment",
    icon: CircleDot,
  },
  {
    id: "10",
    name: "Mileage Tuning",
    description: "Improve fuel efficiency",
    icon: Gauge,
  },
  {
    id: "11",
    name: "Electrical Check",
    description: "Complete electrical system check",
    icon: Cable,
  },
  {
    id: "12",
    name: "Oil Change",
    description: "Engine oil change and filter replacement",
    icon: Droplet,
  },
];

export const showrooms = [
  { id: "1", name: "Main Service Center", address: "Mumbai Naka", contact: "1800-001" },
  { id: "2", name: "Westside Workshop", address: "Meri-Mhasrul", contact: "1800-002" },
  { id: "3", name: "Eastside Garage", address: "Adgaon", contact: "1800-003" },
  { id: "4", name: "Central Workshop", address: "Mahatma Nagar", contact: "1800-004" },
];

export const mechanics = {
  "1": [
    { id: "1", name: "Ravi Kumar", specialization: "Engine Specialist" },
    { id: "2", name: "Suresh Patel", specialization: "General Service" },
  ],
  "2": [
    { id: "3", name: "Amit Singh", specialization: "General Service" },
    { id: "4", name: "Anil Mehta", specialization: "Customization" },
  ],
  "3": [
    { id: "5", name: "Deepak Rao", specialization: "Engine Specialist" },
    { id: "6", name: "Priya Sharma", specialization: "General Service" },
  ],
  "4": [
    { id: "7", name: "Akash Gupta", specialization: "Tyre & Wheel" },
    { id: "8", name: "Ashish Reddy", specialization: "General Service" },
  ],
};

export const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];
