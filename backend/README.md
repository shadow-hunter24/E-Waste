# E-Waste PHP API (XAMPP)

## Prerequisites
- XAMPP installed (Apache + MySQL)
- PHP 8.x recommended

## Install steps
1. Create API directory in XAMPP htdocs
   - Windows: `C:\xampp\htdocs\e-waste-api`
2. Copy backend/public to htdocs
   - Copy the contents of `backend/public/` into `C:\xampp\htdocs\e-waste-api`
3. Create database and tables
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Create database: `e_waste`
   - Import SQL: open the database and import the file at `backend/db/schema.sql`
4. Configure DB credentials
   - Edit `C:\xampp\htdocs\e-waste-api\config.php` if needed to match your MySQL username/password (default is `root` with empty password)
5. Start services
   - In XAMPP Control Panel, start Apache and MySQL
6. Test an endpoint
   - Visit: http://localhost/e-waste-api/waste-types.php
   - You should get a JSON list (after seeding)

## Expo App configuration
- In `services/api.ts` ensure:
  - `API_BASE_URL = 'http://localhost/e-waste-api'`
  - `USE_MOCK_DATA = false`

If you run Expo on a physical device, replace `localhost` with your PC's LAN IP, e.g. `http://192.168.1.10/e-waste-api`.

## Endpoints implemented
- Auth
  - `POST /auth/register.php`
  - `POST /auth/login.php`
  - `POST /auth/forgot-password.php`
- User
  - `GET /user/profile.php`
  - `PUT /user/update.php`
- Waste
  - `GET /waste-types.php`
- Requests
  - `GET /requests/list.php`
  - `POST /requests/create.php`
  - `GET /requests/details.php?id={id}`
  - `PUT /requests/cancel.php?id={id}`
- Payments
  - `GET /payments/history.php`

Auth uses bearer tokens stored in `auth_tokens` table. Passwords are hashed using `password_hash()`.
