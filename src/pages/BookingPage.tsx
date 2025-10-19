import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { services, showrooms, mechanics, timeSlots } from "../data/mockData";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";

// Securely get credentials from environment variables
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const apiBaseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-823312a1`;


export function BookingPage() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");

  const [selectedServices, setSelectedServices] = useState<string[]>(serviceId ? [serviceId] : []);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bikeNumber, setBikeNumber] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");
  const [location, setLocation] = useState("");
  const [mechanic, setMechanic] = useState("");
  const [paymentType, setPaymentType] = useState("paid");
  const [availableMechanics, setAvailableMechanics] = useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    if (location && mechanics[location as keyof typeof mechanics]) {
      setAvailableMechanics(mechanics[location as keyof typeof mechanics]);
      setMechanic("");
    } else {
      setAvailableMechanics([]);
    }
  }, [location]);

  // Fetch booked slots when date, location, or mechanic changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!date || !location || !mechanic) {
        setBookedSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      try {
        const formattedDate = format(date, "PPP");
        const selectedShowroom = showrooms.find(s => s.id === location);
        const selectedMechanic = availableMechanics.find(m => m.id === mechanic);
        
        const response = await fetch(
          `${apiBaseUrl}/bookings/availability?date=${encodeURIComponent(formattedDate)}&location=${encodeURIComponent(selectedShowroom?.name || "")}&mechanic=${encodeURIComponent(selectedMechanic?.name || "")}`,
          {
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`,
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setBookedSlots(data.bookedSlots || []);
        }
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [date, location, mechanic, availableMechanics]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(id => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(id => id !== serviceId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0 || !fullName || !phone || !bikeNumber || !date || !timeSlot || !location || !mechanic) {
      toast.error("Please fill in all required fields and select at least one service");
      return;
    }

    // Check if selected slot is already booked
    if (bookedSlots.includes(timeSlot)) {
      toast.error("This time slot is already booked. Please select another time.");
      return;
    }

    const selectedServiceNames = selectedServices
      .map(id => services.find(s => s.id === id)?.name)
      .filter(Boolean);
    
    const selectedShowroom = showrooms.find(s => s.id === location);
    const selectedMechanic = availableMechanics.find(m => m.id === mechanic);
    
    const booking = {
      service: selectedServiceNames.join(", "),
      fullName,
      phone,
      bikeNumber,
      email,
      date: format(date, "PPP"),
      timeSlot,
      location: selectedShowroom?.name,
      mechanic: selectedMechanic?.name,
      paymentType,
    };

    try {
      const response = await fetch(
        `${apiBaseUrl}/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(booking),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      console.log("Booking submitted:", data.booking);
      toast.success("Booking confirmed! We'll send you a confirmation email shortly.");
      
      // Reset form
      setSelectedServices([]);
      setFullName("");
      setPhone("");
      setBikeNumber("");
      setEmail("");
      setDate(undefined);
      setTimeSlot("");
      setLocation("");
      setMechanic("");
      setPaymentType("paid");
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl mb-8 text-center text-foreground">Book Your Service</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Services List */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-foreground">Select Services</CardTitle>
                <p className="text-sm text-muted-foreground">Choose one or more services</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {services.map((service) => {
                    const Icon = service.icon;
                    const isSelected = selectedServices.includes(service.id);
                    
                    return (
                      <div
                        key={service.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleServiceToggle(service.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{service.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Booking Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Booking Details</CardTitle>
                {selectedServices.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedServices.map(serviceId => {
                      const service = services.find(s => s.id === serviceId);
                      if (!service) return null;
                      const Icon = service.icon;
                      return (
                        <Badge key={serviceId} variant="secondary" className="pl-2 pr-1 py-1">
                          <Icon className="w-3 h-3 mr-1" />
                          {service.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveService(serviceId)}
                            className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div>
                    <h3 className="mb-4 text-foreground">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g., 9876543210"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="bikeNumber">Bike Number *</Label>
                        <Input
                          id="bikeNumber"
                          value={bikeNumber}
                          onChange={(e) => setBikeNumber(e.target.value)}
                          placeholder="e.g., MH 15 AB 1234"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Date and Time Selection */}
                  <div>
                    <h3 className="mb-4 text-foreground">Appointment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Select Date *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="flex h-10 w-full items-center justify-start rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              disabled={(checkDate) => checkDate < today}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="timeSlot">Select Time Slot *</Label>
                        <Select value={timeSlot} onValueChange={setTimeSlot} disabled={isLoadingSlots}>
                          <SelectTrigger id="timeSlot">
                            <SelectValue placeholder={isLoadingSlots ? "Loading available slots..." : "Choose time"} />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((slot) => {
                              const isBooked = bookedSlots.includes(slot);
                              return (
                                <SelectItem 
                                  key={slot} 
                                  value={slot}
                                  disabled={isBooked}
                                >
                                  {slot} {isBooked ? "(Booked)" : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        {date && location && mechanic && bookedSlots.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {bookedSlots.length} slot{bookedSlots.length !== 1 ? 's' : ''} already booked
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location and Mechanic Selection */}
                  <div>
                    <h3 className="mb-4 text-foreground">Service Location</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Showroom Location *</Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger id="location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {showrooms.map((showroom) => (
                              <SelectItem key={showroom.id} value={showroom.id}>
                                {showroom.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="mechanic">Select Mechanic *</Label>
                        <Select
                          value={mechanic}
                          onValueChange={setMechanic}
                          disabled={!location}
                        >
                          <SelectTrigger id="mechanic">
                            <SelectValue placeholder={location ? "Choose mechanic" : "Select location first"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMechanics.map((mech) => (
                              <SelectItem key={mech.id} value={mech.id}>
                                {mech.name} - {mech.specialization}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div>
                    <Label>Service Type *</Label>
                    <RadioGroup value={paymentType} onValueChange={setPaymentType} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paid" id="paid" />
                        <Label htmlFor="paid" className="cursor-pointer">Paid Service</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="free" id="free" />
                        <Label htmlFor="free" className="cursor-pointer">Free Service (Warranty)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-red-700"
                    size="lg"
                    disabled={selectedServices.length === 0}
                  >
                    Confirm Booking ({selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''})
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

