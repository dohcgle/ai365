<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useWizardStore } from '../../stores/wizard'
import { User, Calendar, Search, Star, ChevronDown, X, Building2, Landmark } from 'lucide-vue-next'

const store = useWizardStore()

// Davlatlar ro'yxati
const countries = [
  'SHENGEN', 'EUROPE', 'POLAND', 'THAILAND', 'TURKEY', 
  'SAUDI ARABIA', 'RUSSIAN FEDERATION', 'ISRAEL', 
  'GERMANY', 'UNITED ARAB EMIRATES', 'EGYPT'
]

const searchQuery = ref('')
const isDropdownOpen = ref(false)

// Qidiruv natijalarini filtrlash
const filteredCountries = computed(() => {
  if (!searchQuery.value) return countries
  return countries.filter(c => 
    c.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Tanlash funksiyasi (Multi-select)
const toggleCountry = (country: string) => {
  const index = store.formData.travelCountries.indexOf(country)
  if (index === -1) {
    store.formData.travelCountries.push(country)
  } else {
    store.formData.travelCountries.splice(index, 1)
  }
  searchQuery.value = '' // Tanlangandan keyin qidiruvni tozalash
}

// Davlatni o'chirish
const removeCountry = (country: string) => {
  const index = store.formData.travelCountries.indexOf(country)
  if (index !== -1) {
    store.formData.travelCountries.splice(index, 1)
  }
}

// Tashqariga bosganda yopish
const dropdownRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

// Sayohat kunlarini avtomatik hisoblash
const travelDays = computed(() => {
  if (store.formData.startDate && store.formData.travelEndDate) {
    const start = new Date(store.formData.startDate)
    const end = new Date(store.formData.travelEndDate)
    const diffTime = end.getTime() - start.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }
  return 0
})

const policyTypes = [
  { id: 'single', name: 'Bir martalik sayohat' },
  { id: 'multi', name: 'Ko\'p martalik (Multiviza)' }
]

const programs = [
  { id: 'basic', name: 'Basic (EUR 25000)' },
  { id: 'classic', name: 'Classic (EUR 60000)' },
  { id: 'absolut', name: 'Absolut (EUR 80000)' }
]

const purposes = [
  { id: 'tourism', name: 'OTHER - (Turizm/Xizmat safari)' },
  { id: 'work', name: 'WORK - (Jismoniy mehnat)' },
  { id: 'sport', name: 'SPORT' },
  { id: 'study', name: 'STUDY' }
]

const travelerTypes = [
  { id: 'individual', name: 'Individual' },
  { id: 'family', name: 'OILA (3-6 kishi)' },
  { id: 'team1', name: 'TEAM 1 (11-20 kishi)' },
  { id: 'team2', name: 'TEAM 2 (21-50 kishi)' },
  { id: 'team3', name: 'TEAM 3 (51-75 kishi)' },
  { id: 'team4', name: 'TEAM 4 (76-100 kishi)' },
  { id: 'team5', name: 'TEAM 5 (100 kishidan ko\'p)' }
]

const regions = [
  { id: 'toshkent', name: 'Toshkent sh.' },
  { id: 'andijon', name: 'Andijon vil.' },
  { id: 'fargona', name: 'Farg\'ona vil.' },
  { id: 'namangan', name: 'Namangan vil.' },
  { id: 'samarqand', name: 'Samarqand vil.' }
]
</script>

<template>
  <div class="space-y-8">
    
    <!-- QISM 1: DETALI PUTESHESTVIYA (SAYOHAT TAFSILOTLARI) -->
    <div class="relative bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group">
      <div class="w-full">
        <h3 class="text-lg font-black text-slate-800 mb-6 uppercase tracking-wider">Sayohat tafsilotlari</h3>
        
        <div class="space-y-5">
          <!-- 1-qator: Davlat va Polism turi -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-8 relative group/field" ref="dropdownRef">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter z-10">Mamlakat</label>
              
              <div class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 flex flex-wrap gap-2 items-center min-h-[64px] focus-within:ring-2 focus-within:ring-blue-500 transition-all cursor-text" @click="$refs.countryInput.focus()">
                <!-- TANLANGAN DAVLATLAR (CHIPS) -->
                <div 
                  v-for="country in store.formData.travelCountries" 
                  :key="country"
                  class="flex items-center gap-1.5 bg-[#1e3a8a] text-white pl-3 pr-1.5 py-1 rounded-lg text-[13px] font-bold animate-in zoom-in-95 duration-200"
                >
                  {{ country }}
                  <button @click.stop="removeCountry(country)" class="p-0.5 hover:bg-white/20 rounded-md transition-colors">
                    <X class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- QIDIRUV INPUTI -->
                <input 
                  ref="countryInput"
                  type="text"
                  v-model="searchQuery"
                  @focus="isDropdownOpen = true"
                  placeholder="Davlatni tanlang..."
                  class="flex-1 bg-transparent border-0 p-0 text-slate-900 font-bold outline-none min-w-[120px] placeholder:text-slate-400 placeholder:font-medium"
                />
                
                <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none transition-transform duration-300" :class="{ 'rotate-180': isDropdownOpen }" />
              </div>

              <!-- DROPDOWN RO'YXAT -->
              <div 
                v-if="isDropdownOpen && filteredCountries.length" 
                class="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
              >
                <div 
                  v-for="country in filteredCountries" 
                  :key="country"
                  @click="toggleCountry(country)"
                  class="px-5 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-bold text-sm transition-colors border-b border-slate-50 last:border-0 flex items-center justify-between group"
                >
                  {{ country }}
                  <span v-if="store.formData.travelCountries.includes(country)" class="text-blue-600">
                    <Star class="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>

            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Polis turi</label>
              <select 
                v-model="store.formData.travelPolicyType"
                class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option v-for="t in policyTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <!-- 2-qator: Sanalar va Kunlar -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Safar boshlanishi</label>
              <div class="flex items-center bg-slate-50 rounded-xl">
                <input 
                  v-model="store.formData.startDate"
                  type="date" 
                  class="w-full bg-transparent border-0 px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Safar tugashi</label>
              <div class="flex items-center bg-slate-50 rounded-xl">
                <input 
                  v-model="store.formData.travelEndDate"
                  type="date" 
                  class="w-full bg-transparent border-0 px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Kunlar</label>
              <div class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold flex justify-end items-center h-[54px]">
                {{ travelDays }}
              </div>
            </div>
          </div>

          <!-- 3-qator: Programma, Soni va Maqsad -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dastur</label>
              <select 
                v-model="store.formData.travelProgram"
                class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Soni</label>
              <select 
                v-model="store.formData.travelersType"
                class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option v-for="t in travelerTypes" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Maqsad</label>
              <select 
                v-model="store.formData.travelPurpose"
                class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option v-for="p in purposes" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div class="md:col-span-2 flex flex-col justify-center items-center">
              <span class="text-[10px] font-bold text-slate-400 uppercase mb-1">Anti COVID</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="store.formData.hasAntiCovid" class="sr-only peer">
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QISMLAR: SUG'URTALANUVCHILAR -->
    <div v-for="(person, index) in store.formData.insuredPersons" :key="index" class="relative bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="w-full">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-black text-slate-800 uppercase tracking-wider">
            {{ ['Birinchi', 'Ikkinchi', 'Uchinchi', 'To\'rtinchi', 'Beshinchi', 'Oltinchi'][index] }} sug'urtalanuvchi
          </h3>
          <!-- O'chirish tugmasi (faqat 1-dan tashqari) -->
          <button 
            v-if="index > 0" 
            @click="store.formData.insuredPersons.splice(index, 1)"
            class="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition-colors"
          >
            <X class="w-4 h-4" /> O'chirish
          </button>
        </div>
        
        <div class="mb-6">
          <span class="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-tight">Rezident</span>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="person.isResident" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
          </label>
        </div>

        <div class="space-y-4">
          <!-- 1-guruh: SERIYA, RAQAM, TUG'ILGAN KUN -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="md:col-span-2 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Seriya</label>
              <input v-model="person.passportSeries" type="text" placeholder="FA" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none placeholder:text-slate-300 uppercase" />
            </div>

            <div class="md:col-span-5 relative group/number">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Raqam</label>
              <input v-model="person.passportNumber" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 pr-10 text-slate-900 font-bold outline-none" />
              <Search class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div class="md:col-span-5 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Tug'ilgan sana</label>
              <input v-model="person.dob" type="date" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>

          <!-- 2-guruh: FAMILIYA, ISM, OTASINING ISMI -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Familiya</label>
              <input v-model="person.lastName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Ism</label>
              <input v-model="person.firstName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Otasining ismi</label>
              <input v-model="person.middleName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>

          <!-- 3-guruh: YOSH, JSHSHIR, VILOYAT, MANZIL -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-2 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Yosh</label>
              <select v-model="person.age" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                <option v-for="n in 100" :key="n" :value="n">{{ n }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">JSHSHIR</label>
              <input v-model="person.pinfl" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Hudud</label>
              <select v-model="person.region" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Manzil</label>
              <input v-model="person.address" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- QO'SHISH TUGMASI -->
    <div class="flex justify-center py-4">
      <button 
        v-if="store.formData.insuredPersons.length < 6"
        @click="store.formData.insuredPersons.push({
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
        })"
        class="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-dashed border-slate-200 rounded-[24px] text-slate-500 font-bold hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:bg-blue-50/50 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <div class="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#1e3a8a] group-hover:text-white flex items-center justify-center transition-all">
          <span class="text-xl leading-none">+</span>
        </div>
        Sug'urtalanuvchi qo'shish
      </button>
    </div>
    <!-- QISM: ARIZA BERUVCHI -->
    <div class="relative bg-white rounded-[32px] p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 group">
      <div class="w-full">
        <h3 class="text-lg font-black text-slate-800 uppercase tracking-wider mb-6">Ariza beruvchi</h3>
        
        <div class="mb-8">
          <span class="text-[10px] font-bold text-slate-400 uppercase block mb-3 tracking-tight">Ariza beruvchi turi</span>
          <div class="flex gap-2 bg-slate-50 p-1.5 rounded-2xl w-max">
            <button 
              type="button"
              @click="store.formData.applicant.type = 'individual'"
              class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
              :class="store.formData.applicant.type === 'individual' ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-100'"
            >
              Jismoniy shaxs
            </button>
            <button 
              type="button"
              @click="store.formData.applicant.type = 'legal'"
              class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
              :class="store.formData.applicant.type === 'legal' ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20' : 'text-slate-500 hover:bg-slate-100'"
            >
              Yuridik shaxs
            </button>
          </div>
        </div>

        <!-- JISMONIY SHAXS UCHUN MAYDONLAR -->
        <div v-if="store.formData.applicant.type === 'individual'" class="space-y-4">
          <!-- 1-guruh: SERIYA, RAQAM, TUG'ILGAN KUN -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div class="md:col-span-2 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Seriya</label>
              <input v-model="store.formData.applicant.passportSeries" type="text" placeholder="FA" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none placeholder:text-slate-300 uppercase" />
            </div>

            <div class="md:col-span-5 relative group/number">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Raqam</label>
              <input v-model="store.formData.applicant.passportNumber" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 pr-10 text-slate-900 font-bold outline-none" />
              <Search class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            <div class="md:col-span-5 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Tug'ilgan sana</label>
              <input v-model="store.formData.applicant.dob" type="date" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>

          <!-- 2-guruh: FAMILIYA, ISM, OTASINING ISMI -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Familiya</label>
              <input v-model="store.formData.applicant.lastName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Ism</label>
              <input v-model="store.formData.applicant.firstName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Otasining ismi</label>
              <input v-model="store.formData.applicant.middleName" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>

          <!-- 3-guruh: YOSH, JSHSHIR, VILOYAT, MANZIL -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div class="md:col-span-2 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Yosh</label>
              <select v-model="store.formData.applicant.age" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                <option v-for="n in 100" :key="n" :value="n">{{ n }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">JSHSHIR</label>
              <input v-model="store.formData.applicant.pinfl" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="md:col-span-3 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Hudud</label>
              <select v-model="store.formData.applicant.region" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div class="md:col-span-4 relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Manzil</label>
              <input v-model="store.formData.applicant.address" type="text" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>

          <!-- Aloqa ma'lumotlari -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Telefon raqami</label>
              <input v-model="store.formData.applicant.phone" type="text" placeholder="+998" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
            <div class="relative">
              <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Email</label>
              <input v-model="store.formData.applicant.email" type="email" placeholder="example@mail.com" class="w-full bg-slate-50 border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
            </div>
          </div>
        </div>

        <!-- YURIDIK SHAXS UCHUN MAYDONLAR -->
        <div v-else class="space-y-6">
          <div class="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
            <h4 class="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-600">
                <Building2 class="w-4 h-4" />
              </div>
              Tashkilot ma'lumotlari
            </h4>

            <div class="space-y-4">
              <!-- 1-guruh: Rezident -->
              <div class="relative">
                <span class="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-tight">Rezident</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="store.formData.applicant.isResident" class="sr-only peer">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                </label>
              </div>

              <!-- 2-guruh: INN, OKED, Tashkilot nomi -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div class="md:col-span-3 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">INN</label>
                  <input v-model="store.formData.applicant.inn" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  <Search class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                </div>
                <div class="md:col-span-3 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">OKED</label>
                  <input v-model="store.formData.applicant.oked" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="md:col-span-6 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Tashkilot nomi</label>
                  <input v-model="store.formData.applicant.companyName" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <!-- 3-guruh: Mulkchilik shakli, Viloyat, Manzil -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div class="md:col-span-3 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Mulkchilik shakli</label>
                  <select v-model="store.formData.applicant.ownershipForm" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                    <option value="masuliyati-cheklangan">MCHJ</option>
                    <option value="aksiyadorlik">AJ</option>
                    <option value="xususiy">XK</option>
                  </select>
                  <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div class="md:col-span-4 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Viloyat</label>
                  <select v-model="store.formData.applicant.region" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                    <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.name }}</option>
                  </select>
                  <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div class="md:col-span-5 relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Manzil</label>
                  <input v-model="store.formData.applicant.address" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
              </div>

              <!-- 4-guruh: Telefon raqami -->
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div class="relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Telefon raqami</label>
                  <input v-model="store.formData.applicant.phone" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <!-- Bank rekvizitlari -->
            <div class="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
              <h4 class="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                  <Landmark class="w-4 h-4" />
                </div>
                Bank rekvizitlari
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div class="relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Hisob raqam</label>
                  <input v-model="store.formData.applicant.bankAccount" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
                <div class="relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Bank nomi</label>
                  <input v-model="store.formData.applicant.bankName" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
                <div class="relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Bank INN</label>
                  <input v-model="store.formData.applicant.bankInn" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
                <div class="relative">
                  <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">MFO</label>
                  <input v-model="store.formData.applicant.mfo" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                </div>
              </div>
            </div>

            <!-- Vakil ma'lumotlari -->
            <div class="bg-slate-50/50 rounded-3xl p-5 border border-slate-100">
              <h4 class="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-orange-600">
                  <User class="w-4 h-4" />
                </div>
                Vakil ma'lumotlari
              </h4>
              <div class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div class="relative">
                    <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">F.I.SH (Direktor)</label>
                    <input v-model="store.formData.applicant.directorName" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                  </div>
                  <div class="grid grid-cols-2 gap-3">
                    <div class="relative">
                      <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Asosida</label>
                      <select v-model="store.formData.applicant.basedOn" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none appearance-none">
                        <option value="charter">Ustav</option>
                        <option value="proxy">Ishonchnoma</option>
                      </select>
                      <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                    <div class="relative">
                      <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Hujjat raqami</label>
                      <input v-model="store.formData.applicant.docNumber" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div class="md:col-span-4 relative">
                    <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Lavozimi</label>
                    <input v-model="store.formData.applicant.position" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                  </div>
                  <div class="md:col-span-4 relative">
                    <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">JSHSHIR</label>
                    <input v-model="store.formData.applicant.representativePinfl" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                  </div>
                  <div class="md:col-span-2 relative">
                    <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Seriya</label>
                    <input v-model="store.formData.applicant.representativePassportSeries" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                  </div>
                  <div class="md:col-span-2 relative">
                    <label class="absolute left-4 top-2 text-[10px] font-bold text-slate-400 uppercase">Raqam</label>
                    <input v-model="store.formData.applicant.representativePassportNumber" type="text" class="w-full bg-white border-0 rounded-xl px-4 pb-2 pt-6 text-slate-900 font-bold outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom style for specific blue accent from the image */
.bg-primary-blue {
  background-color: #1e3a8a;
}

/* Removed red marker as requested */
/* .relative::before { ... } */

/* Remove default date picker icon for cleaner look */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
}

/* Remove marker from main containers */
.bg-white::before {
  display: none;
}
</style>
