# 🌟 IMS - Modern Club Management System

<div align="center">

![IMS Logo](https://www.konectile.com/konectile-logo.png)

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![Material UI](https://img.shields.io/badge/Material%20UI-007FFF.svg)](https://mui.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

_A comprehensive club management system with integrated facilities for sports, entertainment, dining, and events._

[View Demo](https://github.com/konectile/universal-ims) · [Report Bug](https://github.com/konectile/universal-ims/issues) · [Request Feature](https://github.com/konectile/universal-ims/issues)

</div>

---

## 📚 Table of Contents

1. [About IMS](#-about-IMS)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Getting Started](#-getting-started)
5. [Project Structure](#-project-structure)
6. [Core Features](#-core-features)
7. [API Documentation](#-api-documentation)
8. [Deployment](#-deployment)
9. [Contributing](#-contributing)
10. [License](#-license)
11. [Contact](#-contact)

---

## 🎯 About IMS

IMS is a modern, full-featured club management system designed to provide a seamless experience for both club administrators and members. It offers comprehensive facilities management, event scheduling, and member services through an intuitive interface.

### Why IMS?

- **All-in-One Solution**: Manage multiple facilities from a single dashboard
- **Modern Architecture**: Built with the latest web technologies
- **User-Centric Design**: Intuitive interface for both administrators and members
- **Scalable Infrastructure**: Designed to grow with your club's needs

---

## 🚀 Key Features

### 🏊‍♂️ Sports & Recreation

- **Swimming Pool Management**

  - Online booking system
  - Capacity tracking
  - Schedule management
  - Safety guidelines integration

- **Sports Complex**

  - Multi-sport facility booking
  - Equipment management
  - Court/field scheduling
  - Event organization

- **Fitness Center**
  - Membership tracking
  - Equipment maintenance
  - Class scheduling
  - Trainer management

### 🎬 Entertainment

- **Movie Theater**

  - Ticket booking system
  - Movie schedule management
  - Trailer integration
  - Seat selection

- **Events Management**
  - Event calendar
  - Registration system
  - Attendance tracking
  - Feedback collection

### 🍽️ Dining & Social

- **Restaurant System**
  - Menu management
  - Table reservations
  - Order tracking
  - Special event dining

### 📊 Administration

- **Member Management**
  - Profile management
  - Access control
  - Billing integration
  - Communication system

---

## 💻 Tech Stack

### Frontend

- **Framework**: React 18 with Vite
- **UI Library**: Material-UI v5
- **State Management**: React Context API
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Data Visualization**: X-Charts

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **API**: RESTful

### Development Tools

- **Version Control**: Git
- **Code Quality**: ESLint, Prettier
- **Build Tool**: Vite
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

---

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB account
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/konectile/universal-ims
cd IMS
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**
   Create a `.env` file in the root directory:

```env
VITE_APP_API_URL=your_api_url
VITE_APP_MONGODB_URI=your_mongodb_uri
VITE_APP_JWT_SECRET=your_jwt_secret
```

4. **Start Development Server**

```bash
npm run dev
```

5. **Build for Production**

```bash
npm run build
```

---

## 📁 Project Structure

```bash
IMS/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # Reusable UI components
│   ├── Pages/         # Main page components
│   │   └── LandingPage/
│   │       ├── Sports.jsx
│   │       ├── Gym.jsx
│   │       ├── MoviesList.jsx
│   │       └── ...
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── context/       # React context providers
│   └── routes.jsx     # Application routes
├── public/           # Public assets
└── package.json     # Project dependencies
```

---

## 🛠 Core Features

### Authentication System

- JWT-based authentication
- Role-based access control
- Protected routes
- Session management

### Booking System

- Real-time availability checking
- Automated confirmation emails
- Calendar integration
- Payment processing

### Member Management

- Profile management
- Subscription handling
- Activity tracking
- Communication system

---

## 📡 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication

```http
POST /auth/login
POST /auth/register
GET /auth/profile
```

### Facilities

```http
GET /facilities
POST /facilities/book
GET /facilities/{id}
```

### Events

```http
GET /events
POST /events/register
GET /events/{id}
```

---

## 🚀 Deployment

### Vercel Deployment

1. Fork the repository
2. Connect to Vercel
3. Configure environment variables
4. Deploy

### Docker Deployment

```bash
docker build -t IMS .
docker run -p 3000:3000 IMS
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

Konectile - [@konectile](https://github.com/konectile) - support@konectile.com

Project Link: [https://github.com/konectile/IMS](https://github.com/konectile/IMS)

---

<div align="center">

Made with ❤️ by [Konectile](https://github.com/konectile)

</div>
