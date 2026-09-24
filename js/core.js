/* =========================================================
   iPhone 16 Pro Max Web Simulator — Core
   ========================================================= */

const State = {
  locked: true,
  pinInput: '',
  pin: localStorage.getItem('iphone_pin') || '0000',
  currentPage: 1,
  totalPages: 4,
  editMode: false,
  brightness: parseFloat(localStorage.getItem('iphone_brightness') || 1),
  wallpaper: localStorage.getItem('iphone_wallpaper') || '',
  activeApp: null,
  swipeStartY: 0,
  swipeStartX: 0,
  notifications: [
    { app: 'Messages', icon: '💬', title: 'Алина', text: 'Привет! Как дела?', color: '#30d158' },
    { app: 'Mail', icon: '✉️', title: 'Apple', text: 'Ваш чек за покупку', color: '#007AFF' },
  ]
};

/* ========== INIT ========== */
document.addEventListener('DOMContentLoaded', () => {
  initStatusBar();
  initLockScreen();
  initHomeScreen();
  initGestures();
  initDynamicIsland();
  applyBrightness(State.brightness);
  if (State.wallpaper) applyWallpaper(State.wallpaper);
  showView('lock-screen');
});

/* ========== STATUS BAR ========== */
function initStatusBar() {
  // Render icons
  document.getElementById('status-icons').innerHTML = `
    <svg width="17" height="12" viewBox="0 0 17 12">
      <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white"/>
      <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" fill="white"/>
      <rect x="9" y="3" width="3" height="9" rx="0.5" fill="white"/>
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white"/>
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12">
      <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white"/>
      <path d="M8 6C6.07 6 4.32 6.77 3.03 8.03l1.42 1.42A4.5 4.5 0 018 7.5c1.24 0 2.37.5 3.18 1.32l1.42-1.42A6.48 6.48 0 008 6z" fill="white"/>
      <path d="M8 2.5C5.04 2.5 2.37 3.7.55 5.68l1.43 1.43A8 8 0 018 4.5c2.22 0 4.22.9 5.67 2.35l1.42-1.42A10.5 10.5 0 008 2.5z" fill="white"/>
    </svg>
    <svg width="25" height="12" viewBox="0 0 25 12">
      <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" stroke-opacity="0.35" fill="none"/>
      <rect x="22" y="3.5" width="2.5" height="5" rx="1.25" fill="white" opacity="0.4"/>
      <rect x="1.5" y="1.5" width="17" height="9" rx="1.5" fill="white"/>
    </svg>`;
  updateTime();
  setInterval(updateTime, 1000);
}

function updateTime() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('status-time').textContent = `${h}:${m}`;
}

/* ========== VIEWS ========== */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById(id);
  if (v) { v.classList.add('active'); v.classList.add('screen-transition'); }
}

/* ========== LOCK SCREEN ========== */
function initLockScreen() {
  updateLockClock();
  setInterval(updateLockClock, 1000);
  renderLockNotifications();

  // Swipe to unlock
  const ls = document.getElementById('lock-screen');
  let startY = 0;
  ls.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, { passive: true });
  ls.addEventListener('touchend', e => {
    if (startY - e.changedTouches[0].clientY > 60) showPinScreen();
  });
  ls.addEventListener('mousedown', e => { startY = e.clientY; });
  ls.addEventListener('mouseup', e => {
    if (startY - e.clientY > 40) showPinScreen();
  });
}

