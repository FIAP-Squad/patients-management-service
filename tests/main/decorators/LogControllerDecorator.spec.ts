import { type ILogErrorDAO, type Controller, type IHTTPRequest, type IHTTPResponse, Presenter } from '@/infrastructure'
import { LogControllerDecorator } from '@/main/decorators'

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (request: IHTTPRequest): Promise<IHTTPResponse> {
      const response: IHTTPResponse = { body: {}, statusCode: 200 }
      return await Promise.resolve(response)
    }
  }
  return new ControllerStub()
}

const mockLogErrorRepository = (): ILogErrorDAO => {
  class LogErrorRepositoryStub implements ILogErrorDAO {
    async logError (stack: string): Promise<void> {
      return await Promise.resolve()
    }
  }
  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: ILogErrorDAO
}

const mockSut = (): SutTypes => {
  const controllerStub = mockController()
  const logErrorRepositoryStub = mockLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle ', async () => {
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const { sut, controllerStub } = mockSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(request)
    expect(handleSpy).toHaveBeenCalledWith(request)
  })

  test('Should call ILogErrorDAO with correct error if controller returns a server error', async () => {
    const request = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const { sut } = mockSut()
    const response = await sut.handle(request)
    expect(response).toEqual({ body: {}, statusCode: 200 })
  })

  test('Should  ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = mockSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = Presenter.serverError(fakeError)
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error))
    const request = {
      body: {}
    }
    await sut.handle(request)
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
