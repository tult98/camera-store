import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys } from '@medusajs/framework/utils'
import { execSync } from 'child_process'

export default async function resetDatabase({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  
  logger.info('Starting database reset process...')
  
  try {
    // Terminate all connections to the database
    logger.info('Terminating database connections...')
    execSync(`psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'camera-website';"`, { stdio: 'inherit' })
    
    // Drop the existing database
    logger.info('Dropping existing database...')
    execSync('dropdb camera-website', { stdio: 'inherit' })
    logger.info('Database dropped successfully.')
    
    // Create a new database
    logger.info('Creating new database...')
    execSync('createdb camera-website', { stdio: 'inherit' })
    logger.info('Database created successfully.')
    
    // Set up the database schema
    logger.info('Setting up database schema...')
    execSync('npx medusa db:setup --db camera-website', { stdio: 'inherit' })
    logger.info('Database schema setup completed.')
    
    // Create admin user
    logger.info('Creating admin user...')
    execSync('npx medusa user --email lethanhtu1551998@gmail.com --password Admin@123', { stdio: 'inherit' })
    logger.info('Admin user created successfully.')
    
    // Run seeding process
    logger.info('Seeding database with demo data...')
    execSync('npx medusa exec ./src/scripts/seed.ts', { stdio: 'inherit' })
    logger.info('Database seeding completed successfully.')
    
    logger.info('Database reset process completed successfully!')
    logger.info('Admin credentials: admin@example.com / Admin@123')
    logger.info('You can now start the development server with: yarn dev')
    
  } catch (error) {
    logger.error('Database reset failed:', error as Error)
    throw error
  }
}