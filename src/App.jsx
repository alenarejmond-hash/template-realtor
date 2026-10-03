import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Building2, Key, MessageCircle, Phone, 
  QrCode, Share2, Copy, X, Check, UserPlus 
} from 'lucide-react';

// Кастомная иконка Instagram
const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
  </svg>
);

// ==========================================
// ⚙️ НАСТРОЙКИ КОНТЕНТА И ПЕРЕВОДОВ
// ==========================================
const BASE_CONTENT = {
  bgImage: '/bg-realtor.webp', // ФОН: файл bg-realtor.jpg в папке public
  avatar: '/avatar-realtor.webp', // АВАТАР: файл avatar-realtor.jpg в папке public
  username: '@saroyan_estate',
  subUsername: 'Prime Properties',
  actionLink: 'https://t.me/твой_юзернейм',
  waLink: 'https://wa.me/79990000000',
  tgLink: 'https://t.me/твой_юзернейм',
  instLink: 'https://instagram.com/твой_юзернейм',
};

const TRANSLATIONS = {
  RU: {
    badge: 'Cascade Realty',
    name1: 'ТИГРАН',
    name2: 'САРОЯН',
    role: 'Элитная недвижимость',
    stat1Title: 'Объекты в базе',
    stat1Value: '80+',
    stat2Title: 'Объем сделок',
    stat2Value: 'от $1M',
    service1: 'Инвестиции',
    service2: 'Пентхаусы',
    service3: 'Оффмаркет',
    quote: 'Ваш статус достоин лучшего адреса.',
    actionText: 'Закрытый каталог',
    modalTitle: 'Поделиться визиткой',
    modalDesc: 'Дайте отсканировать QR-код или отправьте ссылку напрямую.',
    copied: 'Скопировано!',
    copy: 'Копировать',
    shareBtn: 'Отправить',
    shareTitle: 'Моя цифровая визитка',
    shareText: 'Привет! Вот моя визитка с контактами:',
  },
  EN: {
    badge: 'Cascade Realty',
    name1: 'TIGRAN',
    name2: 'SAROYAN',
    role: 'Elite Real Estate',
    stat1Title: 'Active Listings',
    stat1Value: '80+',
    stat2Title: 'Deals From',
    stat2Value: '$1M+',
    service1: 'Investments',
    service2: 'Penthouses',
    service3: 'Off-market',
    quote: 'Your status deserves the finest address.',
    actionText: 'Exclusive Catalog',
    modalTitle: 'Share Business Card',
    modalDesc: 'Let someone scan the QR code or send the link directly.',
    copied: 'Copied!',
    copy: 'Copy',
    shareBtn: 'Share',
    shareTitle: 'My Digital Business Card',
    shareText: 'Hello! Here is my digital business card with contact details:',
  },
  AM: {
    badge: 'Cascade Realty',
    name1: 'ՏԻԳՐԱՆ',
    name2: 'ՍԱՐՈՅԱՆ',
    role: 'Էլիտար Անշարժ Գույք',
    stat1Title: 'Ակտիվ Առաջարկներ',
    stat1Value: '80+',
    stat2Title: 'Գործարքներ',
    stat2Value: '$1M-ից',
    service1: 'Ներդրումներ',
    service2: 'Պենտհաուսներ',
    service3: 'Օֆֆմարկետ',
    quote: 'Ձեր կարգավիճակն արժանի է լավագույն հասցեին։',
    actionText: 'Փակ Կատալոգ',
    modalTitle: 'Կիսվել Այցեքարտով',
    modalDesc: 'Թույլ տվեք սկանավորել QR կոդը կամ ուղարկեք հղումը անմիջապես։',
    copied: 'Պատճենված է',
    copy: 'Պատճենել',
    shareBtn: 'Կիսվել',
    shareTitle: 'Իմ թվային այցեքարտը',
    shareText: 'Ողջույն։ Ահա իմ թվային այցեքարտը կոնտակտային տվյալներով․',
  }
};

