# 🏍️ Bike Service Booking Website

A modern, **full-stack web application** for booking and managing motorcycle services.  
This platform connects customers with service centers for **seamless appointment scheduling**, **mechanic and cashier management**, and a **smooth user experience**.

![GitHub Repo stars](https://img.shields.io/github/stars/Tomgit473/Bike-Service?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Tomgit473/Bike-Service?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Tomgit473/Bike-Service?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Built with React](https://img.shields.io/badge/Built%20with-React-blue)

---

## 📚 Table of Contents
1. [✨ Features](#-features)
2. [🛠️ Tech Stack](#️-tech-stack)
3. [🚀 Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Setup](#environment-setup)
   - [Running the App](#running-the-app)
4. [📁 Project Structure](#-project-structure)
5. [🤝 Contributing](#-contributing)
6. [📄 License](#-license)
7. [🙏 Acknowledgements](#-acknowledgements)

---

## ✨ Features

- 🧾 **Browse Services:** View a complete list of available bike services.  
- 📅 **Easy Booking:** Book appointments by selecting service type, date, time, location, and mechanic.  
- ⚡ **Real-Time Availability:** Instantly view available time slots.  
- 📧 **Email Confirmation:** Receive automatic confirmation upon booking.    

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React (with Vite)
- 🧭 React Router
- 🎨 Tailwind CSS
- 🧩 shadcn/ui
- 🔔 Sonner (notifications)

**Backend**
- 🪶 Hono (API framework)
- ☁️ Supabase Edge Functions

**Database**
- 🗃️ Supabase Tables (Key-Value Store)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.  

### ✅ Prerequisites
- **Node.js** (v18 or later)  
- **npm** (comes with Node.js)

---

### 🧩 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/Tomgit473/Bike-Service.git
cd bike-service-booking

# Install dependencies
npm install
\`\`\`

---

### ⚙️ Environment Setup

1. **Create a Supabase project** at [https://supabase.com](https://supabase.com).  
2. In **SQL Editor**, run:
   \`\`\`sql
   CREATE TABLE kv_store_823312a1 (
       key TEXT NOT NULL PRIMARY KEY,
       value JSONB NOT NULL
   );
   \`\`\`
3. Obtain your **API URL**, **anon key**, and **SERVICE_ROLE_KEY** from the **Supabase settings**.  
4. Create a `.env` file in the root directory and add:
   \`\`\`bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_SERVICE_ROLE_KEY=your_service_role_key
   \`\`\`

---

### ▶️ Running the App

\`\`\`bash
npm run dev
\`\`\`

Visit **http://localhost:3000** to access the app.

---

## 📁 Project Structure

\`\`\`
/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── data/           # Mock data for services, mechanics, etc.
│   ├── pages/          # Application routes
│   ├── supabase/       # Supabase function configs
│   ├── styles/         # Global CSS
│   ├── utils/          # Helper functions and configs
│   ├── App.tsx         # Main application entry
│   └── main.tsx        # Vite entry file
├── .env.example         # Example environment variables
├── package.json         # Dependencies and scripts
└── vite.config.ts       # Build configuration
\`\`\`

---

## 🤝 Contributing

Contributions are welcome!  
If you’d like to improve this project, please follow these steps:

1. **Fork** the repository  
2. **Create a new branch:** \`git checkout -b feature/your-feature-name\`  
3. **Commit your changes:** \`git commit -m "Add new feature"\`  
4. **Push to your branch:** \`git push origin feature/your-feature-name\`  
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE.md) file for details.

---

## 🙏 Acknowledgements

- 🎨 UI Components inspired by [shadcn/ui](https://ui.shadcn.com)  
- 🧩 Icons by [Lucide React](https://lucide.dev)  
- ⚙️ Built with ❤️ using React + Supabase  
