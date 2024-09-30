import { Patient } from '@/domain'

const makeSut = (): Patient => {
  const validPatientData = {
    name: 'Valid Name',
    email: 'valid@example.com',
    cpf: '123.456.789-09'
  }
  return Patient.create(validPatientData)
}

describe('Patient Entity', () => {
  test('Should throw error if Name is invalid', () => {
    const invalidPatientData = {
      name: '',
      email: 'valid@example.com',
      cpf: '123.456.789-09'
    }
    expect(() => Patient.create(invalidPatientData)).toThrow(new Error('InvalidNameError'))
  })

  test('Should throw error if Email is invalid', () => {
    const invalidPatientData = {
      name: 'Valid Name',
      email: 'invalid-email',
      cpf: '123.456.789-09'
    }
    expect(() => Patient.create(invalidPatientData)).toThrow(new Error('InvalidEmailError'))
  })

  test('Should throw error if CPF is invalid', () => {
    const invalidPatientData = {
      name: 'Valid Name',
      email: 'valid@example.com',
      cpf: '111.111.111-11'
    }
    expect(() => Patient.create(invalidPatientData)).toThrow(new Error('InvalidCPFError'))
  })

  test('Should create a valid Patient entity', () => {
    const Patient = makeSut()
    expect(Patient.Name).toBe('Valid Name')
    expect(Patient.Email).toBe('valid@example.com')
    expect(Patient.CPF).toBe('12345678909')
  })
})
