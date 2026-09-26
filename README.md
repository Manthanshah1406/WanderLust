# 🌍 WanderLust

> An Airbnb-inspired full-stack web application designed for exploring, listing, and reviewing unique places to stay around the world.

---

### 🚧 Project Status: **Work in Progress (Under Active Development)** 🚧
> **Note:** This project is currently under active development. Some features are actively being built, refined, and tested. New updates and enhancements are added regularly!

---

## ✨ Features

- **🏠 Listings Management (CRUD)**:
  - Browse all available places and properties.
  - Create, view, edit, and delete listings.
  - Image uploads powered by Cloudinary.
- **⭐ Reviews & Ratings**:
  - Add ratings and feedback for individual listings.
  - Delete reviews with permission checks.
- **🔐 User Authentication & Authorization**:
  - User registration and login using Passport.js.
  - Protected routes and permissions (e.g., only listing/review owners can edit or delete).
- **🛡️ Server-Side & Client-Side Validation**:
  - Schema validation using Joi.
  - Error handling with custom express error wrappers and flash messages.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB & Mongoose
- **Frontend / Templating**: EJS, EJS-Mate, HTML5, CSS3, JavaScript
- **Authentication**: Passport.js & Passport-Local
- **Media & File Storage**: Cloudinary, Multer, Multer-Storage-Cloudinary
- **Form & Schema Validation**: Joi

---

## 🚀 Getting Started

Follow the steps below to run the project locally on your machine:

### 1. Clone the repository
```bash
git clone https://github.com/Manthanshah1406/WanderLust.git
cd Wanderlust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following keys:
```env
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed Database (Optional)
To populate sample listings:
```bash
node init/index.js
```

### 5. Run the Application
Start the development server:
```bash
npx nodemon app.js
```
The server will start at `http://localhost:8080`.

---

## 📌 Upcoming / In-Progress Features

- [ ] Interactive maps integration (Mapbox / Leaflet)
- [ ] Category filtering & search query functionality
- [ ] Responsive UI refinements and dark mode
- [ ] Booking and reservation workflow
- [ ] Production deployment & cloud database setup

---

## 🤝 Contributing & Feedback

Since this project is actively being developed, feedback and suggestions are welcome! Feel free to open an issue or fork the repo.
