TEXTS = {
    'uz': {
        'welcome': "Assalomu alaykum! <b>AI365</b> — innovatsion sug'urta platformasiga xush kelibsiz. Iltimos, xizmat ko'rsatish tilini tanlang:",
        'ask_name': "Ajoyib! Endi sizga qanday murojaat qilishimiz mumkin? Iltimos, <b>Ism va Familiyangizni</b> kiriting:",
        'ask_phone': "Rahmat, <b>{name}</b>! Endi telefon raqamingizni pastdagi tugmani bosish orqali yuboring:",
        'send_phone_btn': "Telefon raqamni yuborish 📱",
        'reg_success': "Tabriklaymiz! Siz muvaffaqiyatli ro'yxatdan o'tdingiz. ✅",
        'main_menu': "Hurmatli <b>{name}</b>, asosiy menyuga xush kelibsiz. Kerakli xizmatni tanlang:",
        'open_app': "Sug'urta xarid qilish 💎",
        'help': "Yordam 🆘",
        'settings': "Sozlamalar ⚙️",
        'profile': "Mening profilim 👤",
        'how_it_works': "Tizim qanday ishlaydi? ℹ️",
        'lang_changed': "Til muvaffaqiyatli o'zgartirildi! ✅",
        'info_text': "AI365 — bu sizning vaqtingizni tejovchi, 100% onlayn sug'urta marketpleysi.",
        'profile_detail': "👤 <b>Sizning profilingiz:</b>\n\n🆔 ID: <code>{id}</code>\n👤 Ism: <b>{name}</b>\n📞 Tel: <code>{phone}</code>\n🌐 Til: <b>{user_lang}</b>",
        'back': "⬅️ Orqaga"
    },
    'ru': {
        'welcome': "Здравствуйте! Добро пожаловать в <b>AI365</b>. Пожалуйста, выберите язык обслуживания:",
        'ask_name': "Отлично! Как мы можем к вам обращаться? Пожалуйста, введите ваше <b>Имя и Фамилию</b>:",
        'ask_phone': "Спасибо, <b>{name}</b>! Теперь отправьте свой номер телефона, нажав кнопку ниже:",
        'send_phone_btn': "Отправить номер телефона 📱",
        'reg_success': "Поздравляем! Вы успешно зарегистрировались. ✅",
        'main_menu': "Уважаемый(ая) <b>{name}</b>, добро пожаловать в главное меню. Выберите нужную услугу:",
        'open_app': "Купить страховку 💎",
        'help': "Помощь 🆘",
        'settings': "Настройки ⚙️",
        'profile': "Мой профиль 👤",
        'how_it_works': "Как это работает? ℹ️",
        'lang_changed': "Язык успешно изменен! ✅",
        'info_text': "AI365 — это ваш страховой маркетплейс, работающий 100% онлайн.",
        'profile_detail': "👤 <b>Ваш профиль:</b>\n\n🆔 ID: <code>{id}</code>\n👤 Имя: <b>{name}</b>\n📞 Тел: <code>{phone}</code>\n🌐 Язык: <b>{lang}</b>",
        'back': "⬅️ Назад"
    }
}

def get_text(key, lang='uz', **kwargs):
    text = TEXTS.get(lang, TEXTS['uz']).get(key, key)
    if kwargs:
        return text.format(**kwargs)
    return text
