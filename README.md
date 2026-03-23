# 🎬 iMovie - Movie Booking Application

A modern, feature-rich movie ticket booking application built with React and Vite. iMovie allows users to browse movies, book tickets, manage orders, and create wishlists.

## Features

### User Features

- **Movie Browsing**: Explore now-playing and upcoming movies with detailed information
- **Ticket Booking**: Select cinema, date, time, and seats to book movie tickets
- **Seat Selection**: Interactive seat map with real-time availability status
- **Order Management**: View and track all your orders with payment status
- **Payment Processing**: Complete payment with snack/merchandise add-ons
- **Wishlist**: Save favorite movies for later viewing
- **Order Tracking**: Real-time order status updates with countdown timers for payment deadlines

### Admin Features

- **Movie Management**: Add new movies with details (title, genre, duration, synopsis, etc.)
- **Schedule Management**: Create and manage movie schedules across studios
- **Studio Management**: Add cinemas with customizable seat layouts

## Technology Stack

### Frontend Framework

- **React 19.2.4** - UI library
- **React Router 7.13.1** - Client-side routing
- **Vite 7.3.1** - Build tool and dev server

### UI & Styling

- **HeroUI 2.8.10** - Component library
- **Tailwind CSS 4.2.1** - Utility-first CSS framework
- **Tailwind CSS Vite Plugin 4.2.1** - Vite integration

### HTTP & State Management

- **Axios 1.13.6** - HTTP client
- **React Context API** - State management

### Utilities & Libraries

- **React Hot Toast 2.6.0** - Toast notifications
- **React Icons 5.6.0** - Icon library
- **React Player 3.4.0** - Video player
- **Framer Motion 12.36.0** - Animation library
- **Luxon 3.7.2** - DateTime manipulation

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/matthewyn/imovie-client.git
   cd imovie-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_BACKEND_API=<your-backend-api-url>
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**

   ```bash
   npm run preview
   ```

7. **Lint code**
   ```bash
   npm run lint
   ```

## API Integration

The application communicates with a backend API for:

- User authentication (login/signup)
- Movie data and schedules
- Order management
- Wishlist operations
- Studio and schedule management

The API origin is dynamically generated based on environment:

- **Development**: `http://localhost:3000`
- **Production**: Uses `VITE_BACKEND_API` environment variable

## Future Enhancements

### User Experience

- [ ] Advanced movie search and filtering
- [ ] Movie recommendations based on viewing history
- [ ] Email notifications for order status updates
- [ ] Multiple language support (i18n)

### Features

- [ ] User profiles with preferences
- [ ] Movie reviews and ratings system
- [ ] Group booking discounts
- [ ] Gift card functionality
- [ ] Social sharing integration
- [ ] Push notifications

### Payment & Security

- [ ] Multiple payment gateway integration (Stripe, PayPal)
- [ ] E-ticket generation and download

### Admin Features

- [ ] Advanced analytics dashboard
- [ ] Revenue reports
- [ ] Customer management system
- [ ] Promotional campaigns management
