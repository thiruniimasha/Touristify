# 🗺️ Touristify - Local Tour & Travel Web Guide

Touristify is a modern, high-performance mobile-first web application designed to enhance the travel experience for tourists exploring Sri Lanka. Built with a focus on seamless user experience, real-time metrics, and clean aesthetics, the platform serves as an interactive digital pocket guide that bridges the gap between travelers and their next destination.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** React.js (Vite)
*   **Styling & Layout:** Tailwind CSS
*   **Navigation & Routing:** React Router DOM (v6)
*   **Data Fetching:** Native Fetch API (Asynchronous HTTP Requests)
*   **Icons:** Lucide Icons
*   **Client-Side Storage:** LocalStorage Web API

---

## 🚀 Key Features Implemented

*   **📱 Mobile-First Responsive Layout:** Architected with a premium, sleek minimalist aesthetic tailored strictly for mobile viewports, featuring fluid typography and optimized 48x48px interactive touch targets.
*   **🔐 Dynamic User Onboarding:** Includes a client-side validation ecosystem for user profile names along with a validated email address or a valid 10-digit Sri Lankan mobile number (`07xxxxxxxx`) check.
*   **🌐 Live Cloud REST API Mapping:** Integrated with an external cloud-hosted REST API (via MockAPI) to asynchronously load data arrays dynamically over secure HTTP networks, featuring responsive loading spinners and try-catch exception fallbacks.
*   **📍 HTML5 Geolocation Integration:** Leverages the native device Geolocation API alongside the mathematical **Haversine Formula** to compute real-time great-circle distances (in Km) from the user's current coordinates to the attraction site.
*   **🔗 Deep-Linking & Navigation:** Provides a one-tap deep-link routing structure directly to Google Maps using dynamic latitude/longitude parameters for flawless cross-platform turn-by-turn navigation.
*   **❤️ State-Driven Favorites System:** Features a lightweight bookmarking engine backed by LocalStorage persistence, allowing users to save, remove, and manage favorite destinations in real time.
*   **🔍 Resilient Empty States:** Custom contextual fallback layouts designed to handle search query mismatches and empty favorites list arrays gracefully, prompting intuitive user redirection.
*   **🖼️ Rich Media Experience:** Enhanced detailed page views containing comprehensive long descriptions and horizontally scrollable media sub-galleries with cross-origin image-error fallbacks.

---

## 💻 Local Deployment Instructions

1.  **Clone the repository and install dependencies:**
```bash
    npm install
```

2.  **Start the local development environment:**
```bash
    npm run dev
```

3.  **Open the application:**
    Copy the local URL displayed in your terminal (typically `http://localhost:5173`) and view it inside your web browser.

---

## ⚙️ Browser Optimization Notes

*   **📱 Mobile Emulation:** Open Google Chrome Developer Tools (`F12`), toggle the **Device Toolbar**, and select a standard mobile viewport size (e.g., iPhone or Pixel presets) to view the native-like responsive UI.
*   **🌍 Geolocation Simulation:** To test live distance sorting from different locations, utilize the Chrome DevTools **Sensors** tab to mock various global latitude and longitude coordinates.
*   **⚠️ Image Fallbacks:** Built-in error boundaries will auto-render stylized gradient cards if Unsplash assets suffer cross-origin network throttles.

---

## 🎓 Academic & Grading Context

> **Note:** This application was developed as a part of the academic coursework evaluation for **SENG 41293: Mobile Web Application Development** at the **University of Kelaniya**. It satisfies all fundamental architecture guidelines, including SPA routing structure, explicit component decomposition, asynchronous client-server APIs, data persistence, and verified mobile-first UX layout parameters.

---

## ✍️ Author

*   **👤 Hiruni Imasha**
*   *🚀 Software Engineering Undergraduate*
