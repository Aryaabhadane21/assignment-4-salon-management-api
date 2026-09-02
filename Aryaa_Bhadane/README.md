# Salon Management API

A RESTful API built with **Node.js**, **Express.js**, **Supabase** (PostgreSQL), **JWT Authentication**, and **Bcrypt**.

---

## 📌 Features

- **User Authentication**: Secure user registration and login with bcrypt password hashing and JWT authorization.
- **Salon Management**: Full CRUD capabilities for salon profiles (name, city, address, rating).
- **Service Management**: Full CRUD capabilities for services associated with specific salons.
- **Bonus Operations**:
  - `GET /salons/top`: Retrieve top 5 salons sorted by rating.
  - `GET /salons/city/:city`: Filter salons by city.
  - `GET /services/available`: Retrieve available services (`isAvailable = true`).
- **Middleware Integration**:
  - Request logging middleware (logs HTTP method, path, and timestamp).
  - JWT verification middleware for protected endpoints.
  - Centralized error-handling middleware.

---

## 🛠️ Project Structure

```text
Salon Management API/
├── config/
│   └── supabaseClient.js       # Supabase client initialization
├── controllers/
│   ├── authController.js       # Register and login controllers
│   ├── salonController.js      # Salon CRUD & query controllers
│   └── serviceController.js    # Service CRUD & query controllers
├── middleware/
│   ├── authMiddleware.js       # JWT validation middleware
│   ├── errorHandler.js         # Centralized error handler
│   └── logger.js               # HTTP request logger
├── models/
│   ├── salonModel.js           # Supabase database operations for salons
│   ├── serviceModel.js         # Supabase database operations for services
│   └── userModel.js            # Supabase database operations for users
├── routes/
│   ├── authRoutes.js           # Authentication routes
│   ├── salonRoutes.js          # Salon & nested service routes
│   └── serviceRoutes.js        # Standalone service routes
├── .env.example                # Example environment variable setup
├── .gitignore                  # Ignored files and folders
├── package.json                # Dependencies and scripts
├── README.md                   # Setup guide and API documentation
├── schema.sql                  # Database schema SQL script
├── server.js                   # Server entry point
└── Salon_Management_API.postman_collection.json  # Postman collection export
```

---

## 🗄️ Database Setup (Supabase)

1. Sign up/Log in at [Supabase](https://supabase.com/).
2. Create a new Supabase project.
3. Open the **SQL Editor** in your Supabase dashboard.
4. Copy and execute the raw SQL from `schema.sql`:

```sql
-- 1. Salons table
CREATE TABLE IF NOT EXISTS salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  rating NUMERIC DEFAULT 0
);

-- 2. Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "salonId" UUID NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  "serviceName" TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration TEXT,
  "isAvailable" BOOLEAN DEFAULT true
);

-- 3. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
```

5. Go to **Project Settings** > **API** in Supabase to obtain:
   - **Project URL** (`SUPABASE_URL`)
   - **anon / public key** (`SUPABASE_KEY`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

---

## 🚀 Running the Server Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```
   Or run in development mode (Node 18+ auto-reload):
   ```bash
   npm run dev
   ```

3. Server starts at `http://localhost:3000`.

---

## 🔑 Authentication Flow

1. Register a user (`POST /register`).
2. Log in with the registered credentials (`POST /login`) to receive a JWT token.
3. Pass the token in the `Authorization` header for protected endpoints:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```

---

## 📖 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Welcome message | ❌ No |
| `POST` | `/register` | Register a new user | ❌ No |
| `POST` | `/login` | Authenticate user & generate JWT | ❌ No |
| `GET` | `/salons` | Get all salons | ❌ No |
| `GET` | `/salons/top` | Get top 5 rated salons | ❌ No |
| `GET` | `/salons/city/:city` | Get salons filtered by city | ❌ No |
| `GET` | `/salons/:id` | Get salon by ID | ❌ No |
| `POST` | `/salons` | Create a new salon | ✅ Yes |
| `PUT` | `/salons/:id` | Update salon details | ✅ Yes |
| `DELETE` | `/salons/:id` | Delete a salon | ✅ Yes |
| `GET` | `/salons/:id/services` | Get all services of a salon | ❌ No |
| `POST` | `/salons/:id/services` | Add service to a salon | ✅ Yes |
| `GET` | `/services/available` | Get all available services | ❌ No |
| `PUT` | `/services/:id` | Update service details | ✅ Yes |
| `DELETE` | `/services/:id` | Delete service | ✅ Yes |

---

## 📝 Example Requests & Responses

### 1. Register User (`POST /register`)
- **Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "e8d69784-0a37-4d92-bf39-2a947df3fb41",
      "username": "johndoe",
      "email": "john@example.com"
    }
  }
  ```

### 2. Login User (`POST /login`)
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### 3. Add New Salon (`POST /salons`) — Protected
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "Glamour Cuts",
    "city": "New York",
    "address": "123 Fashion Ave",
    "rating": 4.8
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "name": "Glamour Cuts",
    "city": "New York",
    "address": "123 Fashion Ave",
    "rating": 4.8
  }
  ```

### 4. Add Service to Salon (`POST /salons/:id/services`) — Protected
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "serviceName": "Haircut & Styling",
    "price": 45.00,
    "duration": "40 min",
    "isAvailable": true
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "f8e7d6c5-b4a3-2109-8765-43210fedcba9",
    "salonId": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
    "serviceName": "Haircut & Styling",
    "price": 45,
    "duration": "40 min",
    "isAvailable": true
  }
  ```

---

## 🧪 Postman Collection

Import `Salon_Management_API.postman_collection.json` into Postman to test all endpoints.
- Collection variables: `baseUrl`, `token`, `salonId`, `serviceId`.
- Authorization is configured as Bearer Token using `{{token}}`.


Deployment Link: https://restaurant-management-api-h5qs.onrender.com/
