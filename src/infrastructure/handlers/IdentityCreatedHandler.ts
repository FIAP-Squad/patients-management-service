import { type ICreatePatient } from '@/usecases'
import { type Handler } from '@/infrastructure'

export class IdentityCreatedHandler implements Handler {
  constructor (private readonly _usecase: ICreatePatient) { }
  async handle (event: any): Promise<void> {
    try {
      await this._usecase.execute(event)
    } catch (error) {
      process.stdout.write(`Error: ${error.message}, Stack: ${error.stack}`)
    }
  }
}
