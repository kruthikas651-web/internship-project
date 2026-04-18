# Smart Secure Campus Exit System

A full-stack, role-based web application designed to automate and secure student exit requests in a campus environment. The system features multi-level approvals, QR code generation, and real-time security scanning with fraud detection.

## 🚀 Features

- **Role-Based Access Control**:
  - **Student**: Submit exit requests and view approved QR passes.
  - **Teacher**: Review and verify academic/departmental exit reasons.
  - **Parent**: Provide final confirmation for student safety.
  - **Security Guard**: Scan QR codes at the gate with Entry/Exit logging.
  - **Admin**: Monitor all system activities and fraud alerts.
- **Secure QR Verification**: Tokens are cryptographically generated and can only be used once for an exit.
- **Fraud Detection**: Prevents reuse of old passes and logs unauthorized entry/exit attempts.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide Icons for a premium experience.
- **Lightweight Database**: Powered by SQLite for zero-configuration setup.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Axios, Lucide React, QRCode.react.
- **Backend**: Node.js, Express.js, SQLite (via `sqlite3` and `sqlite` wrapper).
- **Authentication**: JSON Web Tokens (JWT) with bcrypt password hashing.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "digital exit-3"
   ```

2. **Install Dependencies**:
   Install all dependencies for the root, backend, and frontend at once:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Environment Configuration**:
   The backend includes a default `.env` file. Ensure `JWT_SECRET` is set.
   ```env
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

4. **Run the Application**:
   Start both the backend and frontend simultaneously from the root directory:
   ```bash
   npm run dev
   ```
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:5000

## 🧪 Testing the Flow

1. **Register** as a Student and submit an exit request.
2. **Logout** and **Register/Login** as a Teacher to approve the request.
3. **Logout** and **Register/Login** as a Parent to give final confirmation.
4. **Login** back as a Student to see your generated QR code.
5. **Login** as Security Guard and use the **Manual Entry Simulation** to "scan" the student's QR hash.

---
*Developed for Smart Campus Security.*
