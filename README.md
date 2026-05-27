# GauravEduGo 🎓

**School Management System** - Fee tracking, Student management, Teacher management, Notifications & Admin Dashboard

## Features ✨

### 1️⃣ Fee Management
- Student dues tracking
- Equipment/Machine allocation
- Payment history
- SMS notifications to parents

### 2️⃣ User Management
- Student login
- Teacher login
- School Admin login
- Role-based access

### 3️⃣ Notifications
- Automated SMS (MSG91)
- Bulk messaging
- In-app notices
- Dashboard alerts

### 4️⃣ Admin Dashboard
- Fee status overview
- Notice management
- Student/Teacher management
- Equipment tracking

## Tech Stack 🛠️

- **Mobile:** React Native (Android/iOS)
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **SMS:** MSG91 API
- **Auth:** JWT

## Project Structure 📁

```
Gauravedugo/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
├── mobile/
│   ├── src/
│   ├── package.json
│   └── app.json
├── admin-dashboard/
│   ├── src/
│   ├── package.json
│   └── public/
└── docs/
    └── API.md
```

## Getting Started 🚀

### Backend
```bash
cd backend
npm install
npm run dev
```

### Mobile
```bash
cd mobile
npm install
npm start
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm start
```

## Database Models 🗄️

- **User** - Login authentication
- **School** - School details
- **Student** - Student information
- **Fee** - Fee tracking
- **Notice** - Announcements
- **Machine** - Equipment tracking
- **SMSLog** - SMS delivery log

## API Endpoints 📚

See `docs/API.md` for complete API documentation

## License 📄

MIT License
