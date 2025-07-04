import dotenv from 'dotenv';
dotenv.config({path: './.env'});

import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import gabayRoutes from './routes/gabayRoutes.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Allows server to accept JSON data in request body

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/gabay', gabayRoutes);

// --- Database Connection and Server Startup ---
const startServer = async () => {
    try {
        // This will create the database if it doesn't exist
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log("Database created or already exists.");

        // Switch to the created database
        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        // This will create the tables based on your models if they don't exist
        await sequelize.sync({ alter: true }); // Use `alter: true` during development
        console.log('All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
    }
};

startServer();
