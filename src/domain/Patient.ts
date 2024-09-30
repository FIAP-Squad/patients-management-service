import { Name, Email, CPF } from '@/domain'

export type PatientData = {
  name: string
  email: string
  cpf: string
}

export class Patient {
  private constructor (
    private readonly name: Name,
    private readonly email: Email,
    private readonly cpf: CPF
  ) {
    this.name = name
    this.email = email
    this.cpf = cpf
  }

  public static create (userData: PatientData): Patient {
    return new Patient(
      new Name(userData.name),
      new Email(userData.email),
      new CPF(userData.cpf)
    )
  }

  get Name (): string {
    return this.name.value
  }

  get Email (): string {
    return this.email.value
  }

  get CPF (): string {
    return this.cpf.value
  }
}
