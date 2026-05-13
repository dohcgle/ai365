import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWizardStore = defineStore('wizard', () => {
  const currentStep = ref(1)
  
  const formData = ref({
    pinfl: '',
    carNumber: '',
    policyType: 'osgo',
    premiumTier: 'standard',
    phone: '',
    techPassportSeries: '',
    techPassportNumber: '',
    ownerName: '',
    passportSeries: '',
    passportNumber: '',
    startDate: '',
    duration: '12',
    vehicleType: 'yengil',
    region: 'toshkent',
    hasDiscount: false,
    drivers: [] as { passportSeries: string, passportNumber: string, dob: string }[],
    // Imushestvo specific fields
    cadastreNumber: '',
    // Travel specific fields
    travelEndDate: '',
    travelAge: 35,
    travelersCount: 1,
    travelersType: 'individual',
    isResident: true,
    travelCountries: [] as string[],
    travelPolicyType: 'single',
    travelProgram: 'basic',
    travelPurpose: 'tourism',
    hasAntiCovid: false,
    insuredPersons: [
      {
        isResident: true,
        firstName: '',
        lastName: '',
        middleName: '',
        dob: '',
        passportSeries: '',
        passportNumber: '',
        gender: 'male',
        age: 35,
        pinfl: '',
        region: 'toshkent',
        address: ''
      }
    ],
    applicant: {
      type: 'individual',
      isResident: true,
      firstName: '',
      lastName: '',
      middleName: '',
      dob: '',
      passportSeries: '',
      passportNumber: '',
      gender: 'male',
      age: 35,
      pinfl: '',
      region: 'toshkent',
      address: '',
      phone: '',
      email: '',
      // Yuridik shaxs uchun qo'shimcha maydonlar
      companyName: '',
      inn: '',
      oked: '',
      ownershipForm: '',
      bankAccount: '',
      bankName: '',
      bankInn: '',
      mfo: '',
      directorName: '',
      basedOn: 'charter',
      docNumber: '',
      position: '',
      representativePinfl: '',
      representativePassportSeries: '',
      representativePassportNumber: ''
    },
    // Baxtsiz hodisa ma'lumotlari
    accidentData: {
      passportSeries: '',
      passportNumber: '',
      pinfl: '',
      lastName: '',
      firstName: '',
      middleName: '',
      address: '',
      startDate: '',
      endDate: '',
      coverage: 1000000,
      daysCount: 365,
      agreeToOffer: false
    },
    // Hujjat ma'lumotlari
    hujjatData: {
      passportSeries: '',
      passportNumber: '',
      pinfl: '',
      lastName: '',
      firstName: '',
      middleName: '',
      address: '',
      startDate: '',
      endDate: '',
      coverage: 1000000,
      daysCount: 365,
      agreeToOffer: false
    }
  })

  function nextStep() {
    currentStep.value++
  }

  function prevStep() {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  return {
    currentStep,
    formData,
    nextStep,
    prevStep
  }
})