function updateLockClock() {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  document.getElementById('lock-time').textContent = `${h}:${m}`;

  const days = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  document.getElementById('lock-date').textContent =
    `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function renderLockNotifications() {
  const container = document.getElementById('lock-notifications');
  container.innerHTML = State.notifications.map(n => `
    <div class="lock-notif">
      <div class="notif-app">${n.app}</div>
      <div style="font-weight:600">${n.title}</div>
      <div style="opacity:0.8;font-size:13px">${n.text}</div>
    </div>
  `).join('');
}

/* ========== PIN SCREEN ========== */
function showPinScreen() {
  State.pinInput = '';
  updatePinDots();
  showView('pin-screen');
}

function handlePinKey(val) {
  if (val === 'del') {
    State.pinInput = State.pinInput.slice(0, -1);
  } else if (val === 'bio') {
    unlockPhone();
    return;
  } else {
    if (State.pinInput.length >= 6) return;
    State.pinInput += val;
  }
  updatePinDots();
  if (State.pinInput.length === State.pin.length) {
    setTimeout(checkPin, 150);
  }
}

function updatePinDots() {
  document.querySelectorAll('.pin-dot').forEach((dot, i) => {
    dot.classList.toggle('filled', i < State.pinInput.length);
    dot.classList.remove('error');
  });
}

function checkPin() {
  if (State.pinInput === State.pin) {
    unlockPhone();
  } else {
    document.querySelectorAll('.pin-dot').forEach(d => d.classList.add('error'));
    navigator.vibrate && navigator.vibrate([50,50,50]);
    setTimeout(() => {
      State.pinInput = '';
      updatePinDots();
    }, 600);
  }
}

function unlockPhone() {
  State.locked = false;
  State.pinInput = '';
  updatePinDots();
  showView('home-screen');
}

function lockPhone() {
  State.locked = true;
  closeApp();
  showView('lock-screen');
}

/* ========== HOME SCREEN ========== */
const APP_ICONS = {
  facetime:   'icons/facetime.png',
  calendar:   'icons/calendar.png',
  photos:     'icons/photos.png',
  camera:     'icons/camera.png',
  mail:       'icons/mail.png',
  notes:      'icons/notes.png',
  reminders:  'icons/reminders.png',
  clock:      'icons/clock.png',
  maps:       'icons/maps.png',
  weather:    'icons/weather.png',
  news:       'icons/news.png',
  tv:         'icons/tv.png',
  podcasts:   'icons/podcasts.png',
  appstore:   'icons/appstore.png',
  health:     'icons/health.png',
  wallet:     'icons/wallet.png',
  settings:   'icons/settings.png',
  translate:  'icons/translate.png',
  files:      'icons/files.png',
  calculator: 'icons/calculator.png',
  compass:    'icons/compass.png',
  shortcuts:  'icons/shortcuts.png',
  stocks:     'icons/stocks.png',
  youtube:    'icons/youtube.png',
  music:      'icons/music.png',
  measure:    'icons/measure.png',
  safari:     'icons/safari.png',
  phone:      'icons/phone.png',
  messages:   'icons/messages.png',
  geometrydash: 'icons/geometrydash.png',
  flappy:     'icons/flappy.png',
  dino:       'icons/dino.png',
};

const APPS = [
  // Page 1 (main)
  { id: 'facetime',  label: 'FaceTime',  emoji: '📹', bg: 'linear-gradient(135deg, #65d26e, #30b84a)' },
  { id: 'calendar',  label: 'Календарь', emoji: '📅', bg: '#fff', page: 1 },
  { id: 'photos',    label: 'Фото',      emoji: '🌸', bg: 'linear-gradient(135deg, #fff, #f5f5f5)' },
  { id: 'camera',    label: 'Камера',    emoji: '📷', bg: 'linear-gradient(135deg, #424242, #212121)' },
  { id: 'mail',      label: 'Почта',     emoji: '✉️', bg: 'linear-gradient(135deg, #42a5f5, #1e88e5)' },
  { id: 'notes',     label: 'Заметки',   emoji: '📝', bg: 'linear-gradient(135deg, #ffca28, #f9a825)' },
  { id: 'reminders', label: 'Напомин.',   emoji: '✅', bg: 'linear-gradient(135deg, #ef5350, #c62828)' },
  { id: 'clock',     label: 'Часы',      emoji: '🕐', bg: 'linear-gradient(135deg, #37474f, #263238)' },
  { id: 'maps',      label: 'Карты',     emoji: '🗺️', bg: 'linear-gradient(135deg, #66bb6a, #43a047)' },
  { id: 'weather',   label: 'Погода',    emoji: '🌤️', bg: 'linear-gradient(135deg, #64b5f6, #1e88e5)' },
  { id: 'news',      label: 'Новости',   emoji: '📰', bg: 'linear-gradient(135deg, #ef5350, #c62828)' },
  { id: 'tv',        label: 'TV',        emoji: '📺', bg: 'linear-gradient(135deg, #37474f, #000)' },
  { id: 'podcasts',  label: 'Подкасты',  emoji: '🎙️', bg: 'linear-gradient(135deg, #ab47bc, #7b1fa2)' },
  { id: 'appstore',  label: 'App Store', emoji: '🅰️', bg: 'linear-gradient(135deg, #42a5f5, #1565c0)' },
  { id: 'health',    label: 'Здоровье',  emoji: '❤️', bg: 'linear-gradient(135deg, #ef5350, #c62828)' },
  { id: 'wallet',    label: 'Wallet',    emoji: '💳', bg: 'linear-gradient(135deg, #37474f, #263238)' },
  { id: 'settings',  label: 'Настройки', emoji: '⚙️', bg: 'linear-gradient(135deg, #78909c, #546e7a)' },
  // Page 2
  { id: 'translate', label: 'Переводч.', emoji: '🌐', bg: 'linear-gradient(135deg, #42a5f5, #1565c0)', page: 2 },
  { id: 'files',     label: 'Файлы',     emoji: '📁', bg: 'linear-gradient(135deg, #42a5f5, #1565c0)', page: 2 },
  { id: 'calculator',label: 'Калькулятор',emoji: '🔢', bg: 'linear-gradient(135deg, #ff9800, #f57c00)', page: 2 },
  { id: 'compass',   label: 'Компас',    emoji: '🧭', bg: 'linear-gradient(135deg, #37474f, #263238)', page: 2 },
  { id: 'shortcuts', label: 'Команды',   emoji: '⚡', bg: 'linear-gradient(135deg, #ab47bc, #7b1fa2)', page: 2 },
  { id: 'stocks',    label: 'Акции',     emoji: '📈', bg: 'linear-gradient(135deg, #263238, #000)', page: 2 },
  { id: 'youtube',   label: 'YouTube',   emoji: '▶️', bg: 'linear-gradient(135deg, #ff1744, #d50000)', page: 2 },
  { id: 'music',     label: 'Музыка',    emoji: '🎵', bg: 'linear-gradient(135deg, #ff5b6a, #fc3c44)', page: 2 },
  { id: 'measure',   label: 'Рулетка',   emoji: '📏', bg: 'linear-gradient(135deg, #37474f, #263238)', page: 2 },
  { id: 'safari',    label: 'Safari',    emoji: '🧭', bg: 'linear-gradient(135deg, #42a5f5, #2196f3)', page: 2 },
  { id: 'phone',     label: 'Телефон',   emoji: '📞', bg: 'linear-gradient(135deg, #65d26e, #30b84a)', page: 2 },
  { id: 'messages',  label: 'Сообщения', emoji: '💬', bg: 'linear-gradient(135deg, #65d26e, #30b84a)', page: 2 },
  // Games (page 2)
  { id: 'geometrydash', label: 'Geometry', emoji: '🔺', bg: 'linear-gradient(135deg, #00e5ff, #2962ff)', page: 2 },
  { id: 'flappy',       label: 'Flappy',   emoji: '🐤', bg: 'linear-gradient(135deg, #ffd54f, #ffb300)', page: 2 },
  { id: 'dino',         label: 'Dino',     emoji: '🦖', bg: 'linear-gradient(135deg, #9e9e9e, #616161)', page: 2 },
];

const DOCK_APPS = ['phone', 'messages', 'safari', 'music'];

function initHomeScreen() {
  buildHomePages();
  buildDock();
  buildPageDots();
  updatePageDots();
  updateHomeScroll();

  // Search button (like iOS Search)
  const searchPill = document.createElement('div');
  searchPill.id = 'home-search';
  searchPill.innerHTML = '🔍 Поиск';
  searchPill.style.cssText = 'position:absolute;bottom:106px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.2);backdrop-filter:blur(20px);border-radius:20px;padding:6px 20px;color:rgba(255,255,255,0.8);font-size:13px;z-index:2;cursor:pointer;border:1px solid rgba(255,255,255,0.15)';
  searchPill.onclick = () => openApp('safari');
  document.getElementById('home-screen').appendChild(searchPill);

  // Long press for edit mode
  document.getElementById('pages-container').addEventListener('contextmenu', e => {
    e.preventDefault();
    toggleEditMode();
  });
}

function buildHomePages() {
  const container = document.getElementById('pages-container');
  container.innerHTML = '';
  
  // Sort apps into pages: 0=widgets, 1=main(no page prop or page:1), 2=page:2, 3=appLibrary
  const page1Apps = APPS.filter(a => !a.page || a.page === 1);
  const page2Apps = APPS.filter(a => a.page === 2);
  
  // === PAGE 0: Widgets ===
  const p0 = document.createElement('div');
  p0.className = 'home-page';
  p0.style.cssText = 'display:flex;flex-direction:column;gap:12px;padding:14px 20px;align-content:start';
  
  const now = new Date();
  const days = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'];
  
  // Widget row
  const wr = document.createElement('div');
  wr.className = 'widget-row';
  wr.innerHTML = `
    <div class="home-widget weather-widget" onclick="openApp('weather')">
      <div class="widget-city">Навои</div>
      <div class="widget-temp">18°</div>
      <div class="widget-condition">Переменная облачность<br>Макс:22° Мин:14°</div>
      <div class="widget-label">Погода</div>
    </div>
    <div class="home-widget calendar-widget" onclick="openApp('clock')">
      <div class="widget-day">${days[now.getDay()]}</div>
      <div class="widget-date">${now.getDate()}</div>
      <div class="widget-event">Нет событий</div>
      <div class="widget-label">Календарь</div>
    </div>`;
  p0.appendChild(wr);
  
  // Battery widget
  const battW = document.createElement('div');
  battW.style.cssText = 'background:rgba(255,255,255,0.85);border-radius:20px;padding:16px;color:#000';
  battW.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <span style="font-size:20px">🔋</span>
      <span style="font-size:28px;font-weight:200">54%</span>
    </div>
    <div style="background:#e0e0e0;border-radius:4px;height:6px;overflow:hidden">
      <div style="background:#30d158;width:54%;height:100%;border-radius:4px"></div>
    </div>`;
  if (navigator.getBattery) {
    navigator.getBattery().then(b => {
      const lvl = Math.round(b.level * 100);
      battW.querySelector('span:last-of-type').textContent = lvl + '%';
      battW.querySelector('div > div').style.width = lvl + '%';
    });
  }
  p0.appendChild(battW);
  
  // Screen Time widget
  const stW = document.createElement('div');
  stW.style.cssText = 'background:rgba(255,255,255,0.85);border-radius:20px;padding:16px;color:#000';
  stW.innerHTML = `
    <div style="font-size:12px;font-weight:600;color:#666;margin-bottom:4px">ЭКРАННОЕ ВРЕМЯ</div>
    <div style="font-size:28px;font-weight:200">1ч 30м</div>
    <div style="font-size:11px;color:#888;margin-top:4px">Среднее за неделю</div>`;
  p0.appendChild(stW);

  // Lock button widget
  const lockW = document.createElement('div');
  lockW.style.cssText = 'background:rgba(0,0,0,0.4);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:16px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:transform 0.1s';
  lockW.onmousedown = () => lockW.style.transform = 'scale(0.96)';
  lockW.onmouseup = () => lockW.style.transform = 'scale(1)';
  lockW.onmouseleave = () => lockW.style.transform = 'scale(1)';
  lockW.innerHTML = `
    <div style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;flex-shrink:0">
      <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M12 1a5 5 0 015 5v3h1a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2v-9a2 2 0 012-2h1V6a5 5 0 015-5zm0 2a3 3 0 00-3 3v3h6V6a3 3 0 00-3-3zm0 11a2 2 0 00-1 3.73V19h2v-1.27A2 2 0 0012 14z"/></svg>
    </div>
    <div style="flex:1">
      <div style="color:#fff;font-size:17px;font-weight:600">Заблокировать экран</div>
      <div style="color:rgba(255,255,255,0.55);font-size:13px">Нажмите, чтобы перейти на экран блокировки</div>
    </div>`;
  lockW.onclick = () => lockPhone();
  p0.appendChild(lockW);

  container.appendChild(p0);
  
  // === PAGE 1: Main apps ===
  const p1 = document.createElement('div');
  p1.className = 'home-page';
  page1Apps.forEach(app => p1.appendChild(createAppIcon(app)));
  container.appendChild(p1);
  
  // === PAGE 2: More apps ===
  const p2 = document.createElement('div');
  p2.className = 'home-page';
  page2Apps.forEach(app => p2.appendChild(createAppIcon(app)));
  container.appendChild(p2);
  
  // === PAGE 3: App Library ===
  const p3 = document.createElement('div');
  p3.className = 'home-page';
  p3.style.cssText = 'min-width:393px;display:flex;flex-direction:column;padding:0;overflow-y:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none';

  // Header
  const libHeader = document.createElement('div');
  libHeader.style.cssText = 'padding:16px 20px 8px;flex-shrink:0';
  libHeader.innerHTML = `
    <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(20px);border-radius:12px;padding:10px 14px;display:flex;align-items:center;gap:8px">
      <span style="font-size:16px;opacity:0.5">🔍</span>
      <span style="color:rgba(255,255,255,0.7);font-size:15px">Библиотека приложений</span>
    </div>`;
  p3.appendChild(libHeader);

  // Categories
  const categories = [
    { name: 'Предложения', color: 'rgba(100,181,246,0.25)', apps: ['weather','maps','music','notes'] },
    { name: 'Социальные', color: 'rgba(100,210,110,0.25)', apps: ['messages','facetime','mail','phone'] },
    { name: 'Развлечения', color: 'rgba(255,87,106,0.25)', apps: ['youtube','tv','podcasts','music'] },
    { name: 'Продуктивность и финансы', color: 'rgba(171,71,188,0.25)', apps: ['notes','reminders','calculator','files'] },
    { name: 'Информация и чтение', color: 'rgba(255,152,0,0.25)', apps: ['news','safari','translate','stocks'] },
    { name: 'Утилиты', color: 'rgba(120,144,156,0.25)', apps: ['clock','compass','measure','settings'] },
    { name: 'Другое', color: 'rgba(239,83,80,0.25)', apps: ['health','wallet','shortcuts','appstore'] },
    { name: 'Творчество', color: 'rgba(255,202,40,0.25)', apps: ['camera','photos','music','notes'] },
  ];

  const catContainer = document.createElement('div');
  catContainer.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:8px 16px 20px;flex:1';

  categories.forEach(cat => {
    const catDiv = document.createElement('div');
    catDiv.style.cssText = `background:${cat.color};backdrop-filter:blur(20px);border-radius:20px;padding:14px;display:flex;flex-direction:column;gap:8px;border:1px solid rgba(255,255,255,0.08)`;

    // 2x2 mini icons grid
    const iconGrid = document.createElement('div');
    iconGrid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px';
    cat.apps.slice(0, 4).forEach(appId => {
      const app = APPS.find(a => a.id === appId);
      if (!app) return;
      const mini = document.createElement('div');
      mini.style.cssText = `width:40px;height:40px;border-radius:12px;background:#000;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);overflow:hidden`;
      const mUrl = APP_ICONS[app.id];
      if (mUrl) {
        mini.innerHTML = `<img src="${mUrl}?v=3" style="width:100%;height:100%;border-radius:12px;object-fit:cover">`;
      } else {
        mini.style.background = app.bg;
        mini.textContent = app.emoji;
      }
      mini.onclick = () => openApp(app.id);
      iconGrid.appendChild(mini);
    });
    catDiv.appendChild(iconGrid);

    // Category label
    const label = document.createElement('div');
    label.style.cssText = 'color:rgba(255,255,255,0.85);font-size:12px;font-weight:600;margin-top:4px';
    label.textContent = cat.name;
    catDiv.appendChild(label);

    catContainer.appendChild(catDiv);
  });

  p3.appendChild(catContainer);
  container.appendChild(p3);
}

