// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config({ path: './.env' }); // Make sure to load environment variables

// export const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//   }
// );

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use a single DATABASE_URL for production for easier configuration on Render
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction && process.env.DATABASE_URL) {
    // Production configuration for Render
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        dialectOptions: {
            ssl: { // Often required for remote MySQL connections
                require: true,
                rejectUnauthorized: false
            }
        }
    });
} else {
    // Development configuration using local .env file
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
      }
    );
}

export { sequelize };