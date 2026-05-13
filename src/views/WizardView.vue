<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useWizardStore } from '../stores/wizard'
import { useOsagoStore } from '../stores/osago'
import { ChevronRight, ShieldAlert, Check, Copy } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

import OsgovtsForm from '../components/forms/OsgovtsForm.vue'
import TravelForm from '../components/forms/TravelForm.vue'
import ImushestvoForm from '../components/forms/ImushestvoForm.vue'
import AccidentForm from '../components/forms/AccidentForm.vue'
import BasePersonForm from '../components/forms/BasePersonForm.vue'

const wizardStore = useWizardStore()
const osagoStore = useOsagoStore()
const router = useRouter()
const route = useRoute()
const selectedPaymentMethod = ref('payme')
const copied = ref(false)

const copyJson = () => {
  const payload = JSON.stringify(osagoStore.getPayload(), null, 2)
  navigator.clipboard.writeText(payload)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// Update policy type from route
const updatePolicyFromRoute = () => {
  if (route.params.type) {
    wizardStore.formData.policyType = route.params.type as string
    wizardStore.currentStep = 1 // Reset to step 1
  }
}

const handleOwnerNameInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  osagoStore.owner.person.fullName.firstname = input.value.toUpperCase()
}

const handleOwnerSeriaInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  osagoStore.owner.person.passportData.seria = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
}

const handleOwnerNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const formatted = input.value.replace(/\D/g, '').slice(0, 7)
  osagoStore.owner.person.passportData.number = formatted
  input.value = formatted
}

const handlePhoneInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.length > 12) val = val.slice(0, 12)
  
  let formatted = ''
  if (val.length > 0) {
    formatted = '+' + val.slice(0, 3)
    if (val.length > 3) formatted += ' ' + val.slice(3, 5)
    if (val.length > 5) formatted += ' ' + val.slice(5, 8)
    if (val.length > 8) formatted += '-' + val.slice(8, 10)
    if (val.length > 10) formatted += '-' + val.slice(10, 12)
  }
  osagoStore.applicant.person.phoneNumber = formatted
  input.value = formatted
}

const handleDateInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '').slice(0, 8)
  let formatted = ''
  if (val.length > 0) {
    formatted = val.slice(0, 2)
    if (val.length > 2) formatted += '.' + val.slice(2, 4)
    if (val.length > 4) formatted += '.' + val.slice(4, 8)
  }
  osagoStore.details.startDate = formatted
  input.value = formatted
}

const handleDriverSeriaInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
  osagoStore.drivers[index].passportData.seria = val
  input.value = val
}

const handleDriverNumberInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(0, 7)
  osagoStore.drivers[index].passportData.number = val
  input.value = val
}

const handleDriverBirthDateInput = (index: number, e: Event) => {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '').slice(0, 8)
  let formatted = ''
  if (val.length > 0) {
    formatted = val.slice(0, 2)
    if (val.length > 2) formatted += '.' + val.slice(2, 4)
    if (val.length > 4) formatted += '.' + val.slice(4, 8)
  }
  osagoStore.drivers[index].birthDate = formatted
  input.value = formatted
}

onMounted(updatePolicyFromRoute)
watch(() => route.params.type, updatePolicyFromRoute)

const steps = computed(() => {
  if (wizardStore.formData.policyType === 'osgovts') {
    if (osagoStore.details.driverNumberRestriction) {
      return [
        { id: 1, title: 'Avto ma\'lumotlari' },
        { id: 2, title: 'Shaxsiy ma\'lumotlar' },
        { id: 3, title: 'Polis' },
        { id: 4, title: 'Haydovchilar' },
        { id: 5, title: 'To\'lov' }
      ]
    } else {
      return [
        { id: 1, title: 'Avto ma\'lumotlari' },
        { id: 2, title: 'Shaxsiy ma\'lumotlar' },
        { id: 3, title: 'Polis' },
        { id: 4, title: 'To\'lov' }
      ]
    }
  }
  
  if (wizardStore.formData.policyType === 'baxtsiz') {
    return [
      { id: 1, title: 'Pasport ma\'lumotlari' },
      { id: 2, title: 'Sug\'urta ma\'lumotlari' },
      { id: 3, title: 'To\'lov turi' }
    ]
  }

  return [
    { id: 1, title: 'Shaxs va Avto' },
    { id: 2, title: 'Polis Tanlovi' },
    { id: 3, title: 'To\'lov' }
  ]
})