function createAppIcon(app) {
  const div = document.createElement('div');
  div.className = 'app-icon';
  div.dataset.appId = app.id;

  const img = document.createElement('div');
  img.className = 'app-icon-img';
  const iconUrl = APP_ICONS[app.id];
  if (iconUrl) {
    img.style.background = '#000';
    const im = document.createElement('img');
    im.src = iconUrl + '?v=3';
    im.style.cssText = 'width:100%;height:100%;border-radius:14px;object-fit:cover;display:block';
    im.onerror = function() { this.remove(); img.style.background = app.bg || '#333'; img.textContent = app.emoji; };
    img.appendChild(im);
  } else {
    img.style.background = app.bg || '#333';
    img.textContent = app.emoji;
  }

  const label = document.createElement('div');
  label.className = 'app-icon-label';
  label.textContent = app.label;

  if (app.badge) {
    const badge = document.createElement('div');
    badge.className = 'app-badge';
    badge.textContent = app.badge;
    img.appendChild(badge);
  }

  const del = document.createElement('div');
  del.className = 'delete-btn';
  del.textContent = '×';
  del.addEventListener('click', e => { e.stopPropagation(); /* stub */ });

  div.appendChild(del);
  div.appendChild(img);
  div.appendChild(label);

  let pressTimer;
  div.addEventListener('pointerdown', () => {
    pressTimer = setTimeout(() => toggleEditMode(), 700);
  });
  div.addEventListener('pointerup', () => clearTimeout(pressTimer));
  div.addEventListener('pointercancel', () => clearTimeout(pressTimer));

  div.addEventListener('click', e => {
    if (State.editMode) return;
    e.stopPropagation();
    openApp(app.id);
  });

  return div;
}

