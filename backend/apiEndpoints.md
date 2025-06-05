API ENDPOINTS DOCUMENTATION
============================

## AUTHENTICATION ROUTES

### POST /auth/register

- Method: POST
- Body: { name, email, phone, password }
- Description: Register a new user
- Response: User object with JWT token

### POST /auth/login

- Method: POST
- Body: { phone, password }
- Description: Login user
- Response: User object with JWT token

### POST /auth/logout
- Method: POST
- Headers: Authorization: Bearer <token>
- Description: Logout user
- Response: Success message

## ADMIN ROUTES

### POST /admin/promote/:phone/:role

- Method: POST
- Params: phone (string), role (string)
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Promote user to specified role
- Response: Success message

### POST /admin/demote/:phone/:role

- Method: POST
- Params: phone (string), role (string)
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Demote user from specified role
- Response: Success message

## ELIGIBILITY ROUTES

### GET /eligibility

- Method: GET
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify
- Description: Get current user's eligibility status
- Response: { message, eligibility, score }

### PUT /eligibility/allow/:id

- Method: PUT
- Params: id (user ID)
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Allow/approve user eligibility
- Response: { message, eligibility, score }

### PUT /eligibility/block/:id

- Method: PUT
- Params: id (user ID)
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Block/deny user eligibility
- Response: { message, eligibility, score }

## PRODUCT ROUTES

### POST /products

- Method: POST
- Headers: Authorization: Bearer <token>
- Body: { name, description, price, category, stock }
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Create a new product
- Response: { message, product }

### PUT /products/:id

- Method: PUT
- Params: id (product ID)
- Headers: Authorization: Bearer <token>
- Body: { name, description, price, category, stock }
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Update existing product
- Response: { message, product }

### GET /products

- Method: GET
- Description: Get all products (public)
- Response: { message, products }

### DELETE /products/:id

- Method: DELETE
- Params: id (product ID)
- Headers: Authorization: Bearer <token>
- Middleware: tokenVerify, roleMiddleware(["admin"])
- Description: Delete a product
- Response: { message }

## MIDDLEWARE REQUIREMENTS

### tokenVerify

- Required for protected routes
- Validates JWT token from Authorization header
- Adds user data to req.user

### roleMiddleware(roles)

- Requires tokenVerify middleware first
- Validates user has required role(s)
- Example: roleMiddleware(["admin", "manager"])

## COMMON RESPONSE FORMATS

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## HTTP STATUS CODES

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
