<script setup lang="ts">
import { 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CarFront, 
  HeartPulse, 
  PlaneTakeoff, 
  Home, 
  FileText,
  Sparkles,
  Send,
  Key
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useWizardStore } from '../stores/wizard'
import { useTelegramStore } from '../stores/telegram'

const router = useRouter()
const store = useWizardStore()
const tgStore = useTelegramStore()

const policies = [
  {
    id: 'osgovts',
    title: 'OSAGO — Avtomobilingiz uchun majburiy himoya',
    description: 'Sizning aybingiz bilan boshqa avtomobil yoki yo\'lovchilarga yetkazilgan zararni qoplaydi.',
    icon: CarFront,
    color: 'from-blue-500 to-indigo-600',
    rate: '160 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'vzr',
    title: 'Chet elga chiquvchilarni/turistlarni sugurta qilish',
    description: 'Chet elda kutilmagan tibbiy va transport xarajatlaridan 100% himoyalaning.',
    icon: PlaneTakeoff,
    color: 'from-sky-400 to-blue-600',
    rate: '99 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'baxtsiz',
    title: 'Baxtsiz hodisalardan sugurta qilish',
    description: 'Kutilmagan baxtsiz hodisalar va jarohatlarda o\'zingizni moliyaviy himoya qiling.',
    icon: HeartPulse,
    color: 'from-rose-400 to-red-600',
    rate: '50 000 so\'mdan',
    isPopular: false
  },
  {
    id: 'hujjat',
    title: 'Hujjatlar sug\'urtasi — Pasport va ID xavfsizligi',
    description: 'Hujjatlaringiz yo\'qolishi yoki shikastlanishi oqibatida ularni tiklash xarajatlarini qoplaydi.',
    icon: FileText,
    color: 'from-violet-400 to-purple-600',
    rate: '49 000 so\'mdan',
    isPopular: false
  },
  {
    id: 'molmulk',
    title: 'Mol-mulkni sug\'urta qilish',
    description: 'Uyingiz, ofisingiz va mol-mulkingizni yong\'in, suv toshqini va o\'g\'irlikdan kafolatli himoya qilish.',
    icon: Home,
    color: 'from-amber-400 to-orange-500',
    rate: '100 000 so\'mdan',
    isPopular: false
  },
  {
    id: 'kasko',
    title: 'KASKO sug\'urtasi',
    description: 'Avtomobilingiz uchun VIP darajadagi to\'liq himoya. Kim aybdor bo\'lishidan qat\'i nazar, barcha zararlar qoplanadi.',
    icon: ShieldCheck,
    color: 'from-emerald-400 to-green-600',
    rate: '900 000 so\'mdan',
    isPopular: true
  },
  {
    id: 'avtozalog',
    title: 'Avto zalog (Garov)',
    description: 'Kreditga olinayotgan yoki garovga qo\'yilayotgan avtomobillarni bank talablari asosida sug\'urta qilish.',
    icon: Key,
    color: 'from-indigo-400 to-blue-600',
    rate: '150 000 so\'mdan',
    isPopular: false
  }

]

function startPurchase(policyId: string) {
  store.formData.policyType = policyId
  store.currentStep = 1
  router.push(`/buy/${policyId}`)
}
</script>

<template>
  <div class="w-full overflow-x-hidden bg-slate-50/50">
    <!-- Hero Section: Balandlik maksimal darajada kamaytirildi -->
    <section class="relative pt-2 md:pt-4 pb-6 md:pb-12 px-4">
      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Main Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 max-w-6xl mx-auto gap-3">
          <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-[10px] text-teal-600 font-black uppercase tracking-wider border border-teal-100 w-fit">
              <Zap class="w-3.5 h-3.5 fill-teal-500" />
              <span>Tezkor va Ishonchli</span>
            </div>
            <h1 class="text-xl md:text-3xl font-black tracking-tight text-slate-900">
              Sizga qanday <span class="text-[#EE8142]">sug'urta</span> kerak?
            </h1>
          </div>
          
          <div class="flex items-center gap-3 p-1.5 px-4 rounded-2xl bg-white border border-slate-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-1000">
             <div class="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center shadow-md">
               <Sparkles class="w-4 h-4 text-white" />
             </div>
             <div class="flex flex-col items-start leading-none">
               <span class="text-[10px] font-black text-teal-600 uppercase tracking-tighter mb-0.5">AI365</span>
               <span class="text-[13px] font-bold text-slate-700">Xotirjamlik — 1 daqiqa masofada</span>
             </div>
          </div>
        </div>

        <!-- Insurance Products Grid: Ixchamlashtirilgan Vitrina -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div 
            v-for="(policy, index) in policies" 
            :key="policy.id"
            @click="startPurchase(policy.id)"
            :style="{ animationDelay: `${index * 100}ms` }"
            class="group relative bg-white rounded-[32px] p-6 md:p-7 border border-slate-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden flex flex-col h-full animate-in fade-in zoom-in duration-700"
          >
            <!-- Hover Glow -->
            <div class="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br opacity-0 group-hover:opacity-[0.12] blur-[60px] transition-all duration-700 rounded-full" :class="policy.color"></div>
            
            <!-- Badge -->
            <div v-if="policy.isPopular" class="absolute top-6 right-6 z-20">
              <div class="px-2.5 py-1 rounded-xl bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/30">
                Ommabop
              </div>
            </div>

            <!-- Floating Icon Container -->
            <div 
              class="w-14 h-14 md:w-16 md:h-16 mb-6 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative z-10 floating-icon"
              :class="policy.color"
            >
              <component :is="policy.icon" class="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-xl" />
            </div>

            <!-- Content -->
            <div class="relative z-10 flex-1 flex flex-col text-left">
              <h3 class="text-lg md:text-xl font-black mb-3 tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors duration-500 leading-tight">
                {{ policy.title.split('—')[0] }}
              </h3>
              <p class="text-[13px] text-slate-500 mb-6 line-clamp-3 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                {{ policy.description }}
              </p>
              
              <!-- Footer -->
              <div class="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                <div class="flex flex-col">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Narxi</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-xl font-black text-slate-900">{{ policy.rate.split(' ')[0] }}</span>
                    <span class="text-[12px] font-bold text-slate-500">{{ policy.rate.split(' ').slice(1).join(' ') }}</span>
                  </div>
                </div>
                
                <div class="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center transition-all duration-500 shadow-lg shadow-slate-900/20 group-hover:bg-teal-500 group-hover:shadow-teal-500/40 group-hover:scale-105">
                  <ArrowRight class="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Support Section for TWA -->
    <div v-if="tgStore.tg" class="px-4 pb-12 md:hidden">
       <div class="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-40 h-40 bg-teal-500/20 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
          <p class="text-teal-400 text-[11px] font-black uppercase tracking-[0.2em] mb-3">Professional Yordam</p>
          <h4 class="text-2xl font-black mb-2 leading-tight">Savollaringiz bormi?</h4>
          <p class="text-slate-400 text-sm mb-6 leading-relaxed">Mutaxassislarimiz sizga 24/7 rejimida yordam berishga tayyor.</p>
          <a href="https://t.me/asia_insurance_support" class="flex items-center justify-center gap-3 bg-white text-slate-900 px-6 py-4 rounded-2xl font-black text-[15px] hover:bg-teal-500 hover:text-white transition-all active:scale-95 shadow-xl">
            <Send class="w-5 h-5" />
            Operatorga yozish
          </a>
       </div>
    </div>
  </div>
</template>

<style scoped>
.floating-icon {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

.bg-white {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
}
</style>
