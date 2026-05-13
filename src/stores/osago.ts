import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOsagoStore = defineStore('osago', () => {
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
      regionId: '',
      districtId: ''
    },
    organization: {
      inn: '',
      name: '',
      phoneNumber: ''
    },
    address: '',
    email: '',
    residentOfUzb: 1,
    citizenshipId: 1
  })

  // 2. Owner (Mulkdor)
  const owner = ref({
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
      }
    },
    organization: {
      inn: '',
      name: '',
      phoneNumber: ''
    },
    applicantIsOwner: true
  })

  // 3. Details (Shartnoma tafsilotlari)
  const details = ref({
    issueDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    driverNumberRestriction: true,
    specialNote: '',
    insuredActivityType: ''
  })

  // 4. Cost (Qiymat va to'lovlar)
  const cost = ref({
    discountId: '0',
    discountSum: '0',
    insurancePremium: '0',
    sumInsured: '40000000',
    contractTermConclusionId: '1',
    useTerritoryId: '1',
    commission: '0',
    insurancePremiumPaidToInsurer: '0',
    seasonalInsuranceId: '12',
    foreignVehicleId: '1',
    refundPolicies: [] as { policyUuid: string, refundSum: string }[]
  })

  // 5. Vehicle (Transport vositasi)
  const vehicle = ref({
    techPassport: {
      number: '',
      seria: '',
      issueDate: ''
    },
    modelCustomName: '',
    engineNumber: '',
    typeId: '1',
    issueYear: '',
    govNumber: '',
    bodyNumber: '',
    regionId: 1,
    terrainId: 1
  })

  // 6. Drivers (Haydovchilar)
  const drivers = ref([] as any[])

  // 7. Reinsurance
  const reinsuranceContractUuids = ref([] as string[])

  // Helper: API uchun tayyor payload yasash
  const getPayload = () => {
    // Deep clone to avoid mutations
    const payload = JSON.parse(JSON.stringify({
      applicant: applicant.value,
      owner: owner.value,
      details: details.value,
      cost: cost.value,
      vehicle: vehicle.value,
      drivers: drivers.value,
      reinsuranceContractUuids: reinsuranceContractUuids.value
    }))

    // Logic: Always keep person, nullify organization for applicant
    payload.applicant.organization = null

    // Logic: Owner handling
    if (payload.owner.applicantIsOwner) {
      payload.owner.person = null
      payload.owner.organization = null
    } else {
      // If owner is different, keep person and nullify organization
      payload.owner.organization = null
    }

    return payload
  }

  // Helper: Fake API or Mock data for testing
  const fillWithFakeData = async () => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    applicant.value = {
      ...applicant.value,
      person: {
        ...applicant.value.person,
        passportData: {
          pinfl: '31806045560012',
          seria: 'AA',
          number: '1234567',
          issuedBy: 'Toshkent sh. IIBB',
          issueDate: '2015-06-18'
        },
        fullName: {
          firstname: 'ULUG\'BEK',
          lastname: 'TAYLAKOV',
          middlename: 'NORBEKOVICH'
        },
        phoneNumber: '+998 90 971-01-11',
        birthDate: '1987-02-10'
      }
    }

    owner.value = {
      ...owner.value,
      applicantIsOwner: true,
      person: {
        ...owner.value.person,
        fullName: {
          firstname: 'ULUG\'BEK',
          lastname: 'TAYLAKOV',
          middlename: 'NORBEKOVICH'
        },
        passportData: {
          ...owner.value.person.passportData,
          seria: 'AA',
          number: '1234567'
        }
      }
    }

    vehicle.value = {
      ...vehicle.value,
      govNumber: '01E363RC',
      techPassport: {
        seria: 'AAG',
        number: '7783410',
        issueDate: '2022-03-15'
      },
      typeId: 'yengil',
      regionId: 'toshkent' as any,
      issueYear: '2022'
    }

    details.value = {
      ...details.value,
      startDate: '12.05.2026',
      driverNumberRestriction: true
    }

    drivers.value = [
      {
        passportData: { seria: 'AB', number: '7654321' },
        birthDate: '25.05.1990'
      }
    ]
  }

  return {
    applicant,
    owner,
    details,
    cost,
    vehicle,
    drivers,
    reinsuranceContractUuids,
    getPayload,
    fillWithFakeData
  }
})
