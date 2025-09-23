"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = resetDatabase;
const utils_1 = require("@medusajs/framework/utils");
const child_process_1 = require("child_process");
async function resetDatabase({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info('Starting database reset process...');
    try {
        // Terminate all connections to the database
        logger.info('Terminating database connections...');
        (0, child_process_1.execSync)(`psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'camera-website';"`, { stdio: 'inherit' });
        // Drop the existing database
        logger.info('Dropping existing database...');
        (0, child_process_1.execSync)('dropdb camera-website', { stdio: 'inherit' });
        logger.info('Database dropped successfully.');
        // Create a new database
        logger.info('Creating new database...');
        (0, child_process_1.execSync)('createdb camera-website', { stdio: 'inherit' });
        logger.info('Database created successfully.');
        // Set up the database schema
        logger.info('Setting up database schema...');
        (0, child_process_1.execSync)('npx medusa db:setup --db camera-website', { stdio: 'inherit' });
        logger.info('Database schema setup completed.');
        // Create admin user
        logger.info('Creating admin user...');
        (0, child_process_1.execSync)('npx medusa user --email admin@example.com --password Admin@123', { stdio: 'inherit' });
        logger.info('Admin user created successfully.');
        // Run seeding process
        logger.info('Seeding database with demo data...');
        (0, child_process_1.execSync)('npx medusa exec ./src/scripts/seed.ts', { stdio: 'inherit' });
        logger.info('Database seeding completed successfully.');
        logger.info('Database reset process completed successfully!');
        logger.info('Admin credentials: admin@example.com / Admin@123');
        logger.info('You can now start the development server with: yarn dev');
    }
    catch (error) {
        logger.error('Database reset failed:', error);
        throw error;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtZGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9yZXNldC1kYXRhYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGdDQTJDQztBQTlDRCxxREFBcUU7QUFDckUsaURBQXdDO0FBRXpCLEtBQUssVUFBVSxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDakUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUE7SUFFakQsSUFBSSxDQUFDO1FBQ0gsNENBQTRDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQTtRQUNsRCxJQUFBLHdCQUFRLEVBQUMsZ0hBQWdILEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQTtRQUVoSiw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBQzVDLElBQUEsd0JBQVEsRUFBQyx1QkFBdUIsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtRQUU3Qyx3QkFBd0I7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ3ZDLElBQUEsd0JBQVEsRUFBQyx5QkFBeUIsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtRQUU3Qyw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBQzVDLElBQUEsd0JBQVEsRUFBQyx5Q0FBeUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ3pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtRQUUvQyxvQkFBb0I7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBQ3JDLElBQUEsd0JBQVEsRUFBQyxnRUFBZ0UsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ2hHLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtRQUUvQyxzQkFBc0I7UUFDdEIsTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO1FBQ2pELElBQUEsd0JBQVEsRUFBQyx1Q0FBdUMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUV2RCxNQUFNLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxDQUFDLENBQUE7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO1FBQy9ELE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQTtJQUV4RSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsS0FBYyxDQUFDLENBQUE7UUFDdEQsTUFBTSxLQUFLLENBQUE7SUFDYixDQUFDO0FBQ0gsQ0FBQyJ9