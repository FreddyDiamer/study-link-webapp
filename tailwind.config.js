/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    // extend — токены дизайн-системы Study Link «Defiant» (холодный сланец + индиго).
    // Дефолты Tailwind (rounded-full, spacing, white) остаются рабочими.
    // В коде используем d-* / семантические радиусы / типографику.
    extend: {
      colors: {
        d: {
          // ---- surfaces ----
          ink: '#0E0F13', // фон приложения
          panel: '#15171D', // карточки, приподнятые блоки
          surface: '#21252E', // вложенные поверхности, треки, чипы
          border: '#21252E', // хайрлайн по умолчанию
          'border-soft': '#2A2F3A', // обводка инпутов/иконок
          'border-hover': '#3A4150', // бордер карточки в hover
          // ---- text ----
          text: '#E8EAED', // основной текст
          'text-bright': '#C9CFD8', // тело отзыва / акцентный текст
          'text-second': '#8A93A3', // вторичный текст
          'text-hint': '#5B6472', // подписи, мета
          'text-mute': '#4B5159', // неактивная иконка таба
          // ---- accent (единственный акцент действия) ----
          accent: '#7C8CFF',
          'accent-hi': '#9AA6FF', // активный шаг / В работе
          // ---- rating (ТОЛЬКО рейтинг и отзывы) ----
          rating: '#FFC247',
          'rating-dim': '#A8843C',
          // ---- semantic / avatar chips ----
          teal: '#3FB5A8', // завершено / успех
          coral: '#E97A6B', // деструктив / аватар-чип
          // ---- skeleton ----
          'sk-base': '#1A1D24',
          'sk-hi': '#242833',
        },
      },
      fontFamily: {
        // системный стек как в Telegram
        sl: ['-apple-system', 'SF Pro Text', 'Roboto', 'Segoe UI', 'sans-serif'],
        sans: ['-apple-system', 'SF Pro Text', 'Roboto', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'screen-title': ['26px', { lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.02em' }],
        'title-l': ['22px', { lineHeight: '1.1', fontWeight: '700' }],
        'title-m': ['17px', { lineHeight: '22px', fontWeight: '600' }], // card-title
        price: ['19px', { lineHeight: '1', fontWeight: '700' }],
        'price-lg': ['22px', { lineHeight: '1', fontWeight: '700' }],
        'rating-hero': ['38px', { lineHeight: '0.9', fontWeight: '700' }],
        body: ['16px', { lineHeight: '1.45' }],
        review: ['14px', { lineHeight: '1.45' }],
        subhead: ['14px', { lineHeight: '19px' }],
        caption: ['13px', { lineHeight: '16px' }],
        overline: ['12px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.05em' }],
        micro: ['10px', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.04em' }],
      },
      borderRadius: {
        chip: '9px', // мелкие чипы, аватар-чипы
        field: '10px', // инпуты, мелкие кнопки
        card: '15px', // карточки ленты
        sheet: '16px', // крупные блоки
        avatar: '17px', // аватар профиля
      },
      boxShadow: {
        'd-logo': '0 4px 18px rgba(124,140,255,.35)',
        'd-toast': '0 12px 30px rgba(0,0,0,.4)',
        'd-phone': '0 30px 90px rgba(0,0,0,.55)',
      },
      transitionTimingFunction: {
        'd-spring': 'cubic-bezier(.3,.8,.3,1)',
        'd-out': 'cubic-bezier(.2,.7,.2,1)',
        'd-pop': 'cubic-bezier(.2,.8,.2,1)',
      },
      keyframes: {
        'd-shimmer': {
          '0%': { backgroundPosition: '-340px 0' },
          '100%': { backgroundPosition: '340px 0' },
        },
        'd-fadeup': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'd-growx': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'd-toastin': {
          from: { opacity: '0', transform: 'translateY(-14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'd-ringspin': { to: { transform: 'rotate(360deg)' } },
        'd-sheetup': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'd-pop': {
          '0%': { transform: 'scale(.6)', opacity: '0' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'd-shimmer': 'd-shimmer 1.3s infinite linear',
        'd-fadeup': 'd-fadeup 0.5s cubic-bezier(.2,.7,.2,1) both',
        'd-growx': 'd-growx 0.7s cubic-bezier(.3,.8,.3,1) both',
        'd-toastin': 'd-toastin 0.26s cubic-bezier(.2,.8,.2,1)',
        'd-spin': 'd-ringspin 0.7s linear infinite',
        'd-sheetup': 'd-sheetup 0.3s cubic-bezier(.3,.8,.3,1)',
        'd-pop': 'd-pop 0.3s cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
}
