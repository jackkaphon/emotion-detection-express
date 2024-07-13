const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const errorHandling = require('./middlewares/errorHandling');

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const videoRoutes = require('./routes/videoRoutes');
const imageRoutes = require('./routes/imageRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Use CORS middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Use JSON middleware
app.use(express.json());


// Use the auth routes
app.use('/', authRoutes);
app.use('/admins', adminRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);
app.use('/videos', videoRoutes);
app.use('/images', imageRoutes);

// Use the error handling middleware
app.use(errorHandling);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