function buildDock() {
  const dock = document.getElementById('dock');
  dock.innerHTML = '';
  DOCK_APPS.forEach(id => {
    const app = APPS.find(a => a.id === id);
    if (!app) return;
    const icon = createAppIcon(app);
    dock.appendChild(icon);
  });
}

function buildPageDots() {
  const dots = document.getElementById('page-dots');
  dots.innerHTML = '';
  for (let i = 0; i < State.totalPages; i++) {
    const d = document.createElement('div');
    d.className = 'page-dot' + (i === State.currentPage ? ' active' : '');
    dots.appendChild(d);
  }
}

function updatePageDots() {
  document.querySelectorAll('.page-dot').forEach((d, i) => {
    d.classList.toggle('active', i === State.currentPage);
  });
}

function toggleEditMode() {
  State.editMode = !State.editMode;
  document.querySelectorAll('.app-icon').forEach(icon => {
    icon.classList.toggle('wiggle', State.editMode);
  });
  if (State.editMode) {
    document.getElementById('home-screen').addEventListener('click', exitEditModeOnce);
  }
}

function exitEditModeOnce(e) {
  if (e.target.closest('.app-icon')) return;
  State.editMode = false;
  document.querySelectorAll('.app-icon').forEach(i => i.classList.remove('wiggle'));
  document.getElementById('home-screen').removeEventListener('click', exitEditModeOnce);
}

