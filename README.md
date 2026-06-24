# Touristify - Local Tour & Travel Web Guide

## Module
SENG 41293 - Mobile Web Application Development (University of Kelaniya)

## Tech Stack
- React.js (Vite)
- Tailwind CSS
- React Router DOM (v6)
- Native Fetch API
- Lucide Icons
- LocalStorage Web API

## Key Features Implemented
- Mobile-first layout with premium minimalist styling and 48x48px touch targets.
- Onboarding validation for name plus email or Sri Lankan mobile number.
- LocalStorage-backed user profile persistence under `tourist_user`.
- Mock REST API integration with asynchronous data fetching from `public/data/attractions.json`.
- Detailed attraction view with HTML5 Geolocation API and Haversine distance calculation.
- Deep-linking to Google Maps with one-tap navigation.
- Bookmark favorites stored in LocalStorage with responsive favorites management.
- Empty state screens for search misses and empty favorites.
- Rich media gallery support and clean details layout.

## Local Deployment Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the local URL shown in the terminal in your browser.

## Browser Optimization Notes
- Test in Chrome Developer Tools using the Device Toolbar for mobile viewport simulation.
- Verify smooth responsive behavior at small widths and ensure no console errors during navigation.
- Confirm the Google Maps deep-link opens in a new tab and location distance permissions are handled gracefully.
