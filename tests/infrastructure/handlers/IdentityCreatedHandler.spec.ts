import { IdentityCreatedHandler } from '@/infrastructure'
import { type ICreatePatient } from '@/usecases'

const mockEvent = (): any => (JSON.stringify({
  type: 'DOCTOR',
  email: 'test@example.com',
  password: 'securePassword',
  customAttributes: {
    cpf: '12345678901'
  }
}))

const mockCreateDoctor = (): ICreatePatient => {
  class CreateDoctorStub implements ICreatePatient {
    async execute (params: any): Promise<void> {
      return await Promise.resolve(null)
    }
  }
  return new CreateDoctorStub()
}

interface SutTypes {
  sut: IdentityCreatedHandler
  CreateDoctorStub: ICreatePatient
}

const makeSut = (): SutTypes => {
  const CreateDoctorStub = mockCreateDoctor()
  const sut = new IdentityCreatedHandler(CreateDoctorStub)
  return {
    sut,
    CreateDoctorStub
  }
}

describe('IdentityCreatedHandler', () => {
  test('Should call ICreatePatient with correct values', async () => {
    const { sut, CreateDoctorStub } = makeSut()
    const event = mockEvent()
    const spy = jest.spyOn(CreateDoctorStub, 'execute')
    await sut.handle(event)
    expect(spy).toHaveBeenCalledWith(event)
  })

  test('Should throw if ICreatePatient throws', async () => {
    const { sut, CreateDoctorStub } = makeSut()
    jest.spyOn(CreateDoctorStub, 'execute').mockReturnValueOnce(Promise.reject(new Error()))
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.toBeUndefined()
  })

  test('Should execute successfully when ICreatePatient completes without error', async () => {
    const { sut } = makeSut()
    const event = mockEvent()
    await expect(sut.handle(event)).resolves.not.toThrow()
  })
})
