import { DataTypes } from 'sequelize';
import { sequelize as db } from '../config/database.js';
// REMOVE THIS LINE: import Assessment from './Assessment.js';

const Roadmap = db.define('Roadmap', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    careerTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    salary_range_php: {
        type: DataTypes.STRING,
        allowNull: true
    },
    modules: {
        type: DataTypes.JSON, // Store the roadmap modules as JSON
        allowNull: false
    },
    assessmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
        // REMOVE the 'references' object from here
    }
});

// REMOVE this line from this file
// Roadmap.belongsTo(Assessment, { foreignKey: 'assessmentId' });

export default Roadmap;