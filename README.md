# 🏡 Stay-Wander Full Stack Website

Stay-Wander is a feature-rich, full-stack vacation rental web application inspired by Airbnb. Built using Node.js, Express.js, EJS templates, and MongoDB Atlas, it allows users to explore, search, filter, and manage rental listings around the world with interactive maps, host dashboards, and modern UI/UX aesthetics.

🌐 **Live Demo:** [https://stay-wander.onrender.com](https://stay-wander.onrender.com)

---

## ✨ Features

- 🗺️ **Interactive Location Maps**: Integrated with **Leaflet.js & OpenStreetMap** on listing details pages (`show.ejs`), featuring custom pin markers, popups (Title, City, Country), auto-zoom, and location fallback handling.
- 🎨 **Airbnb-Style Modern UI**: Redesigned responsive interface with rounded card corners (`1.25rem`), hover scale zoom effects, soft shadows, and custom color palettes.
- 💰 **Tax Toggle Switch**: Interactive "Display total after taxes" switch (+18% GST) with price formatting in INR (`₹`).
- 🔍 **Powerful Multi-Field Search**: Case-insensitive partial matching across **Title**, **City/Location**, **Country**, and **Description**. Search text is retained after submission.
- 🏷️ **11 Category Filters**: Instant filtering by category pills (`Trending`, `Beach`, `Mountains`, `Camping`, `Cabins`, `Amazing Views`, `Farms`, `Cities`, `Lakes`, `Rooms`, `Luxury`) with horizontal touch scroll and active category highlighting.
- 📊 **Host Dashboard (`/dashboard`)**: Dedicated host dashboard displaying statistic cards (**Your Listings**, **Total Platform Listings**, **Active Categories**), internal search, category filters, and quick listing management controls (View, Edit, Delete).
- ⭐ **Modern Star Rating System**: Interactive 5-star picker with dynamic quality hint labels and pixel-perfect star badges on guest reviews.
- 🔐 **Authentication & Authorization**: User registration/login powered by **Passport.js**, encrypted session persistence with **Connect-Mongo**, and owner-restricted edit/delete authorization.
- 📷 **Cloud Image Uploads**: Cloudinary integration with Multer for secure image uploads and Cloudinary image transformations.
- 📱 **Fully Responsive Layout**: Mobile, tablet, and desktop optimized layouts with sticky modern navbar and multi-column footer.

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React.js, Bootstrap 5, Leaflet.js, FontAwesome 6 |
| **Backend** | Node.js, Express.js, Passport.js, Passport-Local, Express-Session, Connect-Mongo |
| **Database** | MongoDB Atlas, Mongoose ORM |
| **Storage & Tools** | Cloudinary, Multer, Multer-Storage-Cloudinary, Joi Validation, dotenv |
| **Deployment** | Render |



## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) or local MongoDB instance
- [Cloudinary Account](https://cloudinary.com/) (for image storage)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tarunkumar-2005/wanderlust-Airbnb-Website.git
   cd wanderlust-Airbnb-Website
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and populate the following keys:
   ```env
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ATLASDB_URL=your_mongodb_atlas_connection_string
   SECRET=your_session_secret_key
   ```

4. **Seed the Database**:
   Populate MongoDB with sample listings, property categories, and map coordinates:
   ```bash
   node init/index.js
   ```

5. **Start the Application**:
   ```bash
   node app.js
   ```
   Open your browser and navigate to `http://localhost:3000`.

---

## 🌐 Environment Variables

| Variable | Description |
| :--- | :--- |
| `ATLASDB_URL` | MongoDB Atlas cluster connection URI |
| `CLOUD_NAME` | Cloudinary account name |
| `CLOUD_API_KEY` | Cloudinary API Key |
| `CLOUD_API_SECRET` | Cloudinary API Secret |
| `SECRET` | Secret key for session encryption & cookie signing |
| `PORT` | (Optional) Server port (defaults to 3000 locally, auto-assigned on Render) |

---

## 📄 License & Author

Developed by **Tarun Kumar VS** (2005)  
Built with ❤️ using the MERN Stack.
