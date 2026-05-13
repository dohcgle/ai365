<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Phone, Mail, MapPin, Send, Instagram, Facebook, User, ChevronDown, ShieldCheck, HelpCircle, ShieldAlert } from 'lucide-vue-next'
import { useTelegramStore } from './stores/telegram'

const currentLang = ref('UZ')
const isLangMenuOpen = ref(false)
const tgStore = useTelegramStore()

const languages = [
  { code: 'UZ', label: 'O\'zbekcha', flag: '🇺🇿' },
  { code: 'RU', label: 'Русский', flag: '🇷🇺' },
  { code: 'EN', label: 'English', flag: '🇬🇧' }
]

const toggleLang = (lang: string) => {
  currentLang.value = lang
  isLangMenuOpen.value = false
}

onMounted(() => {
  tgStore.init()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
    <!-- Test Mode Alert -->
    <div v-if="!tgStore.tg" class="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-[11px] font-black uppercase tracking-[0.15em] py-2 text-center flex items-center justify-center gap-4 shadow-md z-[60] relative overflow-hidden border-b border-orange-700/30">
      <div class="absolute inset-0 bg-white/5 opacity-10 pattern-dots animate-pulse"></div>
      <span class="flex items-center gap-2 relative z-10 drop-shadow-sm">
        <ShieldAlert class="w-3.5 h-3.5" />
        DIQQAT: Tizim TEST rejimida ishlamoqda
        <ShieldAlert class="w-3.5 h-3.5" />
      </span>
      <span class="hidden md:inline opacity-80 text-[10px] font-bold relative z-10 border-l border-white/20 pl-4">— BARCHA MA'LUMOTLAR HAQIQIY EMAS —</span>
    </div>
    <div v-else class="fixed top-2 right-2 z-[100] animate-pulse">
       <div class="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 px-2 py-0.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <div class="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
          <span class="text-[9px] font-black text-orange-600 uppercase tracking-tighter">Test Mode</span>
       </div>
    </div>

    <!-- Top Bar -->
    <div class="bg-slate-900 text-slate-300 py-2 hidden md:block border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between text-[13px] font-medium">
        <!-- Social Links -->
        <div class="flex items-center gap-4">
          <span class="text-slate-400">Biz ijtimoiy tarmoqlarda:</span>
          <div class="flex items-center gap-3.5">
            <a href="#" class="hover:text-[#14b8a6] transition-colors"><Send class="w-3.5 h-3.5" /></a>
            <a href="#" class="hover:text-[#14b8a6] transition-colors"><Instagram class="w-3.5 h-3.5" /></a>
            <a href="#" class="hover:text-[#14b8a6] transition-colors"><Facebook class="w-3.5 h-3.5" /></a>
          </div>
        </div>
        
        <!-- Right side topbar -->
        <div class="flex items-center gap-6">
          <a href="#" class="hover:text-white transition-colors flex items-center gap-1.5">
            <HelpCircle class="w-3.5 h-3.5 text-slate-400" /> Yordam markazi
          </a>
          
          <!-- Language Selector -->
          <div class="relative">
            <button 
              @click="isLangMenuOpen = !isLangMenuOpen"
              class="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <span class="text-lg leading-none filter drop-shadow-sm">{{ languages.find(l => l.code === currentLang)?.flag }}</span>
              <span>{{ currentLang }}</span>
              <ChevronDown class="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
            </button>
            
            <!-- Dropdown -->
            <div 
              v-if="isLangMenuOpen" 
              class="absolute top-full right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 w-40 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <button 
                v-for="lang in languages" 
                :key="lang.code"
                @click="toggleLang(lang.code)"
                class="w-full text-left px-5 py-2.5 text-[14px] text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                :class="{ 'bg-teal-50/50 text-teal-700 font-bold': currentLang === lang.code }"
              >
                <span class="text-xl filter drop-shadow-sm">{{ lang.flag }}</span> {{ lang.label }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Header -->
    <header class="sticky top-0 left-0 right-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-8 h-[88px] flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-3 group">
          <img src="/logo-mini20.png" alt="ASIA INSURANCE" class="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
          <span class="text-xl font-black text-slate-900 tracking-tighter uppercase">
            <span class="text-[#EE8142]">ASIA</span> <span class="text-[#2E5A97]">INSURANCE</span>
          </span>
        </RouterLink>
        
        <!-- Navigation Menu -->
        <nav class="hidden lg:flex items-center gap-8 text-[15px] font-bold text-slate-700">
          <a href="#" class="hover:text-teal-600 transition-colors py-2 relative group">
            Mahsulotlar
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </a>
          <a href="#" class="hover:text-teal-600 transition-colors py-2 relative group text-teal-600">
            E-Polis
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-teal-500"></span>
          </a>
          <a href="#" class="hover:text-teal-600 transition-colors py-2 relative group flex items-center gap-1.5">
            <ShieldCheck class="w-[18px] h-[18px] text-orange-500" />
            Sug'urta hodisasi
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
          </a>
          <a href="#" class="hover:text-teal-600 transition-colors py-2 relative group">
            Kompaniya haqida
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
          </a>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-4">
          <!-- Shaxsiy Kabinet -->
          <div class="hidden md:flex items-center gap-3">
            <span v-if="tgStore.user" class="text-sm font-bold text-slate-700">
              {{ tgStore.userFullName }}
            </span>
            <a href="#" class="flex items-center justify-center w-12 h-12 rounded-full border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-all shadow-sm">
              <User class="w-5 h-5" />
            </a>
          </div>
          
          <!-- Contact Button with Animation -->
          <a href="tel:+998712331111" class="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#14b8a6] to-[#0d9488] text-white rounded-2xl hover:shadow-lg hover:shadow-teal-500/30 transition-all group relative overflow-hidden">
            <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            <!-- Animated Phone Icon -->
            <div class="relative flex items-center justify-center w-5 h-5">
              <div class="absolute inset-0 bg-white rounded-full animate-ping opacity-60 scale-150"></div>
              <Phone class="w-[18px] h-[18px] relative z-10" />
            </div>
            
            <span class="font-black tracking-wide hidden sm:block">71 233 11 11</span>
          </a>
        </div>
      </div>
    </header>

    <!-- Overlay for closing dropdowns when clicking outside -->
    <div v-if="isLangMenuOpen" @click="isLangMenuOpen = false" class="fixed inset-0 z-40 hidden md:block"></div>

    <main class="min-h-screen relative pt-8 pb-10">
      <RouterView />
    </main>

    <!-- Modern Asia Insurance Footer -->
    <footer class="bg-white border-t border-slate-200 mt-10 relative overflow-hidden">
      <!-- Decorative Top Element -->
      <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#14b8a6] via-[#2dd4bf] to-blue-500 opacity-50"></div>
      
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-16 pb-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <!-- Left Side: Logo & Contacts -->
          <div class="lg:w-1/3 space-y-8">
            <div class="space-y-6">
              <RouterLink to="/" class="flex items-center gap-3 mb-6 group">
                <img src="/logo-mini20.png" alt="ASIA INSURANCE" class="w-12 h-12 object-contain" />
                <span class="text-xl font-black text-slate-900 tracking-tighter uppercase">
                  <span class="text-[#EE8142]">ASIA</span> <span class="text-[#2E5A97]">INSURANCE</span>
                </span>
              </RouterLink>
              
              <p class="text-slate-500 text-sm leading-relaxed max-w-sm">
                Sug'urtani rasmiylashtiring, 24/7 yordamga murojaat qiling, sug'urta va arizangiz holatini kuzatib boring.
              </p>
              
              <div class="flex gap-3">
                <a href="#" class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.74 2.27 0 3.99 1.14 5.06 2.89-4.32 2.39-3.66 7.82.52 9.53-.87 1.87-2.12 3.8-4.24 5.49zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div class="flex flex-col items-start">
                    <span class="text-[10px] leading-none text-slate-300">Yuklab olish</span>
                    <span class="text-sm font-bold leading-tight">App Store</span>
                  </div>
                </a>
                <a href="#" class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
                  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.165-.286-.25-.623-.25-.986V2.8c0-.363.085-.7.249-.986zM15.4 13.609l3.528 2.037c.75.433 1.114.866 1.092 1.3-.021.433-.429.866-1.222 1.3l-2.062 1.19-2.613-2.613 1.277-3.214zM2.8 1.185C3.164 1.185 3.655 1.411 4.27 1.86l13.608 7.857-4.643 4.643L2.8 1.185zM14.6 14.41L4.27 20.32c-.615.45-1.106.675-1.47.675l10.435-13.185 1.365 6.6z"/></svg>
                  <div class="flex flex-col items-start">
                    <span class="text-[10px] leading-none text-slate-300">Yuklab olish</span>
                    <span class="text-sm font-bold leading-tight">Google Play</span>
                  </div>
                </a>
              </div>
              
              <div class="pt-6 border-t border-slate-100">
                <span class="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-2">Yagona aloqa markazi</span>
                <a href="tel:+998712025566" class="text-2xl font-black text-slate-900 hover:text-[#2E5A97] transition-colors flex items-center gap-3 w-max">
                  <div class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone class="w-5 h-5 text-[#2E5A97]" />
                  </div>
                  +998 71 233 11 11
                </a>
              </div>
            </div>
          </div>

          <!-- Right Side: Links Grid (4 Columns) -->
          <div class="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-10">
            <!-- Col 1: Kompaniya haqida -->
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Kompaniya haqida</h4>
              <ul class="space-y-3">
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Biz haqimizda</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Kompaniya boshqaruvi</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Vakansiya</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Litsenziyalar va sertifikatlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Ustav</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Ommaviy oferta</a></li>
              </ul>
            </div>
            
            <!-- Col 2: Matbuot markazi -->
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Matbuot markazi</h4>
              <ul class="space-y-3">
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Kompaniya yangiliklari</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">E'lonlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Tadbirlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Auditorlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Tenderlar</a></li>
              </ul>
            </div>

            <!-- Col 3: Aksiyadorlar -->
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Aksiyadorlar</h4>
              <ul class="space-y-3">
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Biznes-reja va strategiya</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Muhim faktlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Moliyaviy hisobotlar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Maxfiylik siyosati</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Affillangan shaxslar</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Dividendlar</a></li>
              </ul>
            </div>

            <!-- Col 4: Qayta aloqa -->
            <div>
              <h4 class="font-bold text-slate-900 mb-6 uppercase tracking-wider text-sm">Qayta aloqa</h4>
              <ul class="space-y-3">
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Savol berish</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Fikr qoldirish</a></li>
                <li><a href="#" class="text-[14.5px] text-slate-600 hover:text-[#2E5A97] hover:pl-2 transition-all block">Onlayn so'rovnoma</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Bottom section -->
        <div class="mt-16 pt-8 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <!-- Contacts -->
          <div class="space-y-4">
            <a href="mailto:info@asiainsurance.uz" class="flex items-center gap-3 text-[14.5px] text-slate-600 hover:text-teal-600 transition-colors w-max">
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><Mail class="w-4 h-4" /></div> info@asiainsurance.uz
            </a>
            <div class="flex items-start gap-3 text-[14.5px] text-slate-600 max-w-sm">
              <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0"><MapPin class="w-4 h-4" /></div>
              <span>O'zbekiston, 100000, Toshkent sh.,<br/>Mirobod ko'chasi, 9A-uy</span>
            </div>
          </div>
          
          <!-- Payment Icons -->
          <div class="flex justify-center items-center gap-4 flex-wrap">
            <img src="/Tulov_tizimlar/click-zoom.png" alt="Click" class="h-6 object-contain grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-pointer" />
            <img src="/Tulov_tizimlar/payme-zoom.png" alt="Payme" class="h-7 object-contain grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-pointer" />
            <img src="/Tulov_tizimlar/uzumbank-zoom.png" alt="Uzum" class="h-4 object-contain grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100 cursor-pointer" />
            <div class="h-6 px-2.5 bg-slate-100 text-slate-500 font-bold flex items-center rounded text-xs tracking-wider opacity-80 hover:opacity-100 transition-all cursor-pointer">VISA</div>
            <div class="h-6 px-2.5 bg-slate-100 text-slate-500 font-bold flex items-center rounded text-xs tracking-wider opacity-80 hover:opacity-100 transition-all cursor-pointer">MASTERCARD</div>
          </div>
          
          <!-- Socials -->
          <div class="flex items-center justify-start lg:justify-end gap-3">
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#0088cc] hover:text-white transition-all shadow-sm">
              <Send class="w-4 h-4 ml-[-2px] mt-[1px]" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#E1306C] hover:text-white transition-all shadow-sm">
              <Instagram class="w-4 h-4" />
            </a>
            <a href="#" class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1877F2] hover:text-white transition-all shadow-sm">
              <Facebook class="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <!-- Copyright -->
        <div class="mt-10 flex flex-col md:flex-row justify-between items-center text-[13px] text-slate-500 gap-4 text-center md:text-left bg-slate-50 p-4 rounded-2xl">
          <p>Materiallardan nusxa olishda saytga havola qo'yish shart</p>
          <p>Mualliflik huquqi &copy; 2023-{{ new Date().getFullYear() }} Asia Insurance Corp. Barcha huquqlar himoyalangan</p>
        </div>
      </div>
    </footer>
  </div>
</template>
