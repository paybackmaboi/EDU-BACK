import { DataTypes } from 'sequelize';
import { sequelize as db } from '../config/database.js';
import User from './User.js';

const Assessment = db.define('Assessment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    jobTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quizScore: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // Foreign Key for User
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// REMOVE these lines from this file
// User.hasMany(Assessment, { foreignKey: 'userId' });
// Assessment.belongsTo(User, { foreignKey: 'userId' });
// Assessment.hasMany(Roadmap, { foreignKey: 'assessmentId' }); // <-- REMOVE

export default Assessment;