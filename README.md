Bike Service Booking Website
A modern, full-stack web application for booking and managing motorcycle services. This platform connects customers with bike service centers, allowing for seamless appointment scheduling, mechanic and cashier management, and a great user experience.

✨ Key Features
This application provides distinct dashboards and functionalities for different user roles:

👤 Customer Features
Browse Services: View a comprehensive list of available bike services.

Easy Booking: A step-by-step form to book an appointment by selecting services, date, time, location, and a preferred mechanic.

Real-time Availability: See available time slots in real-time to avoid booking conflicts.

Email Confirmation: Receive an automated email confirmation upon successful booking.

🔧 Mechanic Features
Mechanic Dashboard: A dedicated dashboard to view all assigned bookings.

Status Updates: Update the status of a service from "Pending" to "In-Progress" and finally to "Completed".

Service Details: Add notes about parts used during the service before marking it as complete.

💰 Cashier Features
Cashier Dashboard: A dashboard to view all completed services that are pending payment.

Payment Processing: Process payments through various methods (Cash, Card, Online).

Gate Pass Generation: Generate a gate pass once the payment is successfully processed.

🛠️ Tech Stack
Frontend:

Framework: React

Routing: React Router

UI Components: shadcn/ui

Styling: Tailwind CSS

Notifications: Sonner

Build Tool: Vite

Backend:

Serverless Functions: Supabase Edge Functions

API Framework: Hono

Database:

Key-Value Store: Implemented using Supabase Tables.

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18 or later recommended)

npm (usually comes with Node.js)

Installation
Clone the repository:

git clone [https://github.com/your-username/bike-service-booking.git](https://github.com/your-username/bike-service-booking.git)
cd bike-service-booking

Install dependencies:

npm install

Set up Supabase:

Create a project on Supabase.

In your Supabase project, go to the SQL Editor and run the following query to create the key-value store table:

CREATE TABLE kv_store_823312a1 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);

Find your project's URL and anon key in the API settings.

Create a .env file in the root of your project and add your Supabase credentials. You will also need to get your SERVICE_ROLE_KEY.

Run the development server:

npm run dev

The application will be available at http://localhost:3000.

📁 Project Structure
Here is an overview of the key files and directories in the project:

/
├── public/
├── src/
│   ├── components/      # Reusable UI components
│   ├── data/            # Mock data for services, mechanics, etc.
│   ├── pages/           # Main pages for different routes
│   ├── supabase/        # Supabase function configurations
│   ├── styles/          # Global CSS and styles
│   ├── utils/           # Utility functions and Supabase info
│   ├── App.tsx          # Main application component with routing
│   └── main.tsx         # Entry point of the React application
├── .env.example         # Example for environment variables
├── package.json         # Project dependencies and scripts
└── vite.config.ts       # Vite configuration

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🙏 Acknowledgements
Icons by Lucide React.

UI Components inspired by shadcn/ui.
