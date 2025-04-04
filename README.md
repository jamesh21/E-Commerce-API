# eCommerce Website

## Overview
This is a full-stack eCommerce website built using **Node.js, Express, React, and MongoDB/PostgreSQL**. The application allows users to browse products, add items to the cart, and complete purchases using Stripe for payments. The admin panel provides functionality to manage products, users, and orders.

## Features
### User Features
- Browse products with search and filter options
- Add products to the cart and update quantities
- Secure checkout with **Stripe payment integration**
- User authentication with JWT (JSON Web Token)
- Order history and tracking

### Admin Features
- Manage products (Create, Update, Delete)
- Manage users (Promote to admin, deactivate accounts)
- View and update order statuses
- Inventory management with stock checks

## Technologies Used
### Backend
- **Node.js & Express.js** – API development
- **MongoDB / PostgreSQL** – Database storage
- **Mongoose / Sequelize** – ORM/ODM for database interactions
- **Stripe API** – Payment processing
- **JWT Authentication** – Secure user login

### Frontend
- **React.js** – User interface
- **React Context API** – State management
- **Tailwind CSS** – Styling
- **Axios** – API calls

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- MongoDB or PostgreSQL
- Stripe API keys

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/ecommerce.git
   cd ecommerce
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory and add the following:
   ```ini
   PORT=5000
   DB_URI=mongodb+srv://your-database-url
   STRIPE_SECRET_KEY=your-stripe-secret-key
   JWT_SECRET=your-jwt-secret
   ```
4. Start the backend server:
   ```sh
   npm run server
   ```
5. Navigate to the `client` directory and install frontend dependencies:
   ```sh
   cd client
   npm install
   ```
6. Start the frontend:
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/auth/register` – Register new user
- `POST /api/auth/login` – Login user

### Products
- `GET /api/products` – Get all products
- `GET /api/products/:id` – Get product details
- `POST /api/products` – (Admin) Add new product
- `PUT /api/products/:id` – (Admin) Update product
- `DELETE /api/products/:id` – (Admin) Delete product

### Cart
- `POST /api/cart` – Add item to cart
- `GET /api/cart` – Get user's cart
- `DELETE /api/cart/:id` – Remove item from cart

### Orders
- `POST /api/orders` – Place an order
- `GET /api/orders` – Get all user orders
- `GET /api/orders/:id` – Get order details

## Future Enhancements
- Implement wishlist functionality
- Add product reviews and ratings
- Improve search with Elasticsearch
- Multi-language support

## License
This project is licensed under the MIT License. Feel free to contribute or use it as a reference for your own eCommerce projects!

## Contributors
- **Your Name** – Developer
- **Other Contributors** (if any)

## Contact
For any inquiries or contributions, feel free to reach out:
- Email: your.email@example.com
- GitHub: [your-github-profile](https://github.com/your-github-profile)

