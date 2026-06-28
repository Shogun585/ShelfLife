# 🏡 ShelfLife

**Try it out at :** __https://shelf-life-alpha.vercel.app//__

**ShelfLife** is a collaborative household management platform designed to track your fridge inventory and reduce food waste. Built with a modern Node.js/React architecture, it features an interactive, physics-based neighborhood UI, robust user authentication, real-time roommate synchronization, and a production-grade CI/CD testing pipeline.

## ✨ Features

* **Interactive Neighborhood:** Navigate your home using a custom, draggable street interface built with Framer Motion, complete with modern frosted-glass overlays. 

* **Household Management:** Create a new apartment or join your roommates using a unique 6-character Invite Code.
* **Collaborative Kitchen:** A shared fridge inventory where roommates can add, filter, and remove grocery items.
* **Smart Waste Reduction:** Automated expiry tracking with visual status indicators (Fresh, Expiring Soon, Expired).
* **Responsive Design:** Optimized for both mobile and desktop using dynamic viewport (`vh` / `vw`) units to ensure a consistent experience across all screen sizes.
* **Secure Auth & Rate Limiting:** JWT-based authentication, password hashing, and React Protected Routes to keep your household data private. API endpoints are protected against brute-force attacks via tailored rate limiters.
* **Automated E2E Testing:** A robust Playwright testing suite that automatically wipes and seeds a dedicated test database to ensure predictable user flows.
* **CI/CD Pipeline:** A "Cloud Gatekeeper" powered by GitHub Actions that automatically boots the environment and runs the test suite on every push to protect the main branch.
* **OpenAPI Documentation:** Fully interactive API documentation using Swagger UI.

## 🛠 Tech Stack

* **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, React Router DOM, React Query.

* **Backend:** Node.js, Express.
* **Database:** MongoDB / Mongoose.
* **Security:** JWT (`jsonwebtoken`), `bcrypt`, `express-rate-limit`.
* **Testing & CI/CD:** GitHub Actions, Playwright, `cross-env`.
* **Documentation:** Swagger UI / `swagger-jsdoc`.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB instances (One for local development, one strictly for testing)

### 1. Setup the Backend
1. Navigate to the backend directory, install dependencies, and configure your environment variables.

    ```bash
    cd backend
    npm install
    ```

2. Create a `.env` file in the `backend/` directory:

    ```bash
    PORT=8000
    MONGO_URI=your_mongodb_connection_string
    SECRET_KEY=your_super_secret_jwt_key
    ```

3. Start the Express server:

    ```bash
    npm start
    ```

### 2. Setup the Frontend
1. Open a new terminal, navigate to the frontend directory, and set up your Vite environment.

    ```bash
    cd frontend
    npm install
    ```

2. Create a `.env` file in the root of the `frontend/` directory:

    ```bash
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
3. Create a `.env.test` file in the root of the `frontend/` directory for Playwright:

    ```bash
    VITE_API_BASE_URL=http://localhost:8000/api
    ```

4. Start the Vite development server:

    ```bash
    npm run dev
    ```
### 3. Running Automated Tests
To run the End-to-End Playwright tests locally without affecting your development data:

1. Open a terminal in the backend and boot it in test mode:

    ```bash
    npm run test:server
    ```
2. Open a terminal in the frontend and run the test suite:

    ```bash
    npx playwright test
    ```

## 🛣️ API Routes & Functionalities

### 🔐 Authentication (`/api/auth`)
* `POST /register` - Registers a new user, hashes their password, and returns a JWT.

* `POST /login` - Authenticates a user and returns a JWT.
* _(Note: Auth routes are protected by a strict 5-minute/7-attempt rate limiter to prevent brute-forcing)._

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
### 🍎 Kitchen Inventory (`/api/items`)
* `GET /` - Fetches all fridge items for the user's household (supports filtering by category and status).

* `POST /` - Adds a new grocery item to the shared fridge.
* `PUT /:id` - Updates an item's details (name, category, quantity, expiration date).
* `PATCH /:id/:status` - Quickly updates the status of an item (e.g., marking it as `used` or `wasted`) to calculate waste scores.
* `DELETE /:id` - Removes an item entirely from the database.

### 🧪 Testing (`/api/testing`)
* `POST /reset-db` - Secure endpoint (only accessible when `NODE_ENV=test`) used by Playwright to wipe and seed the database before test runs.



## 📂 Project Structure

### Frontend (`/frontend`)
* **`src/components/auth/`:** Login forms, Hanging Sign animations, and `ProtectedRoute` wrappers.

* **`src/components/kitchen/`:** Inventory modals, filter controls, and dynamic item rows.
* **`src/components/neighbourhood/`:** The draggable street layout and interactive house elements.
* **`src/pages/`:** Main application views (`AuthPage`, `HouseholdSetup`, `KitchenPage`).
* **`src/lib/`:** Centralized Axios instance with automatic JWT interceptors.
* **`src/data/`:** Custom React hooks (`useInventory`) for API state management.
* **`tests/`:** Playwright E2E configuration and `global-setup.js` for database seeding.


### Backend (`/backend`)
* **`routes/`:** Express routers for `/auth`, `/households`, `/items`, and `/dashboard`.

* **`utils/`:** Helper functions for MongoDB connections, token generation, password hashing, and expiry calculations.

### CI/CD (`/.github`)
* **`wrokflows/`:** Contains `playwright.yml` for automated GitHub Actions deployments.

## 💡 Key Design Decisions

* **Viewport Scaling:** The entire neighborhood layout uses CSS Viewport (`vh`/`vw`) units to maintain perfect aspect ratios and prevent UI breakage across varying devices.

* **Axios Interceptors:** To handle expired sessions gracefully, the global Axios instance automatically attaches JWTs to outgoing requests and catches `401 Unauthorized` errors to force user logouts.
* **Test Environment Segregation:** A strict separation between development and test environments ensures that automated tests run against a safe, isolated MongoDB instance, bypassing rate limiters for rapid execution.
* **Single Page Application (SPA) Routing:** Configured a `vercel.json` rewrite rule to route all traffic back to `index.html`, fixing standard 404 refresh errors on React Router endpoints.

_Built by Abhilash Singh_