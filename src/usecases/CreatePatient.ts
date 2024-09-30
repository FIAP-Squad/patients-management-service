import { Patient } from '@/domain'
import {
  type ICreatePatientRepository,
  type IEmitterGateway
} from '@/infrastructure'

export interface ICreatePatient {
  execute: (params: any) => Promise<void>
}

export class CreatePatient implements ICreatePatient {
  public readonly queue: string = 'patient-created'
  constructor (
    private readonly _repository: ICreatePatientRepository,
    private readonly _emitter: IEmitterGateway
  ) { }

  async execute ({ email, name, cpf }): Promise<void> {
    const patient = Patient.create({ email, name, cpf })
    await this._repository.create(patient)
    await this._emitter.publish({
      queue: this.queue,
      message: { email, name, cpf }
    })
  }
}
