import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Helper function to generate unique IDs
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper function to send confirmation email
async function sendConfirmationEmail(booking: any): Promise<boolean> {
  // Skip if no email provided
  if (!booking.email) {
    console.log(`No email provided for booking ${booking.id}, skipping email confirmation`);
    return true;
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured, skipping email");
    return false;
  }

  try {
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
            .detail-row { margin: 15px 0; padding: 10px; background-color: white; border-radius: 4px; }
            .label { font-weight: bold; color: #dc2626; }
            .value { color: #1a1a1a; margin-left: 10px; }
            .footer { text-align: center; margin-top: 20px; color: #737373; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏍️ Booking Confirmation</h1>
            </div>
            <div class="content">
              <p>Dear <strong>${booking.fullName}</strong>,</p>
              <p>Thank you for choosing our bike service! Your booking has been confirmed.</p>
              
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${booking.id}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Services:</span>
                <span class="value">${booking.service}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${booking.date}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Time Slot:</span>
                <span class="value">${booking.timeSlot}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Location:</span>
                <span class="value">${booking.location}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Assigned Mechanic:</span>
                <span class="value">${booking.mechanic}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Bike Number:</span>
                <span class="value">${booking.bikeNumber}</span>
              </div>
              
              <div class="detail-row">
                <span class="label">Service Type:</span>
                <span class="value">${booking.paymentType === 'paid' ? 'Paid Service' : 'Free Service (Warranty)'}</span>
              </div>
              
              <p style="margin-top: 30px;">Please arrive 10 minutes before your scheduled time. If you need to reschedule, please contact us as soon as possible.</p>
              
              <p>We look forward to serving you!</p>
              
              <div class="footer">
                <p>This is an automated confirmation email. Please do not reply.</p>
                <p>&copy; ${new Date().getFullYear()} Bike Service Center. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bike Service Center <onboarding@resend.dev>",
        to: [booking.email],
        subject: "Your Bike Service Booking Confirmation",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return false;
    }

    const data = await response.json();
    console.log(`Confirmation email sent successfully to ${booking.email}, ID: ${data.id}`);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
}

// Route: Create a new booking
app.post("/make-server-823312a1/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const {
      fullName,
      phone,
      bikeNumber,
      email,
      service,
      date,
      timeSlot,
      location,
      mechanic,
      paymentType,
    } = body;

    // Validate required fields
    if (!fullName || !phone || !bikeNumber || !service || !date || !timeSlot || !location || !mechanic) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // CRITICAL: Check for double-booking BEFORE creating the booking
    // Create a unique slot key for this date/time/location/mechanic combination
    const slotKey = `slot:${date}:${location}:${mechanic}:${timeSlot}`;
    const existingSlot = await kv.get(slotKey);
    
    if (existingSlot) {
      console.log(`Double-booking prevented: ${slotKey} is already taken`);
      return c.json({ 
        error: "This time slot is no longer available. Please select another time.",
        code: "SLOT_ALREADY_BOOKED"
      }, 409); // 409 Conflict
    }

    // Create booking
    const bookingId = generateId("B");
    const booking = {
      id: bookingId,
      fullName,
      phone,
      bikeNumber,
      email,
      service,
      date,
      timeSlot,
      location,
      mechanic,
      paymentType,
      status: "pending",
      partsUsed: "",
      createdAt: new Date().toISOString(),
    };

    // Reserve the slot IMMEDIATELY (atomic operation)
    await kv.set(slotKey, {
      bookingId,
      reservedAt: new Date().toISOString(),
      customer: fullName,
    });

    // Store booking
    await kv.set(`booking:${bookingId}`, booking);

    // Add to all bookings list
    const allBookings = (await kv.get("bookings:all")) || [];
    allBookings.push(bookingId);
    await kv.set("bookings:all", allBookings);

    // Add to mechanic's bookings
    const mechanicBookings = (await kv.get(`mechanic:${mechanic}:bookings`)) || [];
    mechanicBookings.push(bookingId);
    await kv.set(`mechanic:${mechanic}:bookings`, mechanicBookings);

    // Store customer info
    await kv.set(`customer:${phone}`, {
      fullName,
      phone,
      email,
      bikeNumber,
    });

    console.log(`Booking created: ${bookingId} for customer ${fullName}`);

    // Send confirmation email (non-blocking - don't fail the booking if email fails)
    let emailSent = false;
    try {
      emailSent = await sendConfirmationEmail(booking);
    } catch (emailError) {
      console.error("Email sending error (non-critical):", emailError);
    }

    return c.json({ 
      success: true, 
      booking,
      emailSent 
    }, 201);
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ error: "Failed to create booking", details: String(error) }, 500);
  }
});

// Route: Get all bookings
app.get("/make-server-823312a1/bookings", async (c) => {
  try {
    const allBookingIds = (await kv.get("bookings:all")) || [];
    const bookings = await kv.mget(allBookingIds.map((id: string) => `booking:${id}`));
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ error: "Failed to fetch bookings", details: String(error) }, 500);
  }
});