/* ========== GESTURES ========== */
function initGestures() {
  const screen = document.getElementById('screen-inner');
  let startX, startY, startTime;

  screen.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  screen.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    const dt = Date.now() - startTime;
    handleSwipe(dx, dy, dt, startX, startY);
  });

  screen.addEventListener('mousedown', e => {
    startX = e.clientX; startY = e.clientY; startTime = Date.now();
  });
  screen.addEventListener('mouseup', e => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const dt = Date.now() - startTime;
    handleSwipe(dx, dy, dt, startX, startY);
  });
}

function handleSwipe(dx, dy, dt, startX, startY) {
  const MIN = 50;
  // Swipe up to go home
  if (dy < -MIN && Math.abs(dy) > Math.abs(dx) * 1.5) {
    if (State.activeApp) { closeApp(); return; }
    if (document.getElementById('control-center').classList.contains('open')) {
      closeControlCenter(); return;
    }
    if (document.getElementById('notification-center').classList.contains('open')) {
      closeNotifCenter(); return;
    }
  }
  // Swipe down from top half → notifications (left side)
  if (dy > MIN && startY < 120 && startX < 250 && !State.activeApp) {
    openNotifCenter(); return;
  }
  // Swipe down from top → control center (right side or anywhere top)
  if (dy > MIN && startY < 120 && startX >= 250 && !State.activeApp) {
    openControlCenter(); return;
  }
  // Swipe left/right between pages (home only)
  if (!State.activeApp && Math.abs(dx) > MIN && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0 && State.currentPage < State.totalPages - 1) {
      State.currentPage++;
    } else if (dx > 0 && State.currentPage > 0) {
      State.currentPage--;
    }
    updateHomeScroll();
    updatePageDots();
  }
}

function updateHomeScroll() {
  const container = document.getElementById('pages-container');
  container.style.transform = `translateX(-${State.currentPage * 393}px)`;
  
  // Hide dock, search pill, and page dots on App Library page (page 3)
  const dock = document.getElementById('dock');
  const search = document.getElementById('home-search');
  const dots = document.getElementById('page-dots');
  const isLibrary = State.currentPage === 3;
  
  if (dock) dock.style.opacity = isLibrary ? '0' : '1';
  if (dock) dock.style.pointerEvents = isLibrary ? 'none' : 'all';
  if (search) search.style.opacity = isLibrary ? '0' : '1';
  if (search) search.style.pointerEvents = isLibrary ? 'none' : 'all';
  if (dots) dots.style.opacity = isLibrary ? '0' : '1';
}