function handleNext() {
  // Validation for OSAGO Step 1
  if (wizardStore.formData.policyType === 'osgovts' && wizardStore.currentStep === 1) {
    if (!osagoStore.vehicle.govNumber || !osagoStore.vehicle.techPassport.seria || !osagoStore.vehicle.techPassport.number) {
      alert('Iltimos, avtomobil ma\'lumotlarini to\'liq kiriting!')
      return
    }
  }
  
  // Validation for OSAGO Step 2
  if (wizardStore.formData.policyType === 'osgovts' && wizardStore.currentStep === 2) {
    if (!osagoStore.owner.person.fullName.firstname || 
        !osagoStore.owner.person.passportData.seria || 
        !osagoStore.owner.person.passportData.number ||
        !osagoStore.details.startDate ||
        !osagoStore.applicant.person.phoneNumber) {
      alert('Iltimos, mulkdor va polis ma\'lumotlarini to\'liq kiriting!')
      return
    }
  }

  if (wizardStore.currentStep === steps.value.length) {
    alert('Polis muvaffaqiyatli xarid qilindi!')
    router.push('/')
  } else {
    wizardStore.nextStep()
  }
}

const policyDetails: Record<string, string[]> = {
  osgovts: [
    "<b>Сиз учун қандай фойда?</b> Агар ЙТҲ (авария) содир бўлса ва сиз айбдор бўлсангиз, жабрланувчига етказилган зарарни сиз эмас, биз қоплаймиз!",
    "<b>Қоплама миқдори:</b> Жами 80 000 000 сўмгача. Шундан 65 фоизи жабрланувчининг ҳаёти ва соғлиғи учун, 35 фоизи эса шикастланган автомобил ёки мол-мулк учун йўналтирилади.",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Агар сиз пенсионер, ногиронлиги бўлган шахс ёки ҳарбий хизматчи бўлсангиз, полис учун 50% чегирма (сиёлов) берилади. Шунингдек, 'Европротокол' орқали ГАИ (ЙҲХБ) ходимларисиз 3 қадамда онлайн расмийлаштириш ва зарарни тезкор ундириш имконияти мавжуд."
  ],
  baxtsiz: [
    "<b>Тариф:</b> Бор-йўғи 1% дан бошланади. Бу дегани, бир неча пиёла қаҳва пулига ўзингизни миллионлаб сўмлик ҳимоя билан таъминлайсиз.",
    "<b>Қандай ҳолатларда тўланади?</b> Олинган тан жароҳати даражасига қараб тезкор тўлов амалга оширилади. Агар бахтсиз ҳодиса сабабли II гуруҳ ногиронлиги белгиланса суғурта пулининг 50% и, I гуруҳга 75% и ва энг оғир (ўлим) ҳолатларида эса 100% суғурта пули тўлиқ қоплаб берилади.",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Ҳеч қандай тиббий маълумотномасиз харид қилинади! Сиз фақат ПИНФЛ киритасиз ва 1 дақиқада электрон полисга эга бўласиз. Касалхонага тушганда оила бюджетини асраб қолишнинг энг зўр йўли."
  ],
  vzr: [
    "<b>Сизга нима беради?</b> Бизда икки хил Premium пакет мавжуд: 'STANDART' (5 млн сўмгача қоплама) ва 'COMFORT' (50 млн сўмгача қоплама).",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Полис нафақат касалхона харажатларини, балки шошилинч стоматологияни (600 минг сўмгача), тиббий эвакуацияни (5 млн сўмгача) ва ҳаттоки фавқулодда вазиятлардаги транспортировкаларни ҳам ўз ичига олади.",
    "Кунига бор-йўғи 4 000 сўмдан 8 000 сўмгача тўлов қилиб, хориждаги минглаб долларлик тиббий харажатлардан халос бўласиз."
  ],
  imushestvo: [
    "<b>Нималардан ҳимоя қилади?</b> Ёнғин, газ портлаши, қўшнилардан сув ўтиши, табиий офатлар (зилзила, довул) ва бинога учинчи шахслар томонидан қасддан етказилган зарарлар.",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Тариф ўта арзон — 0.05% дан 0.10% гача. Бу шуни англатадики, маҳсулотнинг нархи сизнинг хотиржамлигингиз олдида арзимаган суммага тенг.",
    "Ортиқча ҳужжатларсиз, кадастр рақами орқали автоматик топилиб, 100% онлайн расмийлаштирилади."
  ],
  kasko: [
    "<b>ОСАГОдан қандай фарқи бор?</b> КАСКОда аварияда сиз айбдор бўлсангиз ҳам, сизнинг машинангиз таъмирлаб берилади. Қолаверса, машина ўғирланса, ёнғин чиқса ёки тош/дарахт қуласа ҳам барча харажатларни биз кўтарамиз.",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Агар автомобил юра олмайдиган ҳолатга келса, эвакуатор харажатлари (Тошкент шаҳри ва ҳалқа йўлидан 10 км ташқаригача) компания ҳисобидан қопланади.",
    "Шунингдек, агар зарар автомобил суғурта суммасининг 5% идан ошмаса, баъзи тирналиш ва шикастланишлар учун ЙҲХБ (ГАИ) маълумотномаси ҳам талаб қилинмайди!"
  ],
  hujjat: [
    "<b>Нималар ҳимоя қилинади?</b> Биргина полис орқали бир вақтнинг ўзида 5 та энг муҳим ҳужжат: ID-карта, хорижга чиқиш паспорти ('загран'), фуқаролиги бўлмаган шахс яшаш гувоҳномаси, ҳайдовчилик гувоҳномаси ('права') ва транспорт воситасининг қайд этиш гувоҳномаси ('техпаспорт') ҳимояга олинади.",
    "<b>Қандай ҳолатларда тўланади?</b> Ҳужжатларингиз босқинчилик ёки ўғрилик натижасида қўлингиздан кетса, ёнғин, сув тошқини ва зилзилада нобуд бўлса, шунингдек, ўзингиз билмасдан йўқотиб қўйсангиз — уларни тиклаш учун тўланадиган барча давлат божлари ва тўловлар компания томонидан тўлиқ қоплаб берилади.",
    "<b class='text-accent-500'>Энг қизиқарли (Wow) факт:</b> Ушбу хотиржамликнинг нархи бир йилга бор-йўғи 50 000 сўм! Ҳужжатларни йўқотиш қанчалик кўп асаббузарлик ва молиявий жарималар талаб қилишини ҳисобга олсак, бу полис ҳақиқий 'халоскор'дир. Офисга келиш шарт эмас — сайт орқали 1 дақиқада онлайн расмийлаштирилади."
  ]
}

