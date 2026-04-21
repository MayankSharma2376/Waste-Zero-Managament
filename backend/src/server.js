const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

// --- Merged Imports from both branches ---
const authRoutes = require("../routes/auth.routes.js");
const pickupRoutes = require("../routes/pickup.routes.js")
const messageRoutes = require("../routes/message.routes.js");
const userRoutes = require("../routes/user.routes.js");
const ngoRoute = require('../routes/ngo.routes.js');
const volunteerRoute = require('../routes/volunteer.routes.js');
const notificationRoutes = require('../routes/notification.routes.js');
const matchingRoutes = require('../routes/matching.routes.js');
const adminRoutes = require('../routes/admin.routes.js');
const connectDb = require('../lib/connectDb.js');


const { app, server } = require("../socket/socket.js");


app.use(cors({
  
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use('/api/ngo', ngoRoute);
app.use('/api/volunteer', volunteerRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/pickup", pickupRoutes)


app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({
      success: false,
      message: 'Uploaded image is too large. Please choose a smaller image (recommended < 3MB) or use a lower resolution.'
    });
  }
  next(err);
});


const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDb();
});