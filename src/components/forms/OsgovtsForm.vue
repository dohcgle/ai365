<script setup lang="ts">
import { useWizardStore } from '../../stores/wizard'
import { Car, Truck, Bus, Tractor, Building2, Map, Globe } from 'lucide-vue-next'
const store = useWizardStore()
</script>

<template>
  <div>
    <h3 class="text-[22px] font-bold text-slate-800 mb-6 tracking-tight">Avto ma'lumotlari</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Davlat raqami -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Davlat raqami</label>
        <input 
          v-model="store.formData.carNumber"
          type="text" 
          placeholder="01E363RC" 
          class="w-full bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
        />
      </div>
      
      <!-- Texnik pasport raqami -->
      <div>
        <label class="block text-sm font-semibold text-slate-700 mb-2">Texnik pasport seriya va raqami</label>
        <div class="flex gap-3">
          <input 
            v-model="store.formData.techPassportSeries"
            type="text" 
            placeholder="AAG" 
            class="w-24 bg-slate-50 border-0 rounded-2xl px-4 py-3.5 text-slate-900 font-medium uppercase outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all text-center"
          />
          <input 
            v-model="store.formData.techPassportNumber"
            type="text" 
            placeholder="7783410" 
            class="flex-1 bg-slate-50 border-0 rounded-2xl px-5 py-3.5 text-slate-900 font-medium outline-none focus:ring-2 focus:ring-[#14b8a6] transition-all"
          />
        </div>
      </div>
      <!-- Transport turi -->
      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-slate-700 mb-2">Transport turi</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <!-- Yengil -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.vehicleType === 'yengil' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="yengil" v-model="store.formData.vehicleType" class="sr-only" />
            <Car class="w-8 h-8 mb-2 transition-colors" :class="store.formData.vehicleType === 'yengil' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Yengil</span>
          </label>

          <!-- Yuk -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.vehicleType === 'yuk' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="yuk" v-model="store.formData.vehicleType" class="sr-only" />
            <Truck class="w-8 h-8 mb-2 transition-colors" :class="store.formData.vehicleType === 'yuk' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Yuk</span>
          </label>

          <!-- Avtobus -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.vehicleType === 'avtobus' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="avtobus" v-model="store.formData.vehicleType" class="sr-only" />
            <Bus class="w-8 h-8 mb-2 transition-colors" :class="store.formData.vehicleType === 'avtobus' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Avtobus</span>
          </label>

          <!-- Boshqa -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.vehicleType === 'boshqa' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="boshqa" v-model="store.formData.vehicleType" class="sr-only" />
            <Tractor class="w-8 h-8 mb-2 transition-colors" :class="store.formData.vehicleType === 'boshqa' ? 'text-teal-500' : 'text-slate-400'" />
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
            :class="store.formData.region === 'toshkent' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="toshkent" v-model="store.formData.region" class="sr-only" />
            <Building2 class="w-8 h-8 mb-2 transition-colors" :class="store.formData.region === 'toshkent' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Toshkent sh. va viloyati</span>
          </label>

          <!-- Viloyat -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.region === 'viloyat' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="viloyat" v-model="store.formData.region" class="sr-only" />
            <Map class="w-8 h-8 mb-2 transition-colors" :class="store.formData.region === 'viloyat' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Boshqa viloyatlar</span>
          </label>

          <!-- Chet davlat -->
          <label 
            class="relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300"
            :class="store.formData.region === 'chet_el' ? 'border-teal-500 bg-teal-50/50 text-teal-700' : 'border-slate-100 hover:border-teal-200 hover:bg-slate-50 bg-white text-slate-600'"
          >
            <input type="radio" value="chet_el" v-model="store.formData.region" class="sr-only" />
            <Globe class="w-8 h-8 mb-2 transition-colors" :class="store.formData.region === 'chet_el' ? 'text-teal-500' : 'text-slate-400'" />
            <span class="text-sm font-bold text-center">Chet davlat</span>
          </label>
        </div>
      </div>
    </div>

  </div>
</template>