const getPolicyTitle = computed(() => {
  const map: Record<string, string> = {
    osgovts: 'OSAGO (Majburiy)',
    baxtsiz: 'Baxtsiz hodisalar',
    vzr: 'Travel',
    imushestvo: 'Mol-mulk',
    kasko: 'VIP KASKO',
    hujjat: 'Shaxsiy hujjatlar'
  }
  return map[wizardStore.formData.policyType as string] || wizardStore.formData.policyType || 'Sug\'urta'
})

const vehicleTypeLabel = computed(() => {
  const map: Record<string, string> = {
    yengil: 'Yengil avtomobil',
    yuk: 'Yuk avtomobili',
    avtobus: 'Avtobus / Mikroavtobus',
    boshqa: 'Boshqa turdagi'
  }
  return map[osagoStore.vehicle.typeId] || ''
})

const regionLabel = computed(() => {
  const map: Record<string, string> = {
    toshkent: 'Toshkent sh. va viloyati',
    viloyat: 'Boshqa viloyatlar',
    chet_el: 'Chet davлат'
  }
  return map[osagoStore.vehicle.regionId] || ''
})

const driversLabel = computed(() => {
  return osagoStore.details.driverNumberRestriction ? 'Cheklangan (5 kishigacha)' : 'Cheklanmagan'
})

const getCalculatedPriceRaw = computed(() => {
  if (wizardStore.formData.policyType === 'osgovts') {
    const SS = 80000000;
    const TB = osagoStore.vehicle.typeId === 'yengil' ? 0.2 : (osagoStore.vehicle.typeId === 'yuk' ? 0.35 : (osagoStore.vehicle.typeId === 'avtobus' ? 0.4 : 0.075));
    const KT = osagoStore.vehicle.regionId === 'toshkent' ? 1.2 : (osagoStore.vehicle.regionId === 'chet_el' ? 2.0 : 1.0);
    const KBM = 1.0;
    
    let price = 0;
    if (!osagoStore.details.driverNumberRestriction) { // Cheklanmagan VIP
      price = (SS * TB * KT * 2.0) / 100;
    } else {
      price = (SS * TB * KT * KBM) / 100;
    }

    if (osagoStore.cost.seasonalInsuranceId === '6') {
      price = price * 0.7;
    }

    if (osagoStore.cost.discountId === '1' && osagoStore.applicant.residentOfUzb === 1) { // Example logic for discount
      // Assuming discount logic here
    }
    
    // Using a simplified version of the logic from wizardStore but with osagoStore data
    return price;
  }
  
  if (wizardStore.formData.policyType === 'vzr') {
    // ... existing logic but using wizardStore ...
    const rates: Record<string, number> = {
      basic: 4000,
      classic: 7000,
      absolut: 10000
    }
    const baseRate = rates[wizardStore.formData.travelProgram] || 4000
    
    let days = 1
    if (wizardStore.formData.startDate && wizardStore.formData.travelEndDate) {
      const start = new Date(wizardStore.formData.startDate)
      const end = new Date(wizardStore.formData.travelEndDate)
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 0) days = diffDays
    }
    
    let totalSum = 0
    wizardStore.formData.insuredPersons.forEach(person => {
      let personPrice = baseRate * days
      const age = person.age || 35
      if (age < 7) personPrice *= 1.5
      else if (age > 65) personPrice *= 2.0
      if (!person.isResident) personPrice *= 1.5
      totalSum += personPrice
    })
    if (wizardStore.formData.insuredPersons.length >= 5) totalSum *= 0.95
    return totalSum
  }

  if (wizardStore.formData.policyType === 'baxtsiz') {
    return (wizardStore.formData.accidentData.coverage || 0) * 0.01;
  }

  const basePrices: Record<string, number> = {
    baxtsiz: 50000,
    vzr: 120000,
    imushestvo: 99000,
    kasko: 900000,
    hujjat: 49000
  }
  let price = basePrices[wizardStore.formData.policyType as string] || 0
  if (wizardStore.formData.premiumTier === 'premium') price = price * 2.5
  return price
})

