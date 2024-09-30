import { CreatePatient } from '@/usecases'
import { type ICreatePatientRepository, type IEmitterGateway } from '@/infrastructure'
import { Patient } from '@/domain'

const mockPatientData = (): any => ({
  email: 'patient.john.doe@example.com',
  name: 'John Doe',
  cpf: '123.456.789-09'
})

const makeRepository = (): ICreatePatientRepository => {
  class RepositoryStub implements ICreatePatientRepository {
    async create (patient: any): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new RepositoryStub()
}

const makeGateway = (): IEmitterGateway => {
  class EmitterStub implements IEmitterGateway {
    async publish ({ queue, message }): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new EmitterStub()
}

type SutTypes = {
  sut: CreatePatient
  repositoryStub: ICreatePatientRepository
  emitterStub: IEmitterGateway
}

const mockSut = (): SutTypes => {
  const repositoryStub = makeRepository()
  const emitterStub = makeGateway()
  const sut = new CreatePatient(repositoryStub, emitterStub)
  return {
    sut,
    repositoryStub,
    emitterStub
  }
}

describe('Create Patient Use Case', () => {
  test('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = mockSut()
    jest.spyOn(repositoryStub, 'create').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockPatientData())
    await expect(promise).rejects.toThrow()
  })

  test('Should call repository with correct patient entity', async () => {
    const { sut, repositoryStub } = mockSut()
    const spy = jest.spyOn(repositoryStub, 'create')
    await sut.execute(mockPatientData())
    expect(spy).toHaveBeenCalledWith(
      Patient.create(mockPatientData())
    )
  })

  test('Should throw if emitter throws', async () => {
    const { sut, repositoryStub, emitterStub } = mockSut()
    jest.spyOn(repositoryStub, 'create').mockReturnValueOnce(Promise.resolve())
    jest.spyOn(emitterStub, 'publish').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.execute(mockPatientData())
    await expect(promise).rejects.toThrow()
  })

  test('Should complete execution without throwing errors', async () => {
    const { sut } = mockSut()
    const promise = sut.execute(mockPatientData())
    await expect(promise).resolves.not.toThrow()
  })
})
