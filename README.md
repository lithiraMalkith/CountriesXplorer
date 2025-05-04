# Countries Xplorer

A comprehensive web application for exploring global countries with interactive 3D visualizations and detailed statistical information.

## ✨ Key Features

### 🌍 Interactive Globe
- Real-time 3D rendering of countries using Three.js
- Zoom, rotate, and explore different regions
- Click countries for detailed information

### 📊 Country Profiles
- Population statistics
- Economic indicators
- Cultural information
- Historical data

### 🔍 Search System
- Filter by continent, language, or GDP
- Quick search by country name
- Bookmark favorite countries

### 👤 User System
- Secure JWT authentication
- User profiles
- Saved preferences

## 🛠️ Technology Stack

| Component       | Technology           |
|----------------|---------------------|
| Frontend       | React 18, Three.js   |
| Styling        | Tailwind CSS        |
| State Management| Context API         |
| Backend        | Node.js, Express    |
| Database       | MongoDB Atlas       |
| Authentication | JWT                 |
| Deployment     | Netlify (Frontend), Render (Backend) |

## 🚀 Getting Started

### Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-lithiraMalkith.git
cd af-2-lithiraMalkith
```

2. Set up environment variables:
```bash
# Frontend .env
REACT_APP_API_URL=http://localhost:5000

# Backend .env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Install dependencies:
```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

4. Run the development servers:
```bash
# In separate terminals:
cd frontend && npm start
cd backend && npm run dev
```
## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact
Email - it22630834@my.sliit.lk

Project Link: [https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-lithiraMalkith](https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-lithiraMalkith)