const currentFormComponent = computed(() => {
  const map: Record<string, any> = {
    osgovts: OsgovtsForm,
    kasko: OsgovtsForm,
    vzr: TravelForm,
    imushestvo: ImushestvoForm,
    baxtsiz: AccidentForm,
    hujjat: BasePersonForm
  }
  return map[wizardStore.formData.policyType as string] || BasePersonForm
})

const getCalculatedPrice = computed(() => {
  const price = getCalculatedPriceRaw.value;
  if (wizardStore.formData.policyType === 'vzr' && !wizardStore.formData.isResident) {
    return '$ ' + price.toFixed(2);
  }
  return new Intl.NumberFormat('uz-UZ').format(Math.round(price)) + ' UZS'
})

const getLimitAmount = computed(() => {
  if (wizardStore.formData.policyType === 'vzr') {
    return wizardStore.formData.premiumTier === 'premium' ? '50 000 000 UZS' : '5 000 000 UZS'
  }
  if (wizardStore.formData.policyType === 'baxtsiz') {
    return new Intl.NumberFormat('uz-UZ').format(wizardStore.formData.accidentData.coverage) + ' UZS'
  }
  return '80 000 000 UZS'
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8 items-start">
    
    <!-- Left Column: Wizard Form -->
    <div class="flex-1 w-full">
      <!-- Premium Segmented Progress Bar -->
      <div class="mb-10 w-full">
        <div class="flex p-2 bg-slate-100/80 backdrop-blur-xl rounded-[24px] w-full shadow-inner overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div 
            v-for="step in steps" 
            :key="step.id"
            class="flex-1 min-w-[120px] relative rounded-[18px] flex flex-col items-center justify-center py-3 px-2 transition-all duration-500"
            :class="wizardStore.currentStep === step.id ? 'bg-white shadow-[0_8px_30px_rgba(20,184,166,0.15)] ring-1 ring-slate-200/50 transform scale-100 z-10' : 'transform scale-95 opacity-70 hover:opacity-100'"
          >
            <div class="flex items-center justify-center mb-2">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-black transition-all duration-500"
                :class="wizardStore.currentStep === step.id ? 'bg-gradient-to-br from-[#2dd4bf] to-[#0d9488] text-white shadow-lg shadow-teal-500/30' : (wizardStore.currentStep > step.id ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-500')"
              >
                <Check v-if="wizardStore.currentStep > step.id" class="w-4 h-4 stroke-[3]" />
                <span v-else>{{ step.id }}</span>
              </div>
            </div>
            <span 
              class="text-[12px] md:text-sm text-center font-bold transition-colors whitespace-nowrap"
              :class="wizardStore.currentStep === step.id ? 'text-slate-800' : 'text-slate-500'"
            >
              {{ step.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- Wizard Content Cards -->
      <div class="glass-card p-6 md:p-10 min-h-[400px] flex flex-col">
        
        <!-- Wizard Form Component -->
        <div v-if="wizardStore.currentStep === 1 || (['baxtsiz', 'vzr', 'imushestvo', 'hujjat'].includes(wizardStore.formData.policyType) && wizardStore.currentStep < steps.length)" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <component :is="currentFormComponent" />
        </div>

        <!-- STEP 2 (OSAGO): Shaxsiy ma'lumotlar -->
        <div v-if="wizardStore.currentStep === 2 && wizardStore.formData.policyType === 'osgovts'" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 class="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Avto mulkdori haqida ma'lumot</h3>
          
          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
              Avtomobil egasi
              <span class="text-red-500">*</span>
            </label>
            <input 
              :value="osagoStore.owner.person.fullName.firstname"
              @input="handleOwnerNameInput"
              type="text" 
              placeholder="TAYLAKOV ULUGBEK NORBEKOVICH" 
              class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                Pasport seriya va raqami/ID
                <span class="text-red-500">*</span>
              </label>
              <div class="flex gap-3">
                <input 
                  :value="osagoStore.owner.person.passportData.seria"
                  @input="handleOwnerSeriaInput"
                  type="text" 
                  placeholder="AA" 
                  class="w-20 bg-slate-50 border-0 rounded-2xl px-4 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all text-center"
                  maxlength="2"
                  required
                />
                <input 
                  :value="osagoStore.owner.person.passportData.number"
                  @input="handleOwnerNumberInput"
                  type="text" 
                  placeholder="0000000" 
                  class="flex-1 bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
                  maxlength="7"
                  required
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
                Sug'urtaning boshlanish kunini kiriting
                <span class="text-red-500">*</span>
              </label>
              <input 
                :value="osagoStore.details.startDate"
                @input="handleDateInput"
                type="text" 
                inputmode="numeric"
                placeholder="11.05.2026" 
                class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
                maxlength="10"
                required
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
              Telefon
              <span class="text-red-500">*</span>
            </label>
            <input 
              :value="osagoStore.applicant.person.phoneNumber"
              @input="handlePhoneInput"
              type="text" 
              inputmode="tel"
              placeholder="+998 90 971-01-11" 
              class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
              required
            />
          </div>

          <div class="mb-6">
            <label class="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-2xl border-0 transition-all duration-300" :class="osagoStore.cost.discountId === '1' ? 'ring-2 ring-[#14b8a6]' : 'hover:bg-slate-100'">
              <div class="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" :true-value="'1'" :false-value="'0'" v-model="osagoStore.cost.discountId" class="peer sr-only" />
                <div class="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-[#14b8a6] peer-checked:border-[#14b8a6] transition-all flex items-center justify-center">
                  <Check v-if="osagoStore.cost.discountId === '1'" class="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div class="flex-1">
                <span class="block font-semibold text-slate-800">Men imtiyozga egaman (50% chegirma)</span>
                <span class="block text-sm text-slate-500 mt-1">Pensionerlar, nogironligi bor shaxslar va faxriylar uchun.</span>
              </div>
            </label>
          </div>
        </div>

        <!-- STEP 2 (Other): Policy Options -->
        <div v-if="wizardStore.currentStep === 2 && !['osgovts', 'baxtsiz'].includes(wizardStore.formData.policyType)" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 class="text-2xl font-bold mb-6 text-slate-900">Polis ta'rifini tanlang</h2>
          
          <div class="grid gap-4">
            <!-- Travel STANDART -->
            <label 
              v-if="wizardStore.formData.policyType === 'vzr'"
              class="relative flex cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300"
              :class="wizardStore.formData.premiumTier === 'standard' ? 'border-teal-500 bg-teal-50/30' : 'border-slate-100 bg-white hover:border-teal-200'"
            >
              <input type="radio" value="standard" v-model="wizardStore.formData.premiumTier" class="sr-only" />
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <span class="text-xl font-bold text-slate-900">STANDART</span>
                  <span class="text-teal-600 font-bold">4 000 so'm / kun</span>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-slate-600">
                    <Check class="w-4 h-4 text-teal-500" />
                    <span>Umumiy qoplama: <b>5 000 000 UZS</b></span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500 ml-6">
                    <span>Tibbiy xizmatlar: 4 mln gacha</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500 ml-6">
                    <span>Transport xizmatlari: 1 mln gacha</span>
                  </div>
                </div>
              </div>
            </label>

            <!-- Travel COMFORT -->
            <label 
              v-if="wizardStore.formData.policyType === 'vzr'"
              class="relative flex cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300"
              :class="wizardStore.formData.premiumTier === 'premium' ? 'border-teal-500 bg-teal-50/30 shadow-lg' : 'border-slate-100 bg-white hover:border-teal-200'"
            >
              <input type="radio" value="premium" v-model="wizardStore.formData.premiumTier" class="sr-only" />
              <div class="flex-1">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl font-bold text-slate-900">COMFORT</span>
                    <span class="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full uppercase">Tavsiya etiladi</span>
                  </div>
                  <span class="text-teal-600 font-bold">8 000 so'm / kun</span>
                </div>
                <div class="space-y-2">
                  <div class="flex items-center gap-2 text-sm text-slate-600">
                    <Check class="w-4 h-4 text-teal-500" />
                    <span>Umumiy qoplama: <b>50 000 000 UZS</b></span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500 ml-6">
                    <span>Tibbiy xizmatlar: 10 mln gacha</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500 ml-6">
                    <span>Transport xizmatlari: 40 mln gacha</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500 ml-6">
                    <span>Repatriatsiya xizmati (vafot etganda)</span>
                  </div>
                </div>
              </div>
            </label>

            <!-- Generic Options for other types -->
            <template v-if="wizardStore.formData.policyType !== 'vzr' && wizardStore.formData.policyType !== 'osgovts'">
              <label 
                class="relative flex cursor-pointer p-5 rounded-xl border transition-all duration-300"
                :class="wizardStore.formData.premiumTier === 'standard' ? 'bg-primary-50 border-primary-500 shadow-[0_0_15px_rgba(30,58,138,0.1)]' : 'bg-white border-slate-200 hover:bg-slate-50'"
              >
                <input type="radio" value="standard" v-model="wizardStore.formData.premiumTier" class="sr-only" />
                <div class="flex-1">
                  <span class="block text-lg font-bold text-slate-900 mb-1">Standard Himoya</span>
                  <span class="block text-sm text-slate-500">Baza va tayanch xizmatlar.</span>
                </div>
              </label>

              <label 
                class="relative flex cursor-pointer p-5 rounded-xl border transition-all duration-300"
                :class="wizardStore.formData.premiumTier === 'premium' ? 'bg-orange-50 border-accent-500 shadow-[0_0_15_rgba(217,119,6,0.1)]' : 'bg-white border-slate-200 hover:bg-slate-50'"
              >
                <input type="radio" value="premium" v-model="wizardStore.formData.premiumTier" class="sr-only" />
                <div class="flex-1">
                  <span class="block text-lg font-bold text-slate-900 mb-1">VIP Qoplash </span>
                  <span class="block text-sm text-slate-500">Kengaytirilgan himoya va qo'shimcha yordam.</span>
                </div>
              </label>
            </template>
          </div>
        </div>

        <!-- STEP 3 (OSAGO): Policy Options -->
        <div v-if="wizardStore.currentStep === 3 && wizardStore.formData.policyType === 'osgovts'" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 class="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Polis</h3>
          
          <div class="mb-8">
            <h4 class="text-slate-700 font-semibold mb-4">Haydovchilar soni</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Premium (VIP) -->
              <label 
                class="relative flex flex-col cursor-pointer p-6 rounded-3xl border-0 transition-all duration-300"
                :class="!osagoStore.details.driverNumberRestriction ? 'bg-teal-50 ring-2 ring-teal-400' : 'bg-slate-50 hover:bg-slate-100'"
              >
                <input type="radio" :value="false" v-model="osagoStore.details.driverNumberRestriction" class="sr-only" />
                <div class="flex items-center justify-between mb-4">
                  <span class="text-lg font-bold text-slate-800">Cheklanmagan (VIP)</span>
                  <div class="w-6 h-6 rounded-full border-4 transition-colors"
                       :class="!osagoStore.details.driverNumberRestriction ? 'border-teal-400 bg-teal-500' : 'border-slate-200 bg-white'">
                  </div>
                </div>
              </label>

              <!-- Standard -->
              <label 
                class="relative flex flex-col cursor-pointer p-6 rounded-3xl border-0 transition-all duration-300"
                :class="osagoStore.details.driverNumberRestriction ? 'bg-teal-50 ring-2 ring-teal-400' : 'bg-slate-50 hover:bg-slate-100'"
              >
                <input type="radio" :value="true" v-model="osagoStore.details.driverNumberRestriction" class="sr-only" />
                <div class="flex items-center justify-between mb-4">
                  <span class="text-lg font-bold text-slate-800">Cheklangan (5 haydovchigacha)</span>
                  <div class="w-6 h-6 rounded-full border-4 transition-colors"
                       :class="osagoStore.details.driverNumberRestriction ? 'border-teal-400 bg-teal-500' : 'border-slate-200 bg-white'">
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <h4 class="text-slate-700 font-semibold mb-4">Sug'urta muddati</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                class="relative flex items-center justify-between cursor-pointer p-5 rounded-2xl border-0 transition-all duration-300"
                :class="osagoStore.cost.seasonalInsuranceId === '12' ? 'bg-teal-50 ring-2 ring-teal-400' : 'bg-slate-50 hover:bg-slate-100'"
              >
                <input type="radio" value="12" v-model="osagoStore.cost.seasonalInsuranceId" class="sr-only" />
                <span class="text-lg font-medium text-slate-800">12 oy</span>
                <div class="w-6 h-6 rounded-full border-4 transition-colors"
                     :class="osagoStore.cost.seasonalInsuranceId === '12' ? 'border-teal-400 bg-teal-500' : 'border-slate-200 bg-white'">
                </div>
              </label>
              <label 
                class="relative flex items-center justify-between cursor-pointer p-5 rounded-2xl border-0 transition-all duration-300"
                :class="osagoStore.cost.seasonalInsuranceId === '6' ? 'bg-teal-50 ring-2 ring-teal-400' : 'bg-slate-50 hover:bg-slate-100'"
              >
                <input type="radio" value="6" v-model="osagoStore.cost.seasonalInsuranceId" class="sr-only" />
                <span class="text-lg font-medium text-slate-800">6 oy</span>
                <div class="w-6 h-6 rounded-full border-4 transition-colors"
                     :class="osagoStore.cost.seasonalInsuranceId === '6' ? 'border-teal-400 bg-teal-500' : 'border-slate-200 bg-white'">
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- STEP 4 (OSAGO Standard): Haydovchilar -->
        <div v-if="wizardStore.currentStep === 4 && wizardStore.formData.policyType === 'osgovts' && osagoStore.details.driverNumberRestriction" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <h3 class="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Haydovchilar</h3>

          <!-- Haydovchi 1 -->
          <div class="mb-6">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700">Haydovchi 1</label>
              <button class="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">O'chirish</button>
            </div>
            <input 
              v-model="osagoStore.owner.person.fullName.firstname"
              type="text" 
              readonly
              class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none opacity-80"
            />
          </div>

          <!-- Additional Drivers -->
          <div v-for="(driver, index) in osagoStore.drivers" :key="index" class="mb-6 relative">
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-semibold text-slate-700">Haydovchi {{ index + 2 }}</label>
              <button @click="osagoStore.drivers.splice(index, 1)" class="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">O'chirish</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Pasport seriya va raqami/ID</label>
                <div class="flex gap-3">
                  <input 
                    :value="driver.passportData.seria"
                    @input="handleDriverSeriaInput(index, $event)"
                    type="text" 
                    placeholder="AA" 
                    class="w-20 bg-slate-50 border-0 rounded-2xl px-4 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all text-center"
                    maxlength="2"
                  />
                  <input 
                    :value="driver.passportData.number"
                    @input="handleDriverNumberInput(index, $event)"
                    type="text" 
                    inputmode="numeric"
                    placeholder="0000000" 
                    class="flex-1 bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
                    maxlength="7"
                  />
                </div>
              </div>
              
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1">Tug'ilgan sanasi</label>
                <input 
                  :value="driver.birthDate"
                  @input="handleDriverBirthDateInput(index, $event)"
                  type="text" 
                  inputmode="numeric"
                  placeholder="18.06.2004" 
                  class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
                  maxlength="10"
                />
              </div>
            </div>
          </div>

          <!-- Add driver button -->
          <div class="flex justify-center mt-4">
            <button 
              v-if="osagoStore.drivers.length < 4"
              @click="osagoStore.drivers.push({ passportData: { seria: '', number: '' }, birthDate: '' })"
              class="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-900 transition-colors py-2 px-4 rounded-xl hover:bg-slate-100"
            >
              <span class="text-xl leading-none font-light">+</span> Yana haydovchi qo'shish
            </button>
          </div>
        </div>

        <!-- STEP 3 (Other) / STEP 4/5 (OSAGO): Payment -->
        <div v-if="wizardStore.currentStep === steps.length" class="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
          <h2 class="text-2xl font-bold mb-6 text-slate-900">Xaridni yakunlash</h2>
          <div class="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
            <div class="flex justify-between mb-4">
              <span class="text-slate-600">Polis turi:</span>
              <span class="text-slate-900 font-medium capitalize">{{ getPolicyTitle }}</span>
            </div>
            <div class="flex justify-between items-center mt-6 pt-4 border-t border-slate-200">
              <span class="text-slate-600">Jami to'lov:</span>
              <span class="text-3xl font-bold text-accent-500">
                {{ getCalculatedPrice }}
              </span>
            </div>
          </div>
          
          <!-- Payment Methods Grid -->
          <div>
            <h3 class="text-[15px] font-bold text-slate-700 mb-4 uppercase tracking-wider">To'lov tizimini tanlang</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
              <!-- Payme -->
              <label 
                class="relative h-16 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                :class="selectedPaymentMethod === 'payme' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white'"
              >
                <input type="radio" value="payme" v-model="selectedPaymentMethod" class="sr-only" />
                <img src="/Tulov_tizimlar/payme-zoom.png" alt="Payme" class="h-8 object-contain" />
              </label>

              <!-- Click -->
              <label 
                class="relative h-16 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                :class="selectedPaymentMethod === 'click' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white'"
              >
                <input type="radio" value="click" v-model="selectedPaymentMethod" class="sr-only" />
                <img src="/Tulov_tizimlar/click-zoom.png" alt="Click" class="h-8 object-contain" />
              </label>

              <!-- Uzum -->
              <label 
                class="relative h-16 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                :class="selectedPaymentMethod === 'uzum' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white'"
              >
                <input type="radio" value="uzum" v-model="selectedPaymentMethod" class="sr-only" />
                <img src="/Tulov_tizimlar/uzumbank-zoom.png" alt="Uzum" class="h-6 object-contain" />
              </label>

              <!-- Oson -->
              <label 
                class="relative h-16 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                :class="selectedPaymentMethod === 'oson' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white'"
              >
                <input type="radio" value="oson" v-model="selectedPaymentMethod" class="sr-only" />
                <img src="/Tulov_tizimlar/oson-zoom.png" alt="Oson" class="h-6 object-contain" />
              </label>

              <!-- Xazna -->
              <label 
                class="relative h-16 flex items-center justify-center p-3 rounded-2xl border-2 cursor-pointer transition-all duration-300"
                :class="selectedPaymentMethod === 'xazna' ? 'border-teal-500 bg-teal-50/50' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white'"
              >
                <input type="radio" value="xazna" v-model="selectedPaymentMethod" class="sr-only" />
                <img src="/Tulov_tizimlar/xazna-zoom.png" alt="Xazna" class="h-6 object-contain" />
              </label>
            </div>
          </div>

          <!-- JSON Debug Preview (Only for OSAGO on final step) -->
          <div v-if="wizardStore.formData.policyType === 'osgovts'" class="mt-12 pt-8 border-t border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2 text-slate-400">
                <div class="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <span class="text-[11px] font-bold uppercase tracking-[0.2em]">Yig'ilgan JSON Payload (Real-time)</span>
              </div>
              <button 
                @click="copyJson" 
                class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-all"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-teal-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copied ? 'Nusxalandi!' : 'JSONni nusxalash' }}</span>
              </button>
            </div>
            <div class="bg-slate-900 rounded-3xl p-6 overflow-hidden shadow-2xl relative group border border-slate-800">
              <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none"></div>
              <pre class="text-[12px] font-mono text-teal-400/90 leading-relaxed overflow-x-auto custom-scrollbar max-h-[400px]">{{ JSON.stringify(osagoStore.getPayload(), null, 2) }}</pre>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="mt-8 flex items-center gap-4 pt-6">
          <button 
            @click="wizardStore.prevStep"
            v-if="wizardStore.currentStep > 1"
            class="px-6 py-3.5 rounded-2xl bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 transition-all flex items-center gap-2"
          >
            <ChevronRight class="w-4 h-4 rotate-180" />
            Orqaga
          </button>
          
          <button 
            @click="handleNext"
            class="px-8 py-3.5 rounded-2xl bg-[#14b8a6] text-white font-bold flex items-center gap-2 hover:bg-teal-600 active:scale-[0.98] transition-all"
          >
            {{ wizardStore.currentStep === steps.length ? 'To\'lash' : (wizardStore.currentStep === steps.length - 1 ? 'To\'lovga o\'tish' : 'Davom etish') }}
            <ChevronRight v-if="wizardStore.currentStep !== steps.length" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Right Column: Price Calculator & Details -->
    <div class="w-full lg:w-[420px] flex flex-col gap-6 sticky top-24">
      
      <!-- Premium Calculator Box -->
      <div class="rounded-[24px] p-6 md:p-8 bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <!-- Glow Decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-teal-100/50 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none"></div>
        
        <div class="flex justify-between items-start mb-6 border-b border-slate-100 pb-5 relative z-10">
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-wide">{{ getPolicyTitle }}</h3>
        </div>
        
        <div class="space-y-4 text-[14.5px] mb-8 border-b border-slate-100 pb-6 relative z-10">
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType !== 'vzr'">
            <span class="text-slate-500 font-medium">Sug'urta muddati</span>
            <span class="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">1 yillik</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'vzr'">
            <span class="text-slate-500 font-medium">Sayohat kunlari</span>
            <span class="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
              {{ wizardStore.formData.startDate && wizardStore.formData.travelEndDate ? Math.max(1, Math.ceil((new Date(wizardStore.formData.travelEndDate).getTime() - new Date(wizardStore.formData.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 1 }} kun
            </span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'vzr'">
            <span class="text-slate-500 font-medium">Mamlakat</span>
            <span class="font-bold text-slate-800 text-right">{{ wizardStore.formData.travelCountries.join(', ') || 'Tanlanmagan' }}</span>
          </div>

          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'vzr'">
            <span class="text-slate-500 font-medium">Sayohatchilar</span>
            <span class="font-bold text-slate-800">{{ wizardStore.formData.insuredPersons.length }} kishi</span>
          </div>

          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'vzr'">
            <span class="text-slate-500 font-medium">Rezidentlik</span>
            <span class="font-bold text-slate-800">{{ wizardStore.formData.insuredPersons[0].isResident ? 'O\'zbekiston' : 'Xorijiy' }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'osgovts'">
            <span class="text-slate-500 font-medium">Transport turi</span>
            <span class="font-bold text-slate-800 text-right ml-4">{{ vehicleTypeLabel }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'osgovts'">
            <span class="text-slate-500 font-medium">Hudud</span>
            <span class="font-bold text-slate-800 text-right ml-4">{{ regionLabel }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'osgovts' || wizardStore.formData.policyType === 'kasko'">
            <span class="text-slate-500 font-medium">Haydovchilar soni</span>
            <span class="font-bold text-slate-800">{{ driversLabel }}</span>
          </div>
          
          <div class="flex justify-between items-center" v-if="wizardStore.formData.policyType === 'osgovts' || wizardStore.formData.policyType === 'vzr' || wizardStore.formData.policyType === 'baxtsiz'">
            <span class="text-slate-500 font-medium">Qoplash miqdori</span>
            <span class="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{{ getLimitAmount }}</span>
          </div>
        </div>
        
        <div class="flex justify-between items-end mb-8 relative z-10">
          <span class="text-base font-bold text-slate-600 mb-1">To'lovga jami</span>
          <span class="text-3xl font-black text-[#14b8a6]">{{ getCalculatedPrice }}</span>
        </div>
        
        <button class="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-900/20 relative z-10">
          Sug'urta qoidalari
        </button>
      </div>

      <!-- Detail Wow Facts Box -->
      <div v-if="policyDetails[wizardStore.formData.policyType as string]" class="glass-card p-6 border border-slate-200 bg-slate-50/80 shadow-sm animate-in fade-in duration-500">
        <div class="flex items-center gap-2 mb-4">
          <ShieldAlert class="w-5 h-5 text-accent-500" />
          <h4 class="text-sm font-bold uppercase tracking-wider text-slate-800">Батафсил маълумот</h4>
        </div>
        
        <div class="text-[13.5px] text-slate-600 space-y-4 leading-relaxed">
          <p 
            v-for="(paragraph, index) in policyDetails[wizardStore.formData.policyType as string]" 
            :key="index" 
            v-html="paragraph"
            class="p-0 m-0"
          ></p>
        </div>
      </div>
      
    </div>
  </div>
</template>