/* ========== APP LAUNCHER ========== */
function openApp(id) {
  State.activeApp = id;
  const win = document.getElementById('app-window');
  const content = document.getElementById('app-content');
  const title = document.getElementById('app-title');
  const header = document.getElementById('app-header');

  // Neutral iOS-style header (subtle dark, not loud app color)
  const app = APPS.find(a => a.id === id);
  header.style.background = 'transparent';
  title.textContent = app ? app.label : id;

  content.innerHTML = '';
  win.classList.remove('closing');
  win.className = 'open';
  win.style.display = 'flex';

  // Load app content
  const renderer = APP_RENDERERS[id];
  if (renderer) renderer(content);
  else {
    content.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:20px;flex-direction:column;gap:12px;background:#1c1c1e">
      <div style="font-size:60px">${app ? app.emoji : '📱'}</div>
      <div>${app ? app.label : id}</div>
      <div style="font-size:13px;opacity:0.5">Скоро будет доступно</div>
    </div>`;
  }
}

function closeApp() {
  if (!State.activeApp) return;
  const win = document.getElementById('app-window');
  win.classList.add('closing');
  State.activeApp = null;
  // Stop any app cleanup
  stopMusic();
  if (window.stopGame) window.stopGame();
  if (window._appCleanup) { try { window._appCleanup(); } catch (e) {} window._appCleanup = null; }
  setTimeout(() => {
    win.style.display = 'none';
    win.className = '';
  }, 250);
}

/* ========== CONTROL CENTER ========== */
const CC_State = {
  wifi: true,
  bt: true,
  airplane: false,
  flashlight: false,
  cellular: true,
  focus: false,
  dark: false,
  rotate: false,
  volume: 70,
  brightness: 100,
};

function openControlCenter() {
  renderControlCenter();
  document.getElementById('control-center').classList.add('open');
}

function closeControlCenter() {
  document.getElementById('control-center').classList.remove('open');
}

function renderControlCenter() {
  const cc = document.getElementById('cc-content');
  cc.innerHTML = '';
  cc.style.cssText = 'position:relative;z-index:1;padding:50px 14px 14px;display:flex;flex-direction:column;gap:10px;height:100%;box-sizing:border-box;overflow-y:auto';

  // === ROW 1: Connectivity (left) + Music (right) ===
  const row1 = document.createElement('div');
  row1.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;flex-shrink:0';

  // Connectivity 2x2
  const conn = document.createElement('div');
  conn.style.cssText = 'background:#2c2c2e;border-radius:20px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:8px;padding:14px';
  const connBtns = [
    { svg:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>', key:'airplane', color:'#ff9500' },
    { svg:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><rect x="2" y="16" width="3" height="6" rx="1"/><rect x="7" y="11" width="3" height="11" rx="1"/><rect x="12" y="6" width="3" height="16" rx="1"/><rect x="17" y="2" width="3" height="20" rx="1"/></svg>', key:'cellular', color:'#30d158' },
    { svg:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M12 21l3-3c-1.65-1.66-4.34-1.66-6 0l3 3zm0-15c-3.07 0-5.88 1.14-8.03 3.03l1.43 1.43C7.16 8.94 9.46 8 12 8s4.84.94 6.6 2.46l1.43-1.43C17.88 7.14 15.07 6 12 6zm0 5c-1.61 0-3.09.59-4.23 1.57l1.44 1.44c.77-.62 1.74-1 2.79-1s2.02.38 2.79 1l1.44-1.44A6.46 6.46 0 0012 11z"/></svg>', key:'wifi', color:'#007AFF' },
    { svg:'<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"/></svg>', key:'bt', color:'#007AFF' },
  ];
  connBtns.forEach(b => {
    const on = CC_State[b.key];
    const d = document.createElement('div');
    d.style.cssText = `width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:${on?b.color:'#3a3a3c'};transition:background 0.15s;margin:auto`;
    d.innerHTML = b.svg;
    d.onclick = () => toggleCC(b.key);
    conn.appendChild(d);
  });
  row1.appendChild(conn);

  // Music player 2x2
  const music = document.createElement('div');
  music.style.cssText = 'background:#2c2c2e;border-radius:20px;padding:14px;display:flex;flex-direction:column;justify-content:space-between';
  const mTitle = (window.musicCurrent && window.musicCurrent.title) ? window.musicCurrent.title : 'Музыка';
  const isPlaying = window.musicPlaying || false;
  music.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span style="color:#fff;font-size:14px;font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${mTitle}</span>
      <span style="font-size:16px;opacity:0.5;color:#fff">›</span>
    </div>
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;padding:8px 0">
      <button id="cc-p" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:0.6">⏮</button>
      <button id="cc-pl" style="background:none;border:none;color:#fff;font-size:24px;cursor:pointer">${isPlaying?'⏸':'▶'}</button>
      <button id="cc-n" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:0.6">⏭</button>
    </div>`;
  row1.appendChild(music);
  cc.appendChild(row1);

  setTimeout(() => {
    const p = document.getElementById('cc-p'); if(p) p.onclick = () => { if(window.musicPrev) musicPrev(); };
    const pl = document.getElementById('cc-pl'); if(pl) pl.onclick = () => { if(window.toggleMusicPlay) toggleMusicPlay(); };
    const n = document.getElementById('cc-n'); if(n) n.onclick = () => { if(window.musicNext) musicNext(); };
  }, 0);

  // === ROW 2: Focus + Sleep + Brightness + Volume ===
  const row2 = document.createElement('div');
  row2.style.cssText = 'display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:auto auto;gap:10px;flex-shrink:0';

  // Focus
  const focusOn = CC_State.focus;
  const focus = document.createElement('div');
  focus.style.cssText = `background:${focusOn?'#fff':'#2c2c2e'};border-radius:16px;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;aspect-ratio:1`;
  focus.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="${focusOn?'#000':'#a78bfa'}"><path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.81 1.45 1.17 2.26.26.55.47 1.5 1.26 1.5s1-.95 1.25-1.5c.37-.81.7-1.51 1.17-2.26.96-1.53 2.21-2.85 3.16-4.4C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 9.75a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg><span style="font-size:9px;font-weight:600;color:${focusOn?'#000':'rgba(255,255,255,0.7)'}">Фокус</span>`;
  focus.onclick = () => toggleCC('focus');
  row2.appendChild(focus);

  // Moon / Sleep
  const darkOn = CC_State.dark;
  const moon = document.createElement('div');
  moon.style.cssText = `background:${darkOn?'#fff':'#2c2c2e'};border-radius:16px;padding:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;aspect-ratio:1`;
  moon.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" fill="${darkOn?'#000':'#5e5ce6'}"><path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg><span style="font-size:9px;font-weight:600;color:${darkOn?'#000':'rgba(255,255,255,0.7)'}">Сон</span>`;
  moon.onclick = () => { toggleCC('dark'); document.getElementById('screen-inner').style.filter = CC_State.dark ? 'invert(1) hue-rotate(180deg)' : ''; };
  row2.appendChild(moon);

  // Brightness bar (spans 2 rows)
  const bv = Math.round(State.brightness * 100);
  const brightBar = document.createElement('div');
  brightBar.style.cssText = 'grid-row:span 2;background:#2c2c2e;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:16px 0;position:relative;overflow:hidden;min-height:130px';
  brightBar.innerHTML = `
    <div style="position:absolute;bottom:0;left:0;right:0;height:${bv}%;background:rgba(255,255,255,0.9);border-radius:20px;transition:height 0.15s"></div>
    <span style="position:relative;z-index:1;margin-bottom:auto;padding-top:14px"><svg viewBox="0 0 24 24" width="22" height="22" fill="rgba(0,0,0,0.55)"><path d="M12 7a5 5 0 100 10 5 5 0 000-10zM12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg></span>`;
  brightBar.onclick = (e) => {
    const rect = brightBar.getBoundingClientRect();
    const pct = Math.round(100 - ((e.clientY - rect.top) / rect.height) * 100);
    const val = Math.max(5, Math.min(100, pct));
    applyBrightness(val / 100);
    brightBar.querySelector('div').style.height = val + '%';
  };
  row2.appendChild(brightBar);

  // Volume bar (spans 2 rows)
  const vol = CC_State.volume;
  const volBar = document.createElement('div');
  volBar.style.cssText = 'grid-row:span 2;background:#2c2c2e;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:16px 0;position:relative;overflow:hidden;min-height:130px';
  volBar.innerHTML = `
    <div style="position:absolute;bottom:0;left:0;right:0;height:${vol}%;background:rgba(255,255,255,0.9);border-radius:20px;transition:height 0.15s"></div>
    <span style="position:relative;z-index:1;margin-bottom:auto;padding-top:14px"><svg viewBox="0 0 24 24" width="22" height="22" fill="rgba(0,0,0,0.55)"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.05A4.48 4.48 0 0016.5 12z"/></svg></span>`;
  volBar.onclick = (e) => {
    const rect = volBar.getBoundingClientRect();
    const pct = Math.round(100 - ((e.clientY - rect.top) / rect.height) * 100);
    const val = Math.max(0, Math.min(100, pct));
    setGlobalVolume(val);
    CC_State.volume = val;
    volBar.querySelector('div').style.height = val + '%';
  };
  row2.appendChild(volBar);

  // Screen mirror (spans 2 columns in second sub-row)
  const mirror = document.createElement('div');
  mirror.style.cssText = 'grid-column:span 2;background:#2c2c2e;border-radius:16px;padding:12px 16px;display:flex;align-items:center;gap:10px;cursor:pointer';
  mirror.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M20 3H4a2 2 0 00-2 2v10a2 2 0 002 2h5l-1 3v1h8v-1l-1-3h5a2 2 0 002-2V5a2 2 0 00-2-2zm0 12H4V5h16v10z"/></svg><span style="color:#fff;font-size:12px;font-weight:500">Синхронизация экрана</span>`;
  mirror.onclick = () => alert('Screen Mirroring');
  row2.appendChild(mirror);

  cc.appendChild(row2);

  // === ROW 3: 4 buttons ===
  const row3 = document.createElement('div');
  row3.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex-shrink:0';
  const btns3 = [
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="CLR"><path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"/></svg>', label:'Дом', action: () => alert('HomeKit') },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="CLR"><path d="M20 5h-3.17l-1.24-1.35A2 2 0 0014.12 3H9.88a2 2 0 00-1.47.65L7.17 5H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V7a2 2 0 00-2-2zm-8 12a4 4 0 110-8 4 4 0 010 8z"/></svg>', label:'Камера', action: () => { closeControlCenter(); setTimeout(()=>openApp('camera'),250); } },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="CLR"><path d="M9 2v2h6V2H9zm3 5a7 7 0 00-7 7 7 7 0 007 7 7 7 0 007-7 7 7 0 00-7-7zm1 8h-2v-4h2v4z"/></svg>', label:'Фонарь', key:'flashlight', action: () => toggleCC('flashlight') },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="CLR" stroke-width="2"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/></svg>', label:'Таймер', action: () => { closeControlCenter(); setTimeout(()=>openApp('clock'),250); } },
  ];
  btns3.forEach(b => {
    const on = b.key ? CC_State[b.key] : false;
    const clr = on ? '#000' : '#fff';
    const d = document.createElement('div');
    d.style.cssText = `background:${on?'#fff':'#2c2c2e'};border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;padding:14px;aspect-ratio:1`;
    d.innerHTML = `${b.svg.replace(/CLR/g, clr)}<span style="font-size:9px;font-weight:600;color:${on?'#000':'rgba(255,255,255,0.6)'}">${b.label}</span>`;
    d.onclick = b.action;
    row3.appendChild(d);
  });
  cc.appendChild(row3);

  // === ROW 4: 4 buttons ===
  const row4 = document.createElement('div');
  row4.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;flex-shrink:0';
  const btns4 = [
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="#fff" stroke-width="2"/><rect x="7" y="6" width="10" height="3" rx="1"/><circle cx="8" cy="13" r="1.2"/><circle cx="12" cy="13" r="1.2"/><circle cx="16" cy="13" r="1.2"/><circle cx="8" cy="17" r="1.2"/><circle cx="12" cy="17" r="1.2"/><circle cx="16" cy="17" r="1.2"/></svg>', label:'Калькулятор', action: () => { closeControlCenter(); setTimeout(()=>openApp('calculator'),250); } },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="#ff3b30"><circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="5"/></svg>', label:'Запись', action: () => alert('Запись экрана') },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11v7a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-7zm2.5 3a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm9 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/></svg>', label:'CarPlay', action: () => alert('CarPlay') },
    { svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M3 6a2 2 0 012-2h14a2 2 0 012 2v2H3V6zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8zm12 5h3v-2h-3v2z"/></svg>', label:'Wallet', action: () => { closeControlCenter(); setTimeout(()=>openApp('wallet'),250); } },
  ];
  btns4.forEach(b => {
    const d = document.createElement('div');
    d.style.cssText = 'background:#2c2c2e;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;padding:14px;aspect-ratio:1';
    d.innerHTML = `${b.svg}<span style="font-size:9px;font-weight:600;color:rgba(255,255,255,0.6)">${b.label}</span>`;
    d.onclick = b.action;
    row4.appendChild(d);
  });
  cc.appendChild(row4);

  // === ROW 5: Search ===
  const search = document.createElement('div');
  search.style.cssText = 'background:#2c2c2e;border-radius:16px;width:56px;height:56px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:22px;flex-shrink:0';
  search.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 10-.7.7l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0A4.5 4.5 0 1114 9.5 4.5 4.5 0 019.5 14z"/></svg>';
  search.onclick = () => { closeControlCenter(); setTimeout(()=>openApp('safari'),250); };
  cc.appendChild(search);
}

function toggleCC(key) {
  CC_State[key] = !CC_State[key];
  renderControlCenter();
}

function setGlobalVolume(v) {
  CC_State.volume = v;
  if (window.musicAudio) window.musicAudio.volume = v / 100;
}

/* ========== NOTIFICATION CENTER ========== */
function openNotifCenter() {
  const nc = document.getElementById('notification-center');
  document.getElementById('nc-content').innerHTML = `
    <div style="color:rgba(255,255,255,0.6);font-size:13px;text-align:center;margin-bottom:16px">Уведомления</div>
    ${State.notifications.map(n => `
      <div class="notif-item">
        <div class="notif-icon" style="background:${n.color}">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-app-name">${n.app}</div>
          <div class="notif-title">${n.title}</div>
          <div class="notif-text">${n.text}</div>
        </div>
      </div>
    `).join('')}
    <div style="text-align:center;margin-top:20px">
      <button onclick="closeNotifCenter()" style="background:rgba(255,255,255,0.15);border:none;border-radius:14px;color:#fff;padding:10px 24px;font-size:14px;cursor:pointer">Закрыть</button>
    </div>
  `;
  nc.classList.add('open');
}

function closeNotifCenter() {
  document.getElementById('notification-center').classList.remove('open');
}

/* ========== BRIGHTNESS ========== */
function applyBrightness(val) {
  State.brightness = val;
  localStorage.setItem('iphone_brightness', val);
  const darkness = Math.max(0, 1 - val);
  document.getElementById('brightness-overlay').style.background = `rgba(0,0,0,${darkness})`;
}

/* ========== WALLPAPER ========== */
function applyWallpaper(url) {
  State.wallpaper = url;
  localStorage.setItem('iphone_wallpaper', url);
  document.getElementById('home-wallpaper').style.backgroundImage = `url(${url})`;
  document.getElementById('lock-screen').querySelector('.lock-bg').style.backgroundImage = `url(${url})`;
}

/* ========== DYNAMIC ISLAND ========== */
function initDynamicIsland() {
  const di = document.getElementById('dynamic-island');
  di.addEventListener('click', () => {
    if (di.classList.contains('expanded')) {
      di.classList.remove('expanded');
      document.getElementById('island-content').style.display = 'none';
    }
  });
}

function expandIsland(type, data) {
  const di = document.getElementById('dynamic-island');
  const content = document.getElementById('island-content');
  di.classList.add('expanded');
  content.style.display = 'flex';
  let html = '';
  if (type === 'music') {
    html = `<span style="font-size:22px">🎵</span>
      <div style="flex:1;overflow:hidden">
        <div style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${data.title}</div>
        <div style="font-size:10px;opacity:0.6">${data.artist}</div>
      </div>
      <span style="font-size:20px;cursor:pointer" onclick="toggleMusicPlay()">⏸</span>`;
  } else if (type === 'timer') {
    html = `<span style="font-size:22px">⏱</span>
      <div style="flex:1">
        <div style="font-size:14px">Таймер</div>
        <div id="di-timer" style="font-size:12px;opacity:0.6">${data.time}</div>
      </div>`;
  } else if (type === 'call') {
    html = `<span style="font-size:22px">📞</span>
      <div style="flex:1">
        <div style="font-size:14px">${data.name}</div>
        <div id="di-call-time" style="font-size:12px;opacity:0.6">00:00</div>
      </div>
      <span style="font-size:22px;cursor:pointer;color:#ff3b30" onclick="endCall()">📵</span>`;
  }
  content.innerHTML = html;
}

function collapseIsland() {
  const di = document.getElementById('dynamic-island');
  di.classList.remove('expanded', 'pill');
  document.getElementById('island-content').style.display = 'none';
  document.getElementById('island-content').innerHTML = '';
}

/* ========== POWER BUTTON ========== */
document.addEventListener('DOMContentLoaded', () => {
  const powerBtn = document.querySelector('.btn-power');
  if (powerBtn) {
    powerBtn.addEventListener('click', () => {
      if (State.locked) {
        showView('lock-screen');
      } else {
        lockPhone();
      }
    });
  }
  // Action button (left top) also locks the phone
  const actionBtn = document.querySelector('.btn-action');
  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (!State.locked) lockPhone();
    });
  }
});

/* ========== HOME INDICATOR / GO HOME ========== */
function goHome() {
  if (State.locked) return;
  // Close any open app
  if (State.activeApp) { closeApp(); }
  // Close control center / notification center
  closeControlCenter();
  closeNotifCenter();
  // Go to main apps page
  State.currentPage = 1;
  updateHomeScroll();
  updatePageDots();
}

/* ========== MUSIC STOP HELPER ========== */
function stopMusic() {
  if (window.musicAudio && window.musicAudio.src) {
    window.musicAudio.pause();
    collapseIsland();
  }
}
