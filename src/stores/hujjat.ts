import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHujjatStore = defineStore('hujjat', () => {
  // 1. Applicant (Ariza beruvchi)
  const applicant = ref({
    person: {
      passportData: {
        pinfl: '',
        seria: '',
        number: '',
        issuedBy: '',
        issueDate: ''
      },
      fullName: {
        firstname: '',
        lastname: '',
        middlename: ''
      },
      phoneNumber: '',
      gender: 'm',
      birthDate: '',
      regionId: 'toshkent'
    },
    address: '',
    email: '',
    residentOfUzb: 1
  })

  // 2. Policy Details (Sug'urta tafsilotlari)
  const details = ref({
    issueDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    coverage: 1000000,
    daysCount: 365,
    agreeToOffer: false,
    selectedDocuments: [] as string[]
  })

  // 3. Cost Calculation Logic
  const getPremium = () => {
    // Basic logic: 0.1% of coverage
    return Math.round(details.value.coverage * 0.001)
  }

  // Helper: API uchun tayyor payload yasash
  const getPayload = () => {
    return JSON.parse(JSON.stringify({
      applicant: applicant.value,
      details: details.value,
      premium: getPremium(),
      timestamp: new Date().toISOString()
    }))
  }

  // Helper: Fake data for testing
  const fillWithFakeData = async () => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    applicant.value.person.passportData = {
      pinfl: '31806045560012',
      seria: 'AA',
      number: '1234567',
      issuedBy: 'Toshkent sh. IIBB',
      issueDate: '2015-06-18'
    }
    
    applicant.value.person.fullName = {
      firstname: 'ULUG\'BEK',
      lastname: 'TAYLAKOV',
      middlename: 'NORBEKOVICH'
    }
    
    applicant.value.person.birthDate = '10.02.1987'
    applicant.value.person.phoneNumber = '+998 90 971-01-11'
    applicant.value.address = 'Toshkent sh., Mirobod t., Mirobod ko\'chasi, 9A-uy'
    
    details.value.agreeToOffer = true
  }

  return {
    applicant,
    details,
    getPremium,
    getPayload,
    fillWithFakeData
  }
})
