# E-commerce Online Shopping Platform

## Overview

This project is a complete **E-commerce platform** developed using **Node.js, Express, and MongoDB**. The platform supports user authentication, product browsing, shopping cart management, and secure payment through Stripe. Administrators can manage products and orders, while customers can browse, shop, and manage their orders and more.

## Features

- **User Authentication & Authorization**

  - JWT-based login, signup, and password reset with email verification.
  - Role-based access control (admin, user).
  - User address management.
  - Admin panel for managing users and products

- **Product & Cart Management**

  - Admins can add, edit, and remove products.
  - Users can manage their cart, and view product details.
  - Reviews for products.

- **Cart and Orders**

  - Users can add items to their cart, apply discounts, calculate taxes, and complete purchases through Stripe.
  - Card and Cash Orders.
  - Wishlist functionality.
  - Shopping cart with coupon application.
  - Order management (create, read, update, delete).

- **Checkout & Payment**

  - Secure payment processing via Stripe.
  - Integrated tax, shipping, and order tracking.

- **Security**

  - Data sanitization, XSS protection.
  - Rate limiting to prevent brute-force attacks.

- **Performance & Optimization**

  - Response compression for faster load times.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/goudaabdulhmid2/E-commerce-online-shopping.git
   ```

2. Navigate to the project directory:

   ```bash
   cd E-commerce-online-shopping
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables

You need to set up environment variables for the application to work properly. Create a `.env` file in the root directory and configure it as follows:

```bash
NODE_ENV=development
PORT=3000
DATABASE=<your-mongodb-url>
DATABASE_PASSWORD=<your-mongodb-password>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
EMAIL_USERNAME=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
```

## Running the Project

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

- **For a full list of API routes**: [API Documentation](https://documenter.getpostman.com/view/33661317/2sAXxS7qxZ).

## Security & Middleware

- **Rate Limiting**: Protects against brute-force attacks on authentication routes.
- **Data Sanitization**: Removes malicious input data to prevent injection attacks.
- **XSS Protection**: Filters out potentially harmful scripts.

## Technologies Used

- **Node.js**: Backend runtime.
- **Express.js**: Web framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **Stripe API**: For handling secure payments.
- **JWT**: For user authentication.
- **Rate Limit**: To protect against brute force attacks.
- **Multer**: For image storage and management.
- **Nodemailer**: For sending emails to users (e.g., registration, password reset).
