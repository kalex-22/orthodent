# Angelica C. Edralin Dental Clinic Web System
Prepared for Angelica C. Edralin Dental Clinic.

## File structure
- `index.html` — Patient login and registration page.
- `admin-login.html` — Separate administrator login page (not shown in patient login form).
- `patient-dashboard.html` — Patient overview, appointment booking, appointment status, and payment preference.
- `admin-dashboard.html` — Admin overview, appointment management, payment records, procedure catalog, analytics, and CSV export.
- `styles.css` — Shared professional responsive styling.
- `app.js` — Login demo, account registration, booking, status management, payment-record demo, and analytics logic.

## Run using Visual Studio Code
1. Extract the ZIP.
2. Open the `orthodent_system` folder in VS Code.
3. Install the Live Server extension if needed.
4. Right-click `index.html` → **Open with Live Server**.
5. Patient portal is `index.html`. Admin portal is `admin-login.html`.

## Run with PowerShell
1. Open PowerShell in the extracted `orthodent_system` folder.
2. Run `py -m http.server 8000` (or `python -m http.server 8000`).
3. Open `http://localhost:8000/index.html` for patients.
4. Open `http://localhost:8000/admin-login.html` for admin.

## Demo administrator credentials
Username: `admin`
Password: `admin123`

Patients can register through the patient portal. The administrator can approve/reject requests, mark approved visits completed, filter/search bookings, export CSV, and view simple descriptive analytics. Payment verification is a manual demo action; no payment gateway is connected.

## Important for your paper
This is an HTML/CSS/JavaScript front-end prototype. Records use browser `localStorage`, so they do not sync across devices and may be deleted by clearing browser data. It is not suitable for real patient records or deployment. The demo password is visible in JavaScript, and passwords are not securely hashed. For real use, build a backend and database, use server-side authentication and role permissions, password hashing, secure payment integration, audit logs, backups, and privacy/security controls. Use fake sample data during your presentation.
