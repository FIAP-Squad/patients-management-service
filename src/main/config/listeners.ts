import { type IBrokerAdapter } from '@/main/adapters'
import { makeIdentityCreatedHandler } from '@/main/factories/handlers'

export default async (broker: IBrokerAdapter): Promise<void> => {
  await broker.subscribe('patient-identity-created', makeIdentityCreatedHandler())
}
