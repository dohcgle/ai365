<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useWizardStore } from '../../stores/wizard'
import { Search, ChevronRight, CheckCircle2 } from 'lucide-vue-next'

const store = useWizardStore()

// Sanani DD.MM.YYYY formatiga keltirish
const formatDate = (date: Date) => {
  const d = date.getDate().toString().padStart(2, '0')
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const y = date.getFullYear()
  return `${d}.${m}.${y}`
}

// DD.MM.YYYY dan Date ob'ektiga o'tkazish
const parseDate = (str: string) => {
  const parts = str.split('.')
  if (parts.length === 3) {
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
  }
  return null
}

// Boshlanish sanasi o'zgarganda hisoblash
watch(() => store.formData.accidentData.startDate, (newVal) => {
  if (newVal.length === 10) {
    const start = parseDate(newVal)
    if (start && !isNaN(start.getTime())) {
      const end = new Date(start)
      end.setFullYear(start.getFullYear() + 1)
      store.formData.accidentData.endDate = formatDate(end)
    }
  }
})

// Kunlar sonini hisoblash
watch([() => store.formData.accidentData.startDate, () => store.formData.accidentData.endDate], ([startStr, endStr]) => {
  if (startStr.length === 10 && endStr.length === 10) {
    const start = parseDate(startStr)
    const end = parseDate(endStr)
    if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      store.formData.accidentData.daysCount = diffDays
    }
  }
})

onMounted(() => {
  // Boshlang'ich qiymat sifatida bugungi sanani qo'yish (ixtiyoriy)
  if (!store.formData.accidentData.startDate) {
    store.formData.accidentData.startDate = formatDate(new Date())
  }
})
</script>

<template>
  <div class="space-y-8">
    <!-- Form Content -->
    <div class="bg-white rounded-[32px] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden">
      <div v-if="store.currentStep == 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div class="md:col-span-3 relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Passport seriyasi</label>
            <input 
              v-model="store.formData.accidentData.passportSeries"
              type="text" 
              placeholder="AD"
              class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase placeholder:text-slate-300"
            />
          </div>

          <div class="md:col-span-4 relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Passport raqam</label>
            <input 
              v-model="store.formData.accidentData.passportNumber"
              type="text" 
              placeholder="1074617"
              class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          <div class="md:col-span-4 relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">JShShIR</label>
            <input 
              v-model="store.formData.accidentData.pinfl"
              type="text" 
              placeholder="31002873680015"
              class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-300"
            />
          </div>

          <div class="md:col-span-1">
            <button class="w-full h-[60px] bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
              <Search class="w-6 h-6" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Familiya</label>
            <input 
              v-model="store.formData.accidentData.lastName"
              type="text" 
              class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
              readonly
            />
          </div>
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Ism</label>
            <input 
              v-model="store.formData.accidentData.firstName"
              type="text" 
              class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
              readonly
            />
          </div>
          <div class="relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Otasining ismi</label>
            <input 
              v-model="store.formData.accidentData.middleName"
              type="text" 
              class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
              readonly
            />
          </div>
        </div>

        <div class="relative group">
          <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Manzil</label>
          <input 
            v-model="store.formData.accidentData.address"
            type="text" 
            class="w-full bg-slate-50/50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none"
            readonly
          />
        </div>

        <div class="flex items-center gap-3 pt-4">
          <label class="relative flex items-center cursor-pointer group">
            <input type="checkbox" v-model="store.formData.accidentData.agreeToOffer" class="sr-only peer">
            <div class="w-6 h-6 border-2 border-slate-200 rounded-lg flex items-center justify-center transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 group-hover:border-emerald-400">
              <CheckCircle2 class="w-4 h-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
          </label>
          <span class="text-[14px] text-slate-600 font-medium">
            <a href="#" class="text-emerald-600 hover:underline italic font-bold">Ommaviy oferta</a> bilan tanishdim va shartlariga roziman
          </span>
        </div>
      </div>

      <div v-else-if="store.currentStep == 2" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 1. Sug'urta qoplamasini tanlang -->
          <div class="md:col-span-2 relative group">
            <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Sug'urta qoplamasini tanlang</label>
            <div class="relative">
              <select 
                v-model="store.formData.accidentData.coverage"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
              >
                <option :value="1000000">1 000 000 UZS</option>
                <option :value="2000000">2 000 000 UZS</option>
                <option :value="3000000">3 000 000 UZS</option>
                <option :value="4000000">4 000 000 UZS</option>
                <option :value="5000000">5 000 000 UZS</option>
                <option :value="6000000">6 000 000 UZS</option>
                <option :value="7000000">7 000 000 UZS</option>
                <option :value="8000000">8 000 000 UZS</option>
                <option :value="9000000">9 000 000 UZS</option>
                <option :value="10000000">10 000 000 UZS</option>
              </select>
              <ChevronRight class="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          <!-- 2. Sanalar va Kunlar -->
          <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Boshlanish sanasi</label>
              <input 
                v-model="store.formData.accidentData.startDate"
                type="text" 
                placeholder="12.05.2024"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Tugash sanasi</label>
              <input 
                v-model="store.formData.accidentData.endDate"
                type="text" 
                placeholder="12.05.2025"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
            <div class="relative group">
              <label class="block text-[13px] font-bold text-slate-600 mb-2 ml-1">Kunlar soni</label>
              <input 
                v-model="store.formData.accidentData.daysCount"
                type="number" 
                placeholder="365"
                class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-slate-900 font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="min-h-[300px] flex items-center justify-center text-slate-400 font-medium animate-in fade-in zoom-in-95 duration-500">
        Keyingi bosqich ma'lumotlari kutilmoqda...
      </div>
    </div>
  </div>
</template>
