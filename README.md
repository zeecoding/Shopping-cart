Secure Online Shopping Mart System

A robust, full-stack e-commerce solution built with Node.js, Express, MongoDB, and Next.js. This project features a secure backend architecture simulating high-level service layers ("DLL" logic), a comprehensive Admin Dashboard with real-time analytics, and a user-facing shopping interface.

🚀 Project Overview

This application is designed with a strong focus on security, modularity, and scalability. It separates the "Business Logic" into a secure Service Layer (replacing traditional DLLs) that is only accessible via authorized Admin API calls.

Key Features

🔐 Backend (Node.js & Express)

Secure Service Layer: Critical CRUD operations are encapsulated in a productService layer, accessible only to authenticated Admins.

Role-Based Access Control (RBAC): Strict differentiation between User and Admin roles using JWT Middleware.

Security Best Practices:

Helmet: Secure HTTP headers.

Rate Limiting: Protection against DDoS/Brute-force attacks.

Input Sanitization: express-validator used on all inputs.

Audit Logging: Tracks sensitive actions (Login attempts, Payment simulations, DLL access) in MongoDB.

Payment Simulation: Simulates Payment Gateway interactions (Credit Card validation) and Cash on Delivery (COD) logic.

Analytics Engine: Aggregation pipelines to calculate KPI metrics, monthly trends, and product performance.

💻 Frontend (Next.js & React)

Admin Dashboard:

Visual Analytics: Interactive charts (Recharts) for Sales Trends, Category Distribution, and Top Products.

Product Management: CRUD interface to manage inventory via the secure backend.

Session Persistence: Robust authentication handling with auto-login on reload.

User Interface:

Product Browsing & Search.

Shopping Cart Management.

Secure Checkout Flow (Card & COD).

🛠 Tech Stack

Component

Technology

Runtime

Node.js

Framework

Express.js

Database

MongoDB (Mongoose ODM)

Frontend

Next.js 14, React, TypeScript

State Mgmt

Redux Toolkit

UI Library

Material UI (MUI)

Security

BCrypt, JWT, Helmet, Express-Rate-Limit

Charts

Recharts

📂 Project Structure

/project-root
│
├── /backend                # Node.js Server
│   ├── /config             # DB Connection
│   ├── /middleware         # Auth, Role, Error handling
│   ├── /models             # Mongoose Schemas (User, Product, Order, Log)
│   ├── /routes             # API Endpoints
│   ├── /services           # Secure Business Logic (DLL Replacement)
│   └── server.js           # Entry point
│
├── /frontend               # Next.js Application
│   ├── /app                # App Router Pages (Login, Dashboard, Products)
│   ├── /components         # Reusable UI Components
│   ├── /store              # Redux State Management
│   └── /hooks              # Custom Hooks (useAuth)
│
└── README.md


⚡ Getting Started

Prerequisites

Node.js (v16 or higher)

MongoDB (Local or Atlas Cluster)

Git

1. Backend Setup

Navigate to the backend directory:

cd backend


Install dependencies:

npm install


Create a .env file in the backend root:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key


Start the server:

npm start
# Server will run on http://localhost:5000


2. Frontend Setup

Navigate to the frontend directory:

cd frontend


Install dependencies:

npm install


Start the development server:

npm run dev
# Client will run on http://localhost:3000


🔑 Authentication Credentials

To test the system, you can use the Sign Up page or create initial users via Postman.

Default Admin Access:

Role: Admin (Access to Dashboard, Analytics, Product CRUD)

Permissions: Can Create/Update/Delete Products.

Default User Access:

Role: User (Access to Shop, Cart, Checkout)

Permissions: Can View Products, Place Orders.

📡 API Documentation

Authentication

POST /api/register - Register a new user/admin.

POST /api/login - Authenticate and receive JWT.

Secure Product Management (Admin Only)

POST /api/products - Add product (Logged).

PUT /api/products/:id - Update product (Logged).

DELETE /api/products/:id - Remove product (Logged).

GET /api/analytics - Fetch Dashboard Data (KPIs, Charts).

Shopping & Order

GET /api/products - List all products.

POST /api/cart - Add item to cart.

POST /api/pay - Simulate Bank Payment Gateway.

POST /api/checkout - Place Order (COD or Card).

🛡 Security Measures Implemented

"DLL" Encapsulation: Critical logic is hidden in services/productService.js and is not directly exposed to the controller without passing through the Admin Middleware.

Audit Logs: A dedicated MongoDB collection (auditlogs) records every administrative action (who changed what and when) and payment attempts.

No-Cache Policy: Dashboard pages utilize SessionProvider to manage state securely, preventing unauthorized access via browser history.

Data Validation: Backend uses strict schema validation; Frontend uses Yup for form validation.

👨‍💻 Contributors

Backend Developer: [Muhammad Zubair]

Frontend Developer: [Aqsa Arif,Kaleem Abbasi]

This project was developed for the Web Development Competition 2025.
