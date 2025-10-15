import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Banknote, CheckCircle, Printer, Wrench } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  bookingId: string;
  customerName: string;
  bikeNumber: string;
  service: string;
  partsUsed: string;
  paymentStatus: "pending" | "paid";
}

export function CashierPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { projectId, publicAnonKey } = await import("../utils/supabase/info");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-823312a1/cashier/payments`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.payments) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async () => {
    if (selectedPayment) {
      try {
        const { projectId, publicAnonKey } = await import("../utils/supabase/info");
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-823312a1/payments/${selectedPayment.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({ paymentMethod }),
          }
        );

        if (response.ok) {
          setPayments(payments.map(p => 
            p.id === selectedPayment.id 
              ? { ...p, paymentStatus: "paid" as const } 
              : p
          ));
          toast.success(`Payment received via ${paymentMethod}`);
          handleGenerateGatePass(selectedPayment);
          setSelectedPayment(null);
        } else {
          throw new Error("Failed to process payment");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("Failed to process payment");
      }
    }
  };

  const handleGenerateGatePass = (payment: Payment) => {
    toast.success(`Gate pass generated for ${payment.customerName}`);
    console.log("Gate Pass:", {
      bookingId: payment.bookingId,
      customerName: payment.customerName,
      bikeNumber: payment.bikeNumber,
      exitTime: new Date().toLocaleString(),
    });
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wrench className="w-10 h-10 text-primary" />
            <h1 className="text-4xl text-foreground">Cashier Dashboard</h1>
          </div>
          <Button onClick={fetchPayments} variant="outline">
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Pending Payments</CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-primary">
                {payments.filter(p => p.paymentStatus === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                transactions pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm">Completed Today</CardTitle>
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-green-600">
                {payments.filter(p => p.paymentStatus === "paid").length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                transactions completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Payment Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Bike Number</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Parts Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading payments...
                    </TableCell>
                  </TableRow>
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No payments pending
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.bookingId}</TableCell>
                      <TableCell>{payment.customerName}</TableCell>
                      <TableCell>{payment.bikeNumber}</TableCell>
                      <TableCell>{payment.service}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {payment.partsUsed}
                      </TableCell>
                      <TableCell>
                        {payment.paymentStatus === "pending" ? (
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            Pending
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800"
                          >
                            Paid
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.paymentStatus === "pending" ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => setSelectedPayment(payment)}
                                className="bg-primary hover:bg-red-700"
                              >
                                Process Payment
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Process Payment - {payment.id}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6 py-4">
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Customer:</span>
                                    <span>{payment.customerName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Bike:</span>
                                    <span>{payment.bikeNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Service:</span>
                                    <span>{payment.service}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Parts Used:</span>
                                    <span className="max-w-[200px] text-right">
                                      {payment.partsUsed}
                                    </span>
                                  </div>
                                </div>

                                <div>
                                  <Label>Payment Method</Label>
                                  <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="cash" id="cash" />
                                      <Label
                                        htmlFor="cash"
                                        className="flex cursor-pointer items-center gap-2"
                                      >
                                        <Banknote className="h-4 w-4" />
                                        Cash Payment
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="card" id="card" />
                                      <Label
                                        htmlFor="card"
                                        className="flex cursor-pointer items-center gap-2"
                                      >
                                        <CreditCard className="h-4 w-4" />
                                        Card Payment
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem
                                        value="online"
                                        id="online"
                                      />
                                      <Label
                                        htmlFor="online"
                                        className="flex cursor-pointer items-center gap-2"
                                      >
                                        <CheckCircle className="h-4 w-4" />
                                        Online Payment
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    className="flex-1 bg-primary hover:bg-red-700"
                                    onClick={handleProcessPayment}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm Payment
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                      toast.success("Receipt printed");
                                    }}
                                  >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Receipt
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateGatePass(payment)}
                          >
                            <Printer className="mr-2 h-4 w-4" />
                            Print Gate Pass
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

