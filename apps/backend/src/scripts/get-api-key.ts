import { ExecArgs } from '@medusajs/framework/types'
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils'

export default async function getApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  try {
    // Get the publishable API key
    const apiKeysResult = await query.graph({
      entity: "api_key",
      fields: ["id", "title", "token", "type"],
      filters: {
        type: "publishable"
      }
    })

    if (apiKeysResult.data.length > 0) {
      const apiKey = apiKeysResult.data[0]
      logger.info(`Publishable API Key: ${apiKey.token}`)
      logger.info(`Title: ${apiKey.title}`)
      logger.info(`ID: ${apiKey.id}`)
    } else {
      logger.info('No publishable API key found')
    }

  } catch (error) {
    logger.error('Error getting API key:', error as Error)
  }
}