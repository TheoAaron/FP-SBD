# Thunder Client - Coupon API with Auth

## 1. Login Admin (Get JWT Token)
Method: POST
URL: http://localhost:3001/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response: Copy the "token" value for next requests

## 2. Create Coupon with Auth
Method: POST
URL: http://localhost:3001/api/admin/coupon
Headers:
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN_HERE

Body:
{
  "kode_kupon": "DISKON30",
  "expired_at": "2025-12-31T23:59:59",
  "status": "active",
  "diskon": 30
}

## 3. Get All Coupons with Auth
Method: GET
URL: http://localhost:3001/api/admin/coupon
Headers:
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 4. Get Coupon by ID with Auth
Method: GET
URL: http://localhost:3001/api/admin/coupon/COUPON_ID_HERE
Headers:
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## 5. Delete Coupon with Auth
Method: DELETE
URL: http://localhost:3001/api/admin/coupon/COUPON_ID_HERE
Headers:
Authorization: Bearer YOUR_JWT_TOKEN_HERE

## Error Tests

### Test without token (401)
Method: GET
URL: http://localhost:3001/api/admin/coupon
Headers: (no Authorization header)

### Test with invalid token (401)
Method: GET
URL: http://localhost:3001/api/admin/coupon
Headers:
Authorization: Bearer invalid_token_here

### Test with user token (403) - if you have user login
Method: GET
URL: http://localhost:3001/api/admin/coupon
Headers:
Authorization: Bearer USER_JWT_TOKEN_HERE
