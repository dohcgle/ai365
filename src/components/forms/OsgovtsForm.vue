<script setup lang="ts">
import { useOsagoStore } from '../../stores/osago'
import { Car, Truck, Bus, Tractor, Building2, Map, Globe, Search } from 'lucide-vue-next'
const store = useOsagoStore()

const handleSeriaInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
  store.vehicle.techPassport.seria = val
  input.value = val
}

const handleNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '').slice(0, 7)
  store.vehicle.techPassport.number = val
  input.value = val
}

const handleGovNumberInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  const val = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)
  store.vehicle.govNumber = val
  input.value = val
}
</script>

<template>
  <div>
    <h3 class="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Avto ma'lumotlari</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Davlat raqami -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
          Davlat raqami
          <span class="text-red-500">*</span>
        </label>
        <input 
          :value="store.vehicle.govNumber"
          @input="handleGovNumberInput"
          type="text" 
          placeholder="01E363RC" 
          class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
          required
        />
      </div>
      
      <!-- Texnik pasport raqami -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1">
          Texnik pasport seriya va raqami
          <span class="text-red-500">*</span>
        </label>
        <div class="flex gap-3">
          <input 
            :value="store.vehicle.techPassport.seria"
            @input="handleSeriaInput"
            type="text" 
            placeholder="AAG" 
            class="w-24 bg-slate-50 border-0 rounded-2xl px-4 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all text-center"
            maxlength="3"
            required
          />
          <div class="flex-1 relative">
            <input 
              :value="store.vehicle.techPassport.number"
              @input="handleNumberInput"
              type="text" 
              inputmode="numeric"
              placeholder="7783410" 
              class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 pr-14 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
              maxlength="7"
              required
            />
            <button 
              type="button"
              @click="store.fillWithFakeData()"
              class="absolute right-2 top-1.5 bottom-1.5 w-10 rounded-xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-all shadow-sm active:scale-95"
              title="Avto ma'lumotlarini bazadan qidirish"
            >
              <Search class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <!-- Transport turi -->
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-slate-700 mb-2">Transport turi</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <!-- Yengil -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.typeId === 'yengil' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="yengil" v-model="store.vehicle.typeId" class="sr-only" />
            <Car class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.typeId === 'yengil' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Yengil</span>
          </label>

          <!-- Yuk -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.typeId === 'yuk' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="yuk" v-model="store.vehicle.typeId" class="sr-only" />
            <Truck class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.typeId === 'yuk' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Yuk</span>
          </label>

          <!-- Avtobus -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.typeId === 'avtobus' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="avtobus" v-model="store.vehicle.typeId" class="sr-only" />
            <Bus class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.typeId === 'avtobus' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Avtobus</span>
          </label>

          <!-- Boshqa -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.typeId === 'boshqa' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="boshqa" v-model="store.vehicle.typeId" class="sr-only" />
            <Tractor class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.typeId === 'boshqa' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Boshqa</span>
          </label>
        </div>
      </div>

      <!-- Hudud -->
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-slate-700 mb-2">Ro'yxatdan o'tgan hudud</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Toshkent -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.regionId === 'toshkent' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="toshkent" v-model="store.vehicle.regionId" class="sr-only" />
            <Building2 class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.regionId === 'toshkent' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Toshkent sh. va viloyati</span>
          </label>

          <!-- Viloyat -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.regionId === 'viloyat' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="viloyat" v-model="store.vehicle.regionId" class="sr-only" />
            <Map class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.regionId === 'viloyat' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Boshqa viloyatlar</span>
          </label>

          <!-- Chet davlat -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.vehicle.regionId === 'chet_el' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="chet_el" v-model="store.vehicle.regionId" class="sr-only" />
            <Globe class="w-8 h-8 mb-2 transition-colors" :class="store.vehicle.regionId === 'chet_el' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Chet davlat</span>
          </label>
        </div>
      </div>
    </div>

  </div>
</template>

