# API Endpoints Documentation

## 🔐 Authentication Routes

### Register New User
```http
POST /auth/register
```
**Request Body:**
```json
{
  "name": "string",
  "email": "string", 
  "phone": "string",
  "password": "string"
}
```
**Response:** User object with JWT token

---

### User Login
```http
POST /auth/login
```
**Request Body:**
```json
{
  "phone": "string",
  "password": "string"
}
```
**Response:** User object with JWT token

---

### User Logout
```http
POST /auth/logout
```
**Headers:**
```
Authorization: Bearer <token>
```
**Response:** Success message

---

## 👨‍💼 Admin Routes

### Promote User Role
```http
POST /admin/promote/:phone/:role
```
**Parameters:**
- `phone` (string) - User's phone number
- `role` (string) - Role to assign

**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:** Success message

---

### Demote User Role
```http
POST /admin/demote/:phone/:role
```
**Parameters:**
- `phone` (string) - User's phone number
- `role` (string) - Role to remove

**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:** Success message

---

## ✅ Eligibility Routes

### Get User Eligibility Status
```http
GET /eligibility
```
**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`

**Response:**
```json
{
  "message": "string",
  "eligibility": "boolean",
  "score": "number"
}
```

---

### Approve User Eligibility
```http
PUT /eligibility/allow/:id
```
**Parameters:**
- `id` (string) - User ID

**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:**
```json
{
  "message": "string",
  "eligibility": "boolean", 
  "score": "number"
}
```

---

### Block User Eligibility
```http
PUT /eligibility/block/:id
```
**Parameters:**
- `id` (string) - User ID

**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:**
```json
{
  "message": "string",
  "eligibility": "boolean",
  "score": "number"
}
```

---

## 📦 Product Routes

### Create New Product
```http
POST /products
```
**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number"
}
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:**
```json
{
  "message": "string",
  "product": { ... }
}
```

---

### Update Product
```http
PUT /products/:id
```
**Parameters:**
- `id` (string) - Product ID

**Headers:**
```
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "name": "string",
  "description": "string", 
  "price": "number",
  "category": "string",
  "stock": "number"
}
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:**
```json
{
  "message": "string",
  "product": { ... }
}
```

---

### Get All Products
```http
GET /products
```
**Public endpoint** - No authentication required

**Response:**
```json
{
  "message": "string",
  "products": [ ... ]
}
```

---

### Delete Product
```http
DELETE /products/:id
```
**Parameters:**
- `id` (string) - Product ID

**Headers:**
```
Authorization: Bearer <token>
```
**Middleware:** `tokenVerify`, `roleMiddleware(["admin"])`

**Response:**
```json
{
  "message": "string"
}
```

---

## 🛡️ Middleware Requirements

### `tokenVerify`
- **Purpose:** Validates JWT token from Authorization header
- **Usage:** Required for all protected routes
- **Effect:** Adds user data to `req.user`

### `roleMiddleware(roles)`
- **Purpose:** Validates user has required role(s)
- **Prerequisite:** Requires `tokenVerify` middleware first
- **Example:** `roleMiddleware(["admin", "manager"])`

---

## 📋 Response Formats

### ✅ Success Response
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### ❌ Error Response
```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

---

## 🔢 HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | OK | Request successful |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request data |
| `401` | Unauthorized | Authentication required |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `500` | Internal Server Error | Server error occurred |