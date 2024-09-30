import { prismaClient } from '@/infrastructure'
import { type Patient } from '@/domain'

export interface ICreatePatientRepository {
  create: (value: Patient) => Promise<void>
}

export class PatientRepository implements ICreatePatientRepository {
  async create (patient: Patient): Promise<void> {
    await prismaClient.patient.create({
      data: {
        name: patient.Name,
        email: patient.Email,
        cpf: patient.CPF
      }
    })
  }
}
