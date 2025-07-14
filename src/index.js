import dotenv from 'dotenv';
dotenv.config(); // Simplified dotenv config

import express from 'express';
import cors from 'cors';
import { sequelize } from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import gabayRoutes from './routes/gabayRoutes.js';

// Import models
import User from './models/User.js';
import Assessment from './models/Assessment.js';
import Roadmap from './models/Roadmap.js';

const app = express();
const PORT = process.env.PORT || 8000;

// --- CORS Configuration to Allow Frontend to Connect ---
const corsOptions = {
  // Replace with your frontend's actual Render URL
  origin: 'https://edu-front-eaiu.onrender.com', 
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions)); // Use the new corsOptions
app.use(express.json());

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/gabay', gabayRoutes);

// --- Define Model Associations Here ---
User.hasMany(Assessment, { foreignKey: 'userId' });
Assessment.belongsTo(User, { foreignKey: 'userId' });

Assessment.hasMany(Roadmap, { as: 'roadmaps', foreignKey: 'assessmentId' });
Roadmap.belongsTo(Assessment, { as: 'assessment', foreignKey: 'assessmentId' });


// --- Database Connection and Server Startup ---
const startServer = async () => {
    try {
        // This line is removed as it's not needed in production
        // await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

        await sequelize.authenticate();
        console.log('Connection to the database has been established successfully.');

        await sequelize.sync({ alter: true });
        console.log('All models were synchronized successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Unable to connect to the database or start server:', error);
    }
};

startServer();