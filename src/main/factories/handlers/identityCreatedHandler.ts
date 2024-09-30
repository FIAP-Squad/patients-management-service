import { IdentityCreatedHandler, EmitterGateway, PatientRepository, type Handler } from '@/infrastructure'
import { CreatePatient } from '@/usecases'

export const makeIdentityCreatedHandler = (): Handler => {
  const repository = new PatientRepository()
  const emitter = new EmitterGateway()
  const usecase = new CreatePatient(repository, emitter)
  return new IdentityCreatedHandler(usecase)
}
