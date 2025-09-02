# Qwipo Customer Management App

This is a **full-stack CRUD application** for managing customers and their multiple addresses, built with **React (Vite), Node.js (Express.js), and SQLite**.
The application demonstrates complete CRUD functionality, advanced filtering, and responsive design. It also includes **automated tests** for both backend (Jest + Supertest) and frontend (Vitest + React Testing Library).

- **Live Demo URL:** `https://customer-management-qwipo.vercel.app`
- **GitHub Repository:** `https://github.com/your-username/qwipo-customer-management`

---

## ✨ Features Implemented

### Core CRUD Operations

- ✅ **Create Customer:** A comprehensive form with client-side and server-side validation for all fields.
- ✅ **Read Customers:** A paginated and filterable list of all customers.
- ✅ **View Customer Details:** A detailed view for each customer, including their associated addresses.
- ✅ **Update Customer:** Edit customer's first name, last name, and phone number.
- ✅ **Delete Customer:** Permanently delete a customer and all their associated addresses with a confirmation step.
- ✅ **Address Management:** Full CRUD functionality for multiple addresses linked to a customer.

### Advanced Functionality

- ✅ **Powerful Filtering:** Search and filter customers by **City**, **State**, or **Pincode**.

- ✅ **Sorting:** Sort the customer list by first name in ascending or descending order.

- ✅ **Pagination:** A simple and intuitive pagination system to navigate through the customer list.

- ✅ **Clear Filters:** A one-click button to reset all search filters and view the complete customer list.

- ✅ **Special Reports:**

  - Dedicated page to view all customers with **Only One Address**.
  - Dedicated page to view all customers with **Multiple Addresses**.

- ✅ **Input Validation:** Robust validation on both the client (React Hook Form & Zod) and server (Express middleware & `validator.js`).

- ✅ **User Feedback:** Interactive toast notifications for success and error messages.

- ✅ **Responsive Design:** The UI is fully responsive and optimized for a seamless experience on desktops, tablets, and mobile devices.

- ✅ **Error Handling:** A centralized error handling system on the backend ensures consistent and informative error responses.

---

## Backend Documentation (Server)

The server is a Node.js application using the Express.js framework to provide a RESTful API for the frontend.

### Tech Stack

- **Node.js & Express.js:** Core backend framework.
- **SQLite3:** File-based database for data storage.
- **Helmet:** For securing HTTP headers.
- **CORS:** To handle cross-origin requests.
- **Dotenv:** To manage environment variables.
- **Validator.js:** For robust server-side data validation.

### API Routes

#### Customers

- **POST** `/api/customers` → Create new customer
- **GET** `/api/customers` → List all customers (with search, filter, pagination)
- **GET** `/api/customers/:customerId` → Get details of one customer
- **PUT** `/api/customers/:customerId` → Update a customer
- **DELETE** `/api/customers/:customerId` → Delete a customer
- **GET** `/api/customers/one-address/list` → Customers with only one address
- **GET** `/api/customers/multiple-address/list` → Customers with multiple addresses

#### Addresses

- **POST** `/api/addresses/:customerId` → Add new address for customer
- **GET** `/api/addresses/:customerId` → List all addresses for a customer
- **GET** `/api/addresses/details/:addressId` → Get one address by ID
- **PUT** `/api/addresses/:addressId` → Update an address
- **DELETE** `/api/addresses/:addressId` → Delete an address

### Local Setup

1. **Navigate to the server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an environment file:**
   Create a `.env` file in the `server` directory and add the following variables.

   ```env
   # The port the server will run on
   PORT=5000

   # The frontend URL that is allowed to make requests
   ALLOWED_ORIGIN=http://localhost:3000

   # The path to the SQLite database file
   NODE_ENV=development
   ```

   > Tests automatically use `database.test.sqlite` when `NODE_ENV=test`.

4. **Seed the database (Optional but Recommended):**

   ```bash
   npm run seed
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

---

## Frontend Documentation (Client)

The client is a single-page application built with React, providing a dynamic and interactive user interface.

### Tech Stack

- **React JS (Vite):** For building the user interface.
- **React Router:** For client-side routing and navigation.
- **TanStack Query (React Query):** For efficient data fetching, caching, and server state management.
- **Axios:** For making API requests to the backend.
- **React Hook Form & Zod:** For powerful form management and schema-based validation.
- **Tailwind CSS & DaisyUI:** For styling the application.

### Local Setup

1. **Navigate to the client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create an environment file:**
   Create a `.env.local` file in the `client` directory and add the following variable.

   ```env
   # The base URL of the backend API
   VITE_API_BASE_URL=http://localhost:5000
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

---

## 🧪 Testing

### Backend (Jest + Supertest)

Tests live in `/server/tests/`:

```bash
cd server
npm test
```

- `customer.test.js` → covers customer CRUD & filters
- `address.test.js` → covers address CRUD

---
