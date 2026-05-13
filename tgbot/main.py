import os
import asyncio
import logging
from dotenv import load_dotenv
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.types import WebAppInfo, InlineKeyboardButton, MenuButtonWebApp, CallbackQuery, ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
from aiogram.utils.keyboard import InlineKeyboardBuilder

from strings import get_text
import database as db

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")
WEBAPP_URL = os.getenv("WEBAPP_URL", "https://ai365.uz")

bot = Bot(token=TOKEN)
dp = Dispatcher()

# Registration States
class Registration(StatesGroup):
    choosing_language = State()
    entering_name = State()
    requesting_phone = State()

@dp.message(CommandStart())
async def start_handler(message: types.Message, state: FSMContext):
    user = await db.get_user(message.from_user.id)
    
    if user:
        # Agar user ro'yxatdan o'tgan bo'lsa, asosiy menyuni ko'rsatamiz
        await show_main_menu(message, user['language'], user['full_name'])
    else:
        # Ro'yxatdan o'tishni boshlaymiz (til tanlash)
        builder = InlineKeyboardBuilder()
        builder.row(
            InlineKeyboardButton(text="O'zbekcha 🇺🇿", callback_data="reg_lang_uz"),
            InlineKeyboardButton(text="Русский 🇷🇺", callback_data="reg_lang_ru")
        )
        await message.answer(get_text('welcome'), reply_markup=builder.as_markup(), parse_mode="HTML")
        await state.set_state(Registration.choosing_language)

@dp.callback_query(Registration.choosing_language, F.data.startswith("reg_lang_"))
async def process_language(callback: CallbackQuery, state: FSMContext):
    lang = callback.data.split("_")[2]
    await state.update_data(lang=lang)
    
    await callback.message.answer(get_text('ask_name', lang), parse_mode="HTML")
    await state.set_state(Registration.entering_name)
    await callback.answer()

@dp.message(Registration.entering_name)
async def process_name(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    full_name = message.text
    
    await state.update_data(full_name=full_name)
    
    # Telefon raqamni so'rash (Contact tugmasi bilan)
    keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text=get_text('send_phone_btn', lang), request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    
    await message.answer(get_text('ask_phone', lang, name=full_name), reply_markup=keyboard, parse_mode="HTML")
    await state.set_state(Registration.requesting_phone)

@dp.message(Registration.requesting_phone, F.contact)
async def process_phone(message: types.Message, state: FSMContext):
    data = await state.get_data()
    lang = data['lang']
    full_name = data['full_name']
    phone = message.contact.phone_number
    
    # Ma'lumotlarni bazaga saqlash
    await db.add_user(message.from_user.id, full_name, phone, lang)
    
    await message.answer(get_text('reg_success', lang), reply_markup=ReplyKeyboardRemove())
    await state.clear()
    
    await show_main_menu(message, lang, full_name)

async def show_main_menu(message: types.Message, lang: str, name: str):
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text=get_text('open_app', lang), web_app=WebAppInfo(url=WEBAPP_URL)))
    builder.row(
        InlineKeyboardButton(text=get_text('profile', lang), callback_data="profile"),
        InlineKeyboardButton(text=get_text('help', lang), callback_data="help")
    )
    builder.row(
        InlineKeyboardButton(text=get_text('how_it_works', lang), callback_data="how_it_works"),
        InlineKeyboardButton(text=get_text('settings', lang), callback_data="settings")
    )

    text = get_text('main_menu', lang, name=name)
    
    if hasattr(message, 'edit_text') and message.from_user.is_bot:
        await message.edit_text(text, reply_markup=builder.as_markup(), parse_mode="HTML")
    else:
        await message.answer(text, reply_markup=builder.as_markup(), parse_mode="HTML")

@dp.callback_query(F.data == "profile")
async def profile_handler(callback: CallbackQuery):
    user = await db.get_user(callback.from_user.id)
    lang = user['language']
    
    text = get_text('profile_detail', lang, 
                    id=user['user_id'], 
                    name=user['full_name'], 
                    phone=user['phone'], 
                    user_lang=user['language'].upper())
    
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text=get_text('back', lang), callback_data="back_to_menu"))
    
    await callback.message.edit_text(text, reply_markup=builder.as_markup(), parse_mode="HTML")
    await callback.answer()

@dp.callback_query(F.data == "back_to_menu")
async def back_menu_handler(callback: CallbackQuery):
    user = await db.get_user(callback.from_user.id)
    await show_main_menu(callback.message, user['language'], user['full_name'])
    await callback.answer()

@dp.callback_query(F.data == "settings")
async def settings_handler(callback: CallbackQuery, state: FSMContext):
    # Tilni o'zgartirish uchun yana til tanlash menyusini ko'rsatamiz
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(text="O'zbekcha 🇺🇿", callback_data="change_lang_uz"),
        InlineKeyboardButton(text="Русский 🇷🇺", callback_data="change_lang_ru")
    )
    await callback.message.edit_text("Tilni tanlang / Выберите язык:", reply_markup=builder.as_markup())
    await callback.answer()

@dp.callback_query(F.data.startswith("change_lang_"))
async def change_language(callback: CallbackQuery):
    lang = callback.data.split("_")[2]
    await db.update_user_language(callback.from_user.id, lang)
    user = await db.get_user(callback.from_user.id)
    
    await callback.answer(get_text('lang_changed', lang))
    await show_main_menu(callback.message, lang, user['full_name'])

@dp.callback_query(F.data == "how_it_works")
async def how_it_works_handler(callback: CallbackQuery):
    user = await db.get_user(callback.from_user.id)
    lang = user['language']
    text = get_text('info_text', lang)
    
    builder = InlineKeyboardBuilder()
    builder.row(InlineKeyboardButton(text=get_text('back', lang), callback_data="back_to_menu"))
    
    await callback.message.edit_text(text, reply_markup=builder.as_markup(), parse_mode="HTML")
    await callback.answer()

async def main():
    logger.info("Bot ishga tushmoqda...")
    # DBni initsializatsiya qilish
    await db.init_db()
    
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(
            text="AI365 App",
            web_app=WebAppInfo(url=WEBAPP_URL)
        )
    )
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot to'xtatildi.")
