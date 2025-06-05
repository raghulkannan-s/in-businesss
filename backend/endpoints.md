# API ENDPOINTS OVERVIEW

## AUTHENTICATION

- `POST /auth/register` - Register new user (body: name, email, phone, password)
- `POST /auth/login` - Login user (body: phone, password)
- `POST /auth/logout` - Logout user (requires: token)

## ADMIN

- `POST /admin/promote/:phone/:role` - Promote user (requires: token, admin role)
- `POST /admin/demote/:phone/:role` - Demote user (requires: token, admin role)

## ELIGIBILITY

- `GET /eligibility` - Get user eligibility status (requires: token)
- `PUT /eligibility/allow/:id` - Allow user eligibility (requires: token, admin role)
- `PUT /eligibility/block/:id` - Block user eligibility (requires: token, admin role)

## PRODUCTS

- `POST /products` - Create product (requires: token, admin role, body: name, description, price, category, stock)
- `PUT /products/:id` - Update product (requires: token, admin role, body: name, description, price, category, stock)
- `GET /products` - Get all products (public)
- `DELETE /products/:id` - Delete product (requires: token, admin role)

---
**Legend:**

- `token` = Authorization: Bearer <token>
- `admin role` = User must have admin privileges
- `body` = Request body parameters
- `:param` = URL parameters
