# mintGig — Learn skills. Prove your talent. Earn through real projects.

> **mintGig** is an integrated student-focused learning-to-earning platform built on the **MERN** stack (MongoDB, Express, React, Node.js). It seamlessly connects affordable online education, verifiable skill certification, automated student portfolio generation, and client freelance opportunities into one continuous ecosystem.

---

## 🌟 The Core Product Journey

$$\text{Affordable Learning} \longrightarrow \text{Skill Assessment} \longrightarrow \text{Verified Completion} \longrightarrow \text{Certificate} \longrightarrow \text{Automatic Portfolio} \longrightarrow \text{Freelance Applications} \longrightarrow \text{Client Opportunities}$$

---

## 🚀 Key Features Implemented

### 1. Role-Based Authentication & Permissions
- **3 Distinct Roles**: `student`, `client`, and `admin`.
- **JWT Authentication**: Stored in signed HTTP-only cookies (`sameSite: 'strict'`) with Bearer token fallback.
- **Security Protections**: Rate-limiting on authentication endpoints, bcrypt password hashing (cost factor 12), Helmet HTTP headers, CORS origin whitelisting, and centralized input validation via `express-validator`.
- **Admin Setup Protection**: Prevents privilege escalation; administrative accounts are securely initialized via seed scripts or setup keys.

### 2. Course Learning & Progression System
- **Catalog & Discovery**: Search, filter by category, level, and price in INR (₹).
- **Curriculum & Lesson Player**: Tracked lesson completion persisted to MongoDB.
- **Server-Graded Assessments**: Quizzes require achieving minimum passing threshold (e.g., 75%) before certificates are unlocked.
- **Prevent Unauthorized Access**: Unenrolled users cannot access lesson details or quiz evaluation APIs.

### 3. Verifiable Certification Engine
- **Completion-Based Issuance**: Generated uniquely (`MINT-XXXX-XXXX`) only after server verifies passing quiz score and lesson completion threshold.
- **Public Verification Route**: Anyone can verify certificates at `/verify-certificate/:certificateId`.
- **Print & PDF Support**: Dedicated clean certificate layout with verification seal.
- **Administrative Revocation**: Admins can audit and revoke certificates with recorded justification.

### 4. Automatic Portfolio Builder (Core Differentiator)
- **Zero-Friction Creation**: Student portfolio is generated automatically upon registration at `mintgig.com/portfolio/:username`.
- **Live Database Sync**: Completed courses and earned certificates are queried dynamically—never duplicated or out-of-sync.
- **Customizable Proof-of-Work**: Students can add personal GitHub projects, live demo URLs, bio, and social links.
- **Shareable & Public**: 1-click URL copy with visibility toggles.

### 5. Freelance Marketplace & Proposal Workflow
- **Client Project Publishing**: Title, category, deliverables, required skills, and budget range in INR (₹).
- **Student Proposals**: Includes cover message, proposed bid, delivery timeline in days, and links to verified portfolio.
- **Duplicate Prevention**: Rejects duplicate active proposals from the same student on the same project.
- **Status Lifecycle**: `open` $\rightarrow$ `in_progress` $\rightarrow$ `completed`.
- **Client Decision Controls**: Clients accept or decline proposals with decision feedback notes.

### 6. Project Messaging & Notification Center
- **Private Communication**: Threaded messaging restricted strictly to authorized project participants.
- **Persisted Notifications**: Server-generated notifications for enrollment, course completion, certificate issuance, proposal decisions, and incoming messages.
- **Unread Badge Counters**: Instant polling and read/unread status updates.

### 7. Administrative Oversight & Analytics
- **Live Platform Metrics**: Real-time counts of users, students, clients, published courses, active enrollments, certificates, and open projects.
- **Moderation Tools**: Suspend/reactivate users, moderate project listings (pause/reopen), review course curricula, and audit certificates.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide React, Axios |
| **Backend** | Node.js, Express.js, RESTful API architecture |
| **Database** | MongoDB, Mongoose ODM |
| **Security** | JSON Web Tokens (JWT), HTTP-only cookies, bcryptjs, Helmet, Express-Rate-Limit |
| **Testing** | Jest, Supertest |

---

## 📁 Project Structure

