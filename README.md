# eCommerce Website

## Overview
This is a full-stack eCommerce website built using **Node.js, Express, React, and PostgreSQL**. The application allows users to browse products, add items to the cart, and complete purchases using Stripe for payments. The admin panel provides functionality to manage products, users, and orders.

## Features
### User Features
- Browse through products
- Add products to the cart and update quantities
- Secure checkout with **Stripe payment integration**
- User authentication with JWT (JSON Web Token)

### Admin Features
- Manage products (Create, Update, Delete)
- Manage users (Promote to admin)
- Inventory management with stock checks

## Technologies Used
### Backend
- **Node.js & Express.js** – API development
- **PostgreSQL** – Database storage
- **Stripe API** – Payment processing
- **JWT Authentication** – Secure user login

### Frontend
- **React.js** – User interface
- **React Bootstrap** – Styling
- **Axios** – API calls

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js (>= 16.x)
- PostgreSQL
- Stripe API keys 
- Stripe CLI (Used for triggering events to test webhook integration locally)

### Steps to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/jamesh21/E-CommerceApp.git
   cd E-CommerceApp
   ```
2. Install dependencies for front end:
   ```sh
   cd E-Commerce-Frontend
   npm install
   ```
3. Install dependencies for back end:
   ```sh
   cd E-Commerce-Backend
   npm install
   ```
4. Configure environment variables:

   - Create a `.env` file in the E-Commerce-Frontend folder and add the following:
   ```ini
    REACT_APP_API_URL=http://localhost:4000/api/v1 (set this on your backend port)
   ```

   - Create a `.env` file in the E-Commerce-Backend folder and add the following:
   ```ini
    PORT=4000
    DB_USER=your-local-postgres-db-username
    DB_HOST=your-local-postgres-db-host
    DB_NAME=your-local-postgres-db-name
    DB_PASSWORD=your-local-postgres-pw
    DB_PORT=your-local-postgres-port
    JWT_SECRET=your-jwt-secret
    JWT_LIFETIME=your-jwt-lifetime
    STRIPE_SECRET_KEY=your-stripe-secret-key    
    STRIPE_SUCCESS_URL=http://localhost:3000/success (set this on your frontend port, defaults to localhost:3000)
    STRIPE_CANCEL_URL=http://localhost:3000/cart (set this on your frontend port, defaults to localhost:3000)
   ```

5. Start Postgres server locally
    ```sh
    psql -h your-local-postgres-db-host -U your-local-postgres-db-username -d your-local-postgres-db-name
    ```

6. Run DB Script (An inital user must be created in the db with admin priviledge, since you will need to be an admin to update roles)
    - Navigate to E-Commerce-Backend
    - Run db.sql to generate postgres tables

7. Start Stripe CLI: (This is necessary for stripe to confirm payment has gone through, so our webhook can update order status and deduct product inventory)
    - Login to Stripe, browser will open to ask for credentials.
    - Have stripe forward events to your local node server.
    ```sh
    stripe login
    stripe listen --forward-to localhost:4000/api/v1/checkout/webhook
    ```

8. Navigate to `E-Commerce-Backend` directory and Start the backend server:
   ```sh
   npm start
   ```
9. Navigate to the `E-Commerce-Frontend` directory and Start the frontend:
   ```sh
   npm start
   ```

## API Endpoints
### Authentication
- `POST /api/v1/auth/register` – Register new user
- `POST /api/v1/auth/login` – Login user


### Products (must be logged in and include bearer token, besides get all products)
- `GET /api/v1/product` – Get all products
- `GET /api/v1/product/:id` – Get product details
- `POST /api/v1/product` – (Admin) Add new product
- `PUT /api/v1/product/:id` – (Admin) Update product
- `DELETE /api/v1/product/:id` – (Admin) Delete product

### Cart (must be logged in and include bearer token)
- `POST /api/v1/cart` – Add item to cart
- `GET /api/v1/cart` – Get user's cart
- `DELETE /api/v1/cart/:id` – Remove item from cart
- 'PATCH api/v1/cart/:id` – Update quantity of cart item
- `DELETE /api/v1/cart/` – Remove all items from cart

### Orders (must be logged in and include bearer token)
- `POST /api/v1/orders` – Place an order


## Future Enhancements
- Add search and filter options with elastic search.
- Add guest checkout
- Implement wishlist functionality
- Add product reviews and ratings


## License
This project is licensed under the MIT License. Feel free to contribute or use it as a reference for your own eCommerce projects!

## Contributors
- *James Ho* – Developer


## Contact
For any inquiries or contributions, feel free to reach out:
- GitHub: [jamesh21](https://github.com/jamesh21)

## Credit
This project idea is from [roadmap.sh](https://roadmap.sh/projects/ecommerce-api)