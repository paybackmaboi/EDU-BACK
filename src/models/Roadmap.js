import { DataTypes } from 'sequelize';
import { sequelize as db } from '../config/database.js';
import Assessment from './Assessment.js';

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
    modules: {
        type: DataTypes.JSON, // Store the roadmap modules as JSON
        allowNull: false
    },
    // Foreign Key for Assessment
    assessmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Assessment,
            key: 'id'
        }
    }
});

Assessment.hasOne(Roadmap, { foreignKey: 'assessmentId' });
Roadmap.belongsTo(Assessment, { foreignKey: 'assessmentId' });

export default Roadmap;
