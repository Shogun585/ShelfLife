# 🏡 ShelfLife

**ShelfLife** is a collaborative household management platform designed to track your fridge inventory and reduce food waste. Built with a modern Node.js/React architecture, it features an interactive, physics-based neighborhood UI, robust user authentication, and real-time roommate synchronization.

## ✨ Features

* **Interactive Neighborhood:** Navigate your home using a custom, draggable street interface built with Framer Motion. 
* **Household Management:** Create a new apartment or join your roommates using a unique 6-character Invite Code.
* **Collaborative Kitchen:** A shared fridge inventory where roommates can add, filter, and remove grocery items.
* **Smart Waste Reduction:** Automated expiry tracking with visual status indicators (Fresh, Expiring Soon, Expired).
* **Responsive Design:** Optimized for both mobile and desktop using dynamic viewport (`vh` / `vw`) units to ensure a consistent experience across all screen sizes.
* **Secure Auth:** JWT-based authentication, password hashing, and React Protected Routes to keep your household data private.
* **OpenAPI Documentation:** Fully interactive API documentation using Swagger UI.

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, React Router DOM.
* **Backend:** Node.js, Express.
* **Database:** MongoDB / Mongoose.
* **Security:** JWT (JSON Web Tokens), bcrypt.
* **Documentation:** Swagger UI / `swagger-jsdoc`.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB instance (local or Atlas)

### 1. Setup the Backend
Navigate to the backend directory, install dependencies, and configure your environment variables.

```bash
cd backend
npm install
```

Create a .env file in the backend/ directory:

```bash
PORT=8000
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_super_secret_jwt_key
```

Start the Express server:

```bash
npm start
```

### 2. Setup the Frontend
Open a new terminal, navigate to the frontend directory, and set up your Vite environment.

```bash
cd frontend
npm install
```

Create a .env file in the root of the frontend/ directory:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

Start the Vite development server:

```bash
npm run dev
```

## 🛣️ API Routes & Functionalities

### 🔐 Authentication (`/api/auth`)
* `POST /register` - Registers a new user, hashes their password, and returns a JWT.
* `POST /login` - Authenticates a user and returns a JWT.

### 🏠 Households (`/api/households`)
* `POST /` - Creates a new household apartment and generates a 6-character invite code.
* `POST /join` - Links a user to an existing household using an invite code.
* `GET /me` - Fetches the current user's household details, including the shareable invite code.
* `GET /:id/members` - Retrieves a list of all roommates in the specified household.

### 🍎 Kitchen Inventory (`/api/items`)
* `GET /` - Fetches all fridge items for the user's household (supports filtering by category and status).
* `POST /` - Adds a new grocery item to the shared fridge.
* `PUT /:id` - Updates an item's details (name, category, quantity, expiration date).
* `PATCH /:id/:status` - Quickly updates the status of an item (e.g., marking it as `used` or `wasted`) to calculate waste scores.
* `DELETE /:id` - Removes an item entirely from the database.

### 📊 Dashboard & Stats (`/api/dashboard`)
* `GET /stats` - Calculates and returns the household's overall "Waste Score" alongside item status counts.
* `GET /expiring` - Retrieves a list of items that will expire within the next 24 hours.



## 📂 Project Structure

### Frontend (`/src`)
* **`components/auth/`:** Login forms, Hanging Sign animations, and `ProtectedRoute` wrappers.
* **`components/kitchen/`:** Inventory modals, filter controls, and dynamic item rows.
* **`components/neighbourhood/`:** The draggable street layout and interactive house elements.
* **`pages/`:** Main application views (`AuthPage`, `HouseholdSetup`, `KitchenPage`).
* **`lib/`:** Centralized Axios instance with automatic JWT interceptors.
* **`data/`:** Custom React hooks (`useInventory`) for API state management.

### Backend (`/backend`)
* **`routes/`:** Express routers for `/auth`, `/households`, `/items`, and `/dashboard`.
* **`utils/`:** Helper functions for MongoDB connections, token generation, password hashing, and expiry calculations.

## 💡 Key Design Decisions

* **Viewport Scaling:** The entire neighborhood layout uses CSS Viewport (`vh`/`vw`) units to maintain perfect aspect ratios and prevent UI breakage across varying devices.
* **Axios Interceptors:** To handle expired sessions gracefully, the global Axios instance automatically attaches JWTs to outgoing requests and catches `401 Unauthorized` errors to force user logouts.
* **Household "Catch-22" Resolution:** A dedicated setup routing flow ensures users cannot access the shared fridge until they have explicitly created or joined a household.

_Built by Abhilash Singh_