// ==========================================
// 🎨 ГЛОБАЛЬНЫЕ СТИЛИ
// ==========================================
const globalStyles = `
  :root {
    --card-h: calc(min(22rem, 50vh) * 1.6);
  }
  @media (min-width: 640px) {
    :root {
      --card-h: calc(min(22rem, 50vh) * 1.5);
    }
  }
  body {
    background-color: #0a0a0a;
    overscroll-behavior: none;
    overflow-x: hidden;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  @keyframes float {
    0% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
    50% { transform: translateY(-15px) rotateX(2deg) rotateY(-2deg); }
    100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .card-preserve-3d {
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .card-backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
  }
  
  /* Искры */
  @keyframes spark-explode {
    0% { transform: translate(0, 0) scale(0.5); opacity: 0.8; }
    100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0.6; }
  }
  @keyframes spark-wander {
    0% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0.6; }
    33% { transform: translate(calc(var(--tx) * 1.5 + var(--wx1)), calc(var(--ty) * 1.5 + var(--wy1))) scale(1.5); opacity: 0.8; }
    66% { transform: translate(calc(var(--tx) * 2.5 + var(--wx2)), calc(var(--ty) * 2.5 + var(--wy2))) scale(1.2); opacity: 0.5; }
    100% { transform: translate(calc(var(--tx) * 4 + var(--wx3)), calc(var(--ty) * 4 + var(--wy3))) scale(0.8); opacity: 0; }
  }
  .spark-particle {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.8), 0 0 12px rgba(255, 255, 255, 0.4);
    pointer-events: none;
    animation: 
      spark-explode 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards,
      spark-wander var(--wt) linear 0.8s forwards;
  }
  
  /* Эффект сгорающей бумаги */
  @media (min-width: 640px) {
    @keyframes burn-mask-reveal {
      0% { -webkit-mask-position: 100% 0%; mask-position: 100% 0%; }
      100% { -webkit-mask-position: 0% 100%; mask-position: 0% 100%; }
    }
    @keyframes burn-fire-scan {
      0% { background-position: 100% 0%; opacity: 0; }
      5% { opacity: 1; }
      95% { opacity: 1; }
      100% { background-position: 0% 100%; opacity: 0; }
    }
    .smooth-mask-wipe {
      -webkit-mask-image: linear-gradient(225deg, transparent 47%, rgba(0,0,0,0.6) 49%, black 51%);
      mask-image: linear-gradient(225deg, transparent 47%, rgba(0,0,0,0.6) 49%, black 51%);
      -webkit-mask-size: 300% 300%;
      mask-size: 300% 300%;
      -webkit-mask-position: 100% 0%;
      mask-position: 100% 0%;
      animation: burn-mask-reveal 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      will-change: mask-position, -webkit-mask-position;
    }
    .burn-fire-edge {
      background: 
        linear-gradient(224deg, 
          transparent 48.5%, 
          rgba(20, 5, 0, 0.95) 49%, 
          var(--burn-c1) 49.5%, 
          var(--burn-c2) 50%, 
          var(--burn-c3) 50.2%,
          transparent 51%
        ),
        linear-gradient(226deg, 
          transparent 48.5%, 
          rgba(20, 5, 0, 0.95) 49%, 
          var(--burn-c1) 49.5%, 
          var(--burn-c2) 50%, 
          var(--burn-c3) 50.2%,
          transparent 51%
        );
      background-size: 300% 300%;
      background-position: 100% 0%;
      mix-blend-mode: normal;
      filter: drop-shadow(0 0 8px var(--burn-c2)) blur(0.5px);
      animation: burn-fire-scan 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      will-change: background-position, opacity;
    }
  }

  @media (max-width: 639px) {
    @keyframes simple-fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .smooth-mask-wipe {
      opacity: 0;
      animation: simple-fade-in 1.5s ease-in-out forwards;
      will-change: opacity;
    }
    .burn-fire-edge {
      display: none;
    }
  }

  /* Анимация сканирования для кнопки (горизонтальная, плавная) */
  @keyframes scan-horizontal {
    0% { left: -5%; opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { left: 105%; opacity: 0; }
  }
`;

