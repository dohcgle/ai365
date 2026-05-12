<script setup lang="ts">
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CarFront, 
  HeartPulse, 
  PlaneTakeoff, 
  Home, 
  FileText 
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useWizardStore } from '../stores/wizard'

const router = useRouter()
const store = useWizardStore()

const policies = [
  {
    id: 'osgovts',
    title: 'OSAGO — Avtomobilingiz uchun majburiy va ishonchli himoya',
    description: 'Sizning aybingiz bilan boshqa avtomobil yoki yo\'lovchilarga yetkazilgan zararni qoplab beruvchi, qonun doirasidagi majburiy avtosug\'urta polisi.',
    icon: CarFront,
    color: 'from-blue-500 to-indigo-600',
    rate: '160 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'baxtsiz',
    title: 'Baxtsiz hodisa himoyasi — Siz va yaqinlaringizning moliyaviy qalqoni',
    description: 'Kutilmagan baxtsiz hodisalar, jarohatlar va travmalarda o\'zingiz va oila a\'zolaringizni moliyaviy himoya qiling.',
    icon: HeartPulse,
    color: 'from-rose-400 to-red-600',
    rate: '50 000 so\'mdan',
    isPopular: false
  },
  {
    id: 'vzr',
    title: 'Travel Himoya — Xotirjam sayohat kafolati',
    description: 'Chet elda yoki O\'zbekiston bo\'ylab sayohat vaqtida kutilmagan tibbiy va transport xarajatlaridan 100% himoyalaning.',
    icon: PlaneTakeoff,
    color: 'from-sky-400 to-blue-600',
    rate: '99 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'imushestvo',
    title: 'Mening Uyim — Mulkingiz xavfsizligi kaliti',
    description: 'Xonadoningiz, ofisingiz yoki binolaringizni yong\'in, suv toshqini, zilzila va uchinchi shaxslarning harakatlaridan kafolatli sug\'urta qiling.',
    icon: Home,
    color: 'from-amber-400 to-orange-500',
    rate: '99 000 so\'mdan',
    isPopular: false
  },
  {
    id: 'kasko',
    title: 'VIP KASKO — Avtomobilingiz uchun ideal himoya',
    description: 'Kim aybdor bo\'lishidan qat\'i nazar, avtomobilingizga yetkazilgan har qanday zarar va o\'g\'irlikni qoplab beruvchi premium sug\'urta polisi.',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-green-600',
    rate: '900 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'hujjat',
    title: 'Hujjatlarim himoyada — Pasport, ID-karta va "Prava" xavfsizligi',
    description: 'Eng muhim shaxsiy hujjatlaringizning yo\'qolishi, o\'g\'irlanishi yoki shikastlanishi oqibatida ularni qayta tiklash bo\'yicha kutilmagan xarajatlarni qoplab beruvchi innovatsion sug\'urta polisi.',
    icon: FileText,
    color: 'from-violet-400 to-purple-600',
    rate: '49 000 so\'mdan',
    isPopular: false
  }
]

function startPurchase(policyId: string) {
  store.formData.policyType = policyId
  store.currentStep = 1 // Reset wizard step
  router.push(`/buy/${policyId}`)
}
</script>

<template>
  <div class="w-full">
    <!-- Hero Section -->
    <section class="relative pt-10 pb-24 px-4 overflow-hidden">
      <!-- Background Effects -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-primary-600)_0%,transparent_50%)] opacity-5"></div>
      
      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Compact Header -->
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-10 max-w-6xl mx-auto">
          <div>
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[13px] text-[#EE8142] mb-4 font-bold border border-orange-100/50">
              <Zap class="w-4 h-4 fill-[#EE8142]" />
              <span>100% Onlayn xarid</span>
            </div>
            <h1 class="text-3xl md:text-[42px] font-black tracking-tight text-slate-900 leading-tight">
              Sizga qanday <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#EE8142] to-[#2E5A97]">sug'urta</span> kerak?
            </h1>
          </div>
          <p class="text-slate-500 mt-4 md:mt-0 max-w-sm text-[15px] font-medium leading-relaxed">
            O'zingizga kerakli sug'urta turini tanlang va uydan chiqmasdan eng maqbul narxlarda rasmiylashtiring.
          </p>
        </div>

        <!-- Insurance Products Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
          <div 
            v-for="policy in policies" 
            :key="policy.id"
            @click="startPurchase(policy.id)"
            class="group relative glass-card p-6 md:p-8 transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] hover:bg-white cursor-pointer overflow-hidden flex flex-col items-center text-center shadow-sm hover:shadow-xl"
          >
            <!-- Hover Glow -->
            <div class="absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none" :class="policy.color"></div>
            
            <div class="w-full flex justify-end mb-2 h-6 absolute top-4 right-4">
              <div v-if="policy.isPopular" class="px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-500/20 backdrop-blur-sm">
                Ommabop
              </div>
            </div>

            <!-- Big Centered Icon -->
            <div 
              class="w-20 h-20 mt-4 mb-6 rounded-3xl flex items-center justify-center bg-gradient-to-br shadow-lg group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500 relative z-10"
              :class="policy.color"
            >
              <component :is="policy.icon" class="w-10 h-10 text-white drop-shadow-md" />
            </div>

            <h3 class="text-xl font-bold mb-3 tracking-tight text-slate-900 leading-snug">{{ policy.title }}</h3>
            <p class="text-sm text-gray-500 mb-8 line-clamp-3 leading-relaxed">{{ policy.description }}</p>
            
            <div class="flex items-center justify-between w-full mt-auto pt-5 border-t border-slate-100">
              <div class="text-left">
                <p class="text-[12px] uppercase tracking-wider text-slate-400 mb-1 font-semibold">Narxi</p>
                <p class="text-[16px] font-bold text-slate-800">{{ policy.rate }}</p>
              </div>
              
              <button class="flex items-center justify-center px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-accent-500 group-hover:border-accent-400 group-hover:text-white transition-all duration-300 relative z-10 text-slate-600 text-sm font-bold gap-2 shadow-sm group-hover:shadow-md">
                <span>Batafsil</span>
                <ArrowRight class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
