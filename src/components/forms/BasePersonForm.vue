<script setup lang="ts">
import { useWizardStore } from '../../stores/wizard'
const store = useWizardStore()
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">JShShIR (PINFL)</label>
      <input 
        v-model="store.formData.pinfl"
        type="text" 
        placeholder="14 xonali raqam" 
        class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all shadow-sm"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 mb-2">Telefon raqam</label>
      <input 
        v-model="store.formData.phone"
        type="text" 
        placeholder="+998 90 123 45 67" 
        class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 transition-all shadow-sm"
      />
    </div>
  </div>
</template>