```
d:\Mint-Gig-Team-Apex-\
├── mintgig/
│   ├── client/                      # React + Vite Frontend
│   │   ├── src/
│   │   │   ├── api/                 # Axios client with interceptors
│   │   │   ├── components/
│   │   │   │   ├── common/          # Button, Badge, Card, Modal, Input, ProtectedRoute
│   │   │   │   └── layout/          # Navbar, Footer, DashboardLayout
│   │   │   ├── context/             # AuthContext, NotificationContext
│   │   │   ├── pages/
│   │   │   │   ├── admin/           # Admin Dashboard, Users, Courses, New Course, Moderation
│   │   │   │   ├── client/          # Client Dashboard, Projects, CreateProject, Proposals, Talent
│   │   │   │   ├── student/         # Student Dashboard, Courses, Player, Certs, Portfolio, Proposals
│   │   │   │   ├── LandingPage.jsx
│   │   │   │   ├── CoursesPage.jsx
│   │   │   │   ├── ProjectsPage.jsx
│   │   │   │   ├── PublicPortfolioPage.jsx
│   │   │   │   └── CertificateVerifyPage.jsx
│   │   │   ├── App.jsx              # Application router
│   │   │   └── main.jsx
│   │   ├── index.html
│   │   ├── tailwind.config.js
│   │   ├── vite.config.js
│   │   └── package.json
│   │
│   └── server/                      # Node.js + Express Backend
│       ├── src/
│       │   ├── config/              # MongoDB connection (db.js)
│       │   ├── controllers/         # Auth, Course, Certificate, Project, Portfolio, Conversation
│       │   ├── middleware/          # JWT auth, role validation, error handling, rate limiting
│       │   ├── models/              # User, StudentProfile, ClientProfile, Course, Enrollment, Certificate, FreelanceProject, Proposal, Conversation, Notification
│       │   ├── routes/              # Express API route modules
│       │   ├── seed/                # Comprehensive seed script (seed.js)
│       │   ├── services/            # Notification & Certificate services
│       │   ├── __tests__/           # Jest & Supertest API integration tests
│       │   ├── app.js               # Express application configuration
│       │   └── index.js             # Server entry point
│       ├── .env                     # Local environment configuration
│       ├── .env.example
│       └── package.json
├── README.md
└── .gitignore
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.0.0 or higher (v24.20.0 tested)
- **npm**: v9.0.0 or higher (v11.19.0 tested)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI.

---

## 🚀 Quick Start Guide

### 1. Configure Backend Environment
Navigate to `mintgig/server` and inspect `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mintgig
JWT_SECRET=mintgig_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ADMIN_SETUP_KEY=mintgig_admin_setup_2024
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

### 2. Seed Database with Realistic Demonstration Data
Run the database seed script to populate courses, quizzes, verified certificates, student profiles, and project listings:
```powershell
cd d:\Mint-Gig-Team-Apex-\mintgig\server
npm run seed
```

### 3. Start the Backend API Server
```powershell
cd d:\Mint-Gig-Team-Apex-\mintgig\server
npm start
```
The server will start on `http://localhost:5000` with the health check available at `http://localhost:5000/api/v1/health`.