// ==========================================
// 🪄 КОМПОНЕНТ ЭФФЕКТА СГОРАНИЯ
// ==========================================
const BurnRevealImage = ({ src, className, style, imgClassName = "" }) => {
  // Цветовая тема огня жестко зафиксирована под Риэлтора (Silver/Platinum)
  const theme = { 
    c1: 'rgba(148, 163, 184, 0.9)', 
    c2: 'rgba(226, 232, 240, 1)', 
    c3: 'rgba(255, 255, 255, 0.8)' 
  };

  return (
    <div className={`absolute inset-0 pointer-events-none rounded-[2.5rem] ${className}`} style={{ ...style, clipPath: 'inset(0 round 2.5rem)', WebkitClipPath: 'inset(0 round 2.5rem)' }}>
      <div 
        className={`absolute inset-0 bg-cover bg-center smooth-mask-wipe rounded-[2.5rem] ${imgClassName}`}
        style={{ backgroundImage: `url(${src})` }}
      />
      <div 
        className="absolute inset-0 burn-fire-edge rounded-[2.5rem]" 
        style={{
          '--burn-c1': theme.c1,
          '--burn-c2': theme.c2,
          '--burn-c3': theme.c3,
        }}
      />
    </div>
  );
};

// ==========================================
// 🏙️ КОМПОНЕНТ ВИЗИТКИ (РИЭЛТОР)
// ==========================================
const RealtorCard = ({ t }) => {
  return (
    <>
      {/* ЛИЦЕВАЯ СТОРОНА (Obsidian & Platinum) */}
      <div className="absolute inset-0 w-full h-full card-backface-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(148,163,184,0.2)] overflow-hidden bg-[#050505] text-white flex flex-col p-[clamp(1rem,6cqw,1.5rem)] group-hover:shadow-[0_20px_80px_rgba(203,213,225,0.4)] transition-shadow duration-700 border border-slate-700/30">
        
        {/* Базовое фото - 100% видимость, без искажений */}
        <BurnRevealImage src={BASE_CONTENT.bgImage} className="opacity-100" />
        
        {/* Темный градиент поверх фото для читаемости текста (темнее снизу, прозрачный сверху) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent pointer-events-none opacity-90 sm:opacity-80"></div>

        {/* Архитектурные линии на фоне */}
        <div className="absolute top-0 right-0 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-slate-500/30 to-transparent transform rotate-45 translate-x-1/4 translate-y-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-slate-500/30 to-transparent transform rotate-45 -translate-x-1/4 -translate-y-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-[#151515]/95 sm:bg-black/80 sm:backdrop-blur-md px-[clamp(0.5rem,4cqw,1rem)] py-[clamp(0.25rem,2cqw,0.5rem)] rounded-sm border-l-2 border-slate-400 flex items-center gap-[clamp(0.25rem,2cqw,0.5rem)] shadow-[4px_4px_15px_rgba(0,0,0,0.5)]">
              <MapPin className="w-[clamp(0.6rem,2.5cqw,0.875rem)] h-[clamp(0.6rem,2.5cqw,0.875rem)] text-slate-300" />
              <span className="text-[clamp(0.5rem,2cqw,0.625rem)] font-medium tracking-[0.2em] uppercase text-slate-100">{t.badge}</span>
            </div>
            <Building2 className="w-[clamp(1.5rem,6cqw,2rem)] h-[clamp(1.5rem,6cqw,2rem)] text-slate-300/80" />
          </div>

          <div className="mb-[clamp(0.5rem,4cqw,1rem)]">
            <h2 className="text-[clamp(1.5rem,8cqw,2.25rem)] leading-tight font-light mb-[clamp(0.125rem,1cqw,0.25rem)] uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              {t.name1}
              <br />
              <span className="font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">{t.name2}</span>
            </h2>
            <div className="flex items-center gap-[clamp(0.375rem,3cqw,0.75rem)] mt-[clamp(0.375rem,3cqw,0.75rem)]">
              <div className="h-[1px] w-[clamp(1rem,6cqw,2rem)] bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.8)]"></div>
              <p className="text-slate-300 font-medium text-[clamp(0.5rem,2cqw,0.625rem)] uppercase tracking-[0.3em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {t.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ОБРАТНАЯ СТОРОНА (Smart Keycard Aesthetic) */}
      <div className="absolute inset-0 w-full h-full card-backface-hidden rounded-[2.5rem] shadow-[0_20px_50px_rgba(148,163,184,0.2)] overflow-hidden bg-[#0a0a0a] flex flex-col text-white border border-slate-700/50" style={{ transform: 'rotateY(180deg)' }}>
        
        {/* Текстура шлифованного металла */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-normal sm:mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }}></div>

        <div className="relative z-10 flex flex-col h-full p-[clamp(1rem,6cqw,1.5rem)]">
          {/* Шапка: Лого и Аватар */}
          <div className="flex items-end gap-[clamp(0.5rem,4cqw,1rem)] mb-[clamp(1rem,6cqw,1.5rem)] mt-[clamp(0.125rem,1cqw,0.25rem)] relative z-20">
            <div className="w-[clamp(2.5rem,12cqw,4rem)] h-[clamp(2.5rem,12cqw,4rem)] shrink-0 bg-slate-900 border border-slate-600 shadow-[0_0_20px_rgba(148,163,184,0.15)] rounded-sm overflow-hidden">
              <img src={BASE_CONTENT.avatar} alt={t.name1} className="w-full h-full object-cover grayscale opacity-90" />
            </div>
            <div className="flex flex-col pb-[clamp(0.125rem,1cqw,0.25rem)] flex-1">
              <h3 className="text-[clamp(0.75rem,3cqw,1rem)] font-light tracking-[0.2em] text-white uppercase leading-none mb-[clamp(0.2rem,1.5cqw,0.375rem)] drop-shadow-md" title={BASE_CONTENT.username}>{BASE_CONTENT.username}</h3>
              <p className="text-slate-400 text-[clamp(0.4rem,1.5cqw,0.5rem)] uppercase tracking-[0.25em] font-bold">{BASE_CONTENT.subUsername}</p>
            </div>
          </div>

          {/* Статистика / Детали (в 2 колонки) */}
          <div className="flex gap-[clamp(0.375rem,3cqw,0.75rem)] mb-[clamp(0.5rem,3.5cqw,1rem)] mt-auto">
            <div className="flex-1 bg-[#151515]/95 sm:bg-slate-900/50 border border-slate-700/50 py-[clamp(0.5rem,3cqw,0.75rem)] px-[clamp(0.25rem,2cqw,0.5rem)] rounded-sm flex flex-col items-center justify-center sm:backdrop-blur-sm shadow-inner text-center">
              <span className="text-[clamp(0.875rem,4cqw,1.125rem)] font-medium tracking-wider text-slate-100">{t.stat1Value}</span>
              <span className="text-[clamp(0.4rem,1.5cqw,0.5rem)] text-slate-400 uppercase tracking-widest mt-[clamp(0.0625rem,0.5cqw,0.125rem)]">{t.stat1Title}</span>
            </div>
            <div className="flex-1 bg-[#151515]/95 sm:bg-slate-900/50 border border-slate-700/50 py-[clamp(0.5rem,3cqw,0.75rem)] px-[clamp(0.25rem,2cqw,0.5rem)] rounded-sm flex flex-col items-center justify-center sm:backdrop-blur-sm shadow-inner text-center">
              <span className="text-[clamp(0.875rem,4cqw,1.125rem)] font-medium tracking-wider text-slate-100">{t.stat2Value}</span>
              <span className="text-[clamp(0.4rem,1.5cqw,0.5rem)] text-slate-400 uppercase tracking-widest mt-[clamp(0.0625rem,0.5cqw,0.125rem)]">{t.stat2Title}</span>
            </div>
          </div>

          {/* Теги специализации */}
          <div className="flex justify-center flex-wrap gap-[clamp(0.25rem,2cqw,0.5rem)] mb-[clamp(0.75rem,5cqw,1.25rem)]">
            {[t.service1, t.service2, t.service3].map((srv, i) => (
              <span key={i} className="text-[clamp(0.4rem,1.8cqw,0.55rem)] uppercase tracking-[0.15em] text-slate-300 border border-slate-700/50 bg-[#151515]/95 sm:bg-slate-900/50 px-[clamp(0.4rem,2.5cqw,0.75rem)] py-[clamp(0.2rem,1.5cqw,0.375rem)] rounded-sm sm:backdrop-blur-sm shadow-inner text-center font-medium">
                {srv}
              </span>
            ))}
          </div>

          {/* Цитата */}
          <div className="mt-auto mb-[clamp(0.75rem,5cqw,1.25rem)]">
             <p className="text-[clamp(0.5rem,2.2cqw,0.6875rem)] text-slate-400 uppercase tracking-widest font-light text-center px-[clamp(0.25rem,2cqw,0.5rem)]">
               "{t.quote}"
             </p>
          </div>

          {/* Кнопка с эффектом горизонтального сканера */}
          <a href={BASE_CONTENT.actionLink} target="_blank" rel="noopener noreferrer" className="w-full bg-[#151515]/95 sm:bg-slate-900/80 sm:backdrop-blur-md border border-slate-600/50 text-slate-200 font-medium uppercase tracking-[0.15em] text-[clamp(0.5rem,2cqw,0.625rem)] py-[clamp(0.6rem,3.5cqw,0.875rem)] rounded-sm flex items-center justify-center gap-[clamp(0.3rem,2.5cqw,0.625rem)] transition-all hover:bg-slate-800 hover:border-slate-500 shadow-[0_0_15px_rgba(0,0,0,0.5)] group relative overflow-hidden active:scale-95 mb-[clamp(0.375rem,3cqw,0.75rem)] z-20 no-tilt" onClick={e => e.stopPropagation()}>
            <div className="absolute top-0 bottom-0 w-[3px] bg-slate-200/80 shadow-[0_0_12px_rgba(255,255,255,1)] animate-[scan-horizontal_3s_ease-in-out_infinite]"></div>
            <Key className="w-[clamp(0.75rem,3cqw,1rem)] h-[clamp(0.75rem,3cqw,1rem)] text-amber-200/80 drop-shadow-[0_0_5px_rgba(253,230,138,0.5)] relative z-10" />
            <span className="relative z-10">{t.actionText}</span>
          </a>
          
          {/* Нижний ряд контактов */}
          <div className="flex justify-center gap-[clamp(0.375rem,3cqw,0.75rem)] w-full pb-[clamp(0.125rem,1cqw,0.25rem)] z-20 no-tilt" onClick={e => e.stopPropagation()}>
            <a href={BASE_CONTENT.waLink} target="_blank" rel="noopener noreferrer" className="flex-1 h-[clamp(2rem,9cqw,2.75rem)] bg-[#151515]/95 sm:bg-slate-900/60 sm:backdrop-blur-md border border-slate-700/50 rounded-sm flex items-center justify-center shadow-md hover:bg-emerald-900/40 hover:border-emerald-500/50 transition-all active:scale-95 group">
               <MessageCircle className="w-[clamp(0.75rem,3cqw,1rem)] h-[clamp(0.75rem,3cqw,1rem)] text-emerald-400 group-hover:scale-110 transition-transform" />
            </a>
            <a href={BASE_CONTENT.tgLink} target="_blank" rel="noopener noreferrer" className="flex-1 h-[clamp(2rem,9cqw,2.75rem)] bg-[#151515]/95 sm:bg-slate-900/60 sm:backdrop-blur-md border border-slate-700/50 rounded-sm flex items-center justify-center shadow-md hover:bg-blue-900/40 hover:border-blue-500/50 transition-all active:scale-95 group">
               <Phone className="w-[clamp(0.75rem,3cqw,1rem)] h-[clamp(0.75rem,3cqw,1rem)] text-slate-300 group-hover:scale-110 transition-transform" />
            </a>
            <a href={BASE_CONTENT.instLink} target="_blank" rel="noopener noreferrer" className="flex-1 h-[clamp(2rem,9cqw,2.75rem)] bg-[#151515]/95 sm:bg-slate-900/60 sm:backdrop-blur-md border border-slate-700/50 rounded-sm flex items-center justify-center shadow-md hover:bg-pink-900/40 hover:border-pink-500/50 transition-all active:scale-95 group">
               <InstagramIcon className="w-[clamp(0.75rem,3cqw,1rem)] h-[clamp(0.75rem,3cqw,1rem)] text-pink-400 group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

// ==========================================
// 🚀 ОСНОВНОЕ ПРИЛОЖЕНИЕ
// ==========================================
const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [sparks, setSparks] = useState([]);
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 });
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState('RU');
  
  const cardRef = useRef(null);
  const audioCtxRef = useRef(null);
  const isFlippingRef = useRef(false);

  // Настройки темы под Риэлтора (Slate/Platinum)
  const glowColor = 'rgba(148,163,184,0.6)';
  const modalTheme = { bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)', icon: 'text-slate-400' };

  // Параллакс фона
  useEffect(() => {
    const handleGlobalMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = (clientX / window.innerWidth - 0.5) * 80;
      const y = (clientY / window.innerHeight - 0.5) * 80;
      setBgOffset({ x: -x, y: -y });
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('touchmove', handleGlobalMove);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
    };
  }, []);

  // 3D наклон
  const handlePointerMove = (e) => {
    if (isFlippingRef.current || !cardRef.current || isFlipped) return;
    
    if (e.target.closest('.no-tilt')) {
      setRotate({ x: 0, y: 0 });
      setGlare(prev => ({ ...prev, opacity: 0 }));
      return;
    }
    
    const rect = cardRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -25;
    const rotateY = ((x - centerX) / centerX) * 25;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    
    setRotate({ x: rotateX, y: rotateY });
    setGlare({ x: glareX, y: glareY, opacity: 1 });
  };

  const handlePointerLeave = () => {
    if (isFlippingRef.current) return;
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  // Звук переворота
  const playFlipSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Игнорируем ошибки автоплея
    }
  };

  const handleFlip = () => {
    playFlipSound();
    
    isFlippingRef.current = true;
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
    
    setTimeout(() => { isFlippingRef.current = false; }, 700);

    if (!isFlipped) {
      const newSparks = Array.from({ length: 35 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 35 + (Math.random() * 0.5);
        const distance = 80 + Math.random() * 100;
        return {
          id: Date.now() + i,
          tx: Math.cos(angle) * distance + 'px',
          ty: Math.sin(angle) * distance + 'px',
          wx1: (Math.random() - 0.5) * 100 + 'px',
          wy1: (Math.random() - 0.5) * 100 + 'px',
          wx2: (Math.random() - 0.5) * 200 + 'px',
          wy2: (Math.random() - 0.5) * 200 + 'px',
          wx3: (Math.random() - 0.5) * 300 + 'px',
          wy3: (Math.random() - 0.5) * 300 + 'px',
          wt: (20 + Math.random() * 20) + 's',
          size: Math.random() * 2.5 + 1.5 + 'px',
        };
      });
      setSparks(newSparks);
    } else {
      setSparks([]);
    }

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 30, 40]); 
    }
    setIsFlipped(!isFlipped);
  };

  const t = TRANSLATIONS[lang];

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shareTitle,
          text: t.shareText,
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      handleCopy();
    }
  };

  const downloadVCard = () => {
    let phoneStr = '';
    if (BASE_CONTENT.waLink) {
      const match = BASE_CONTENT.waLink.match(/\d+/);
      if (match) phoneStr = `+${match[0]}`;
    }

    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${t.name1} ${t.name2}`,
      `TITLE:${t.role}`,
      phoneStr ? `TEL;TYPE=CELL,VOICE:${phoneStr}` : '',
      phoneStr ? `URL;TYPE=WhatsApp:https://wa.me/${phoneStr.replace('+', '')}` : '',
      `URL:${typeof window !== 'undefined' ? window.location.href : ''}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');
    
    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[100dvh] bg-neutral-950 flex flex-col font-sans select-none relative overflow-hidden justify-center items-center p-4 sm:p-8">
      <style>{globalStyles}</style>

      {/* Параллакс-сферы (Тематические цвета Риэлтора - Slate/Zinc) */}
      <div 
        className="hidden sm:block fixed top-1/4 left-1/4 w-96 h-96 bg-slate-500/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${bgOffset.x}px, ${bgOffset.y}px)` }}
      ></div>
      <div 
        className="hidden sm:block fixed bottom-1/4 right-1/4 w-96 h-96 bg-zinc-500/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${bgOffset.x * 1.5}px, ${bgOffset.y * 1.5}px)` }}
      ></div>

      {/* ОСНОВНОЙ КОНТЕЙНЕР */}
      <div className="flex-1 w-full flex items-center justify-center min-h-0 relative z-40">
        
        {/* Карточка */}
        <div 
          ref={cardRef}
          className="@container relative z-10 w-full aspect-[1/1.6] sm:aspect-[1/1.5] cursor-pointer group animate-float touch-none"
          style={{ perspective: '1500px', maxWidth: 'min(26rem, 94vw, 52dvh)' }}
          onClick={handleFlip}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerLeave}
        >
          {/* Искры */}
          {sparks.map(spark => (
            <div
              key={spark.id}
              className="spark-particle"
              style={{
                '--tx': spark.tx,
                '--ty': spark.ty,
                '--wx1': spark.wx1,
                '--wy1': spark.wy1,
                '--wx2': spark.wx2,
                '--wy2': spark.wy2,
                '--wx3': spark.wx3,
                '--wy3': spark.wy3,
                '--wt': spark.wt,
                width: spark.size,
                height: spark.size,
                left: '50%',
                top: '50%',
                marginTop: '-' + (parseFloat(spark.size) / 2) + 'px',
                marginLeft: '-' + (parseFloat(spark.size) / 2) + 'px'
              }}
            />
          ))}

          <div
            className="w-full h-full card-preserve-3d transition-transform duration-100 ease-out z-10 relative"
            style={{ transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` }}
          >
            <div 
              className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] card-preserve-3d"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              <div 
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none sm:hidden card-backface-hidden" 
                style={{ boxShadow: `0 0 60px ${glowColor}` }} 
              />
              <div 
                className="absolute inset-0 rounded-[2.5rem] pointer-events-none sm:hidden card-backface-hidden" 
                style={{ transform: 'rotateY(180deg)', boxShadow: `0 0 60px ${glowColor}` }} 
              />

              {/* Компонент Визитки */}
              <RealtorCard t={t} />

              <div 
                className="absolute inset-0 w-full h-full rounded-[2.5rem] pointer-events-none transition-opacity duration-300 card-backface-hidden mix-blend-normal sm:mix-blend-overlay"
                style={{
                  background: `radial-gradient(farthest-corner circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 80%)`,
                  opacity: glare.opacity,
                  zIndex: 50,
                }}
              />
              <div 
                className="absolute inset-0 w-full h-full rounded-[2.5rem] pointer-events-none transition-opacity duration-300 card-backface-hidden mix-blend-normal sm:mix-blend-overlay"
                style={{
                  transform: 'rotateY(180deg) translateZ(0)',
                  background: `radial-gradient(farthest-corner circle at ${100 - glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 80%)`,
                  opacity: glare.opacity,
                  zIndex: 50,
                }}
              />
            </div>
          </div>
        </div>

        {/* ПАНЕЛЬ КНОПОК ПОД ВИЗИТКОЙ */}
        <div className="fixed bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 sm:gap-3 bg-[#181818]/95 sm:bg-white/5 sm:backdrop-blur-xl border border-white/10 p-1.5 sm:p-2 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-0.5 px-1">
            {['RU', 'AM', 'EN'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`relative px-2 py-1 rounded-full text-[10px] font-bold tracking-widest transition-all duration-500 ${lang === l ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                {lang === l && (
                  <span className="absolute inset-0 bg-white/10 border border-white/20 rounded-full shadow-[inset_0_0_8px_rgba(255,255,255,0.1)] pointer-events-none"></span>
                )}
                <span className="relative z-10">{l}</span>
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-white/20 mx-1"></div>

          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              setShowShare(true);
            }}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
              downloadVCard();
            }}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* МОДАЛЬНОЕ ОКНО ПОДЕЛИТЬСЯ */}
      {showShare && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#151515]/95 sm:bg-black/40 sm:backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
          onClick={() => setShowShare(false)}
        >
          <div 
            className="bg-[#151515]/95 sm:bg-[rgba(148,163,184,0.15)] sm:backdrop-blur-3xl rounded-[2.5rem] p-6 sm:p-8 w-full max-w-sm flex flex-col items-center relative shadow-2xl animate-in zoom-in-95 duration-200 border" 
            style={{ borderColor: modalTheme.border }}
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowShare(false)} 
              className="absolute top-5 right-5 text-white/40 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors border border-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className={`w-12 h-12 rounded-full bg-black/20 flex items-center justify-center mb-4 border ${modalTheme.icon.replace('text', 'border').replace('400', '500/30')}`}>
              <QrCode className={`w-6 h-6 ${modalTheme.icon}`} />
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{t.modalTitle}</h3>
            <p className="text-sm text-white/60 text-center mb-6 leading-relaxed">{t.modalDesc}</p>
            
            <div className="bg-white p-4 rounded-3xl mb-6 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : 'https://nice-app.ru')}`} 
                alt="QR Code" 
                className="w-[180px] h-[180px] object-contain rounded-lg"
              />
            </div>

            <div className="flex gap-3 w-full">
              <button 
                onClick={handleCopy}
                className="flex-1 bg-black/20 hover:bg-black/40 border border-white/10 text-white font-medium py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? t.copied : t.copy}
              </button>
              <button 
                onClick={handleShare}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <Share2 className="w-4 h-4" />
                {t.shareBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;