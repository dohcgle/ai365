<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useWizardStore } from '../../stores/wizard'
import { useHujjatStore } from '../../stores/hujjat'
import { CheckCircle2, Loader2, Check } from 'lucide-vue-next'

const wizardStore = useWizardStore()
const hujjatStore = useHujjatStore()
const isFetching = ref(false)

const handlePassportNumber = (e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(0, 7)
  hujjatStore.applicant.person.passportData.number = val
  input.value = val
}

const handlePinfl = (e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(0, 14)
  hujjatStore.applicant.person.passportData.pinfl = val
  input.value = val
}

const handleDateInput = (e: Event, field: 'startDate' | 'endDate') => {
  const input = e.target as HTMLInputElement
  let val = input.value.replace(/\D/g, '')
  if (val.length > 8) val = val.slice(0, 8)
  
  let formatted = ''
  if (val.length > 0) {
    formatted = val.slice(0, 2)
    if (val.length > 2) {
      formatted += '.' + val.slice(2, 4)
      if (val.length > 4) {
        formatted += '.' + val.slice(4, 8)
      }
    }
  }
  
  hujjatStore.details[field] = formatted
  input.value = formatted
}

const fetchPersonalData = async () => {
  if (isFetching.value) return
  isFetching.value = true
  await hujjatStore.fillWithFakeData()
  isFetching.value = false
}

watch(() => hujjatStore.applicant.person.passportData.pinfl, (newVal) => {
  if (newVal.replace(/\D/g, '').length === 14) {
    fetchPersonalData()
  }
})

onMounted(() => {
  if (!hujjatStore.details.startDate) {
    const today = new Date()
    const d = today.getDate().toString().padStart(2, '0')
    const m = (today.getMonth() + 1).toString().padStart(2, '0')
    const y = today.getFullYear()
    hujjatStore.details.startDate = `${d}.${m}.${y}`
    
    // Default endDate is 1 year later
    hujjatStore.details.endDate = `${d}.${m}.${y + 1}`
  }
})

const toggleDoc = (doc: string) => {
  const current = [...hujjatStore.details.selectedDocuments]
  const idx = current.indexOf(doc)
  if (idx > -1) {
    current.splice(idx, 1)
  } else {
    current.push(doc)
  }
  hujjatStore.details.selectedDocuments = current
}

const documentTypes = [
  'ID-karta',
  'Xorijga chiqish pasporti ("zagranpasport")',
  'Fuqaroligi bo\'lmagan shaxsning yashash guvohnomasi',
  'Haydovchilik guvohnomasi ("prava")',
  'Transport vositasini qayd etish guvohnomasi ("texpasport")'
]
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-700">
    <!-- Step 1: Pasport ma'lumotlari -->
    <div v-if="wizardStore.currentStep == 1" class="space-y-8">
      <div class="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight">Pasport ma'lumotlari</h3>
        </div>

        <div class="space-y-8">
          <!-- 1-qator: Passport -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div class="md:col-span-3 relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Seriya</label>
              <input 
                v-model="hujjatStore.applicant.person.passportData.seria"
                type="text" 
                placeholder="AD"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase placeholder:text-slate-300"
              />
            </div>

            <div class="md:col-span-4 relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Raqam</label>
              <input 
                :value="hujjatStore.applicant.person.passportData.number"
                @input="handlePassportNumber"
                type="text" 
                inputmode="numeric"
                placeholder="1074617"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
              />
            </div>

            <div class="md:col-span-5 relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">JShShIR</label>
              <div class="relative">
                <input 
                  :value="hujjatStore.applicant.person.passportData.pinfl"
                  @input="handlePinfl"
                  type="text" 
                  inputmode="numeric"
                  maxlength="14"
                  placeholder="31002873680015"
                  class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
                />
                <div v-if="isFetching" class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <Loader2 class="w-5 h-5 text-emerald-500 animate-spin" />
                </div>
              </div>
            </div>
          </div>

          <!-- 2-qator: Ism sharif -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Familiya</label>
              <input 
                v-model="hujjatStore.applicant.person.fullName.lastname"
                type="text" 
                class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
                readonly
              />
            </div>
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Ism</label>
              <input 
                v-model="hujjatStore.applicant.person.fullName.firstname"
                type="text" 
                class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
                readonly
              />
            </div>
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Otasining ismi</label>
              <input 
                v-model="hujjatStore.applicant.person.fullName.middlename"
                type="text" 
                class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
                readonly
              />
            </div>
          </div>

          <!-- 3-qator: Manzil -->
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Manzil</label>
            <input 
              v-model="hujjatStore.applicant.address"
              type="text" 
              class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
              readonly
            />
          </div>

          <!-- 4-qator: Oferta -->
          <div class="pt-4 border-t border-slate-50">
            <label class="flex items-center gap-4 cursor-pointer group w-max">
              <div class="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  v-model="hujjatStore.details.agreeToOffer" 
                  class="peer sr-only" 
                />
                <div class="w-6 h-6 bg-slate-100 border-2 border-slate-200 rounded-lg transition-all duration-300 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 flex items-center justify-center">
                  <CheckCircle2 v-if="hujjatStore.details.agreeToOffer" class="w-4 h-4 text-white" />
                </div>
              </div>
              <span class="text-sm text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">
                <span class="text-emerald-600 underline font-bold">Ommaviy oferta</span> bilan tanishdim va shartlariga roziman
              </span>
            </label>
          </div>
        </div>
      </div>

    </div>

    <!-- Step 2: Sug'urta ma'lumotlari -->
    <div v-if="wizardStore.currentStep == 2" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <!-- Yangi card: Sug'urtalanadigan hujjatlar -->
      <div class="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50">
        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          Quyidagi hujjatlar sug'urtalanadi
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="doc in documentTypes" 
            :key="doc"
            @click="toggleDoc(doc)"
            class="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 transition-all cursor-pointer group select-none outline-none"
            :class="hujjatStore.details.selectedDocuments.includes(doc) ? 'bg-emerald-50/50' : 'hover:border-emerald-100 hover:bg-slate-50'"
          >
            <div class="relative flex items-center justify-center pointer-events-none">
              <div class="w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center"
                :class="hujjatStore.details.selectedDocuments.includes(doc) ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'"
              >
                <Check v-if="hujjatStore.details.selectedDocuments.includes(doc)" class="w-4 h-4 text-white" />
              </div>
            </div>
            <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
              {{ doc }}
            </span>
          </div>
        </div>
      </div>

      <!-- Yangi card: Polis ma'lumotlari -->
      <div class="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50">
        <h3 class="text-xl font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <CheckCircle2 class="w-6 h-6" />
          </div>
          Polis ma'lumotlari
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Boshlanish sanasi</label>
            <input 
              :value="hujjatStore.details.startDate"
              @input="(e) => handleDateInput(e, 'startDate')"
              type="text" 
              placeholder="13.05.2024"
              class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1 uppercase">Tugash sanasi</label>
            <input 
              :value="hujjatStore.details.endDate"
              @input="(e) => handleDateInput(e, 'endDate')"
              type="text" 
              placeholder="12.05.2025"
              class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-orange-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}
</style>