### 4. Start the Frontend Development Server
Open a second terminal window:
```powershell
cd d:\Mint-Gig-Team-Apex-\mintgig\client
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Pre-Configured Demo Accounts (For Hackathon Judges)

The login screen features **1-click credential buttons** for fast evaluation:

| Role | Name | Email | Password | Details |
|---|---|---|---|---|
| **Student (Featured)** | Aarav Sharma | `student1@mintgig.com` | `StudentPass123!` | Complete course, verified certificate (`MINT-DEMO-001`), active proposal, automated public portfolio (`/portfolio/aaravsharma`). |
| **Student (Design)** | Priya Patel | `student2@mintgig.com` | `StudentPass123!` | Certified in Figma to Tailwind, UI/UX portfolio (`/portfolio/priyapatel`). |
| **Client (Employer)** | Neha Gupta | `client1@mintgig.com` | `ClientPass123!` | EdTech founder, active project listings, incoming proposals. |
| **Client (Agency)** | Vikram Malhotra | `client2@mintgig.com` | `ClientPass123!` | Studio director, in-progress projects, active messaging thread with student. |
| **Administrator** | mintGig Admin | `admin@mintgig.com` | `AdminPass123!` | Full control panel, platform metrics, moderation, course editor. |

---

## 📡 API Endpoint Reference (`/api/v1`)

### Authentication & Users (`/api/v1/auth`)
- `POST /register` — Register student or client with input validation.
- `POST /login` — Authenticate and receive signed HTTP-only cookie.
- `POST /logout` — Invalidate session cookie.
- `GET /me` — Get authenticated user details and role profile.
- `PUT /profile` — Update bio, headline, skills, and links.

### Courses & Learning (`/api/v1/courses`)
- `GET /` — Browse published courses with search, category, level, and price filters.
- `GET /:id` — Detailed course curriculum.
- `GET /my/enrollments` — Student enrolled courses with progress percentages.
- `POST /:id/enroll` — Enroll in free course.
- `GET /:id/learn` — Access lesson content and quiz requirements.
- `POST /:courseId/lessons/:lessonId/complete` — Record lesson progress.
- `POST /:courseId/quiz/submit` — Submit quiz answers, evaluate score on server, and issue certificate if threshold is met.

### Certificates (`/api/v1/certificates`)
- `GET /verify/:certificateId` — Public verification route.
- `GET /my` — Get all earned certificates for authenticated student.
- `GET /admin/all` — Audit all platform certificates.
- `PUT /admin/:id/revoke` — Revoke certificate with reason.

### Portfolios (`/api/v1/portfolio`)
- `GET /user/:username` — Public student portfolio dynamically synthesized from database.
- `GET /me` — Personal portfolio configuration.
- `POST /projects` — Add custom student proof-of-work project.
- `PUT /projects/:projectId` — Update custom project.
- `DELETE /projects/:projectId` — Remove custom project.

### Freelance Marketplace (`/api/v1/projects`)
- `GET /` — Browse open freelance projects with filters.
- `GET /:id` — Detailed project listing and application portal.
- `POST /` — Client posts new project listing.
- `PUT /:id` — Client updates project status (`open`, `paused`, `completed`).
- `POST /:id/proposals` — Student submits proposal with bid, timeline, and cover letter.
- `GET /my/proposals` — Student view of submitted proposals.
- `PUT /proposals/:id/withdraw` — Student withdraws pending proposal.
- `PUT /proposals/:id/decide` — Client accepts or rejects proposal with note.

### Messaging & Notifications
- `GET /api/v1/conversations` — List active project conversation threads.
- `GET /api/v1/conversations/:id` — Conversation message history.
- `POST /api/v1/conversations/:id/messages` — Send message to project participant.
- `GET /api/v1/notifications` — Notification center with unread count.
- `PUT /api/v1/notifications/:id/read` — Mark notification as read.
- `PUT /api/v1/notifications/read-all` — Mark all notifications as read.

### Administration (`/api/v1/admin`)
- `GET /metrics` — Live platform database statistics.
- `GET /users` — User management directory.
- `PUT /users/:id` — Suspend or reactivate user accounts.
- `GET /projects` — Moderation project queue.
- `PUT /projects/:id/status` — Moderate inappropriate listings.
- `GET /enrollments` — Global student learning progress log.

---

## 🧪 Testing

### Running Backend API & Security Tests
Integration tests verify health endpoints, authentication guards, validation rejections, and security headers using **Jest** and **Supertest**:
```powershell
cd d:\Mint-Gig-Team-Apex-\mintgig\server
npm test
```
*Result: 6/6 tests passing.*

### Testing Frontend Production Build
Validate that all React components, icons, and Tailwind styles compile without warnings or syntax errors:
```powershell
cd d:\Mint-Gig-Team-Apex-\mintgig\client
npm run build
```
*Result: 1,681 modules compiled successfully into optimized distribution bundle.*

---

## 🔒 Security Best Practices Implemented

1. **No Client Privilege Escalation**: Role checks are strictly verified on the Express server middleware (`requireAuth`, `requireRole('admin')`). Role cannot be altered via client payload.
2. **HTTP-Only Cookies**: Authentication tokens are prevented from being accessed via `document.cookie`, mitigating client-side XSS token exfiltration.
3. **No Committed Secrets**: Database credentials and JWT signing keys are managed exclusively via environment variables (`.env`).
4. **Rate Limiting**: Authentication endpoints are rate-limited to 30 requests per 15 minutes to thwart brute-force password guessing.
5. **Server-Side Evaluation**: Quizzes and certificate eligibility are evaluated exclusively on the server—client-side score fabrication is impossible.

---

## 💡 Known MVP Limitations & Recommended Next Steps

- **Payment Gateway**: Paid courses display an informative development notice ("Payment processing is not implemented in MVP"). A production integration with Razorpay or Stripe can be connected to the existing enrollment controller.
- **Real-Time WebSockets**: Messages and notifications currently use robust REST polling (every 5–15 seconds). Upgrading to Socket.IO can enable zero-latency typing indicators and audio calls.
- **Video Hosting**: Course lessons currently support formatted curriculum text and external video links; cloud storage integration (e.g. AWS S3 or Cloudinary) can be attached for direct video uploads.

---

## 📄 License

Created for demonstration and hackathon evaluation under the MIT License.
