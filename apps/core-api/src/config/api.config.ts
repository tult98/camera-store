export const apiConfig = {
  backendUrl: process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
  adminEmail: process.env.MEDUSA_ADMIN_EMAIL || '',
  adminPassword: process.env.MEDUSA_ADMIN_PASSWORD || '',
};

export function validateApiConfig(): void {
  const errors: string[] = [];

  if (!apiConfig.adminEmail) {
    errors.push('MEDUSA_ADMIN_EMAIL is required');
  }

  if (!apiConfig.adminPassword) {
    errors.push('MEDUSA_ADMIN_PASSWORD is required');
  }

  if (errors.length > 0) {
    throw new Error(
      `API configuration error:\n${errors.map((e) => `  - ${e}`).join('\n')}`
    );
  }
}