// Route: Check slot availability for a specific date, location, and mechanic
app.get("/make-server-823312a1/bookings/availability", async (c) => {
  try {
    const date = c.req.query("date");
    const location = c.req.query("location");
    const mechanic = c.req.query("mechanic");

    if (!date || !location || !mechanic) {
      return c.json({ error: "Missing required parameters: date, location, mechanic" }, 400);
    }

    // Get all bookings
    const allBookingIds = (await kv.get("bookings:all")) || [];
    const bookings = await kv.mget(allBookingIds.map((id: string) => `booking:${id}`));

    // Filter bookings for the specific date, location, and mechanic
    const bookedSlots = bookings
      .filter((booking: any) => 
        booking && 
        booking.date === date && 
        booking.location === location && 
        booking.mechanic === mechanic &&
        booking.status !== "cancelled"
      )
      .map((booking: any) => booking.timeSlot);

    console.log(`Availability check: ${date}, ${location}, ${mechanic} - ${bookedSlots.length} slots booked`);
    return c.json({ success: true, bookedSlots });
  } catch (error) {
    console.error("Error checking slot availability:", error);
    return c.json({ error: "Failed to check slot availability", details: String(error) }, 500);
  }
});

// Route: Get bookings for a specific mechanic
app.get("/make-server-823312a1/mechanic/:mechanicName/bookings", async (c) => {
  try {
    const mechanicName = c.req.param("mechanicName");
    const mechanicBookingIds = (await kv.get(`mechanic:${mechanicName}:bookings`)) || [];
    
    if (mechanicBookingIds.length === 0) {
      return c.json({ success: true, bookings: [] });
    }

    const bookings = await kv.mget(mechanicBookingIds.map((id: string) => `booking:${id}`));
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching mechanic bookings:", error);
    return c.json({ error: "Failed to fetch mechanic bookings", details: String(error) }, 500);
  }
});

// Route: Update booking status
app.put("/make-server-823312a1/bookings/:id", async (c) => {
  try {
    const bookingId = c.req.param("id");
    const body = await c.req.json();
    const { status, partsUsed } = body;

    // Get existing booking
    const booking = await kv.get(`booking:${bookingId}`);
    if (!booking) {
      return c.json({ error: "Booking not found" }, 404);
    }

    // Update booking
    const updatedBooking = {
      ...booking,
      status,
      partsUsed: partsUsed || booking.partsUsed,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`booking:${bookingId}`, updatedBooking);

    // If cancelled, release the slot
    if (status === "cancelled") {
      const slotKey = `slot:${booking.date}:${booking.location}:${booking.mechanic}:${booking.timeSlot}`;
      await kv.del(slotKey);
      console.log(`Slot released: ${slotKey}`);
    }

    // If completed, create payment record
    if (status === "completed") {
      const paymentId = generateId("P");
      const payment = {
        id: paymentId,
        bookingId,
        customerName: booking.fullName,
        bikeNumber: booking.bikeNumber,
        service: booking.service,
        partsUsed: partsUsed || "",
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
      };

      await kv.set(`payment:${paymentId}`, payment);

      // Add to pending payments
      const pendingPayments = (await kv.get("payments:pending")) || [];
      pendingPayments.push(paymentId);
      await kv.set("payments:pending", pendingPayments);
    }

    console.log(`Booking ${bookingId} updated to status: ${status}`);
    return c.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error updating booking:", error);
    return c.json({ error: "Failed to update booking", details: String(error) }, 500);
  }
});

// Route: Get pending payments for cashier
app.get("/make-server-823312a1/cashier/payments", async (c) => {
  try {
    const pendingPaymentIds = (await kv.get("payments:pending")) || [];
    const allPaymentIds = (await kv.get("payments:all")) || [];

    if (allPaymentIds.length === 0) {
      return c.json({ success: true, payments: [] });
    }

    const payments = await kv.mget(allPaymentIds.map((id: string) => `payment:${id}`));
    
    return c.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return c.json({ error: "Failed to fetch payments", details: String(error) }, 500);
  }
});

// Route: Process payment
app.put("/make-server-823312a1/payments/:id", async (c) => {
  try {
    const paymentId = c.req.param("id");
    const body = await c.req.json();
    const { paymentMethod } = body;

    // Get existing payment
    const payment = await kv.get(`payment:${paymentId}`);
    if (!payment) {
      return c.json({ error: "Payment not found" }, 404);
    }

    // Update payment
    const updatedPayment = {
      ...payment,
      paymentStatus: "paid",
      paymentMethod,
      paidAt: new Date().toISOString(),
    };

    await kv.set(`payment:${paymentId}`, updatedPayment);

    // Remove from pending payments
    const pendingPayments = (await kv.get("payments:pending")) || [];
    const updatedPending = pendingPayments.filter((id: string) => id !== paymentId);
    await kv.set("payments:pending", updatedPending);

    console.log(`Payment ${paymentId} processed via ${paymentMethod}`);
    return c.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error("Error processing payment:", error);
    return c.json({ error: "Failed to process payment", details: String(error) }, 500);
  }
});

// Health check
app.get("/make-server-823312a1/health", (c) => {
  return c.json({ status: "ok", service: "bike-service-api" });
});

Deno.serve(app.fetch);
