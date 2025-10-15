import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, Wrench } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface Booking {
  id: string;
  customerName: string;
  bikeNumber: string;
  service: string;
  dateTime: string;
  status: "pending" | "in-progress" | "completed";
  partsUsed?: string;
}

export function MechanicDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [partsUsed, setPartsUsed] = useState("");
  const [loading, setLoading] = useState(true);
  const [mechanicName] = useState("Ravi Kumar"); // In real app, get from auth

  useEffect(() => {
    fetchBookings();
  }, [mechanicName]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { projectId, publicAnonKey } = await import("../utils/supabase/info");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-823312a1/mechanic/${encodeURIComponent(mechanicName)}/bookings`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.bookings) {
        const formattedBookings = data.bookings.map((b: any) => ({
          id: b.id,
          customerName: b.fullName,
          bikeNumber: b.bikeNumber,
          service: b.service,
          dateTime: `${b.date} - ${b.timeSlot}`,
          status: b.status,
          partsUsed: b.partsUsed,
        }));
        setBookings(formattedBookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStartService = async (id: string) => {
    try {
      const { projectId, publicAnonKey } = await import("../utils/supabase/info");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-823312a1/bookings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ status: "in-progress" }),
        }
      );

      if (response.ok) {
        setBookings(bookings.map(b => 
          b.id === id ? { ...b, status: "in-progress" as const } : b
        ));
        toast.success("Service started");
      } else {
        throw new Error("Failed to update booking");
      }
    } catch (error) {
      console.error("Error starting service:", error);
      toast.error("Failed to start service");
    }
  };

  const handleCompleteService = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      setSelectedBooking(booking);
      setPartsUsed(booking.partsUsed || "");
    }
  };

  const handleGenerateReceipt = async () => {
    if (selectedBooking) {
      try {
        const { projectId, publicAnonKey } = await import("../utils/supabase/info");
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-823312a1/bookings/${selectedBooking.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ 
              status: "completed",
              partsUsed 
            }),
          }
        );

        if (response.ok) {
          setBookings(bookings.map(b => 
            b.id === selectedBooking.id 
              ? { ...b, status: "completed" as const, partsUsed } 
              : b
          ));
          toast.success(`Receipt generated for booking ${selectedBooking.id}`);
          setSelectedBooking(null);
          setPartsUsed("");
        } else {
          throw new Error("Failed to complete booking");
        }
      } catch (error) {
        console.error("Error completing service:", error);
        toast.error("Failed to complete service");
      }
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wrench className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl text-foreground">Mechanic Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {mechanicName}</p>
            </div>
          </div>
          <Button onClick={fetchBookings} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Jobs</CardTitle>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-primary">
                {bookings.filter(b => b.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">In Progress</CardTitle>
              <Wrench className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-blue-600">
                {bookings.filter(b => b.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Completed Today</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">
                {bookings.filter(b => b.status === "completed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Assigned Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Bike Number</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading bookings...
                    </TableCell>
                  </TableRow>
                ) : bookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No bookings assigned yet
                    </TableCell>
                  </TableRow>
                ) : bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.bikeNumber}</TableCell>
                    <TableCell>{booking.service}</TableCell>
                    <TableCell>{booking.dateTime}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {booking.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handleStartService(booking.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Start
                          </Button>
                        )}
                        {booking.status === "in-progress" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => handleCompleteService(booking.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Complete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Complete Service - {booking.id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div>
                                  <p><strong>Customer:</strong> {booking.customerName}</p>
                                  <p><strong>Bike:</strong> {booking.bikeNumber}</p>
                                  <p><strong>Service:</strong> {booking.service}</p>
                                </div>
                                <div>
                                  <Label htmlFor="partsUsed">Parts Used</Label>
                                  <Textarea
                                    id="partsUsed"
                                    placeholder="List all parts used (e.g., Engine Oil - 2L, Oil Filter - 1 unit, Spark Plug - 1 unit)"
                                    value={partsUsed}
                                    onChange={(e) => setPartsUsed(e.target.value)}
                                    rows={5}
                                  />
                                </div>
                                <Button
                                  className="w-full bg-primary hover:bg-red-700"
                                  onClick={handleGenerateReceipt}
                                >
                                  Generate Receipt & Mark Complete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {booking.status === "completed" && (
                          <Badge className="bg-green-600 text-white">Done</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

