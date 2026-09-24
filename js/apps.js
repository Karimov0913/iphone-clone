/* =========================================================
   iPhone 16 Pro Max — App Renderers
   ========================================================= */

const APP_RENDERERS = {};

/* ========== FACETIME ========== */
APP_RENDERERS.facetime = function(container) {
  // Load FaceTime modules
  if (typeof initFaceTimeApp === 'undefined') {
    console.error('[FaceTime] Module not loaded');
    container.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100%;color:#fff;font-size:16px;background:#000;flex-direction:column;gap:12px">
        <div style="font-size:60px">📹</div>
        <div>FaceTime</div>
        <div style="font-size:13px;opacity:0.5">Загрузка...</div>
      </div>
    `;
    return;
  }
  
  initFaceTimeApp(container);
};

/* ========== CALCULATOR ========== */
APP_RENDERERS.calculator = function(container) {
  container.innerHTML = `
  <div id="calc-app">
    <div id="calc-display">
      <div id="calc-history"></div>
      <div id="calc-result">0</div>
    </div>
    <div id="calc-buttons">
      <button class="calc-btn func" onclick="calcFunc('AC')">AC</button>
      <button class="calc-btn func" onclick="calcFunc('+/-')">+/-</button>
      <button class="calc-btn func" onclick="calcFunc('%')">%</button>
      <button class="calc-btn op" onclick="calcOp('/')">÷</button>
      <button class="calc-btn num" onclick="calcNum('7')">7</button>
      <button class="calc-btn num" onclick="calcNum('8')">8</button>
      <button class="calc-btn num" onclick="calcNum('9')">9</button>
      <button class="calc-btn op" onclick="calcOp('*')">×</button>
      <button class="calc-btn num" onclick="calcNum('4')">4</button>
      <button class="calc-btn num" onclick="calcNum('5')">5</button>
      <button class="calc-btn num" onclick="calcNum('6')">6</button>
      <button class="calc-btn op" onclick="calcOp('-')">−</button>
      <button class="calc-btn num" onclick="calcNum('1')">1</button>
      <button class="calc-btn num" onclick="calcNum('2')">2</button>
      <button class="calc-btn num" onclick="calcNum('3')">3</button>
      <button class="calc-btn op" onclick="calcOp('+')">+</button>
      <button class="calc-btn num zero" style="grid-column:span 2" onclick="calcNum('0')">0</button>
      <button class="calc-btn num" onclick="calcNum('.')">.</button>
      <button class="calc-btn op" onclick="calcEquals()">=</button>
    </div>
  </div>`;
  resetCalc();
};

let calcState = { display: '0', operand: null, operator: null, newInput: true };

function resetCalc() { calcState = { display: '0', operand: null, operator: null, newInput: true }; renderCalc(); }
function renderCalc() {
  const r = document.getElementById('calc-result');
  if (r) {
    let d = calcState.display;
    r.style.fontSize = d.length > 9 ? '42px' : d.length > 6 ? '58px' : '72px';
    r.textContent = d;
  }
  document.querySelectorAll('.calc-btn.op').forEach(b => b.classList.remove('active'));
  if (calcState.operator && calcState.newInput) {
    const map = {'/':'÷','*':'×','-':'−','+':'+'};
    document.querySelectorAll('.calc-btn.op').forEach(b => {
      if (b.textContent === map[calcState.operator]) b.classList.add('active');
    });
  }
}
function calcNum(n) {
  if (calcState.newInput) { calcState.display = n === '.' ? '0.' : n; calcState.newInput = false; }
  else {
    if (n === '.' && calcState.display.includes('.')) return;
    if (calcState.display === '0' && n !== '.') calcState.display = n;
    else calcState.display += n;
  }
  renderCalc();
}
function calcOp(op) {
  if (calcState.operator && !calcState.newInput) calcEquals();
  calcState.operand = parseFloat(calcState.display);
  calcState.operator = op;
  calcState.newInput = true;
  renderCalc();
}
function calcEquals() {
  if (calcState.operator === null || calcState.newInput) return;
  const a = calcState.operand, b = parseFloat(calcState.display);
  let res;
  if (calcState.operator === '+') res = a + b;
  else if (calcState.operator === '-') res = a - b;
  else if (calcState.operator === '*') res = a * b;
  else if (calcState.operator === '/') res = b === 0 ? 'Ошибка' : a / b;
  const hist = document.getElementById('calc-history');
  if (hist) hist.textContent = `${a} ${calcState.operator} ${b} =`;
  calcState.display = typeof res === 'number' ? (Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString()) : res;
  calcState.operator = null; calcState.newInput = true;
  renderCalc();
}
function calcFunc(f) {
  const v = parseFloat(calcState.display);
  if (f === 'AC') { resetCalc(); return; }
  if (f === '+/-') calcState.display = (-v).toString();
  if (f === '%') calcState.display = (v / 100).toString();
  renderCalc();
}

/* ========== CLOCK ========== */
APP_RENDERERS.clock = function(container) {
  container.innerHTML = `
  <div id="clock-app">
    <div class="clock-body">
      <!-- World Clock (placeholder) -->
      <div id="clock-world" class="clock-panel">
        <div class="clock-header">
          <h1 class="clock-title">Мировые часы</h1>
        </div>
        <div class="clock-scroll">
          <div class="world-row">
            <div class="world-info">
              <div class="world-label">Сегодня, +0 ч.</div>
              <div class="world-city">Москва</div>
            </div>
            <div class="world-time">${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</div>
          </div>
          <div class="world-row">
            <div class="world-info">
              <div class="world-label">Сегодня, −10 ч.</div>
              <div class="world-city">Нью-Йорк</div>
            </div>
            <div class="world-time">${new Date(Date.now()-10*3600e3).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</div>
          </div>
          <div class="world-row">
            <div class="world-info">
              <div class="world-label">Сегодня, −3 ч.</div>
              <div class="world-city">Лондон</div>
            </div>
            <div class="world-time">${new Date(Date.now()-3*3600e3).toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        </div>
      </div>
      <!-- Alarm -->
      <div id="clock-alarm" class="clock-panel">
        <div class="clock-header">
          <h1 class="clock-title">Будильник</h1>
          <button class="clock-add-btn" onclick="addAlarm()" aria-label="Добавить будильник">+</button>
        </div>
        <div class="clock-scroll">
          <div id="alarm-list"></div>
        </div>
      </div>
      <!-- Stopwatch -->
      <div id="clock-sw" class="clock-panel">
        <div class="sw-stage">
          <div id="sw-display"><span id="sw-time">00:00</span><span class="ms">.<span id="sw-ms">00</span></span></div>
          <div class="sw-btns">
            <button class="sw-btn reset" id="sw-left-btn" onclick="swLeftBtn()">Сброс</button>
            <button class="sw-btn start" id="sw-start-btn" onclick="swToggle()">Старт</button>
          </div>
        </div>
        <div class="clock-scroll"><div id="laps-list"></div></div>
      </div>
      <!-- Timer -->
      <div id="clock-timer" class="clock-panel">
        <div class="timer-stage">
          <div id="timer-display">00:00</div>
          <div class="timer-wheel-wrap">
            <div class="timer-wheel"><input type="number" id="t-h" min="0" max="23" value="0"><label>часы</label></div>
            <span class="timer-colon">:</span>
            <div class="timer-wheel"><input type="number" id="t-m" min="0" max="59" value="5"><label>мин</label></div>
            <span class="timer-colon">:</span>
            <div class="timer-wheel"><input type="number" id="t-s" min="0" max="59" value="0"><label>сек</label></div>
          </div>
          <div class="sw-btns">
            <button class="sw-btn reset" onclick="timerReset()">Отмена</button>
            <button class="sw-btn start" id="timer-start-btn" onclick="timerToggle()">Старт</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Bottom tab bar -->
    <div class="clock-tabbar">
      <div class="clock-tab" onclick="switchClockTab('world',this)">
        <span class="clock-tab-ico">🌍</span><span class="clock-tab-lbl">Мировые часы</span>
      </div>
      <div class="clock-tab active" onclick="switchClockTab('alarm',this)">
        <span class="clock-tab-ico">⏰</span><span class="clock-tab-lbl">Будильник</span>
      </div>
      <div class="clock-tab" onclick="switchClockTab('sw',this)">
        <span class="clock-tab-ico">⏱</span><span class="clock-tab-lbl">Секундомер</span>
      </div>
      <div class="clock-tab" onclick="switchClockTab('timer',this)">
        <span class="clock-tab-ico">⏲</span><span class="clock-tab-lbl">Таймер</span>
      </div>
    </div>
  </div>`;
  document.getElementById('clock-alarm').classList.add('active');
  renderAlarms();
};

function switchClockTab(name, el) {
  document.querySelectorAll('.clock-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.clock-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('clock-' + name).classList.add('active');
}

// Stopwatch
let swRunning = false, swElapsed = 0, swStart = 0, swInterval, swLaps = [];
function swToggle() {
  swRunning = !swRunning;
  const btn = document.getElementById('sw-start-btn');
  const left = document.getElementById('sw-left-btn');
  if (swRunning) {
    swStart = Date.now() - swElapsed;
    swInterval = setInterval(swTick, 30);
    btn.textContent = 'Стоп'; btn.className = 'sw-btn stop';
    if (left) { left.textContent = 'Круг'; }
    expandIsland('timer', { time: '00:00' });
  } else {
    clearInterval(swInterval);
    btn.textContent = 'Старт'; btn.className = 'sw-btn start';
    if (left) { left.textContent = 'Сброс'; }
  }
}
function swTick() {
  swElapsed = Date.now() - swStart;
  const total = Math.floor(swElapsed / 10);
  const ms = total % 100, s = Math.floor(total / 100) % 60, m = Math.floor(total / 6000);
  const fmt = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const t = document.getElementById('sw-time'), ms2 = document.getElementById('sw-ms');
  if (t) t.textContent = fmt;
  if (ms2) ms2.textContent = String(ms).padStart(2,'0');
  const di = document.getElementById('di-timer');
  if (di) di.textContent = fmt;
}
function swReset() {
  clearInterval(swInterval); swRunning = false; swElapsed = 0; swLaps = [];
  const t = document.getElementById('sw-time'), ms = document.getElementById('sw-ms');
  if (t) t.textContent = '00:00'; if (ms) ms.textContent = '00';
  const b = document.getElementById('sw-start-btn');
  if (b) { b.textContent = 'Старт'; b.className = 'sw-btn start'; }
  const left = document.getElementById('sw-left-btn');
  if (left) { left.textContent = 'Сброс'; }
  const ll = document.getElementById('laps-list'); if (ll) ll.innerHTML = '';
  collapseIsland();
}
// Left button: acts as "Круг" while running, "Сброс" while stopped
function swLeftBtn() {
  if (swRunning) swLap();
  else swReset();
}
function swLap() {
  if (!swRunning) return;
  swLaps.unshift({ n: swLaps.length + 1, t: document.getElementById('sw-time').textContent + '.' + document.getElementById('sw-ms').textContent });
  const ll = document.getElementById('laps-list');
  if (ll) ll.innerHTML = swLaps.map(l => `<div class="lap-row"><span>Круг ${l.n}</span><span>${l.t}</span></div>`).join('');
}

// Timer
let timerRunning = false, timerLeft = 0, timerInterval;
function timerToggle() {
  if (!timerRunning) {
    if (timerLeft <= 0) {
      const h = parseInt(document.getElementById('t-h').value) || 0;
      const m = parseInt(document.getElementById('t-m').value) || 0;
      const s = parseInt(document.getElementById('t-s').value) || 0;
      timerLeft = h * 3600 + m * 60 + s;
    }
    if (timerLeft <= 0) return;
    timerRunning = true;
    const btn = document.getElementById('timer-start-btn');
    if (btn) { btn.textContent = 'Пауза'; btn.className = 'sw-btn stop'; }
    timerInterval = setInterval(timerTick, 1000);
    expandIsland('timer', { time: fmtTimer(timerLeft) });
  } else {
    timerRunning = false;
    clearInterval(timerInterval);
    const btn = document.getElementById('timer-start-btn');
    if (btn) { btn.textContent = 'Старт'; btn.className = 'sw-btn start'; }
  }
}
function timerTick() {
  timerLeft--;
  const d = document.getElementById('timer-display');
  if (d) d.textContent = fmtTimer(timerLeft);
  const di = document.getElementById('di-timer');
  if (di) di.textContent = fmtTimer(timerLeft);
  if (timerLeft <= 0) {
    clearInterval(timerInterval); timerRunning = false;
    collapseIsland();
    alert('⏰ Таймер завершён!');
    const btn = document.getElementById('timer-start-btn');
    if (btn) { btn.textContent = 'Старт'; btn.className = 'sw-btn start'; }
  }
}
function timerReset() { clearInterval(timerInterval); timerRunning = false; timerLeft = 0; const d = document.getElementById('timer-display'); if (d) d.textContent = '00:00'; collapseIsland(); }
function fmtTimer(s) { const m = Math.floor(s / 60), sec = s % 60; return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`; }

// Alarms
let alarms = JSON.parse(localStorage.getItem('iphone_alarms') || '[]');
function addAlarm() {
  const t = prompt('Время будильника (HH:MM):', '08:00');
  if (t && /^\d{2}:\d{2}$/.test(t)) {
    alarms.push({ time: t, on: true, id: Date.now() });
    saveAlarms(); renderAlarms();
  }
}
function saveAlarms() { localStorage.setItem('iphone_alarms', JSON.stringify(alarms)); }
function renderAlarms() {
  const el = document.getElementById('alarm-list'); if (!el) return;
  el.innerHTML = alarms.length === 0
    ? '<div class="alarm-empty">Нет будильников</div>'
    : alarms.map((a, i) => `
    <div class="alarm-row">
      <div class="alarm-info">
        <div class="alarm-time ${a.on?'':'off'}">${a.time}</div>
        <div class="alarm-sub">Будильник</div>
      </div>
      <label class="ios-toggle">
        <input type="checkbox" ${a.on?'checked':''} onchange="alarms[${i}].on=this.checked;saveAlarms();renderAlarms()">
        <div class="ios-toggle-track"></div>
        <div class="ios-toggle-thumb"></div>
      </label>
    </div>`).join('');
}

/* ========== MESSAGES ========== */
APP_RENDERERS.messages = function(container) {
  const chats = [
    { name: 'Алина', avatar: '👩', msgs: [
      { from: 'them', text: 'Привет! Как дела?' },
      { from: 'me', text: 'Привет! Всё хорошо, спасибо!' },
      { from: 'them', text: 'Что делаешь сегодня вечером?' }
    ]},
    { name: 'Дима', avatar: '👨', msgs: [
      { from: 'them', text: 'Ты уже смотрел этот фильм?' },
      { from: 'me', text: 'Ещё нет, но слышал хорошие отзывы' }
    ]},
    { name: 'Мама', avatar: '👩‍🦳', msgs: [
      { from: 'them', text: 'Не забудь позвонить!' }
    ]}
  ];
  let currentChat = null;

  function renderList() {
    container.innerHTML = `
    <div id="messages-app" style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px 16px 8px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
        <input placeholder="Поиск" style="width:100%;background:#2c2c2e;border:none;border-radius:10px;padding:8px 12px;color:#fff;font-size:14px;outline:none">
      </div>
      <div style="flex:1;overflow-y:auto">
        ${chats.map((c, i) => `
          <div onclick="openChat(${i})" style="display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid #1c1c1e;cursor:pointer;gap:12px">
            <div style="width:50px;height:50px;border-radius:50%;background:#2c2c2e;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">${c.avatar}</div>
            <div style="flex:1;overflow:hidden">
              <div style="color:#fff;font-size:16px;font-weight:600">${c.name}</div>
              <div style="color:rgba(255,255,255,0.4);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.msgs[c.msgs.length-1].text}</div>
            </div>
            <div style="color:#007AFF;font-size:11px;opacity:0.7;flex-shrink:0">Сейчас</div>
          </div>`).join('')}
      </div>
    </div>`;
    window.openChat = (i) => renderChat(chats[i], i);
  }

  function renderChat(chat, idx) {
    const autoReplies = ['Окей!','Понял.','Хорошо!','Да, конечно!','Ладно, увидимся!','👍','Ок, договорились!'];
    container.innerHTML = `
    <div id="messages-app" style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
        <button onclick="renderMsgList()" style="background:none;border:none;color:#007AFF;font-size:16px;cursor:pointer">← Назад</button>
        <div style="font-size:28px">${chat.avatar}</div>
        <div style="color:#fff;font-size:16px;font-weight:600">${chat.name}</div>
      </div>
      <div class="msg-list" id="msg-list-${idx}">
        ${chat.msgs.map(m => `
          <div>
            <div class="msg-bubble ${m.from==='me'?'sent':'received'}">${m.text}</div>
          </div>`).join('')}
      </div>
      <div class="msg-input-wrap">
        <input class="msg-input" id="msg-input" placeholder="Сообщение" onkeydown="if(event.key==='Enter')sendMsg(${idx})">
        <button class="msg-send-btn" onclick="sendMsg(${idx})">↑</button>
      </div>
    </div>`;
    scrollMsgList(idx);
    window.renderMsgList = renderList;
    window.sendMsg = (i) => {
      const inp = document.getElementById('msg-input');
      if (!inp || !inp.value.trim()) return;
      chats[i].msgs.push({ from: 'me', text: inp.value });
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setTimeout(() => {
        chats[i].msgs.push({ from: 'them', text: reply });
        renderChat(chats[i], i);
      }, 800 + Math.random() * 600);
      inp.value = '';
      renderChat(chats[i], i);
    };
  }

  function scrollMsgList(i) {
    const el = document.getElementById(`msg-list-${i}`);
    if (el) setTimeout(() => { el.scrollTop = el.scrollHeight; }, 50);
  }

  renderList();
};

/* ========== PHONE ========== */
APP_RENDERERS.phone = function(container) {
  let callActive = false, callTimer = 0, callInterval;
  const history = JSON.parse(localStorage.getItem('phone_history') || '[]');

  function render() {
    container.innerHTML = `
    <div id="phone-app">
      <div class="dialer">
        <div id="dialer-number" style="font-size:${dialNum.length>10?'28px':'42px'}">${dialNum || ''}</div>
        <div class="dialer-grid">
          ${[['1',''],['2','ABC'],['3','DEF'],['4','GHI'],['5','JKL'],['6','MNO'],['7','PQRS'],['8','TUV'],['9','WXYZ'],['*',''],['0','+'],['#','']].map(([n,s])=>`
            <button class="dial-key" onclick="dialPress('${n}')">
              ${n}<span class="sub">${s}</span>
            </button>`).join('')}
        </div>
        <div style="display:flex;gap:30px;margin-top:16px;align-items:center">
          ${callActive
            ? `<button class="dial-key call-btn" style="width:72px;height:72px" onclick="endPhoneCall()">📵</button>`
            : `<button class="dial-key" style="width:52px;height:52px;background:transparent" onclick="dialDel()">⌫</button>
               <button class="dial-key call-btn" style="width:72px;height:72px" onclick="startCall()">📞</button>
               <div style="width:52px;height:52px"></div>`}
        </div>
        ${callActive ? `<div id="call-status" style="color:#fff;font-size:18px;margin-top:12px">Звонок... <span id="call-timer">0:00</span></div>` : ''}
      </div>
      <div style="padding:0 16px 16px">
        <div style="color:rgba(255,255,255,0.5);font-size:13px;margin-bottom:8px">Недавние</div>
        ${history.slice(-5).reverse().map(h=>`
          <div style="display:flex;align-items:center;padding:10px 0;border-bottom:1px solid #1c1c1e;color:#fff;gap:12px">
            <span style="font-size:20px">${h.in?'📲':'📤'}</span>
            <div style="flex:1">
              <div style="font-size:16px">${h.num}</div>
              <div style="font-size:11px;color:rgba(255,255,255,0.4)">${h.time}</div>
            </div>
            <button onclick="phoneRedial('${h.num}')" style="background:none;border:none;color:#007AFF;cursor:pointer;font-size:16px">↩</button>
          </div>`).join('')}
      </div>
    </div>`;
  }

  let dialNum = '';
  window.dialPress = (n) => { dialNum += n; render(); };
  window.dialDel = () => { dialNum = dialNum.slice(0,-1); render(); };
  window.phoneRedial = (n) => { dialNum = n; render(); };
  window.startCall = () => {
    if (!dialNum) return;
    callActive = true;
    callTimer = 0;
    history.push({ num: dialNum, in: false, time: new Date().toLocaleTimeString() });
    localStorage.setItem('phone_history', JSON.stringify(history));
    render();
    callInterval = setInterval(() => {
      callTimer++;
      const m = Math.floor(callTimer/60), s = callTimer%60;
      const el = document.getElementById('call-timer');
      if (el) el.textContent = `${m}:${String(s).padStart(2,'0')}`;
    }, 1000);
    expandIsland('call', { name: dialNum });
  };
  window.endPhoneCall = () => {
    callActive = false;
    clearInterval(callInterval);
    collapseIsland();
    render();
  };
  window.endCall = () => { endPhoneCall(); };
  render();
};

/* ========== CALENDAR ========== */
APP_RENDERERS.calendar = function(container) {
  let viewDate = new Date();
  let events = JSON.parse(localStorage.getItem('iphone_calendar') || '{}');
  const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  const WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  function key(y, m, d) { return `${y}-${m}-${d}`; }

  function render() {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    const today = new Date();
    const firstDay = new Date(y, m, 1);
    // JS: 0=Sun..6=Sat -> convert to Mon-first (0=Mon..6=Sun)
    let startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let cells = '';
    for (let i = 0; i < startOffset; i++) cells += `<div class="cal-cell empty"></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
      const hasEvent = events[key(y, m, d)] && events[key(y, m, d)].length;
      cells += `
        <div class="cal-cell ${isToday ? 'today' : ''}" onclick="calSelectDay(${d})">
          <span class="cal-num">${d}</span>
          ${hasEvent ? '<span class="cal-dot"></span>' : ''}
        </div>`;
    }

    const selKey = key(y, m, calSelectedDay);
    const dayEvents = events[selKey] || [];

    container.innerHTML = `
    <div id="calendar-app">
      <div class="cal-header">
        <button class="cal-nav" onclick="calPrevMonth()">‹</button>
        <div class="cal-month">${MONTHS[m]} ${y}</div>
        <button class="cal-nav" onclick="calNextMonth()">›</button>
      </div>
      <div class="cal-weekdays">
        ${WEEKDAYS.map(w => `<div class="cal-wd">${w}</div>`).join('')}
      </div>
      <div class="cal-grid">${cells}</div>
      <div class="cal-events">
        <div class="cal-events-head">
          <span>${calSelectedDay} ${MONTHS[m]}</span>
          <button class="cal-add" onclick="calAddEvent()">+</button>
        </div>
        ${dayEvents.length === 0
          ? '<div class="cal-noevents">Нет событий</div>'
          : dayEvents.map((e, i) => `
            <div class="cal-event">
              <div class="cal-event-bar"></div>
              <div class="cal-event-info">
                <div class="cal-event-title">${e.title}</div>
                <div class="cal-event-time">${e.time}</div>
              </div>
              <button class="cal-event-del" onclick="calDelEvent(${i})">✕</button>
            </div>`).join('')}
      </div>
    </div>`;
  }

  window.calSelectDay = (d) => { calSelectedDay = d; render(); };
  window.calPrevMonth = () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1); calSelectedDay = 1; render(); };
  window.calNextMonth = () => { viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1); calSelectedDay = 1; render(); };
  window.calAddEvent = () => {
    const title = prompt('Название события:');
    if (!title) return;
    const time = prompt('Время (например 14:30):', '12:00') || '';
    const k = key(viewDate.getFullYear(), viewDate.getMonth(), calSelectedDay);
    if (!events[k]) events[k] = [];
    events[k].push({ title, time });
    localStorage.setItem('iphone_calendar', JSON.stringify(events));
    render();
  };
  window.calDelEvent = (i) => {
    const k = key(viewDate.getFullYear(), viewDate.getMonth(), calSelectedDay);
    if (events[k]) { events[k].splice(i, 1); if (!events[k].length) delete events[k]; }
    localStorage.setItem('iphone_calendar', JSON.stringify(events));
    render();
  };

  window.calSelectedDay = new Date().getDate();
  render();
};
let calSelectedDay = new Date().getDate();

/* ========== NOTES ========== */
APP_RENDERERS.notes = function(container) {
  let notes = JSON.parse(localStorage.getItem('iphone_notes') || '[{"title":"Добро пожаловать","text":"Это ваши заметки!","date":"Сегодня"}]');
  let editIdx = -1;
  let search = '';

  function fmtDate(n) { return n.date || ''; }
  function preview(n) {
    const body = (n.text || '').replace(/\n/g, ' ').trim();
    return body ? body.substring(0, 60) : 'Нет дополнительного текста';
  }

  function renderList() {
    const filtered = notes
      .map((n, i) => ({ n, i }))
      .filter(({ n }) => !search || (n.title + ' ' + n.text).toLowerCase().includes(search.toLowerCase()));

    container.innerHTML = `
    <div id="notes-app">
      <div class="notes-list-view">
        <div class="notes-header">
          <div class="notes-title">Заметки</div>
        </div>
        <div class="notes-search">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="#8e8e93"><path d="M6.5 1a5.5 5.5 0 014.38 8.83l3.64 3.64a.75.75 0 01-1.06 1.06l-3.64-3.64A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z"/></svg>
          <input id="notes-search-inp" placeholder="Поиск" value="${search}" oninput="notesSearch(this.value)">
        </div>
        <div class="notes-count">${notes.length === 0 ? 'Нет заметок' : notes.length + (notes.length === 1 ? ' заметка' : ' заметок/-и')}</div>
        <div class="notes-list">
          ${filtered.length === 0
            ? '<div class="notes-empty">Нет заметок</div>'
            : filtered.map(({ n, i }) => `
            <div class="note-item" onclick="editNote(${i})">
              <div class="note-item-title">${n.title || 'Новая заметка'}</div>
              <div class="note-item-row">
                <span class="note-item-date">${fmtDate(n)}</span>
                <span class="note-item-preview">${preview(n)}</span>
              </div>
            </div>`).join('')}
        </div>
        <div class="notes-toolbar">
          <span></span>
          <button class="notes-new-btn" onclick="newNote()" aria-label="Новая заметка">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd60a"><path d="M19 3a2 2 0 012 2v3.5l-2 2V5H5v14h11.5l-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zm1.7 4.3a1 1 0 011.4 1.4l-8.6 8.6-2.1.7.7-2.1 8.6-8.6z"/></svg>
          </button>
        </div>
      </div>
    </div>`;
    window.newNote = () => { editIdx = -1; renderEdit({ title: '', text: '', date: now() }); };
    window.editNote = (i) => { editIdx = i; renderEdit(notes[i]); };
    window.notesSearch = (v) => {
      search = v;
      const filtered2 = notes.map((n, i) => ({ n, i })).filter(({ n }) => !search || (n.title + ' ' + n.text).toLowerCase().includes(search.toLowerCase()));
      const list = container.querySelector('.notes-list');
      if (list) list.innerHTML = filtered2.length === 0
        ? '<div class="notes-empty">Ничего не найдено</div>'
        : filtered2.map(({ n, i }) => `
          <div class="note-item" onclick="editNote(${i})">
            <div class="note-item-title">${n.title || 'Новая заметка'}</div>
            <div class="note-item-row">
              <span class="note-item-date">${fmtDate(n)}</span>
              <span class="note-item-preview">${preview(n)}</span>
            </div>
          </div>`).join('');
    };
  }

  function renderEdit(note) {
    container.innerHTML = `
    <div id="notes-app">
      <div class="note-edit-view">
        <div class="note-edit-header">
          <button class="note-back-btn" onclick="saveNote()">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffd60a"><path d="M15 4l-8 8 8 8 1.4-1.4L9.8 12l6.6-6.6z"/></svg>
            <span>Заметки</span>
          </button>
          <div class="note-edit-actions">
            ${editIdx >= 0 ? `<button class="note-del-btn" onclick="deleteNote(${editIdx})">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffd60a"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 12H7L6 9z"/></svg>
            </button>` : ''}
            <button class="note-done-btn" onclick="saveNote()">Готово</button>
          </div>
        </div>
        <div class="note-edit-date">${note.date} ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}</div>
        <input id="note-title-inp" class="note-title-input" placeholder="Заголовок" value="${(note.title||'').replace(/"/g,'&quot;')}">
        <textarea id="note-text-inp" class="note-text-input" placeholder="">${note.text || ''}</textarea>
      </div>
    </div>`;
    setTimeout(() => { const t = document.getElementById('note-title-inp'); if (t && !note.title) t.focus(); }, 100);
    window.saveNote = () => {
      const title = document.getElementById('note-title-inp').value;
      const text = document.getElementById('note-text-inp').value;
      if (!title.trim() && !text.trim()) { renderList(); return; }
      const n = { title, text, date: now() };
      if (editIdx >= 0) notes[editIdx] = n;
      else notes.push(n);
      localStorage.setItem('iphone_notes', JSON.stringify(notes));
      renderList();
    };
    window.deleteNote = (i) => {
      notes.splice(i, 1);
      localStorage.setItem('iphone_notes', JSON.stringify(notes));
      renderList();
    };
  }

  function now() { return new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }); }
  renderList();
};

/* ========== SAFARI ========== */
APP_RENDERERS.safari = function(container) {
  const bookmarks = [
    { title: 'Wikipedia', url: 'https://ru.wikipedia.org', icon: '📖' },
    { title: 'Google', url: 'https://www.google.com', icon: '🔍' },
    { title: 'YouTube', url: 'https://www.youtube.com', icon: '▶️' },
    { title: 'GitHub', url: 'https://github.com', icon: '🐙' },
    { title: 'Bing', url: 'https://www.bing.com', icon: '🅱️' },
    { title: 'MDN', url: 'https://developer.mozilla.org', icon: '📘' },
    { title: 'Example', url: 'https://example.com', icon: '🌐' },
    { title: 'OpenAI', url: 'https://openai.com', icon: '🤖' },
  ];
  // Sites known to block iframe embedding (X-Frame-Options)
  const BLOCKED = ['google.', 'youtube.', 'github.', 'bing.', 'openai.', 'facebook.', 'instagram.', 'twitter.', 'x.com', 'yandex.', 'mail.ru', 'vk.com'];
  let history = [], histIdx = -1;
  let currentUrl = '';

  container.innerHTML = `
  <div id="safari-app">
    <div class="safari-bar">
      <input class="safari-url-input" id="safari-url" placeholder="Поиск или адрес сайта" onkeydown="if(event.key==='Enter')safariGo()">
      <button class="safari-go-btn" onclick="safariGo()">Перейти</button>
    </div>
    <div id="safari-main" style="flex:1;overflow:hidden;position:relative;display:flex;flex-direction:column">
      <div id="safari-home" style="overflow-y:auto;padding:16px;background:#f2f2f7;flex:1">
        <div style="font-size:20px;font-weight:700;color:#000;margin-bottom:12px">Избранное</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
          ${bookmarks.map((b,i)=>`
            <div onclick="safariLoad('${b.url}')" style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer">
              <div style="width:52px;height:52px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 2px 8px rgba(0,0,0,0.1)">${b.icon}</div>
              <div style="font-size:11px;color:#000;text-align:center">${b.title}</div>
            </div>`).join('')}
        </div>
        <div style="font-size:13px;color:rgba(0,0,0,0.5);line-height:1.5;background:#fff;border-radius:12px;padding:12px 14px">
          💡 Google, YouTube и подобные сайты запрещают встраивание — они откроются в новой вкладке. Wikipedia, MDN и Example работают прямо здесь.
        </div>
      </div>
      <iframe id="safari-iframe" style="display:none;flex:1;border:none;width:100%;height:100%;background:#fff"></iframe>
      <div id="safari-blocked" style="display:none;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:30px;text-align:center;background:#f2f2f7">
        <div style="font-size:54px">🔒</div>
        <div style="font-size:17px;font-weight:600;color:#000" id="safari-blocked-name">Сайт не разрешает встраивание</div>
        <div style="font-size:14px;color:rgba(0,0,0,0.5)">Этот сайт защищён от показа внутри окна. Откройте его в полноценной вкладке браузера.</div>
        <button onclick="safariOpenExternal()" style="background:#007AFF;border:none;border-radius:12px;color:#fff;padding:12px 24px;font-size:15px;font-weight:600;cursor:pointer;font-family:var(--font)">↗ Открыть в новой вкладке</button>
      </div>
    </div>
    <div class="safari-bottom-bar">
      <button class="safari-nav-btn" id="safari-back" onclick="safariBack()" disabled>←</button>
      <button class="safari-nav-btn" id="safari-fwd" onclick="safariForward()" disabled>→</button>
      <button class="safari-nav-btn" onclick="safariHome()">⊞</button>
      <button class="safari-nav-btn" onclick="safariOpenExternal()" title="Открыть в новой вкладке">↗</button>
      <button class="safari-nav-btn" onclick="safariRefresh()">↻</button>
    </div>
  </div>`;

  function isBlocked(url) {
    return BLOCKED.some(d => url.toLowerCase().includes(d));
  }

  window.safariGo = () => {
    let url = document.getElementById('safari-url').value.trim();
    if (!url) return;
    if (!/^https?:\/\//.test(url)) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}`;
      }
    }
    safariLoad(url);
  };

  window.safariLoad = (url) => {
    currentUrl = url;
    document.getElementById('safari-home').style.display = 'none';
    document.getElementById('safari-url').value = url;
    history = history.slice(0, histIdx + 1); history.push(url); histIdx = history.length - 1;
    document.getElementById('safari-back').disabled = histIdx <= 0;
    document.getElementById('safari-fwd').disabled = histIdx >= history.length - 1;

    const frame = document.getElementById('safari-iframe');
    const blocked = document.getElementById('safari-blocked');

    if (isBlocked(url)) {
      frame.style.display = 'none';
      frame.src = 'about:blank';
      blocked.style.display = 'flex';
      const name = document.getElementById('safari-blocked-name');
      try { name.textContent = new URL(url).hostname + ' не разрешает встраивание'; } catch(e) {}
    } else {
      blocked.style.display = 'none';
      frame.style.display = 'block';
      frame.src = url;
    }
  };

  window.safariOpenExternal = () => {
    let u = currentUrl || document.getElementById('safari-url').value.trim();
    if (!u) return;
    if (!/^https?:\/\//.test(u)) u = 'https://' + u;
    window.open(u, '_blank');
  };

  window.safariBack = () => {
    if (histIdx > 0) {
      histIdx--;
      const u = history[histIdx];
      currentUrl = u;
      renderSafariUrl(u);
    }
  };
  window.safariForward = () => {
    if (histIdx < history.length - 1) {
      histIdx++;
      const u = history[histIdx];
      currentUrl = u;
      renderSafariUrl(u);
    }
  };

  function renderSafariUrl(url) {
    document.getElementById('safari-url').value = url;
    document.getElementById('safari-back').disabled = histIdx <= 0;
    document.getElementById('safari-fwd').disabled = histIdx >= history.length - 1;
    const frame = document.getElementById('safari-iframe');
    const blocked = document.getElementById('safari-blocked');
    if (isBlocked(url)) {
      frame.style.display = 'none'; frame.src = 'about:blank';
      blocked.style.display = 'flex';
      try { document.getElementById('safari-blocked-name').textContent = new URL(url).hostname + ' не разрешает встраивание'; } catch(e) {}
    } else {
      blocked.style.display = 'none';
      frame.style.display = 'block'; frame.src = url;
    }
  }

  window.safariHome = () => {
    document.getElementById('safari-home').style.display = 'block';
    document.getElementById('safari-blocked').style.display = 'none';
    const f = document.getElementById('safari-iframe'); f.style.display = 'none'; f.src = 'about:blank';
    document.getElementById('safari-url').value = '';
    currentUrl = '';
  };
  window.safariRefresh = () => { if (currentUrl) renderSafariUrl(currentUrl); };
};

/* ========== MUSIC ========== */
let musicAudio = null, musicPlaying = false, musicCurrent = { title: 'Нет трека', artist: '-' };
let musicList = [], musicIdx = 0;

// Web Audio API EQ setup
let audioCtx = null, audioSource = null, analyser = null, animFrameId = null;
const EQ_BANDS = [
  { freq: 60,   label: 'Sub',  type: 'lowshelf',  gain: 0 },
  { freq: 170,  label: 'Bass', type: 'peaking',   gain: 0 },
  { freq: 310,  label: 'Low',  type: 'peaking',   gain: 0 },
  { freq: 600,  label: 'Mid',  type: 'peaking',   gain: 0 },
  { freq: 1000, label: 'Mids', type: 'peaking',   gain: 0 },
  { freq: 3000, label: 'High', type: 'peaking',   gain: 0 },
  { freq: 6000, label: 'Air',  type: 'peaking',   gain: 0 },
  { freq: 14000,label: 'Tre',  type: 'highshelf', gain: 0 },
];
let eqNodes = [];

function initAudioCtx() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioSource = audioCtx.createMediaElementSource(musicAudio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;

  // Create EQ filter chain
  eqNodes = EQ_BANDS.map(band => {
    const f = audioCtx.createBiquadFilter();
    f.type = band.type;
    f.frequency.value = band.freq;
    f.gain.value = band.gain;
    f.Q.value = 1.4;
    return f;
  });

  // Connect: source → eq filters chain → analyser → destination
  let prev = audioSource;
  eqNodes.forEach(node => { prev.connect(node); prev = node; });
  prev.connect(analyser);
  analyser.connect(audioCtx.destination);
}

function setEqBand(idx, gain) {
  EQ_BANDS[idx].gain = gain;
  if (eqNodes[idx]) eqNodes[idx].gain.value = gain;
}

function applyEqPreset(preset) {
  const presets = {
    flat:    [0,0,0,0,0,0,0,0],
    bass:    [8,7,4,0,0,0,0,0],
    treble:  [0,0,0,0,2,5,7,8],
    vocal:   [-2,-1,2,5,5,3,1,-1],
    dj:      [6,5,2,-1,-2,2,5,6],
    club:    [5,4,3,2,0,1,3,4],
    pop:     [-1,2,4,4,2,0,-1,-1],
    rock:    [5,4,3,0,-1,2,4,5],
    hiphop:  [7,6,3,1,0,0,2,3],
  };
  const vals = presets[preset] || presets.flat;
  vals.forEach((v, i) => {
    setEqBand(i, v);
    const slider = document.getElementById('eq-band-' + i);
    const label = document.getElementById('eq-val-' + i);
    if (slider) slider.value = v;
    if (label) label.textContent = (v >= 0 ? '+' : '') + v;
  });
}

function drawVisualizer() {
  const canvas = document.getElementById('eq-canvas');
  if (!canvas || !analyser) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const bufLen = analyser.frequencyBinCount;
  const dataArr = new Uint8Array(bufLen);

  function draw() {
    animFrameId = requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArr);
    ctx.clearRect(0, 0, W, H);

    const barW = (W / bufLen) * 2.2;
    let x = 0;
    for (let i = 0; i < bufLen; i++) {
      const barH = (dataArr[i] / 255) * H;
      // Color gradient: bass=red, mid=yellow, treble=cyan
      const hue = Math.round((i / bufLen) * 200 + 160);
      ctx.fillStyle = `hsl(${hue},100%,55%)`;
      ctx.fillRect(x, H - barH, barW - 1, barH);
      // Mirror top (dim)
      ctx.fillStyle = `hsla(${hue},100%,55%,0.2)`;
      ctx.fillRect(x, 0, barW - 1, H - barH);
      x += barW + 1;
    }
  }
  draw();
}

APP_RENDERERS.music = function(container) {
  container.innerHTML = `
  <div id="music-app">
    <div class="music-artwork ${musicPlaying?'playing':''}" id="music-art">🎵</div>
    <div class="music-info">
      <div class="music-title" id="music-title">${musicCurrent.title}</div>
      <div class="music-artist" id="music-artist">${musicCurrent.artist}</div>
    </div>
    <div class="music-progress-wrap">
      <input type="range" class="music-progress" id="music-prog" min="0" max="100" value="0" oninput="musicSeek(this.value)">
      <div class="music-times"><span id="music-cur">0:00</span><span id="music-dur">0:00</span></div>
    </div>
    <div class="music-controls">
      <button class="music-btn" onclick="musicPrev()">⏮</button>
      <button class="music-btn play-pause" id="music-play-btn" onclick="toggleMusicPlay()">${musicPlaying?'⏸':'▶'}</button>
      <button class="music-btn" onclick="musicNext()">⏭</button>
    </div>
    <div class="music-volume-wrap">
      <span>🔈</span>
      <input type="range" class="music-vol" min="0" max="100" value="80" oninput="if(musicAudio)musicAudio.volume=this.value/100">
      <span>🔊</span>
    </div>

    <!-- EQUALIZER -->
    <div id="eq-panel" style="width:100%;background:rgba(0,0,0,0.4);border-radius:16px;padding:12px;margin-top:8px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="color:#fff;font-size:13px;font-weight:700">🎚 Эквалайзер</span>
        <div style="display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end">
          ${['flat','bass','treble','vocal','dj','club','pop','rock','hiphop'].map(p=>`
            <button onclick="applyEqPreset('${p}')" style="background:rgba(255,255,255,0.1);border:none;border-radius:8px;color:#fff;padding:3px 7px;font-size:10px;cursor:pointer;font-family:var(--font)">${p}</button>`).join('')}
        </div>
      </div>
      <!-- Spectrum visualizer -->
      <canvas id="eq-canvas" width="330" height="50" style="width:100%;height:50px;border-radius:8px;background:#0a0a0a;margin-bottom:10px;display:block"></canvas>
      <!-- EQ sliders -->
      <div style="display:flex;gap:4px;align-items:flex-end;justify-content:space-between">
        ${EQ_BANDS.map((b,i) => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex:1">
            <span id="eq-val-${i}" style="color:#ff9f0a;font-size:9px;font-weight:700">${b.gain>=0?'+':''}${b.gain}</span>
            <div style="position:relative;height:80px;display:flex;align-items:center;justify-content:center">
              <input id="eq-band-${i}" type="range" min="-12" max="12" step="1" value="${b.gain}"
                style="writing-mode:vertical-lr;direction:rtl;-webkit-appearance:slider-vertical;appearance:auto;height:75px;width:20px;cursor:pointer;accent-color:#ff9f0a"
                oninput="setEqBand(${i},+this.value);document.getElementById('eq-val-${i}').textContent=(+this.value>=0?'+':'')+this.value">
            </div>
            <span style="color:rgba(255,255,255,0.5);font-size:8px;text-align:center">${b.label}</span>
            <span style="color:rgba(255,255,255,0.3);font-size:7px">${b.freq>=1000?(b.freq/1000)+'k':b.freq}</span>
          </div>`).join('')}
      </div>
    </div>

    <input type="file" id="music-file-inp" accept="audio/*" multiple style="display:none" onchange="loadMusicFiles(this.files)">
    <button class="music-file-btn" onclick="document.getElementById('music-file-inp').click()">📂 Загрузить музыку</button>
    <div id="music-playlist" style="width:100%;margin-top:10px;max-height:120px;overflow-y:auto"></div>
  </div>`;

  if (!musicAudio) { musicAudio = new Audio(); musicAudio.crossOrigin = 'anonymous'; window.musicAudio = musicAudio; setupMusicAudio(); }
  renderPlaylist();
  startMusicProgress();
  if (musicPlaying && analyser) { if (animFrameId) cancelAnimationFrame(animFrameId); drawVisualizer(); }
};

function setupMusicAudio() {
  musicAudio.ontimeupdate = () => {
    const prog = document.getElementById('music-prog');
    const cur = document.getElementById('music-cur');
    const dur = document.getElementById('music-dur');
    if (!musicAudio.duration) return;
    const pct = (musicAudio.currentTime / musicAudio.duration) * 100;
    if (prog) prog.value = pct;
    if (cur) cur.textContent = fmtSec(musicAudio.currentTime);
    if (dur) dur.textContent = fmtSec(musicAudio.duration);
  };
  musicAudio.onended = () => musicNext();
}

function startMusicProgress() {
  setInterval(() => {
    const prog = document.getElementById('music-prog');
    if (prog && musicAudio && musicAudio.duration) prog.value = (musicAudio.currentTime / musicAudio.duration) * 100;
  }, 500);
}

function fmtSec(s) { const m = Math.floor(s/60); return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}`; }

window.toggleMusicPlay = function() {
  if (!musicAudio.src) { alert('Загрузите музыкальный файл'); return; }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  if (musicPlaying) {
    musicAudio.pause(); musicPlaying = false;
    if (animFrameId) { cancelAnimationFrame(animFrameId); animFrameId = null; }
  } else {
    musicAudio.play(); musicPlaying = true;
    expandIsland('music', musicCurrent);
    if (analyser) drawVisualizer();
  }
  const btn = document.getElementById('music-play-btn');
  if (btn) btn.textContent = musicPlaying ? '⏸' : '▶';
  const art = document.getElementById('music-art');
  if (art) art.classList.toggle('playing', musicPlaying);
};

window.musicSeek = function(v) { if (musicAudio && musicAudio.duration) musicAudio.currentTime = (v/100)*musicAudio.duration; };
window.musicPrev = function() { if (musicIdx > 0) { musicIdx--; playMusicAt(musicIdx); } };
window.musicNext = function() { if (musicIdx < musicList.length-1) { musicIdx++; playMusicAt(musicIdx); } else { musicAudio.currentTime=0; musicAudio.play(); }};

window.loadMusicFiles = function(files) {
  Array.from(files).forEach(f => {
    const url = URL.createObjectURL(f);
    const title = f.name.replace(/\.[^.]+$/,'');
    musicList.push({ url, title, artist: 'Неизвестен' });
  });
  if (musicList.length > 0) { musicIdx = musicList.length - files.length; playMusicAt(musicIdx); }
  renderPlaylist();
};

function playMusicAt(i) {
  const track = musicList[i];
  musicAudio.src = track.url;
  musicCurrent = { title: track.title, artist: track.artist };
  // Init Web Audio on first play (requires user gesture)
  try { initAudioCtx(); } catch(e) { console.warn('AudioCtx init:', e); }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  musicAudio.play().then(() => {
    musicPlaying = true;
    if (analyser) { if (animFrameId) cancelAnimationFrame(animFrameId); drawVisualizer(); }
  }).catch(e => console.warn(e));
  const btn = document.getElementById('music-play-btn'); if (btn) btn.textContent = '⏸';
  const t = document.getElementById('music-title'); if (t) t.textContent = track.title;
  const a = document.getElementById('music-artist'); if (a) a.textContent = track.artist;
  const art = document.getElementById('music-art'); if (art) art.classList.add('playing');
  expandIsland('music', musicCurrent);
}

function renderPlaylist() {
  const el = document.getElementById('music-playlist'); if (!el) return;
  el.innerHTML = musicList.map((t,i)=>`
    <div onclick="musicIdx=${i};playMusicAt(${i})" style="padding:8px 12px;color:${i===musicIdx?'#ff9f0a':'#fff'};font-size:13px;cursor:pointer;border-radius:8px;background:${i===musicIdx?'rgba(255,159,10,0.15)':'transparent'}">
      ${i===musicIdx?'▶ ':''}${t.title}
    </div>`).join('');
}

/* ========== YOUTUBE ========== */
APP_RENDERERS.youtube = function(container) {
  const featured = [
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up', ch: 'Rick Astley' },
    { id: 'kJQP7kiw5Fk', title: 'Despacito', ch: 'Luis Fonsi' },
    { id: '9bZkp7q19f0', title: 'PSY - GANGNAM STYLE', ch: 'officialpsy' },
    { id: 'JGwWNGJdvx8', title: 'Ed Sheeran - Shape of You', ch: 'Ed Sheeran' },
    { id: 'OPf0YbXqDm0', title: 'Mark Ronson - Uptown Funk', ch: 'Mark Ronson' },
  ];

  container.innerHTML = `
  <div id="youtube-app">
    <div style="display:flex;align-items:center;padding:10px 12px;background:#0f0f0f;gap:10px">
      <span style="color:#ff0000;font-size:24px;font-weight:800">▶ YouTube</span>
    </div>
    <div class="yt-search-bar">
      <input class="yt-search-input" id="yt-search" placeholder="Поиск" onkeydown="if(event.key==='Enter')ytSearch()">
      <button class="yt-search-btn" onclick="ytSearch()">🔍</button>
    </div>
    <div id="yt-player-wrap" style="display:none">
      <iframe id="yt-iframe" allowfullscreen allow="autoplay; encrypted-media"></iframe>
      <button onclick="closeYT()" style="position:absolute;top:4px;right:4px;background:rgba(0,0,0,0.7);border:none;color:#fff;border-radius:50%;width:28px;height:28px;font-size:16px;cursor:pointer">✕</button>
    </div>
    <div class="yt-feed" id="yt-feed">
      ${featured.map(v=>`
        <div class="yt-video-card" onclick="ytPlay('${v.id}','${v.title}','${v.ch}')">
          <img class="yt-thumb" src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="">
          <div class="yt-video-info">
            <div class="yt-title">${v.title}</div>
            <div class="yt-channel">${v.ch}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;

  window.ytPlay = (id, title, ch) => {
    if (!id) return;
    const wrap = document.getElementById('yt-player-wrap');
    wrap.style.display = 'block';
    document.getElementById('yt-iframe').src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
    expandIsland('music', { title: title || 'YouTube', artist: ch || '' });
  };
  window.closeYT = () => {
    document.getElementById('yt-player-wrap').style.display = 'none';
    document.getElementById('yt-iframe').src = '';
    collapseIsland();
  };
  window.ytSearch = () => {
    const q = document.getElementById('yt-search').value.trim();
    if (!q) return;
    const wrap = document.getElementById('yt-player-wrap');
    wrap.style.display = 'block';
    // Search via YouTube's embed search
    document.getElementById('yt-iframe').src = `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(q)}&autoplay=1`;
    expandIsland('music', { title: 'Поиск: ' + q, artist: 'YouTube' });
  };
};

/* ========== CAMERA ========== */
APP_RENDERERS.camera = function(container) {
  let stream = null, photos = JSON.parse(localStorage.getItem('iphone_photos') || '[]');
  let facingMode = 'user'; // front camera = mirrored by default
  let currentMode = 'PHOTO';
  const modes = ['SLO-MO', 'VIDEO', 'PHOTO', 'SQUARE', 'PANO'];

  container.innerHTML = `
  <div id="camera-app" style="background:#000;height:100%;display:flex;flex-direction:column;position:relative;overflow:hidden">

    <!-- Top bar -->
    <div style="position:absolute;top:0;left:0;right:0;z-index:10;padding:12px 20px;display:flex;align-items:center;justify-content:space-between">
      <button onclick="camToggleFlash()" id="cam-flash-btn" style="background:none;border:none;color:#ff0;font-size:20px;cursor:pointer;width:36px;text-align:center">⚡</button>
      <span style="color:#fff;font-size:12px;font-weight:600;letter-spacing:1px">HDR</span>
      <button onclick="camTimer()" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;width:36px;text-align:center">⏱</button>
      <button onclick="camToggleMirror()" id="cam-mirror-btn" title="Зеркало" style="background:none;border:none;color:#fff;font-size:18px;cursor:pointer;width:36px;text-align:center">↔</button>
    </div>

    <!-- Viewfinder — full screen -->
    <video id="camera-viewfinder" autoplay muted playsinline
      style="flex:1;width:100%;object-fit:cover;transform:scaleX(-1);transition:transform 0.2s"></video>

    <!-- Flash overlay -->
    <div id="camera-flash" style="position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;transition:opacity 0.15s;z-index:20"></div>

    <!-- Mode selector -->
    <div style="display:flex;justify-content:center;gap:18px;padding:10px 0 6px;background:transparent;z-index:10">
      ${modes.map(m => `
        <span id="cam-mode-${m}" onclick="camSetMode('${m}')"
          style="color:${m===currentMode?'#ff9f0a':'rgba(255,255,255,0.7)'};font-size:11px;font-weight:700;letter-spacing:0.5px;cursor:pointer;text-transform:uppercase">
          ${m}
        </span>`).join('')}
    </div>

    <!-- Bottom controls -->
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 28px 18px;background:rgba(0,0,0,0.5);z-index:10">
      <!-- Thumbnail -->
      <div id="cam-thumb" onclick="openPhotosFromCamera()"
        style="width:52px;height:52px;border-radius:10px;background:#1c1c1e;overflow:hidden;cursor:pointer;border:2px solid rgba(255,255,255,0.3);flex-shrink:0">
        ${photos.length ? `<img src="${photos[photos.length-1]}" style="width:100%;height:100%;object-fit:cover;transform:scaleX(-1)">` : ''}
      </div>

      <!-- Shutter -->
      <button onclick="takePhoto()"
        style="width:72px;height:72px;border-radius:50%;background:#fff;border:4px solid rgba(255,255,255,0.4);cursor:pointer;flex-shrink:0;transition:transform 0.1s;box-shadow:0 0 0 2px rgba(0,0,0,0.3)"
        onmousedown="this.style.transform='scale(0.9)'" onmouseup="this.style.transform='scale(1)'">
      </button>

      <!-- Flip -->
      <button onclick="flipCamera()"
        style="width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;backdrop-filter:blur(10px)">
        🔄
      </button>
    </div>
  </div>`;

  let isMirrored = true;

  function startCamera() {
    if (stream) stream.getTracks().forEach(t => t.stop());
    navigator.mediaDevices.getUserMedia({ video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then(s => {
        stream = s;
        const v = document.getElementById('camera-viewfinder');
        if (v) {
          v.srcObject = s;
          v.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
        }
      })
      .catch(() => {
        container.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#fff;background:#000">
          <div style="font-size:64px">📷</div>
          <div style="font-size:16px">Нет доступа к камере</div>
          <div style="font-size:13px;opacity:0.5;text-align:center;padding:0 30px">Разрешите доступ к камере в настройках браузера</div>
        </div>`;
      });
  }

  window.takePhoto = () => {
    const video = document.getElementById('camera-viewfinder');
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (isMirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/jpeg', 0.85);
    photos.push(data);
    if (photos.length > 50) photos.shift();
    localStorage.setItem('iphone_photos', JSON.stringify(photos));
    // Flash
    const flash = document.getElementById('camera-flash');
    if (flash) { flash.style.opacity = '1'; setTimeout(() => flash.style.opacity = '0', 120); }
    // Update thumbnail
    const thumb = document.getElementById('cam-thumb');
    if (thumb) thumb.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover">`;
  };

  window.flipCamera = () => {
    facingMode = facingMode === 'environment' ? 'user' : 'environment';
    // Front cam auto-mirror, back cam no mirror
    isMirrored = facingMode === 'user';
    startCamera();
  };

  window.camToggleMirror = () => {
    isMirrored = !isMirrored;
    const v = document.getElementById('camera-viewfinder');
    if (v) v.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    const btn = document.getElementById('cam-mirror-btn');
    if (btn) btn.style.color = isMirrored ? '#ff9f0a' : '#fff';
  };

  window.camSetMode = (mode) => {
    currentMode = mode;
    modes.forEach(m => {
      const el = document.getElementById('cam-mode-' + m);
      if (el) el.style.color = m === mode ? '#ff9f0a' : 'rgba(255,255,255,0.7)';
    });
  };

  let flashOn = false;
  window.camToggleFlash = () => {
    flashOn = !flashOn;
    const btn = document.getElementById('cam-flash-btn');
    if (btn) { btn.textContent = flashOn ? '⚡' : '⚡'; btn.style.color = flashOn ? '#ff9f0a' : 'rgba(255,255,255,0.5)'; }
  };

  window.camTimer = () => alert('Таймер: 3 сек (откройте Часы для настройки)');
  window.openPhotosFromCamera = () => { openApp('photos'); };

  startCamera();

  // Cleanup when app closes (invoked by closeApp in core.js)
  window._appCleanup = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
  };
};

/* ========== PHOTOS ========== */
APP_RENDERERS.photos = function(container) {
  let photos = JSON.parse(localStorage.getItem('iphone_photos') || '[]');
  container.innerHTML = `
  <div id="photos-app">
    <div style="padding:16px;color:#fff;font-size:20px;font-weight:700">Фото (${photos.length})</div>
    ${photos.length === 0
      ? '<div style="color:rgba(255,255,255,0.4);text-align:center;padding:60px;font-size:14px">Сделайте фото через Камеру</div>'
      : `<div class="photos-grid">${photos.map((p,i)=>`<img src="${p}" loading="lazy" onclick="viewPhoto(${i})">`).join('')}</div>`}
    <div class="photo-viewer" id="photo-viewer">
      <button onclick="document.getElementById('photo-viewer').classList.remove('open')" style="position:absolute;top:20px;right:20px;background:rgba(0,0,0,0.6);border:none;color:#fff;border-radius:50%;width:36px;height:36px;font-size:18px;cursor:pointer">✕</button>
      <img id="photo-viewer-img" src="" alt="" style="max-width:100%;max-height:80%">
    </div>
  </div>`;
  window.viewPhoto = (i) => {
    document.getElementById('photo-viewer-img').src = photos[i];
    document.getElementById('photo-viewer').classList.add('open');
  };
};

/* ========== WEATHER ========== */
APP_RENDERERS.weather = function(container) {
  // Uses Open-Meteo (free, no API key, CORS-enabled).

  // --- helpers -------------------------------------------------------------
  // Pick an emoji for a condition, optionally for night.
  function condEmoji(main, isNight) {
    const m = (main || '').toLowerCase();
    if (m.includes('thunder')) return '⛈️';
    if (m.includes('drizzle')) return '🌦️';
    if (m.includes('rain')) return '🌧️';
    if (m.includes('snow')) return '❄️';
    if (m.includes('mist') || m.includes('fog') || m.includes('haze') || m.includes('smoke')) return '🌫️';
    if (m.includes('cloud')) return isNight ? '☁️' : '⛅';
    if (m.includes('clear')) return isNight ? '🌙' : '☀️';
    return isNight ? '🌙' : '🌤️';
  }

  // Pick a full-screen gradient for a condition + day/night.
  function condGradient(main, isNight) {
    const m = (main || '').toLowerCase();
    if (isNight) {
      if (m.includes('rain') || m.includes('drizzle') || m.includes('thunder'))
        return 'linear-gradient(180deg,#1c2530 0%,#2b3a47 100%)';
      if (m.includes('cloud')) return 'linear-gradient(180deg,#2a323b 0%,#3e4a56 100%)';
      return 'linear-gradient(180deg,#1b2735 0%,#2c3e50 100%)';
    }
    if (m.includes('thunder')) return 'linear-gradient(180deg,#3a4453 0%,#566270 100%)';
    if (m.includes('rain') || m.includes('drizzle')) return 'linear-gradient(180deg,#3a4a5a 0%,#5a6a7a 100%)';
    if (m.includes('snow')) return 'linear-gradient(180deg,#6d7e8c 0%,#aab8c2 100%)';
    if (m.includes('mist') || m.includes('fog') || m.includes('haze')) return 'linear-gradient(180deg,#6a7884 0%,#9aa7b0 100%)';
    if (m.includes('cloud')) return 'linear-gradient(180deg,#54717a 0%,#8a9ba8 100%)';
    // clear day (default)
    return 'linear-gradient(180deg,#4a90d9 0%,#87ceeb 100%)';
  }

  function isNightNow(d) {
    if (d && d.sys && d.sys.sunrise && d.sys.sunset) {
      const t = Math.floor(Date.now() / 1000);
      return t < d.sys.sunrise || t > d.sys.sunset;
    }
    const h = new Date().getHours();
    return h < 6 || h >= 20;
  }

  // Generate a plausible 12-hour curve around the current temp.
  function genHourly(curTemp, main, night) {
    const out = [];
    const startH = new Date().getHours();
    for (let i = 0; i < 12; i++) {
      const h = (startH + i) % 24;
      // day curve: warmest ~15:00, coldest ~04:00
      const curveOffset = Math.sin((h - 9) / 24 * Math.PI * 2) * 3.5;
      const jitter = (Math.random() - 0.5) * 1.5;
      const temp = Math.round(curTemp + curveOffset + jitter);
      const nightHour = h < 6 || h >= 20;
      out.push({
        label: i === 0 ? 'Сейчас' : (h < 10 ? '0' + h : '' + h),
        emoji: condEmoji(main, nightHour),
        temp
      });
    }
    return out;
  }

  // Generate a plausible 7-day forecast around the current temp.
  function genDaily(curTemp, main) {
    const names = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const conds = ['Clear', 'Clouds', 'Clear', 'Rain', 'Clouds', 'Clear', 'Clear'];
    const today = new Date().getDay();
    const out = [];
    let weekMin = 999, weekMax = -999;
    for (let i = 0; i < 7; i++) {
      const c = i === 0 ? main : conds[(i * 3) % conds.length];
      const base = curTemp + (Math.random() - 0.5) * 6;
      const max = Math.round(base + 2 + Math.random() * 3);
      const min = Math.round(base - 4 - Math.random() * 3);
      weekMin = Math.min(weekMin, min);
      weekMax = Math.max(weekMax, max);
      out.push({
        name: i === 0 ? 'Сегодня' : names[(today + i) % 7],
        emoji: condEmoji(c, false),
        min, max, cond: c
      });
    }
    return { days: out, weekMin, weekMax };
  }

  function esc(s) { return String(s).replace(/[<>&"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c])); }

  // --- markup --------------------------------------------------------------
  container.innerHTML = `<div id="weather-app">
    <div class="weather-bg" id="weather-bg"></div>
    <div class="weather-scroll" id="weather-scroll">
      <div class="weather-search-wrap">
        <input id="weather-city-inp" placeholder="Поиск города" value="Навои"
          onkeydown="if(event.key==='Enter')loadWeather()">
        <button onclick="loadWeather()" title="Найти">⌕</button>
      </div>
      <div id="weather-data"></div>
    </div>
  </div>`;

  function renderLoading() {
    document.getElementById('weather-data').innerHTML =
      `<div class="weather-message">Загрузка…</div>`;
  }

  function renderError(msg) {
    document.getElementById('weather-data').innerHTML =
      `<div class="weather-message">${esc(msg)}</div>`;
  }

  function renderWeather(d) {
    const night = isNightNow(d);
    const main = d.weather[0].main;
    const desc = d.weather[0].description;
    const cur = Math.round(d.main.temp);
    const tmax = Math.round(d.main.temp_max);
    const tmin = Math.round(d.main.temp_min);

    // background
    document.getElementById('weather-bg').style.background = condGradient(main, night);

    const hourly = d._hourly && d._hourly.length ? d._hourly : genHourly(cur, main, night);
    const daily = d._daily && d._daily.days ? d._daily : genDaily(cur, main);
    const range = Math.max(1, daily.weekMax - daily.weekMin);

    const uv = night ? 0 : Math.max(0, Math.min(11, Math.round((cur - 5) / 4)));
    const uvLabel = uv <= 2 ? 'Низкий' : uv <= 5 ? 'Умеренный' : uv <= 7 ? 'Высокий' : 'Оч. высокий';
    const press = Math.round((d.main.pressure || 1013) * 0.750062); // hPa -> mm Hg
    const vis = Math.round((d.visibility != null ? d.visibility : 10000) / 1000);
    const feels = Math.round(d.main.feels_like);
    const windDir = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'][Math.round(((d.wind.deg || 0) % 360) / 45) % 8];

    document.getElementById('weather-data').innerHTML = `
      <div class="weather-hero">
        <div class="weather-city">${esc(d.name)}</div>
        <div class="weather-temp">${cur}°</div>
        <div class="weather-desc">${esc(desc)}</div>
        <div class="weather-minmax">Макс.: ${tmax}°  Мин.: ${tmin}°</div>
      </div>

      <div class="weather-block">
        <div class="weather-block-title">⏱ ПОЧАСОВОЙ ПРОГНОЗ</div>
        <div class="weather-hourly">
          ${hourly.map(h => `
            <div class="weather-hour">
              <div class="weather-hour-label">${esc(h.label)}</div>
              <div class="weather-hour-emoji">${h.emoji}</div>
              <div class="weather-hour-temp">${h.temp}°</div>
            </div>`).join('')}
        </div>
      </div>

      <div class="weather-block">
        <div class="weather-block-title">📅 ПРОГНОЗ НА 7 ДНЕЙ</div>
        <div class="weather-daily">
          ${daily.days.map(day => {
            const lp = ((day.min - daily.weekMin) / range) * 100;
            const wp = ((day.max - day.min) / range) * 100;
            return `
            <div class="weather-day">
              <div class="weather-day-name">${esc(day.name)}</div>
              <div class="weather-day-emoji">${day.emoji}</div>
              <div class="weather-day-min">${day.min}°</div>
              <div class="weather-day-bar">
                <div class="weather-day-bar-fill" style="left:${lp}%;width:${wp}%"></div>
              </div>
              <div class="weather-day-max">${day.max}°</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      <div class="weather-grid">
        <div class="weather-detail">
          <div class="weather-detail-label">ОЩУЩАЕТСЯ</div>
          <div class="weather-detail-value">${feels}°</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">ВЛАЖНОСТЬ</div>
          <div class="weather-detail-value">${d.main.humidity}%</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">ВЕТЕР</div>
          <div class="weather-detail-value">${Math.round(d.wind.speed)} <span>м/с</span></div>
          <div class="weather-detail-sub">${windDir}</div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">ВИДИМОСТЬ</div>
          <div class="weather-detail-value">${vis} <span>км</span></div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">ДАВЛЕНИЕ</div>
          <div class="weather-detail-value">${press} <span>мм</span></div>
        </div>
        <div class="weather-detail">
          <div class="weather-detail-label">УФ-ИНДЕКС</div>
          <div class="weather-detail-value">${uv}</div>
          <div class="weather-detail-sub">${uvLabel}</div>
        </div>
      </div>
    `;
  }

  // WMO weather code -> [main keyword, ru description]
  function wmo(code) {
    const map = {
      0:['Clear','ясно'],1:['Clear','в основном ясно'],2:['Clouds','переменная облачность'],3:['Clouds','пасмурно'],
      45:['Fog','туман'],48:['Fog','изморозь'],
      51:['Drizzle','слабая морось'],53:['Drizzle','морось'],55:['Drizzle','сильная морось'],
      56:['Drizzle','ледяная морось'],57:['Drizzle','сильная ледяная морось'],
      61:['Rain','небольшой дождь'],63:['Rain','дождь'],65:['Rain','сильный дождь'],
      66:['Rain','ледяной дождь'],67:['Rain','сильный ледяной дождь'],
      71:['Snow','небольшой снег'],73:['Snow','снег'],75:['Snow','сильный снег'],77:['Snow','снежные зёрна'],
      80:['Rain','ливень'],81:['Rain','сильный ливень'],82:['Rain','очень сильный ливень'],
      85:['Snow','снегопад'],86:['Snow','сильный снегопад'],
      95:['Thunderstorm','гроза'],96:['Thunderstorm','гроза с градом'],99:['Thunderstorm','сильная гроза с градом'],
    };
    return map[code] || ['Clouds','облачно'];
  }

  window.loadWeather = () => {
    const inp = document.getElementById('weather-city-inp');
    const city = (inp && inp.value.trim()) || 'Navoiy';
    renderLoading();
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=ru&format=json`)
      .then(r => r.json())
      .then(geo => {
        if (!geo.results || !geo.results.length) { renderError('Город не найден'); return null; }
        const g = geo.results[0];
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}`
          + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m`
          + `&hourly=temperature_2m,weather_code`
          + `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset`
          + `&wind_speed_unit=ms&timezone=auto&forecast_days=7`;
        return fetch(url).then(r => r.json()).then(f => ({ g, f }));
      })
      .then(res => {
        if (!res) return;
        const { g, f } = res;
        const c = f.current || {};
        const [main, desc] = wmo(c.weather_code);
        const srise = f.daily && f.daily.sunrise ? Math.floor(new Date(f.daily.sunrise[0]).getTime() / 1000) : null;
        const sset  = f.daily && f.daily.sunset  ? Math.floor(new Date(f.daily.sunset[0]).getTime()  / 1000) : null;

        // hourly: next 12 hours starting from the current hour
        const hourly = [];
        if (f.hourly && f.hourly.time) {
          const now = Date.now();
          let startIdx = f.hourly.time.findIndex(t => new Date(t).getTime() >= now - 3600e3);
          if (startIdx < 0) startIdx = 0;
          for (let i = 0; i < 12 && startIdx + i < f.hourly.time.length; i++) {
            const idx = startIdx + i;
            const hh = new Date(f.hourly.time[idx]).getHours();
            const nightHour = hh < 6 || hh >= 20;
            hourly.push({
              label: i === 0 ? 'Сейчас' : (hh < 10 ? '0' + hh : '' + hh),
              emoji: condEmoji(wmo(f.hourly.weather_code[idx])[0], nightHour),
              temp: Math.round(f.hourly.temperature_2m[idx])
            });
          }
        }

        // daily: 7-day forecast
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const days = []; let weekMin = 999, weekMax = -999;
        if (f.daily && f.daily.time) {
          for (let i = 0; i < f.daily.time.length; i++) {
            const dt = new Date(f.daily.time[i]);
            const mn = Math.round(f.daily.temperature_2m_min[i]);
            const mx = Math.round(f.daily.temperature_2m_max[i]);
            weekMin = Math.min(weekMin, mn); weekMax = Math.max(weekMax, mx);
            days.push({
              name: i === 0 ? 'Сегодня' : dayNames[dt.getDay()],
              emoji: condEmoji(wmo(f.daily.weather_code[i])[0], false),
              min: mn, max: mx
            });
          }
        }

        const d = {
          name: g.name,
          weather: [{ main, description: desc }],
          main: {
            temp: c.temperature_2m,
            temp_max: f.daily ? f.daily.temperature_2m_max[0] : c.temperature_2m,
            temp_min: f.daily ? f.daily.temperature_2m_min[0] : c.temperature_2m,
            feels_like: c.apparent_temperature,
            humidity: c.relative_humidity_2m,
            pressure: c.surface_pressure
          },
          wind: { speed: c.wind_speed_10m, deg: c.wind_direction_10m },
          visibility: 10000,
          sys: { sunrise: srise, sunset: sset },
          _hourly: hourly,
          _daily: { days, weekMin, weekMax }
        };
        renderWeather(d);
      })
      .catch(() => renderError('Не удалось загрузить погоду. Проверьте подключение к интернету.'));
  };

  window.loadWeather();
};

/* ========== MAPS ========== */
APP_RENDERERS.maps = function(container) {
  container.innerHTML = `
  <div id="maps-app">
    <div style="position:absolute;top:0;left:0;right:0;z-index:10;padding:10px;background:rgba(0,0,0,0.4)">
      <div style="display:flex;gap:8px">
        <input id="maps-search" placeholder="Поиск места" style="flex:1;background:rgba(255,255,255,0.9);border:none;border-radius:20px;padding:8px 14px;font-size:14px;outline:none">
        <button onclick="mapsSearch()" style="background:#007AFF;border:none;border-radius:20px;color:#fff;padding:8px 14px;font-size:14px;cursor:pointer">Найти</button>
      </div>
    </div>
    <iframe id="maps-iframe"
      src="https://maps.google.com/maps?q=Moscow&output=embed&z=12"
      style="width:100%;height:100%;border:none" allow="geolocation"></iframe>
  </div>`;
  window.mapsSearch = () => {
    const q = document.getElementById('maps-search').value;
    if (!q) return;
    document.getElementById('maps-iframe').src = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=14`;
  };
};

/* ========== SETTINGS ========== */
APP_RENDERERS.settings = function(container) {
  function render() {
    const pin = State.pin;
    const wallpapers = ['https://picsum.photos/seed/1/400/800','https://picsum.photos/seed/2/400/800','https://picsum.photos/seed/3/400/800','https://picsum.photos/seed/4/400/800','https://picsum.photos/seed/5/400/800'];
    container.innerHTML = `
    <div id="settings-app">
      <!-- Large title -->
      <div class="settings-large-header">
        <div class="settings-large-title">Настройки</div>
        <div class="settings-search">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="#8e8e93"><path d="M6.5 1a5.5 5.5 0 014.38 8.83l3.64 3.64a.75.75 0 01-1.06 1.06l-3.64-3.64A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z"/></svg>
          <input placeholder="Поиск">
          <span class="settings-search-mic">🎙</span>
        </div>
      </div>

      <!-- Apple ID banner -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row settings-appleid-row">
            <div class="settings-appleid-avatar">👤</div>
            <div class="settings-appleid-text">
              <div class="settings-appleid-name">iPhone 16 Pro Max</div>
              <div class="settings-appleid-sub">Apple ID, iCloud и др.</div>
            </div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
      </div>

      <!-- Connectivity group -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#ff9f0a">✈️</div>
            <div class="settings-row-label">Авиарежим</div>
            <label class="ios-toggle">
              <input type="checkbox" ${CC_State.airplane?'checked':''} onchange="CC_State.airplane=this.checked">
              <div class="ios-toggle-track"></div>
              <div class="ios-toggle-thumb"></div>
            </label>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#007AFF">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M12 18.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0-4.2c1.13 0 2.16.45 2.91 1.18l-1.06 1.06a2.62 2.62 0 00-3.7 0l-1.06-1.06A4.12 4.12 0 0112 14.3zm0-4.1c2.26 0 4.3.92 5.78 2.4l-1.06 1.06a6.67 6.67 0 00-9.44 0L6.22 12.6A8.16 8.16 0 0112 10.2zm0-4.1c3.38 0 6.44 1.37 8.66 3.59l-1.06 1.06a11.2 11.2 0 00-15.2 0L3.34 9.69A12.2 12.2 0 0112 6.1z"/></svg>
            </div>
            <div class="settings-row-label">Wi-Fi</div>
            <div class="settings-row-value">Домашняя</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#007AFF">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#fff"><path d="M12 2l5 4-3.5 3L17 12l-5 4v-7l-3 3-1.5-1.5L10.5 8 7.5 5 9 3.5 12 6V2zm0 4.8v3.4L13.7 9 12 6.8zm0 7l1.7 1.2L12 17.2v-3.4z"/></svg>
            </div>
            <div class="settings-row-label">Bluetooth</div>
            <div class="settings-row-value">${CC_State.bt?'Вкл.':'Выкл.'}</div>
            <label class="ios-toggle">
              <input type="checkbox" id="bt-toggle" ${CC_State.bt?'checked':''} onchange="CC_State.bt=this.checked;const v=this.closest('.settings-row').querySelector('.settings-row-value');if(v)v.textContent=this.checked?'Вкл.':'Выкл.'">
              <div class="ios-toggle-track"></div>
              <div class="ios-toggle-thumb"></div>
            </label>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#34c759">📶</div>
            <div class="settings-row-label">Сотовая связь</div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
      </div>

      <!-- Notifications / Sounds / Focus / ScreenTime -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#ff3b30">🔔</div>
            <div class="settings-row-label">Уведомления</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#ff2d55">🔊</div>
            <div class="settings-row-label">Звуки, тактильные сигналы</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#5e5ce6">🌙</div>
            <div class="settings-row-label">Фокус</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#5856D6">⏳</div>
            <div class="settings-row-label">Экранное время</div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
      </div>

      <!-- General / Display / Wallpaper / FaceID / Privacy -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#8e8e93">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0 1.6a2.4 2.4 0 110 4.8 2.4 2.4 0 010-4.8z"/><path d="M10.7 2h2.6l.4 2.2c.5.16.97.38 1.4.66l2.05-.9 1.84 1.84-.9 2.05c.28.43.5.9.66 1.4l2.2.4v2.6l-2.2.4c-.16.5-.38.97-.66 1.4l.9 2.05-1.84 1.84-2.05-.9c-.43.28-.9.5-1.4.66l-.4 2.2h-2.6l-.4-2.2c-.5-.16-.97-.38-1.4-.66l-2.05.9-1.84-1.84.9-2.05c-.28-.43-.5-.9-.66-1.4L2 13.3v-2.6l2.2-.4c.16-.5.38-.97.66-1.4l-.9-2.05 1.84-1.84 2.05.9c.43-.28.9-.5 1.4-.66L10.7 2z" opacity=".0"/></svg>
            </div>
            <div class="settings-row-label">Основные</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#007AFF">🔆</div>
            <div class="settings-row-label">Экран и яркость</div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
        <!-- Brightness slider (functional) -->
        <div class="settings-slider-row">
          <div class="settings-slider-label"><span>Яркость</span><span id="bright-val">${Math.round(State.brightness*100)}%</span></div>
          <div class="settings-slider-wrap">
            <span class="settings-slider-ico">☀</span>
            <input type="range" class="settings-slider" min="5" max="100" value="${Math.round(State.brightness*100)}"
              oninput="applyBrightness(this.value/100);document.getElementById('bright-val').textContent=this.value+'%'">
            <span class="settings-slider-ico" style="font-size:16px">☀</span>
          </div>
        </div>
      </div>

      <!-- Wallpaper -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row" onclick="changeWallpaper()">
            <div class="settings-row-icon" style="background:#32ade6">🖼️</div>
            <div class="settings-row-label">Обои</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-wallpaper-strip">
            ${wallpapers.map(u=>`
              <img src="${u}" class="settings-wallpaper-thumb" style="border-color:${State.wallpaper===u?'#007AFF':'transparent'}" onclick="applyWallpaper('${u}');render()">`
            ).join('')}
          </div>
          <div class="settings-row" onclick="uploadWallpaper()">
            <div class="settings-row-icon" style="background:#007AFF">📁</div>
            <div class="settings-row-label">Загрузить своё фото</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <input type="file" id="wallpaper-inp" accept="image/*" style="display:none" onchange="loadWallpaperFile(this)">
        </div>
      </div>

      <!-- Face ID & code / Privacy -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row" onclick="changePin()">
            <div class="settings-row-icon" style="background:#34c759">🔒</div>
            <div class="settings-row-label">Face ID и код-пароль</div>
            <div class="settings-row-arrow">›</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#ff3b30">🔑</div>
            <div class="settings-row-label">Текущий код-пароль</div>
            <div class="settings-row-value">${'●'.repeat(pin.length)}</div>
          </div>
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#007AFF">✋</div>
            <div class="settings-row-label">Конфиденциальность</div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
      </div>

      <!-- Language -->
      <div class="settings-section">
        <div class="settings-group">
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#8e8e93">🌐</div>
            <div class="settings-row-label">Язык и регион</div>
            <div class="settings-row-value">Русский</div>
            <div class="settings-row-arrow">›</div>
          </div>
        </div>
      </div>

      <!-- Device Info -->
      <div class="settings-section">
        <div class="settings-section-title">Об устройстве</div>
        <div class="settings-group" id="device-info-section">
          <div class="settings-row"><div class="settings-row-label">Загрузка...</div></div>
        </div>
      </div>

      <div style="height:40px"></div>
    </div>`;

    loadDeviceInfo();
  }

  function loadDeviceInfo() {
    const section = document.getElementById('device-info-section');
    if (!section) return;
    const nav = navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const mem = nav.deviceMemory;
    const cores = nav.hardwareConcurrency;
    const ua = nav.userAgent;
    const platform = nav.platform;

    let rows = [
      { icon: '💻', label: 'Платформа', value: platform || 'Неизвестно' },
      { icon: '🧠', label: 'ОЗУ', value: mem ? `${mem} ГБ` : 'Нет данных' },
      { icon: '⚡', label: 'Ядра процессора', value: cores ? `${cores} ядер` : 'Нет данных' },
      { icon: '🌐', label: 'Тип сети', value: conn ? conn.effectiveType || conn.type || 'Нет данных' : 'Нет данных' },
      { icon: '🖥️', label: 'Экран', value: `${screen.width}×${screen.height}` },
      { icon: '📱', label: 'Пиксельная плотность', value: `${window.devicePixelRatio}x` },
      { icon: '🔋', label: 'Батарея', value: 'Загрузка...' },
      { icon: '🌍', label: 'Язык системы', value: nav.language },
    ];

    section.innerHTML = rows.map(r => `
      <div class="settings-row">
        <div class="settings-row-icon" style="background:#3a3a3c">${r.icon}</div>
        <div class="settings-row-label">${r.label}</div>
        <div class="settings-row-value" style="max-width:150px;text-align:right;font-size:13px;word-break:break-all">${r.value}</div>
      </div>`).join('');

    // Battery API
    if (navigator.getBattery) {
      navigator.getBattery().then(b => {
        const val = `${Math.round(b.level*100)}% ${b.charging?'⚡ Заряжается':''}`;
        const btRow = section.querySelectorAll('.settings-row')[6];
        if (btRow) btRow.querySelector('.settings-row-value').textContent = val;
        b.onlevelchange = () => { if (btRow) btRow.querySelector('.settings-row-value').textContent = `${Math.round(b.level*100)}% ${b.charging?'⚡':''}`; };
      });
    }

    // Storage
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(est => {
        const used = (est.usage / 1e9).toFixed(2);
        const total = (est.quota / 1e9).toFixed(1);
        section.insertAdjacentHTML('beforeend', `
          <div class="settings-row">
            <div class="settings-row-icon" style="background:#3a3a3c">💾</div>
            <div class="settings-row-label">Хранилище (браузер)</div>
            <div class="settings-row-value" style="font-size:13px">${used} / ${total} ГБ</div>
          </div>`);
      });
    }
  }

  window.changePin = () => {
    const newPin = prompt('Введите новый пароль (4-6 цифр):');
    if (newPin && /^\d{4,6}$/.test(newPin)) {
      State.pin = newPin;
      localStorage.setItem('iphone_pin', newPin);
      alert('Пароль изменён!');
      render();
    } else if (newPin !== null) {
      alert('Пароль должен содержать 4-6 цифр');
    }
  };

  window.changeWallpaper = () => document.getElementById('wallpaper-inp').click();
  window.uploadWallpaper = () => document.getElementById('wallpaper-inp').click();
  window.loadWallpaperFile = (inp) => {
    const file = inp.files[0]; if (!file) return;
    const url = URL.createObjectURL(file);
    applyWallpaper(url); render();
  };

  render();
};

/* ========== APP STORE ========== */
APP_RENDERERS.appstore = function(container) {
  const apps = [
    { name: 'Telegram', cat: 'Соцсети', icon: '✈️', color: '#229ED9', rating: '4.9' },
    { name: 'Instagram', cat: 'Фото', icon: '📸', color: '#E1306C', rating: '4.7' },
    { name: 'TikTok', cat: 'Видео', icon: '🎵', color: '#010101', rating: '4.6' },
    { name: 'Spotify', cat: 'Музыка', icon: '🎧', color: '#1DB954', rating: '4.8' },
    { name: 'Netflix', cat: 'Кино', icon: '🎬', color: '#E50914', rating: '4.5' },
    { name: 'Shazam', cat: 'Музыка', icon: '🔵', color: '#0088FF', rating: '4.8' },
  ];
  container.innerHTML = `
  <div id="appstore-app">
    <div style="display:flex;align-items:center;padding:12px 16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e;gap:10px">
      <input placeholder="Поиск в App Store" style="flex:1;background:#2c2c2e;border:none;border-radius:10px;padding:8px 12px;color:#fff;font-size:14px;outline:none">
    </div>
    <div class="appstore-banner">🅰 App Store<br><span style="font-size:12px;opacity:0.8">Лучшие приложения</span></div>
    <div class="appstore-section-title">Топ бесплатных</div>
    <div class="appstore-row">
      ${apps.map(a=>`
        <div class="appstore-card">
          <div class="appstore-card-icon" style="background:${a.color}">${a.icon}</div>
          <div class="appstore-card-name">${a.name}</div>
          <div class="appstore-card-cat">${a.cat} · ⭐${a.rating}</div>
          <button class="appstore-get-btn">Загрузить</button>
        </div>`).join('')}
    </div>
    <div class="appstore-section-title">Для вас</div>
    <div style="background:#1c1c1e;border-radius:16px;padding:20px;margin:0 0 20px;text-align:center;color:rgba(255,255,255,0.5);font-size:14px">
      Рекомендации появятся после авторизации в Apple ID
    </div>
  </div>`;
};

/* ========== MAIL ========== */
APP_RENDERERS.mail = function(container) {
  const mails = [
    { from: 'Apple', subj: 'Ваш чек на сумму', preview: 'Благодарим за покупку в App Store', time: '9:41', unread: true },
    { from: 'GitHub', subj: 'New pull request', preview: 'A new PR was opened in your repository', time: 'Вчера', unread: true },
    { from: 'Google', subj: 'Активность аккаунта', preview: 'Новый вход в систему обнаружен', time: 'Пн', unread: false },
  ];
  container.innerHTML = `
  <div style="background:#000;height:100%;display:flex;flex-direction:column">
    <div style="padding:16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
      <div style="color:#fff;font-size:20px;font-weight:700">Входящие <span style="color:#007AFF">${mails.filter(m=>m.unread).length}</span></div>
    </div>
    <div style="flex:1;overflow-y:auto">
      ${mails.map(m=>`
        <div style="display:flex;padding:14px 16px;border-bottom:1px solid #1c1c1e;gap:10px;cursor:pointer" onclick="this.style.background='#1c1c1e'">
          ${m.unread ? '<div style="width:10px;height:10px;border-radius:50%;background:#007AFF;flex-shrink:0;margin-top:6px"></div>' : '<div style="width:10px;flex-shrink:0"></div>'}
          <div style="flex:1;overflow:hidden">
            <div style="display:flex;justify-content:space-between">
              <span style="color:#fff;font-weight:${m.unread?'700':'400'};font-size:16px">${m.from}</span>
              <span style="color:rgba(255,255,255,0.4);font-size:13px">${m.time}</span>
            </div>
            <div style="color:#fff;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.subj}</div>
            <div style="color:rgba(255,255,255,0.4);font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.preview}</div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
};

/* ========== REMINDERS ========== */
APP_RENDERERS.reminders = function(container) {
  let lists = JSON.parse(localStorage.getItem('iphone_reminders') || '[{"name":"Напоминания","color":"#ff3b30","items":[{"text":"Купить продукты","done":false},{"text":"Позвонить маме","done":false}]}]');

  function save() { localStorage.setItem('iphone_reminders', JSON.stringify(lists)); }

  function render(listIdx) {
    if (listIdx !== undefined) return renderList(listIdx);
    container.innerHTML = `
    <div style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e;display:flex;justify-content:space-between;align-items:center">
        <span style="color:#fff;font-size:20px;font-weight:700">Напоминания</span>
        <button onclick="remAddList()" style="background:none;border:none;color:#ff3b30;font-size:22px;cursor:pointer">+</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px">
        ${lists.map((l,i)=>`
          <div onclick="remRenderList(${i})" style="background:#1c1c1e;border-radius:14px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer">
            <div style="width:36px;height:36px;border-radius:50%;background:${l.color};display:flex;align-items:center;justify-content:center;font-size:18px">✅</div>
            <div style="flex:1"><div style="color:#fff;font-size:17px;font-weight:600">${l.name}</div></div>
            <div style="color:#fff;font-size:22px;font-weight:300">${l.items.filter(x=>!x.done).length}</div>
          </div>`).join('')}
      </div>
    </div>`;
    window.remAddList = () => {
      const name = prompt('Название списка:');
      if (!name) return;
      lists.push({ name, color: '#007AFF', items: [] });
      save(); render();
    };
    window.remRenderList = (i) => render(i);
  }

  function renderList(i) {
    const list = lists[i];
    container.innerHTML = `
    <div style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:12px 16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e;display:flex;align-items:center;gap:10px">
        <button onclick="remBack()" style="background:none;border:none;color:#ff3b30;font-size:16px;cursor:pointer">← Назад</button>
        <span style="color:#fff;font-size:17px;font-weight:600;flex:1">${list.name}</span>
      </div>
      <div style="flex:1;overflow-y:auto" id="rem-items">
        ${list.items.map((item,j)=>`
          <div style="display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid #1c1c1e;gap:12px">
            <div onclick="remToggle(${i},${j})" style="width:26px;height:26px;border-radius:50%;border:2px solid ${list.color};background:${item.done?list.color:'transparent'};display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0">
              ${item.done?'<span style="color:#fff;font-size:14px">✓</span>':''}
            </div>
            <span style="color:${item.done?'rgba(255,255,255,0.3)':'#fff'};font-size:16px;text-decoration:${item.done?'line-through':'none'};flex:1">${item.text}</span>
            <span onclick="remDelete(${i},${j})" style="color:#ff3b30;cursor:pointer;font-size:18px">✕</span>
          </div>`).join('')}
      </div>
      <div style="padding:12px 16px;background:#1c1c1e;border-top:1px solid #2c2c2e;display:flex;gap:8px">
        <input id="rem-inp" placeholder="Новое напоминание..." style="flex:1;background:#2c2c2e;border:none;border-radius:10px;padding:10px 14px;color:#fff;font-size:15px;outline:none;font-family:var(--font)" onkeydown="if(event.key==='Enter')remAdd(${i})">
        <button onclick="remAdd(${i})" style="background:${list.color};border:none;border-radius:10px;color:#fff;padding:10px 16px;font-size:15px;cursor:pointer">+</button>
      </div>
    </div>`;
    window.remBack = () => render();
    window.remToggle = (li,ji) => { lists[li].items[ji].done = !lists[li].items[ji].done; save(); renderList(li); };
    window.remDelete = (li,ji) => { lists[li].items.splice(ji,1); save(); renderList(li); };
    window.remAdd = (li) => {
      const inp = document.getElementById('rem-inp');
      if (!inp.value.trim()) return;
      lists[li].items.push({ text: inp.value.trim(), done: false });
      save(); renderList(li);
    };
  }

  render();
};
/* ========== HEALTH ========== */
APP_RENDERERS.health = function(container) {
  let steps = parseInt(localStorage.getItem('health_steps') || '0');
  let water = parseInt(localStorage.getItem('health_water') || '0');
  let weight = parseFloat(localStorage.getItem('health_weight') || '70');
  const goal = 10000;
  function save() {
    localStorage.setItem('health_steps', steps);
    localStorage.setItem('health_water', water);
    localStorage.setItem('health_weight', weight);
  }
  function render() {
    const pct = Math.min(100, Math.round((steps / goal) * 100));
    const circ = 2 * Math.PI * 54;
    const dash = circ * (pct / 100);
    container.innerHTML = `
    <div style="background:#000;height:100%;overflow-y:auto">
      <div style="padding:16px;color:#fff;font-size:20px;font-weight:700;background:#1c1c1e;border-bottom:1px solid #2c2c2e">Здоровье</div>
      <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
        <!-- Steps ring -->
        <div style="background:#1c1c1e;border-radius:16px;padding:20px;display:flex;align-items:center;gap:20px">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#2c2c2e" stroke-width="10"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#ff3b30" stroke-width="10"
              stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ/4}" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <text x="60" y="55" text-anchor="middle" fill="#fff" font-size="20" font-weight="700">${steps.toLocaleString()}</text>
            <text x="60" y="72" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="11">шагов</text>
          </svg>
          <div style="flex:1">
            <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:4px">ЦЕЛЬ</div>
            <div style="color:#fff;font-size:18px;font-weight:600">${goal.toLocaleString()} шагов</div>
            <div style="color:#ff3b30;font-size:14px;margin-top:4px">${pct}% выполнено</div>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button onclick="healthAddSteps()" style="background:#ff3b30;border:none;border-radius:8px;color:#fff;padding:6px 12px;font-size:13px;cursor:pointer">+1000</button>
              <button onclick="healthResetSteps()" style="background:#3a3a3c;border:none;border-radius:8px;color:#fff;padding:6px 12px;font-size:13px;cursor:pointer">Сброс</button>
            </div>
          </div>
        </div>
        <!-- Water -->
        <div style="background:#1c1c1e;border-radius:16px;padding:16px">
          <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px">💧 ВОДА (стаканов)</div>
          <div style="display:flex;align-items:center;gap:16px">
            <div style="font-size:40px;font-weight:200;color:#007AFF">${water}</div>
            <div style="flex:1">
              <div style="background:#2c2c2e;border-radius:6px;height:8px;overflow:hidden">
                <div style="background:#007AFF;width:${Math.min(100,water/8*100)}%;height:100%;border-radius:6px;transition:width 0.3s"></div>
              </div>
              <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px">Цель: 8 стаканов</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button onclick="healthAddWater()" style="background:#007AFF;border:none;border-radius:8px;color:#fff;padding:8px 16px;font-size:14px;cursor:pointer">+ Стакан</button>
            <button onclick="healthResetWater()" style="background:#3a3a3c;border:none;border-radius:8px;color:#fff;padding:8px 12px;font-size:14px;cursor:pointer">✕</button>
          </div>
        </div>
        <!-- Weight -->
        <div style="background:#1c1c1e;border-radius:16px;padding:16px">
          <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px">⚖️ ВЕС</div>
          <div style="display:flex;align-items:center;gap:12px">
            <input type="number" id="weight-inp" value="${weight}" min="30" max="300" step="0.1"
              style="background:#2c2c2e;border:none;border-radius:10px;color:#fff;font-size:28px;font-weight:200;padding:8px 12px;width:120px;outline:none;font-family:var(--font)">
            <span style="color:rgba(255,255,255,0.5);font-size:16px">кг</span>
            <button onclick="healthSaveWeight()" style="background:#30d158;border:none;border-radius:8px;color:#fff;padding:8px 14px;font-size:14px;cursor:pointer">Сохранить</button>
          </div>
        </div>
        <!-- BMI -->
        <div style="background:#1c1c1e;border-radius:16px;padding:16px">
          <div style="color:rgba(255,255,255,0.5);font-size:12px;margin-bottom:8px">📊 СТАТИСТИКА ДНЯ</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div style="background:#2c2c2e;border-radius:12px;padding:12px;text-align:center">
              <div style="color:#ff9f0a;font-size:24px;font-weight:600">${Math.round(steps * 0.045)}</div>
              <div style="color:rgba(255,255,255,0.5);font-size:11px">ккал</div>
            </div>
            <div style="background:#2c2c2e;border-radius:12px;padding:12px;text-align:center">
              <div style="color:#30d158;font-size:24px;font-weight:600">${(steps * 0.0008).toFixed(1)}</div>
              <div style="color:rgba(255,255,255,0.5);font-size:11px">км</div>
            </div>
            <div style="background:#2c2c2e;border-radius:12px;padding:12px;text-align:center">
              <div style="color:#007AFF;font-size:24px;font-weight:600">${Math.round(steps / 100)}</div>
              <div style="color:rgba(255,255,255,0.5);font-size:11px">мин активности</div>
            </div>
            <div style="background:#2c2c2e;border-radius:12px;padding:12px;text-align:center">
              <div style="color:#ff3b30;font-size:24px;font-weight:600">${Math.round(72 - steps * 0.002)}</div>
              <div style="color:rgba(255,255,255,0.5);font-size:11px">уд/мин</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    window.healthAddSteps = () => { steps += 1000; save(); render(); };
    window.healthResetSteps = () => { steps = 0; save(); render(); };
    window.healthAddWater = () => { water++; save(); render(); };
    window.healthResetWater = () => { water = 0; save(); render(); };
    window.healthSaveWeight = () => { weight = parseFloat(document.getElementById('weight-inp').value) || weight; save(); render(); };
  }
  render();
};
/* ========== WALLET ========== */
APP_RENDERERS.wallet = function(container) {
  let cards = JSON.parse(localStorage.getItem('iphone_wallet') || '[{"name":"Visa Platinum","num":"•••• •••• •••• 4242","exp":"12/26","color":"linear-gradient(135deg,#1a1a2e,#16213e)","balance":45230},{"name":"Mastercard Gold","num":"•••• •••• •••• 8888","exp":"08/25","color":"linear-gradient(135deg,#ff6b35,#f7c59f)","balance":12890}]');
  let txs = JSON.parse(localStorage.getItem('iphone_wallet_tx') || '[{"desc":"Apple Store","amt":-4990,"date":"Сегодня"},{"desc":"Netflix","amt":-999,"date":"Вчера"},{"desc":"Зарплата","amt":120000,"date":"01.01"},{"desc":"Кафе","amt":-650,"date":"30.12"}]');

  function save() { localStorage.setItem('iphone_wallet', JSON.stringify(cards)); localStorage.setItem('iphone_wallet_tx', JSON.stringify(txs)); }

  container.innerHTML = `
  <div style="background:#000;height:100%;overflow-y:auto">
    <div style="padding:16px;color:#fff;font-size:20px;font-weight:700;background:#1c1c1e;border-bottom:1px solid #2c2c2e">Wallet</div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:12px">
      <!-- Cards -->
      ${cards.map((c,i)=>`
        <div style="border-radius:20px;background:${c.color};padding:24px;color:#fff;position:relative;overflow:hidden;min-height:140px">
          <div style="font-size:18px;font-weight:600;margin-bottom:20px">${c.name}</div>
          <div style="font-size:22px;font-weight:300;letter-spacing:2px;margin-bottom:12px">${c.num}</div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end">
            <div><div style="font-size:10px;opacity:0.7">СРОК</div><div style="font-size:14px">${c.exp}</div></div>
            <div style="text-align:right"><div style="font-size:10px;opacity:0.7">БАЛАНС</div><div style="font-size:20px;font-weight:600">${c.balance.toLocaleString()} ₽</div></div>
          </div>
          <div style="position:absolute;top:-20px;right:-20px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,0.08)"></div>
        </div>`).join('')}
      <!-- Add card -->
      <button onclick="walletAddCard()" style="border:2px dashed rgba(255,255,255,0.2);background:transparent;border-radius:20px;color:rgba(255,255,255,0.5);padding:24px;font-size:15px;cursor:pointer;font-family:var(--font)">+ Добавить карту</button>
      <!-- Transactions -->
      <div style="color:#fff;font-size:18px;font-weight:700;margin-top:8px">Транзакции</div>
      ${txs.map((t,i)=>`
        <div style="background:#1c1c1e;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:${t.amt>0?'#30d15833':'#ff3b3033'};display:flex;align-items:center;justify-content:center;font-size:18px">${t.amt>0?'↓':'↑'}</div>
          <div style="flex:1"><div style="color:#fff;font-size:15px">${t.desc}</div><div style="color:rgba(255,255,255,0.4);font-size:12px">${t.date}</div></div>
          <div style="color:${t.amt>0?'#30d158':'#ff3b30'};font-size:16px;font-weight:600">${t.amt>0?'+':''}${t.amt.toLocaleString()} ₽</div>
        </div>`).join('')}
    </div>
  </div>`;
  window.walletAddCard = () => {
    const name = prompt('Название карты:');
    if (!name) return;
    const num = prompt('Последние 4 цифры:');
    if (!num) return;
    cards.push({ name, num: `•••• •••• •••• ${num}`, exp: '12/27', color: 'linear-gradient(135deg,#5856D6,#007AFF)', balance: 0 });
    save(); APP_RENDERERS.wallet(container);
  };
};
/* ========== NEWS ========== */
APP_RENDERERS.news = function(container) {
  const articles = [
    { title: 'Apple представила новые MacBook Pro с чипом M4', source: 'MacRumors', time: '1 час назад', emoji: '💻', cat: 'Технологии' },
    { title: 'Центральный банк сохранил ключевую ставку на уровне 16%', source: 'РБК', time: '2 часа назад', emoji: '💰', cat: 'Финансы' },
    { title: 'SpaceX успешно запустила очередную партию спутников Starlink', source: 'Ars Technica', time: '3 часа назад', emoji: '🚀', cat: 'Наука' },
    { title: 'Вышел долгожданный патч к популярной игре', source: 'IGN', time: '5 часов назад', emoji: '🎮', cat: 'Игры' },
    { title: 'Учёные обнаружили новый вид живых существ в Тихом океане', source: 'Nature', time: '6 часов назад', emoji: '🌊', cat: 'Наука' },
    { title: 'Курс доллара снизился по отношению к рублю', source: 'Коммерсант', time: 'Вчера', emoji: '📉', cat: 'Финансы' },
    { title: 'Новый рекорд температуры зафиксирован в Европе', source: 'BBC', time: 'Вчера', emoji: '🌡️', cat: 'Мир' },
    { title: 'Анонсирован выход нового смартфона от Samsung', source: 'The Verge', time: 'Вчера', emoji: '📱', cat: 'Технологии' },
  ];
  const cats = ['Все', 'Технологии', 'Финансы', 'Наука', 'Игры', 'Мир'];
  let active = 'Все';

  function render() {
    const filtered = active === 'Все' ? articles : articles.filter(a => a.cat === active);
    container.innerHTML = `
    <div style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
        <div style="color:#fff;font-size:20px;font-weight:700;margin-bottom:10px">📰 Новости</div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:2px">
          ${cats.map(c=>`<button onclick="newsFilter('${c}')" style="background:${active===c?'#ff3b30':'#2c2c2e'};border:none;border-radius:14px;color:#fff;padding:6px 14px;font-size:13px;cursor:pointer;white-space:nowrap;font-family:var(--font)">${c}</button>`).join('')}
        </div>
      </div>
      <div style="flex:1;overflow-y:auto">
        ${filtered.map(a=>`
          <div onclick="this.style.background='#1c1c1e'" style="padding:16px;border-bottom:1px solid #1c1c1e;cursor:pointer;transition:background 0.1s">
            <div style="display:flex;gap:12px;align-items:flex-start">
              <div style="width:56px;height:56px;border-radius:12px;background:#1c1c1e;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">${a.emoji}</div>
              <div style="flex:1">
                <div style="color:rgba(255,255,255,0.4);font-size:11px;margin-bottom:4px">${a.source} · ${a.time}</div>
                <div style="color:#fff;font-size:15px;font-weight:500;line-height:1.4">${a.title}</div>
                <div style="color:#ff3b30;font-size:11px;margin-top:4px">${a.cat}</div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
    window.newsFilter = (c) => { active = c; render(); };
  }
  render();
};
/* ========== STOCKS ========== */
APP_RENDERERS.stocks = function(container) {
  const stocks = [
    { sym: 'AAPL', name: 'Apple Inc.', price: 189.30, change: +1.24, pct: +0.66 },
    { sym: 'GOOGL', name: 'Alphabet', price: 141.80, change: -0.92, pct: -0.64 },
    { sym: 'TSLA', name: 'Tesla', price: 248.50, change: +5.30, pct: +2.18 },
    { sym: 'MSFT', name: 'Microsoft', price: 378.20, change: +2.10, pct: +0.56 },
    { sym: 'AMZN', name: 'Amazon', price: 185.60, change: -1.40, pct: -0.75 },
    { sym: 'NVDA', name: 'NVIDIA', price: 875.40, change: +23.50, pct: +2.76 },
    { sym: 'META', name: 'Meta', price: 484.10, change: +3.80, pct: +0.79 },
    { sym: 'SBER', name: 'Сбербанк', price: 298.50, change: +1.20, pct: +0.40 },
  ];

  function miniChart(seed, isUp) {
    const pts = Array.from({length: 20}, (_,i) => {
      const v = 20 + Math.sin(i * 0.8 + seed) * 8 + Math.cos(i * 1.3 + seed) * 5 + (isUp ? i * 0.8 : -i * 0.4);
      return v;
    });
    const min = Math.min(...pts), max = Math.max(...pts);
    const norm = pts.map(p => 28 - ((p - min) / (max - min)) * 24);
    const d = norm.map((y,i) => `${i===0?'M':'L'}${i*3.5},${y}`).join(' ');
    const color = isUp ? '#30d158' : '#ff3b30';
    return `<svg width="70" height="30" viewBox="0 0 70 30"><path d="${d}" fill="none" stroke="${color}" stroke-width="1.5"/></svg>`;
  }

  container.innerHTML = `
  <div style="background:#000;height:100%;display:flex;flex-direction:column">
    <div style="padding:16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
      <div style="color:#fff;font-size:20px;font-weight:700">📈 Акции</div>
      <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">Данные демонстрационные</div>
    </div>
    <div style="flex:1;overflow-y:auto">
      ${stocks.map((s,i)=>`
        <div style="display:flex;align-items:center;padding:12px 16px;border-bottom:1px solid #1c1c1e;gap:10px">
          <div style="flex:1">
            <div style="color:#fff;font-size:16px;font-weight:600">${s.sym}</div>
            <div style="color:rgba(255,255,255,0.4);font-size:12px">${s.name}</div>
          </div>
          ${miniChart(i, s.change > 0)}
          <div style="text-align:right;min-width:80px">
            <div style="color:#fff;font-size:15px;font-weight:500">$${s.price.toFixed(2)}</div>
            <div style="background:${s.change>0?'#30d158':'#ff3b30'};color:#fff;font-size:12px;border-radius:6px;padding:2px 6px;margin-top:2px">
              ${s.change>0?'+':''}${s.pct.toFixed(2)}%
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>`;
};
/* ========== PODCASTS ========== */
APP_RENDERERS.podcasts = function(container) {
  const shows = [
    { name: 'Lex Fridman Podcast', ep: 'Episode 420 — Илон Маск', dur: '3ч 14м', emoji: '🎙️', color: '#a855f7' },
    { name: 'The Joe Rogan Experience', ep: '#2100 — Jordan Peterson', dur: '2ч 48м', emoji: '🎤', color: '#f59e0b' },
    { name: 'Huberman Lab', ep: 'Оптимизация сна', dur: '1ч 52м', emoji: '🧠', color: '#06b6d4' },
    { name: 'How I Built This', ep: 'Airbnb: Брайан Чески', dur: '58м', emoji: '🏗️', color: '#10b981' },
    { name: 'Darknet Diaries', ep: 'Ep 145 — Zero Day', dur: '1ч 05м', emoji: '🔐', color: '#6366f1' },
  ];
  let playing = null;

  function render() {
    container.innerHTML = `
    <div style="background:#0d0d1a;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#1a0d2e;border-bottom:1px solid #2c1a4e">
        <div style="color:#fff;font-size:20px;font-weight:700">🎙️ Подкасты</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px">
        ${shows.map((s,i)=>`
          <div onclick="podPlay(${i})" style="background:#1c1c2e;border-radius:16px;padding:16px;display:flex;gap:14px;align-items:center;cursor:pointer;border:2px solid ${playing===i?s.color:'transparent'};transition:border 0.2s">
            <div style="width:56px;height:56px;border-radius:14px;background:${s.color};display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0">${s.emoji}</div>
            <div style="flex:1;overflow:hidden">
              <div style="color:rgba(255,255,255,0.5);font-size:11px">${s.name}</div>
              <div style="color:#fff;font-size:14px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.ep}</div>
              <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">⏱ ${s.dur}</div>
            </div>
            <div style="font-size:26px">${playing===i?'⏸':'▶️'}</div>
          </div>`).join('')}
        ${playing !== null ? `
        <div style="background:#1c1c2e;border-radius:16px;padding:16px;border:1px solid ${shows[playing].color}33">
          <div style="color:rgba(255,255,255,0.5);font-size:11px;margin-bottom:4px">СЕЙЧАС ИГРАЕТ</div>
          <div style="color:#fff;font-size:14px;font-weight:600">${shows[playing].ep}</div>
          <div style="color:rgba(255,255,255,0.4);font-size:12px">${shows[playing].name}</div>
          <div style="margin-top:12px;background:#2c2c3e;border-radius:4px;height:4px;overflow:hidden">
            <div id="pod-prog-bar" style="background:${shows[playing].color};width:35%;height:100%;border-radius:4px"></div>
          </div>
          <div style="display:flex;justify-content:space-between;color:rgba(255,255,255,0.4);font-size:11px;margin-top:4px">
            <span>32:14</span><span>${shows[playing].dur}</span>
          </div>
          <div style="display:flex;gap:16px;justify-content:center;margin-top:12px">
            <button style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer">⏮</button>
            <button onclick="podStop()" style="background:${shows[playing].color};border:none;border-radius:50%;width:48px;height:48px;font-size:22px;cursor:pointer">⏸</button>
            <button style="background:none;border:none;color:#fff;font-size:22px;cursor:pointer">⏭</button>
          </div>
        </div>` : ''}
      </div>
    </div>`;
    window.podPlay = (i) => { playing = playing === i ? null : i; render(); };
    window.podStop = () => { playing = null; render(); };
  }
  render();
};
/* ========== APPLE TV ========== */
APP_RENDERERS.tv = function(container) {
  const movies = [
    { title: 'Ted Lasso', genre: 'Комедия', rating: '⭐ 8.8', year: 2020, emoji: '⚽', desc: 'Американский тренер по футболу возглавляет английский футбольный клуб.' },
    { title: 'Severance', genre: 'Триллер', rating: '⭐ 8.7', year: 2022, emoji: '🏢', desc: 'Сотрудники компании разделяют воспоминания о работе и личной жизни.' },
    { title: 'The Morning Show', genre: 'Драма', rating: '⭐ 8.3', year: 2019, emoji: '📺', desc: 'Закулисная жизнь утреннего шоу на американском телевидении.' },
    { title: 'Foundation', genre: 'Фантастика', rating: '⭐ 7.5', year: 2021, emoji: '🌌', desc: 'Группа изгнанников отправляется на далёкую планету, чтобы спасти цивилизацию.' },
    { title: 'Slow Horses', genre: 'Шпионаж', rating: '⭐ 8.1', year: 2022, emoji: '🕵️', desc: 'Агенты британской разведки, отправленные на «скамейку запасных».' },
    { title: 'For All Mankind', genre: 'Альт. история', rating: '⭐ 8.0', year: 2019, emoji: '🚀', desc: 'Альтернативная история: СССР первым высадился на Луне.' },
  ];
  let selected = null;

  function render() {
    if (selected !== null) return renderDetail(selected);
    container.innerHTML = `
    <div style="background:#0a0a0a;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#111;border-bottom:1px solid #222">
        <div style="color:#fff;font-size:20px;font-weight:700">📺 Apple TV+</div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">Оригинальные сериалы и фильмы</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:10px">
        ${movies.map((m,i)=>`
          <div onclick="tvSelect(${i})" style="background:#1a1a1a;border-radius:16px;overflow:hidden;cursor:pointer;display:flex;gap:0">
            <div style="width:80px;background:linear-gradient(135deg,#1c1c2e,#2c2c3e);display:flex;align-items:center;justify-content:center;font-size:36px;flex-shrink:0">${m.emoji}</div>
            <div style="padding:14px;flex:1">
              <div style="color:#fff;font-size:15px;font-weight:600">${m.title}</div>
              <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">${m.genre} · ${m.year}</div>
              <div style="color:#f1c40f;font-size:12px;margin-top:4px">${m.rating}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
    window.tvSelect = (i) => { selected = i; render(); };
  }

  function renderDetail(i) {
    const m = movies[i];
    container.innerHTML = `
    <div style="background:#0a0a0a;height:100%;display:flex;flex-direction:column">
      <div style="padding:12px 16px;background:#111;border-bottom:1px solid #222;display:flex;gap:10px;align-items:center">
        <button onclick="tvBack()" style="background:none;border:none;color:#007AFF;font-size:16px;cursor:pointer">← Назад</button>
        <span style="color:#fff;font-size:17px;font-weight:600">${m.title}</span>
      </div>
      <div style="flex:1;overflow-y:auto">
        <div style="height:200px;background:linear-gradient(135deg,#1a1a2e,#16213e);display:flex;align-items:center;justify-content:center;font-size:80px">${m.emoji}</div>
        <div style="padding:20px">
          <div style="color:#fff;font-size:22px;font-weight:700;margin-bottom:4px">${m.title}</div>
          <div style="color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:16px">${m.genre} · ${m.year} · ${m.rating}</div>
          <div style="color:rgba(255,255,255,0.8);font-size:15px;line-height:1.6;margin-bottom:24px">${m.desc}</div>
          <div style="display:flex;gap:12px">
            <button style="flex:1;background:#007AFF;border:none;border-radius:12px;color:#fff;padding:14px;font-size:16px;font-weight:600;cursor:pointer;font-family:var(--font)">▶ Смотреть</button>
            <button style="background:#2c2c2e;border:none;border-radius:12px;color:#fff;padding:14px 18px;font-size:18px;cursor:pointer">+</button>
          </div>
        </div>
      </div>
    </div>`;
    window.tvBack = () => { selected = null; render(); };
  }
  render();
};
/* ========== FILES ========== */
APP_RENDERERS.files = function(container) {
  let files = JSON.parse(localStorage.getItem('iphone_files') || '[]');
  let currentFolder = null;
  const rootFolders = [
    { name: 'iCloud Drive', icon: '☁️', color: '#007AFF' },
    { name: 'На моём iPhone', icon: '📱', color: '#636366' },
    { name: 'Загрузки', icon: '📥', color: '#30d158' },
  ];

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' КБ';
    return (bytes/1024/1024).toFixed(1) + ' МБ';
  }

  function render(folder) {
    currentFolder = folder || null;
    const myFiles = files.filter(f => f.folder === (folder || 'На моём iPhone'));
    container.innerHTML = `
    <div style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:12px 16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e;display:flex;align-items:center;gap:10px">
        ${folder ? `<button onclick="filesBack()" style="background:none;border:none;color:#007AFF;font-size:16px;cursor:pointer">← Назад</button>` : ''}
        <span style="color:#fff;font-size:17px;font-weight:600;flex:1">${folder || 'Файлы'}</span>
        ${folder ? `<button onclick="filesAdd('${folder}')" style="background:none;border:none;color:#007AFF;font-size:22px;cursor:pointer">+</button>` : ''}
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px">
        ${!folder ? rootFolders.map(f=>`
          <div onclick="filesOpen('${f.name}')" style="background:#1c1c1e;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:14px;cursor:pointer">
            <div style="width:40px;height:40px;border-radius:10px;background:${f.color}22;display:flex;align-items:center;justify-content:center;font-size:22px">${f.icon}</div>
            <div style="flex:1;color:#fff;font-size:16px">${f.name}</div>
            <div style="color:rgba(255,255,255,0.3);font-size:14px">›</div>
          </div>`).join('') : myFiles.length === 0 ? `
          <div style="color:rgba(255,255,255,0.3);text-align:center;padding:60px;font-size:14px">
            <div style="font-size:48px;margin-bottom:12px">📂</div>Папка пуста
          </div>` : myFiles.map((f,i)=>`
          <div style="background:#1c1c1e;border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px">
            <div style="font-size:28px">${f.type==='image'?'🖼️':f.type==='text'?'📄':'📎'}</div>
            <div style="flex:1;overflow:hidden">
              <div style="color:#fff;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.name}</div>
              <div style="color:rgba(255,255,255,0.4);font-size:12px">${formatSize(f.size)} · ${f.date}</div>
            </div>
            <button onclick="filesDelete('${folder}',${i})" style="background:none;border:none;color:#ff3b30;font-size:18px;cursor:pointer">✕</button>
          </div>`).join('')}
      </div>
      ${folder ? `
      <div style="padding:12px 16px;background:#1c1c1e;border-top:1px solid #2c2c2e">
        <label style="display:flex;align-items:center;gap:10px;background:#007AFF;border-radius:12px;padding:12px;cursor:pointer;justify-content:center;color:#fff;font-size:15px;font-family:var(--font)">
          <input type="file" multiple style="display:none" onchange="filesUpload('${folder}',this.files)">
          📎 Загрузить файлы
        </label>
      </div>` : ''}
    </div>`;
    window.filesOpen = (f) => render(f);
    window.filesBack = () => render(null);
    window.filesAdd = (f) => {
      const name = prompt('Имя файла:');
      if (!name) return;
      files.push({ name, folder: f, size: Math.round(Math.random()*50000+500), date: new Date().toLocaleDateString('ru-RU'), type: 'text' });
      localStorage.setItem('iphone_files', JSON.stringify(files));
      render(f);
    };
    window.filesDelete = (f, idx) => {
      const toDelete = files.filter(fi => fi.folder === f);
      const realIdx = files.indexOf(toDelete[idx]);
      if (realIdx > -1) files.splice(realIdx, 1);
      localStorage.setItem('iphone_files', JSON.stringify(files));
      render(f);
    };
    window.filesUpload = (f, fileList) => {
      Array.from(fileList).forEach(fl => {
        const ext = fl.name.split('.').pop().toLowerCase();
        const type = ['jpg','jpeg','png','gif','webp'].includes(ext) ? 'image' : 'text';
        files.push({ name: fl.name, folder: f, size: fl.size, date: new Date().toLocaleDateString('ru-RU'), type });
      });
      localStorage.setItem('iphone_files', JSON.stringify(files));
      render(f);
    };
  }
  render();
};
/* ========== COMPASS ========== */
APP_RENDERERS.compass = function(container) {
  let heading = 0;
  let watching = false;

  container.innerHTML = `
  <div id="compass-app" style="background:#000;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px">
    <div id="compass-dir" style="color:#fff;font-size:48px;font-weight:200;letter-spacing:-2px">--°</div>
    <div id="compass-name" style="color:rgba(255,255,255,0.6);font-size:20px">---</div>
    <canvas id="compass-canvas" width="260" height="260" style="border-radius:50%"></canvas>
    <div id="compass-coords" style="color:rgba(255,255,255,0.4);font-size:13px;text-align:center"></div>
    <button id="compass-btn" onclick="compassStart()" style="background:#007AFF;border:none;border-radius:14px;color:#fff;padding:12px 28px;font-size:16px;cursor:pointer;font-family:var(--font)">
      Включить компас
    </button>
  </div>`;

  const dirs = ['С','ССВ','СВ','ВСВ','В','ВЮВ','ЮВ','ЮЮВ','Ю','ЮЮЗ','ЮЗ','ЗЮЗ','З','ЗСЗ','СЗ','ССЗ'];

  function drawCompass(angle) {
    const canvas = document.getElementById('compass-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const cx = 130, cy = 130, r = 120;
    ctx.clearRect(0,0,260,260);
    // Background
    ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
    grad.addColorStop(0,'#1c1c1e'); grad.addColorStop(1,'#0a0a0a');
    ctx.fillStyle = grad; ctx.fill();
    // Border
    ctx.strokeStyle = '#3a3a3c'; ctx.lineWidth = 2; ctx.stroke();
    // Rotate to heading
    ctx.save(); ctx.translate(cx,cy); ctx.rotate(-angle * Math.PI/180);
    // Tick marks
    for (let i=0; i<360; i+=5) {
      const rad = i * Math.PI/180;
      const inner = i%90===0 ? 90 : i%45===0 ? 95 : i%10===0 ? 100 : 105;
      ctx.beginPath();
      ctx.moveTo(Math.sin(rad)*inner, -Math.cos(rad)*inner);
      ctx.lineTo(Math.sin(rad)*115, -Math.cos(rad)*115);
      ctx.strokeStyle = i%90===0 ? '#fff' : i%45===0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = i%90===0 ? 2 : 1; ctx.stroke();
    }
    // Cardinal labels
    [['С',0,'#ff3b30'],['В',90,'#fff'],['Ю',180,'#fff'],['З',270,'#fff']].forEach(([lbl,deg,color])=>{
      const rad = deg*Math.PI/180;
      ctx.fillStyle = color; ctx.font = 'bold 16px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(lbl, Math.sin(rad)*78, -Math.cos(rad)*78);
    });
    ctx.restore();
    // Red needle (N)
    ctx.save(); ctx.translate(cx,cy);
    ctx.beginPath(); ctx.moveTo(0,-100); ctx.lineTo(-8,10); ctx.lineTo(0,0); ctx.lineTo(8,10); ctx.closePath();
    ctx.fillStyle = '#ff3b30'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(0,100); ctx.lineTo(-8,-10); ctx.lineTo(0,0); ctx.lineTo(8,-10); ctx.closePath();
    ctx.fillStyle = '#aaa'; ctx.fill();
    // Center dot
    ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    ctx.restore();
  }

  window.compassStart = () => {
    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission().then(r => {
          if (r === 'granted') listenOrientation();
          else fallbackCompass();
        });
      } else {
        listenOrientation();
      }
    } else { fallbackCompass(); }
  };

  function listenOrientation() {
    watching = true;
    document.getElementById('compass-btn').textContent = 'Компас активен';
    window.addEventListener('deviceorientationabsolute', onOrientation, true);
    window.addEventListener('deviceorientation', onOrientation, true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const el = document.getElementById('compass-coords');
        if (el) el.textContent = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
      });
    }
  }

  function onOrientation(e) {
    const alpha = e.webkitCompassHeading || (e.alpha ? 360 - e.alpha : null);
    if (alpha === null) return;
    heading = Math.round(alpha);
    const dirIdx = Math.round(heading / 22.5) % 16;
    const d = document.getElementById('compass-dir');
    const n = document.getElementById('compass-name');
    if (d) d.textContent = heading + '°';
    if (n) n.textContent = dirs[dirIdx];
    drawCompass(heading);
  }

  function fallbackCompass() {
    // Simulate compass animation
    let deg = 0;
    document.getElementById('compass-btn').style.display = 'none';
    const note = document.getElementById('compass-coords');
    if (note) note.textContent = 'Демо-режим (нет датчика ориентации)';
    setInterval(() => {
      deg = (deg + 1) % 360;
      heading = deg;
      const dirIdx = Math.round(deg / 22.5) % 16;
      const d = document.getElementById('compass-dir');
      const n = document.getElementById('compass-name');
      if (d) d.textContent = deg + '°';
      if (n) n.textContent = dirs[dirIdx];
      drawCompass(deg);
    }, 50);
  }

  drawCompass(0);
  // Try auto-start
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    setTimeout(() => window.compassStart(), 300);
  }
};
/* ========== MEASURE ========== */
APP_RENDERERS.measure = function(container) {
  container.innerHTML = `
  <div style="background:#1c1c1e;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:24px;gap:16px">
    <div style="color:#fff;font-size:20px;font-weight:700;align-self:flex-start">📏 Рулетка</div>
    <div style="background:#2c2c2e;border-radius:20px;padding:24px;width:100%;display:flex;flex-direction:column;gap:16px">
      <div style="color:rgba(255,255,255,0.6);font-size:13px">Конвертер единиц</div>
      <div style="display:flex;gap:10px;align-items:center">
        <input id="meas-val" type="number" value="1" style="flex:1;background:#3a3a3c;border:none;border-radius:12px;color:#fff;font-size:24px;font-weight:200;padding:10px 14px;outline:none;font-family:var(--font)">
        <select id="meas-from" onchange="measConvert()" style="background:#3a3a3c;border:none;border-radius:12px;color:#fff;font-size:15px;padding:10px 12px;outline:none;font-family:var(--font)">
          <option value="m">Метры</option>
          <option value="cm">Сантиметры</option>
          <option value="mm">Миллиметры</option>
          <option value="km">Километры</option>
          <option value="ft">Футы</option>
          <option value="in">Дюймы</option>
          <option value="mi">Мили</option>
        </select>
      </div>
      <div style="color:rgba(255,255,255,0.4);font-size:13px;text-align:center">↕ В</div>
      <div id="meas-results" style="display:flex;flex-direction:column;gap:8px"></div>
    </div>
    <div style="background:#2c2c2e;border-radius:20px;padding:20px;width:100%;display:flex;flex-direction:column;gap:12px">
      <div style="color:rgba(255,255,255,0.6);font-size:13px">Простая рулетка</div>
      <div style="display:flex;gap:10px">
        <input type="number" id="ruler-a" placeholder="A (см)" style="flex:1;background:#3a3a3c;border:none;border-radius:10px;color:#fff;font-size:16px;padding:10px 12px;outline:none;font-family:var(--font)">
        <span style="color:#fff;font-size:20px;line-height:42px">→</span>
        <input type="number" id="ruler-b" placeholder="B (см)" style="flex:1;background:#3a3a3c;border:none;border-radius:10px;color:#fff;font-size:16px;padding:10px 12px;outline:none;font-family:var(--font)">
      </div>
      <button onclick="rulerCalc()" style="background:#007AFF;border:none;border-radius:12px;color:#fff;padding:12px;font-size:15px;cursor:pointer;font-family:var(--font)">Рассчитать расстояние</button>
      <div id="ruler-result" style="color:#30d158;font-size:18px;font-weight:600;text-align:center"></div>
    </div>
  </div>`;

  const factors = { m:1, cm:0.01, mm:0.001, km:1000, ft:0.3048, in:0.0254, mi:1609.344 };
  const names = { m:'Метры', cm:'Сантиметры', mm:'Миллиметры', km:'Километры', ft:'Футы', in:'Дюймы', mi:'Мили' };

  function measConvert() {
    const val = parseFloat(document.getElementById('meas-val').value) || 0;
    const from = document.getElementById('meas-from').value;
    const inMeters = val * factors[from];
    const res = document.getElementById('meas-results');
    if (!res) return;
    res.innerHTML = Object.keys(factors).filter(k=>k!==from).map(k=>`
      <div style="background:#3a3a3c;border-radius:10px;padding:10px 14px;display:flex;justify-content:space-between">
        <span style="color:rgba(255,255,255,0.5);font-size:14px">${names[k]}</span>
        <span style="color:#fff;font-size:16px;font-weight:500">${(inMeters/factors[k]).toLocaleString('ru-RU',{maximumFractionDigits:4})}</span>
      </div>`).join('');
  }
  window.measConvert = measConvert;
  document.getElementById('meas-val').addEventListener('input', measConvert);
  measConvert();

  window.rulerCalc = () => {
    const a = parseFloat(document.getElementById('ruler-a').value);
    const b = parseFloat(document.getElementById('ruler-b').value);
    const r = document.getElementById('ruler-result');
    if (isNaN(a) || isNaN(b)) { r.textContent = 'Введите оба значения'; return; }
    r.textContent = `Расстояние: ${Math.abs(b - a).toFixed(2)} см`;
  };
};
/* ========== SHORTCUTS ========== */
APP_RENDERERS.shortcuts = function(container) {
  let shortcuts = JSON.parse(localStorage.getItem('iphone_shortcuts') || '[]');
  const templates = [
    { name: 'Открыть Калькулятор', emoji: '⚡', action: 'openApp', arg: 'calculator', color: '#a855f7' },
    { name: 'Открыть Музыку', emoji: '🎵', action: 'openApp', arg: 'music', color: '#fc3c44' },
    { name: 'Открыть Заметки', emoji: '📝', action: 'openApp', arg: 'notes', color: '#ff9f0a' },
    { name: 'Показать время', emoji: '⏰', action: 'alert', arg: () => new Date().toLocaleTimeString('ru-RU'), color: '#30d158' },
    { name: 'Случайное число', emoji: '🎲', action: 'alert', arg: () => 'Случайное число: ' + Math.floor(Math.random()*100+1), color: '#007AFF' },
    { name: 'Сегодняшняя дата', emoji: '📅', action: 'alert', arg: () => new Date().toLocaleDateString('ru-RU',{weekday:'long',year:'numeric',month:'long',day:'numeric'}), color: '#ff3b30' },
  ];

  function render() {
    container.innerHTML = `
    <div style="background:#0d0a1a;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#1a0d2e;border-bottom:1px solid #2c1a4e">
        <div style="color:#fff;font-size:20px;font-weight:700">⚡ Команды</div>
        <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-top:2px">Автоматизация действий</div>
      </div>
      <div style="flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:12px">
        <div style="color:rgba(255,255,255,0.6);font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Галерея</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          ${templates.map((t,i)=>`
            <div onclick="scRun(${i})" style="background:${t.color}22;border:1px solid ${t.color}44;border-radius:16px;padding:16px;cursor:pointer;display:flex;flex-direction:column;gap:8px">
              <div style="font-size:28px">${t.emoji}</div>
              <div style="color:#fff;font-size:13px;font-weight:500;line-height:1.3">${t.name}</div>
              <div style="color:${t.color};font-size:11px">▶ Запустить</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
    window.scRun = (i) => {
      const t = templates[i];
      if (t.action === 'openApp') { closeApp(); setTimeout(() => openApp(t.arg), 300); }
      else if (t.action === 'alert') { alert(typeof t.arg === 'function' ? t.arg() : t.arg); }
    };
  }
  render();
};
/* ========== TRANSLATE ========== */
APP_RENDERERS.translate = function(container) {
  const langs = { ru: 'Русский', en: 'English', de: 'Deutsch', fr: 'Français', es: 'Español', zh: '中文', ja: '日本語', ar: 'العربية' };
  let fromLang = 'ru', toLang = 'en';

  function render() {
    container.innerHTML = `
    <div style="background:#000;height:100%;display:flex;flex-direction:column">
      <div style="padding:16px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
        <div style="color:#fff;font-size:20px;font-weight:700">🌐 Переводчик</div>
      </div>
      <!-- Lang selectors -->
      <div style="display:flex;align-items:center;background:#1c1c1e;border-bottom:1px solid #2c2c2e;padding:8px 12px;gap:8px">
        <select id="tr-from" style="flex:1;background:#2c2c2e;border:none;border-radius:10px;color:#fff;padding:8px;font-size:14px;outline:none;font-family:var(--font)">
          ${Object.entries(langs).map(([k,v])=>`<option value="${k}" ${k===fromLang?'selected':''}>${v}</option>`).join('')}
        </select>
        <button onclick="trSwap()" style="background:#2c2c2e;border:none;border-radius:10px;color:#007AFF;padding:8px 12px;font-size:18px;cursor:pointer">⇄</button>
        <select id="tr-to" style="flex:1;background:#2c2c2e;border:none;border-radius:10px;color:#fff;padding:8px;font-size:14px;outline:none;font-family:var(--font)">
          ${Object.entries(langs).map(([k,v])=>`<option value="${k}" ${k===toLang?'selected':''}>${v}</option>`).join('')}
        </select>
      </div>
      <!-- Input -->
      <div style="padding:12px 16px;border-bottom:1px solid #1c1c1e;background:#0a0a0a">
        <textarea id="tr-input" placeholder="Введите текст для перевода..." style="width:100%;background:transparent;border:none;color:#fff;font-size:18px;outline:none;resize:none;line-height:1.5;font-family:var(--font);min-height:100px" oninput="trTranslate()"></textarea>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px">
          <button onclick="document.getElementById('tr-input').value='';document.getElementById('tr-output').innerHTML='<div style=color:rgba(255,255,255,0.3);padding:16px>Перевод появится здесь</div>'" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:14px;cursor:pointer">✕ Очистить</button>
          <button onclick="trTranslate()" style="background:#007AFF;border:none;border-radius:10px;color:#fff;padding:8px 16px;font-size:14px;cursor:pointer;font-family:var(--font)">Перевести</button>
        </div>
      </div>
      <!-- Output -->
      <div style="flex:1;background:#0f0f1a;padding:16px;overflow-y:auto">
        <div id="tr-output" style="color:rgba(255,255,255,0.3);font-size:16px">Перевод появится здесь</div>
      </div>
      <!-- Quick phrases -->
      <div style="padding:12px 16px;background:#1c1c1e;border-top:1px solid #2c2c2e">
        <div style="color:rgba(255,255,255,0.4);font-size:12px;margin-bottom:8px">Быстрые фразы</div>
        <div style="display:flex;gap:6px;overflow-x:auto">
          ${['Привет','Как дела?','Спасибо','Пожалуйста','Где находится...','Сколько стоит?'].map(p=>`
            <button onclick="document.getElementById('tr-input').value='${p}';trTranslate()" style="background:#2c2c2e;border:none;border-radius:14px;color:#fff;padding:6px 12px;font-size:12px;cursor:pointer;white-space:nowrap;font-family:var(--font)">${p}</button>`).join('')}
        </div>
      </div>
    </div>`;

    window.trSwap = () => {
      const f = document.getElementById('tr-from').value;
      const t = document.getElementById('tr-to').value;
      fromLang = t; toLang = f;
      render();
    };

    window.trTranslate = () => {
      const text = document.getElementById('tr-input').value.trim();
      if (!text) return;
      const from = document.getElementById('tr-from').value;
      const to = document.getElementById('tr-to').value;
      const out = document.getElementById('tr-output');
      out.innerHTML = '<div style="color:rgba(255,255,255,0.4);font-size:14px">Переводим...</div>';
      // Use MyMemory free API
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`)
        .then(r => r.json())
        .then(d => {
          const translated = d.responseData?.translatedText || 'Ошибка перевода';
          out.innerHTML = `
            <div style="color:#fff;font-size:20px;line-height:1.5;margin-bottom:12px">${translated}</div>
            <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${translated.replace(/'/g,"\\'")}').then(()=>alert('Скопировано!'))" style="background:#2c2c2e;border:none;border-radius:8px;color:#007AFF;padding:6px 14px;font-size:13px;cursor:pointer">📋 Копировать</button>`;
        })
        .catch(() => {
          out.innerHTML = '<div style="color:#ff3b30;font-size:14px">Ошибка. Проверьте подключение к сети.</div>';
        });
    };
  }
  render();
};


/* =========================================================
   GAMES — original implementations (canvas-based)
   ========================================================= */

// Global game loop handle + cleanup, called by closeApp() in core.js
window._gameRAF = null;
window.stopGame = function() {
  if (window._gameRAF) { cancelAnimationFrame(window._gameRAF); window._gameRAF = null; }
  if (window._gameCleanup) { try { window._gameCleanup(); } catch (e) {} window._gameCleanup = null; }
};

/* ========== GEOMETRY DASH (level-based runner) ========== */
APP_RENDERERS.geometrydash = function(container) {
  window.stopGame();
  const bestPct = +(localStorage.getItem('gd_bestpct') || 0);
  let attempts = +(localStorage.getItem('gd_attempts') || 0);

  container.innerHTML = `
  <div class="game-wrap" id="gd-wrap" style="background:#5b3df5">
    <canvas id="gd-canvas"></canvas>
    <!-- top progress bar -->
    <div id="gd-topbar" style="position:absolute;top:10px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:8px;z-index:4;pointer-events:none">
      <div style="width:62%;height:14px;background:rgba(0,0,0,0.28);border:2px solid rgba(255,255,255,0.85);border-radius:8px;overflow:hidden">
        <div id="gd-progress" style="height:100%;width:0%;background:linear-gradient(90deg,#ff6ec7,#c86bff);border-radius:6px;transition:width 0.08s linear"></div>
      </div>
      <span id="gd-pct" style="color:#fff;font-size:15px;font-weight:800;min-width:38px;text-shadow:0 1px 2px rgba(0,0,0,0.4)">0%</span>
    </div>
    <div class="game-overlay" id="gd-overlay">
      <div class="game-title">🔺 Geometry Dash</div>
      <div class="game-sub">Тап / пробел — прыжок<br>Жёлтый круг — прыжок в воздухе<br>Оранжевый пад — супер-прыжок</div>
      <button class="game-btn" id="gd-start">Играть</button>
    </div>
  </div>`;

  const canvas = document.getElementById('gd-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = container.clientWidth; H = canvas.height = container.clientHeight; }
  resize();

  // ---- theme (GD-style purple/blue brick world) ----
  const THEME = { bg1: '#6a4bff', bg2: '#4a2fd6', brick: 'rgba(255,255,255,0.10)', brickLine: 'rgba(255,255,255,0.16)', objFill: '#16133a', objLine: '#ffffff' };

  const PX = 90;            // player fixed screen-x
  const SIZE = 32;          // cube size
  const SPEED = 6.2;        // constant scroll speed (GD is constant)
  const GRAV = 0.86;
  const JUMP = -13.2;
  let groundY;

  let player, camX, running, won, rot, trail, level, levelLen, progress;

  // ----- build a fixed, hand-authored level -----
  // cursor-based authoring: x advances; helpers append objects
  function buildLevel() {
    const objs = [];
    let x = 520;
    const G = () => groundY;
    const gap = (n) => { x += n; };

    function spikes(n) {
      for (let i = 0; i < n; i++) { objs.push({ t: 'spike', x: x, w: 30, h: 30 }); x += 30; }
    }
    function block(h) {
      objs.push({ t: 'block', x: x, w: 34, h: h, topY: G() - h }); x += 34;
    }
    function blockRow(n, h) {
      for (let i = 0; i < n; i++) { objs.push({ t: 'block', x: x, w: 34, h: h, topY: G() - h }); x += 34; }
    }
    function orb(yOff) { objs.push({ t: 'orb', x: x, y: G() - (yOff || 70), r: 16, used: false }); x += 90; }
    function pad() { objs.push({ t: 'pad', x: x, w: 34 }); x += 80; }

    // ---- intro: a few single spikes (easy) ----
    gap(40); spikes(1); gap(150); spikes(1); gap(170);
    spikes(2); gap(180);
    // ---- block to land on then spikes ----
    blockRow(2, 34); gap(60); spikes(1); gap(170);
    spikes(3); gap(160);
    // ---- step up blocks ----
    block(34); block(68); gap(50); spikes(1); gap(190);
    // ---- jump orb section ----
    spikes(1); gap(20); orb(64); gap(20); spikes(2); gap(190);
    // ---- platform gap with spikes underneath ----
    spikes(2); gap(40);
    objs.push({ t: 'platform', x: x, w: 120, topY: G() - 110 }); 
    // spikes under platform
    for (let i = 0; i < 6; i++) objs.push({ t: 'spikeSmall', x: x + i * 20, w: 20, h: 22 });
    x += 130; gap(60); spikes(1); gap(190);
    // ---- pad super jump over wide spikes ----
    pad(); 
    for (let i = 0; i < 7; i++) objs.push({ t: 'spike', x: x + i * 22, w: 22, h: 28 });
    x += 7 * 22 + 40; gap(160);
    // ---- staircase ----
    block(34); block(68); block(102); gap(40);
    block(102); gap(8); spikes(1); gap(180);
    // ---- finale: tight spikes + orb ----
    spikes(2); gap(30); orb(70); gap(10); spikes(3); gap(160);
    blockRow(3, 34); gap(50); spikes(2); gap(220);

    return { objs, len: x + 200 };
  }

  function reset() {
    groundY = H - 70;
    const L = buildLevel();
    level = L.objs; levelLen = L.len;
    player = { vy: 0, onGround: true, y: groundY - SIZE };
    camX = 0; running = true; won = false; rot = 0; trail = []; progress = 0;
  }

  // input: jump on ground, or activate an orb in mid-air
  function action() {
    if (!running) return;
    if (player.onGround) { player.vy = JUMP; player.onGround = false; return; }
    // try orb
    const px = PX, py = player.y;
    for (const o of level) {
      if (o.t === 'orb' && !o.used) {
        const sx = o.x - camX;
        if (sx > px - 40 && sx < px + 70) {
          const cx = sx, cy = o.y;
          if (Math.abs((px + SIZE / 2) - cx) < 46 && Math.abs((py + SIZE / 2) - cy) < 50) {
            player.vy = JUMP * 1.02; o.used = true;
            return;
          }
        }
      }
    }
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, THEME.bg1); g.addColorStop(1, THEME.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // brick / panel pattern (parallax slow)
    const off = (camX * 0.4) % 120;
    ctx.lineWidth = 2; ctx.strokeStyle = THEME.brickLine;
    ctx.fillStyle = THEME.brick;
    const cw = 120, ch = 90;
    for (let gy = -ch; gy < H + ch; gy += ch) {
      const rowShift = (Math.floor(gy / ch) % 2) * (cw / 2);
      for (let gx = -cw; gx < W + cw; gx += cw) {
        const x = gx - off + rowShift;
        ctx.fillRect(x + 4, gy + 4, cw - 8, ch - 8);
        ctx.strokeRect(x + 4, gy + 4, cw - 8, ch - 8);
      }
    }
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function loop() {
    if (!running) return;
    camX += SPEED;

    drawBackground();

    // ground band
    ctx.fillStyle = '#100c30';
    ctx.fillRect(0, groundY, W, H - groundY);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
    // ground moving stripes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2;
    const goff = (camX) % 60;
    for (let x = -goff; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, groundY); ctx.lineTo(x - 30, H); ctx.stroke(); }

    // ---- physics ----
    player.vy += GRAV;
    let nextY = player.y + player.vy;
    let floorY = groundY;
    const px1 = PX + 3, px2 = PX + SIZE - 3;

    // landable tops (blocks / platforms)
    for (const o of level) {
      if (o.t === 'block' || o.t === 'platform') {
        const sx = o.x - camX;
        if (px2 > sx && px1 < sx + o.w && player.vy >= 0 &&
            player.y + SIZE <= o.topY + 14 && nextY + SIZE >= o.topY) {
          floorY = Math.min(floorY, o.topY);
        }
      }
    }
    if (nextY + SIZE >= floorY) { player.y = floorY - SIZE; player.vy = 0; player.onGround = true; }
    else { player.y = nextY; player.onGround = false; }

    if (player.onGround) rot = Math.round(rot / (Math.PI / 2)) * (Math.PI / 2);
    else rot += 0.16;

    // trail particles
    if (!player.onGround) trail.push({ x: PX + 4, y: player.y + SIZE - 6, life: 12 });
    for (let i = trail.length - 1; i >= 0; i--) { trail[i].life--; trail[i].x -= SPEED; if (trail[i].life <= 0) trail.splice(i, 1); }
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (const t of trail) { const a = t.life / 12; ctx.globalAlpha = a * 0.6; ctx.fillRect(t.x, t.y, 5, 5); }
    ctx.globalAlpha = 1;

    // ---- draw + collide objects ----
    const pcx = PX + SIZE / 2, pcy = player.y + SIZE / 2;
    for (const o of level) {
      const sx = o.x - camX;
      if (sx > W + 60 || sx + (o.w || 40) < -60) continue;

      if (o.t === 'spike' || o.t === 'spikeSmall') {
        const h = o.h;
        ctx.fillStyle = THEME.objFill; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, groundY);
        ctx.lineTo(sx + o.w / 2, groundY - h);
        ctx.lineTo(sx + o.w, groundY);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // collision: triangle hitbox (a bit forgiving)
        if (px2 > sx + 4 && px1 < sx + o.w - 4 && player.y + SIZE - 4 > groundY - h + 4) die();

      } else if (o.t === 'block') {
        ctx.fillStyle = THEME.objFill; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.fillRect(sx, o.topY, o.w, o.h);
        ctx.strokeRect(sx, o.topY, o.w, o.h);
        // side death: overlapping and below top surface
        if (px2 > sx + 2 && px1 < sx + o.w - 2 && player.y + SIZE > o.topY + 10) die();

      } else if (o.t === 'platform') {
        ctx.fillStyle = THEME.objFill; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.fillRect(sx, o.topY, o.w, 16);
        ctx.strokeRect(sx, o.topY, o.w, 16);
        const onThis = player.onGround && Math.abs(player.y + SIZE - o.topY) < 4;
        if (!onThis && px2 > sx + 2 && px1 < sx + o.w - 2 && player.y + SIZE > o.topY + 16 && player.y < o.topY + 16) die();

      } else if (o.t === 'orb') {
        const cx = sx, cy = o.y;
        const t = Date.now() / 300;
        ctx.save();
        ctx.globalAlpha = o.used ? 0.3 : 1;
        ctx.strokeStyle = '#ffe24d'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, cy, o.r + 4 + Math.sin(t) * 2, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ffd400';
        ctx.beginPath(); ctx.arc(cx, cy, o.r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff8c0';
        ctx.beginPath(); ctx.arc(cx, cy, o.r * 0.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

      } else if (o.t === 'pad') {
        // orange jump pad on the ground
        ctx.fillStyle = '#ff9f0a'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(sx, groundY);
        ctx.lineTo(sx + o.w / 2, groundY - 14);
        ctx.lineTo(sx + o.w, groundY);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        // auto super-jump on contact
        if (px2 > sx && px1 < sx + o.w && player.y + SIZE >= groundY - 16) {
          player.vy = JUMP * 1.45; player.onGround = false;
        }
      }
    }

    // ---- player cube with face ----
    ctx.save();
    ctx.translate(PX + SIZE / 2, player.y + SIZE / 2);
    ctx.rotate(rot);
    // body
    ctx.fillStyle = '#ff4d3d';
    rrect(-SIZE / 2, -SIZE / 2, SIZE, SIZE, 6); ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = '#7a1d12'; ctx.stroke();
    // inner highlight
    ctx.fillStyle = '#ff8a72';
    rrect(-SIZE / 2 + 4, -SIZE / 2 + 4, SIZE - 8, (SIZE - 8) / 2, 4); ctx.fill();
    // eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(-8, -4, 6, 8); ctx.fillRect(2, -4, 6, 8);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-6, -2, 3, 5); ctx.fillRect(4, -2, 3, 5);
    ctx.restore();

    // ---- progress ----
    progress = Math.min(100, (camX / levelLen) * 100);
    const pb = document.getElementById('gd-progress'); if (pb) pb.style.width = progress.toFixed(1) + '%';
    const pp = document.getElementById('gd-pct'); if (pp) pp.textContent = Math.floor(progress) + '%';

    if (camX >= levelLen) { winGame(); return; }

    window._gameRAF = requestAnimationFrame(loop);
  }

  function start() {
    reset();
    attempts++; localStorage.setItem('gd_attempts', attempts);
    document.getElementById('gd-overlay').style.display = 'none';
    window._gameRAF = requestAnimationFrame(loop);
  }

  function die() {
    if (!running) return;
    running = false;
    if (window._gameRAF) cancelAnimationFrame(window._gameRAF);
    const pct = Math.floor(progress);
    if (pct > bestPct) localStorage.setItem('gd_bestpct', pct);
    // small shake/flash
    const wrap = document.getElementById('gd-wrap');
    if (wrap) { wrap.style.transition = 'filter 0.1s'; wrap.style.filter = 'brightness(2.2)'; setTimeout(() => { if (wrap) wrap.style.filter = ''; }, 90); }
    const ov = document.getElementById('gd-overlay');
    ov.style.display = 'flex';
    ov.querySelector('.game-title').textContent = '💀 ' + pct + '%';
    ov.querySelector('.game-sub').innerHTML = `Попытка ${attempts} · Рекорд: <b>${Math.max(pct, bestPct)}%</b>`;
    ov.querySelector('.game-btn').textContent = 'Заново';
  }

  function winGame() {
    running = false;
    if (window._gameRAF) cancelAnimationFrame(window._gameRAF);
    localStorage.setItem('gd_bestpct', 100);
    const ov = document.getElementById('gd-overlay');
    ov.style.display = 'flex';
    ov.querySelector('.game-title').textContent = '🏆 Уровень пройден!';
    ov.querySelector('.game-sub').innerHTML = `100% · Попыток: ${attempts}`;
    ov.querySelector('.game-btn').textContent = 'Играть снова';
  }

  const onKey = (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); action(); } };
  canvas.addEventListener('pointerdown', action);
  document.addEventListener('keydown', onKey);
  document.getElementById('gd-start').addEventListener('click', (e) => { e.stopPropagation(); start(); });

  window._gameCleanup = () => {
    running = false;
    document.removeEventListener('keydown', onKey);
  };
};

/* ========== FLAPPY (bird through pipes) ========== */
APP_RENDERERS.flappy = function(container) {
  window.stopGame();
  const best = +(localStorage.getItem('flappy_best') || 0);
  container.innerHTML = `
  <div class="game-wrap" style="background:#4ec0ca">
    <canvas id="fl-canvas"></canvas>
    <div class="game-hud"><span id="fl-score">0</span><span class="game-best">Рекорд: <b id="fl-best">${best}</b></span></div>
    <div class="game-overlay" id="fl-overlay">
      <div class="game-title">🐤 Flappy</div>
      <div class="game-sub">Тапай / пробел<br>Лети между труб</div>
      <button class="game-btn" id="fl-start">Играть</button>
    </div>
  </div>`;

  const canvas = document.getElementById('fl-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = container.clientWidth; H = canvas.height = container.clientHeight; }
  resize();

  let bird, pipes, score, running, spawnT, gap, speed, frame;
  let clouds, hills, stars;

  function reset() {
    bird = { x: W * 0.28, y: H / 2, r: 14, vy: 0, flapT: 0 };
    pipes = []; score = 0; running = true; spawnT = 0; gap = 160; speed = 2.6; frame = 0;
    clouds = []; hills = []; stars = [];
    for (let i = 0; i < 5; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * (H * 0.4), s: 0.6 + Math.random() * 0.6, r: 16 + Math.random() * 16 });
    for (let i = 0; i < 6; i++) hills.push({ x: i * 90, h: 50 + Math.random() * 60, w: 120 + Math.random() * 60 });
    for (let i = 0; i < 30; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * 0.6, r: Math.random() * 1.4 + 0.3 });
  }
  function flap() { if (running) { bird.vy = -6.5; bird.flapT = 8; } }

  // day → sunset → night → dawn palettes, blended by score
  const SKY = [
    { t: '#4ec0ca', b: '#9be7d8' }, // day
    { t: '#ff8c42', b: '#ffd27f' }, // sunset
    { t: '#0b1026', b: '#243b6b' }, // night
    { t: '#7b6ca8', b: '#f3a6c0' }  // dawn
  ];
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hx(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(c1, c2, t) {
    const a = hx(c1), b = hx(c2);
    return `rgb(${lerp(a[0], b[0], t) | 0},${lerp(a[1], b[1], t) | 0},${lerp(a[2], b[2], t) | 0})`;
  }
  function skyNow() {
    const cyc = 18;
    const f = (score % (cyc * SKY.length)) / cyc;
    const i = Math.floor(f) % SKY.length;
    const j = (i + 1) % SKY.length;
    const t = f - Math.floor(f);
    return { top: mix(SKY[i].t, SKY[j].t, t), bot: mix(SKY[i].b, SKY[j].b, t), idx: i, blend: t };
  }
  function nightAmount() {
    // how "night" we are (0..1) for stars/moon
    const s = skyNow();
    if (s.idx === 1) return s.blend;        // sunset → night
    if (s.idx === 2) return 1;              // night
    if (s.idx === 3) return 1 - s.blend;    // night → dawn
    return 0;
  }

  function spawn() {
    gap = Math.max(110, 160 - score * 1.4);
    const minTop = 46, maxTop = H - gap - 110;
    const top = minTop + Math.random() * Math.max(20, maxTop - minTop);
    const moving = score > 10 && Math.random() < 0.35;
    pipes.push({
      x: W + 10, top, w: 52 + Math.random() * 16, passed: false,
      moving, base: top, amp: 26 + Math.random() * 22, phase: Math.random() * Math.PI * 2
    });
  }

  function loop() {
    if (!running) return;
    frame++;
    speed = Math.min(4.6, 2.6 + score * 0.04);

    const sky = skyNow();
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, sky.top); g.addColorStop(1, sky.bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // stars + moon at night
    const nA = nightAmount();
    if (nA > 0.05) {
      ctx.fillStyle = `rgba(255,255,255,${nA * 0.9})`;
      for (const st of stars) { ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.save();
      ctx.globalAlpha = nA;
      ctx.fillStyle = '#fdf6c8';
      ctx.beginPath(); ctx.arc(W - 56, 64, 22, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = sky.top;
      ctx.beginPath(); ctx.arc(W - 48, 58, 18, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = '#fff3b0';
      ctx.beginPath(); ctx.arc(W - 56, 64, 26, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // parallax clouds (slow)
    ctx.fillStyle = `rgba(255,255,255,${0.75 - nA * 0.5})`;
    for (const c of clouds) {
      c.x -= c.s * (speed * 0.3);
      if (c.x < -c.r * 2) { c.x = W + c.r; c.y = 40 + Math.random() * (H * 0.4); }
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.arc(c.x + c.r, c.y + 4, c.r * 0.8, 0, Math.PI * 2);
      ctx.arc(c.x - c.r * 0.8, c.y + 4, c.r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // parallax hills / city silhouette (medium)
    ctx.fillStyle = nA > 0.4 ? 'rgba(20,28,55,0.85)' : 'rgba(80,140,120,0.55)';
    const hw = 150;
    for (const hl of hills) {
      hl.x -= speed * 0.6;
      if (hl.x < -hl.w) { hl.x += hills.length * 90 + hw; hl.h = 50 + Math.random() * 60; }
      ctx.beginPath();
      ctx.moveTo(hl.x, H - 60);
      ctx.quadraticCurveTo(hl.x + hl.w / 2, H - 60 - hl.h, hl.x + hl.w, H - 60);
      ctx.closePath(); ctx.fill();
    }

    bird.vy += 0.4; bird.y += bird.vy;
    if (bird.flapT > 0) bird.flapT--;

    spawnT++;
    const last = pipes[pipes.length - 1];
    const spacing = Math.max(150, 210 - score * 1.5) + Math.random() * 60;
    if (!last || last.x < W - spacing) { if (spawnT > 30) { spawn(); spawnT = 0; } }

    for (let i = pipes.length - 1; i >= 0; i--) {
      const p = pipes[i];
      p.x -= speed;
      if (p.moving) p.top = p.base + Math.sin(frame * 0.03 + p.phase) * p.amp;
      const by = p.top + gap;

      const grad = ctx.createLinearGradient(p.x, 0, p.x + p.w, 0);
      grad.addColorStop(0, '#4a9d4a'); grad.addColorStop(0.5, '#6fcf6f'); grad.addColorStop(1, '#4a9d4a');
      ctx.fillStyle = grad;
      ctx.fillRect(p.x, 0, p.w, p.top);
      ctx.fillRect(p.x - 3, p.top - 22, p.w + 6, 22);
      ctx.fillRect(p.x, by, p.w, H - by - 60);
      ctx.fillRect(p.x - 3, by, p.w + 6, 22);

      if (bird.x + bird.r > p.x && bird.x - bird.r < p.x + p.w &&
          (bird.y - bird.r < p.top || bird.y + bird.r > by)) gameOver();
      if (!p.passed && p.x + p.w < bird.x) { p.passed = true; score++; }
      if (p.x + p.w < -10) pipes.splice(i, 1);
    }

    // ground (scrolling texture)
    ctx.fillStyle = '#ded895'; ctx.fillRect(0, H - 60, W, 60);
    ctx.fillStyle = '#c0b86a'; ctx.fillRect(0, H - 60, W, 6);
    ctx.fillStyle = '#cdc77f';
    const off = (frame * speed) % 24;
    for (let x = -off; x < W; x += 24) { ctx.fillRect(x, H - 54, 12, 6); }

    // bird with wing flap
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(Math.max(-0.5, Math.min(1, bird.vy / 10)));
    ctx.fillStyle = '#ffd54f';
    ctx.beginPath(); ctx.arc(0, 0, bird.r, 0, Math.PI * 2); ctx.fill();
    // wing — up frame when flapping, down otherwise
    ctx.fillStyle = '#f0b429';
    const wingUp = bird.flapT > 0;
    ctx.beginPath();
    if (wingUp) { ctx.moveTo(-4, 0); ctx.lineTo(-14, -10); ctx.lineTo(-2, -4); }
    else { ctx.moveTo(-4, 0); ctx.lineTo(-14, 8); ctx.lineTo(-2, 4); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(5, -4, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(7, -4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff9800'; ctx.beginPath(); ctx.moveTo(bird.r, 0); ctx.lineTo(bird.r + 8, -3); ctx.lineTo(bird.r + 8, 3); ctx.fill();
    ctx.restore();

    if (bird.y + bird.r > H - 60 || bird.y - bird.r < 0) gameOver();

    document.getElementById('fl-score').textContent = score;
    window._gameRAF = requestAnimationFrame(loop);
  }

  function start() { reset(); document.getElementById('fl-overlay').style.display = 'none'; flap(); window._gameRAF = requestAnimationFrame(loop); }
  function gameOver() {
    running = false;
    if (window._gameRAF) cancelAnimationFrame(window._gameRAF);
    if (score > best) localStorage.setItem('flappy_best', score);
    const ov = document.getElementById('fl-overlay');
    ov.style.display = 'flex';
    ov.querySelector('.game-title').textContent = '💥 Конец';
    ov.querySelector('.game-sub').innerHTML = `Счёт: <b>${score}</b><br>Рекорд: <b>${Math.max(score, best)}</b>`;
    ov.querySelector('.game-btn').textContent = 'Ещё раз';
    document.getElementById('fl-best').textContent = Math.max(score, best);
  }

  const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); flap(); } };
  canvas.addEventListener('pointerdown', flap);
  document.addEventListener('keydown', onKey);
  document.getElementById('fl-start').addEventListener('click', (e) => { e.stopPropagation(); start(); });
  window._gameCleanup = () => { running = false; document.removeEventListener('keydown', onKey); };
};

/* ========== DINO (endless runner) ========== */
APP_RENDERERS.dino = function(container) {
  window.stopGame();
  const best = +(localStorage.getItem('dino_best') || 0);
  container.innerHTML = `
  <div class="game-wrap" id="dn-wrap" style="background:#f7f7f7">
    <canvas id="dn-canvas"></canvas>
    <div class="game-hud" style="color:#535353;justify-content:flex-end;gap:14px">
      <span class="game-best" style="color:#535353;font-size:15px;letter-spacing:2px">HI <b id="dn-best">${String(best).padStart(5,'0')}</b></span>
      <span id="dn-score" style="font-size:15px;letter-spacing:2px;font-weight:700">00000</span>
    </div>
    <div class="game-overlay" id="dn-overlay" style="background:rgba(247,247,247,0.92);color:#535353">
      <div class="game-title" style="color:#535353">🦖 Dino</div>
      <div class="game-sub" style="color:#535353">Тап / пробел — прыжок<br>↓ или тап снизу — пригнуться</div>
      <button class="game-btn" id="dn-start" style="background:#535353">Играть</button>
    </div>
  </div>`;

  const canvas = document.getElementById('dn-canvas');
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = container.clientWidth; H = canvas.height = container.clientHeight; }
  resize();

  // ---- pixel sprites ('X' = filled pixel) ----
  const S = {
    dinoRun1: [
      '.........XXXXXXX',
      '.........X.XXXXX',
      '.........X.X...X',
      '.........XXXXXXX',
      '.........XX.....',
      '.........XXXX...',
      'X........XXXXX..',
      'XX......XXXXXX..',
      'XXX....XXXXXXX..',
      'XXXX..XXXXXXXX..',
      'XXXXXXXXXXXXXX..',
      'XXXXXXXXXXXXX...',
      '.XXXXXXXXXXXX...',
      '..XXXXXXXXXX....',
      '...XXXXXXXX.....',
      '...XX.X.XX......',
      '...XX...XX......',
      '...XX...X.......',
      '...X....XX......',
      '...XX...........',
    ],
    dinoRun2: [
      '.........XXXXXXX',
      '.........X.XXXXX',
      '.........X.X...X',
      '.........XXXXXXX',
      '.........XX.....',
      '.........XXXX...',
      'X........XXXXX..',
      'XX......XXXXXX..',
      'XXX....XXXXXXX..',
      'XXXX..XXXXXXXX..',
      'XXXXXXXXXXXXXX..',
      'XXXXXXXXXXXXX...',
      '.XXXXXXXXXXXX...',
      '..XXXXXXXXXX....',
      '...XXXXXXXX.....',
      '...XX.X.XX......',
      '...XX...XX......',
      '....X...XX......',
      '...XX....X......',
      '.........XX.....',
    ],
    dinoDuck1: [
      '...............XXXXXXX',
      '...............X.XXXXX',
      '...............X.X...X',
      '...............XXXXXXX',
      'X..............XX......'.slice(0,21),
      'XXXXXXXXXXXXXXXXXX....',
      'XXXXXXXXXXXXXXXXXXX...',
      'XXXXXXXXXXXXXXXXXX....',
      '.XXXXXXXXXXXXXXX......',
      '...XX....XX..........',
      '...XX....XX..........',
      '...X......X..........',
    ],
    dinoDuck2: [
      '...............XXXXXXX',
      '...............X.XXXXX',
      '...............X.X...X',
      '...............XXXXXXX',
      'X..............XX.....',
      'XXXXXXXXXXXXXXXXXX....',
      'XXXXXXXXXXXXXXXXXXX...',
      'XXXXXXXXXXXXXXXXXX....',
      '.XXXXXXXXXXXXXXX......',
      '....XX....XX.........',
      '...XX......X.........',
      '..........XX.........',
    ],
    cactusS: [
      '..X..',
      '..X..',
      'X.X..',
      'X.X.X',
      'X.X.X',
      'XXXXX',
      '..X..',
      '..X..',
      '..X..',
      '..X..',
    ],
    cactusL: [
      '...X...',
      '...X...',
      'X..X..X',
      'X..X..X',
      'X..X..X',
      'XXXXXXX',
      '...X...',
      '...X...',
      '...X...',
      '...X...',
      '...X...',
      '...X...',
    ],
    birdUp: [
      '..........XX',
      '.........XXX',
      'X.......XXXX',
      'XXX....XXXXX',
      'XXXXXXXXXX.X',
      'XXXXXXXXX...',
      '..XXXXX.....',
      '....X.......',
    ],
    birdDown: [
      '............',
      'X...........',
      'XXX.........',
      'XXXXXXXXX...',
      'XXXXXXXXXXXX',
      'XXXXXXXXXXXX',
      '..XXXXXXX..X',
      '....XXX....X',
    ],
    cloud: [
      '...XXXXX....',
      '..X.....XX..',
      '.X........X.',
      'XXXXXXXXXXXX',
    ],
  };

  function drawSprite(map, x, y, p, color) {
    ctx.fillStyle = color;
    for (let r = 0; r < map.length; r++) {
      const row = map[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === 'X') ctx.fillRect(x + c * p, y + r * p, p, p);
      }
    }
  }
  function spriteW(map, p) { return Math.max(...map.map(r => r.length)) * p; }
  function spriteH(map, p) { return map.length * p; }

  const GROUND = () => H - 80;
  const P = 3; // pixel scale
  const standH = spriteH(S.dinoRun1, P);   // ~60
  const standW = spriteW(S.dinoRun1, P);
  const duckH = spriteH(S.dinoDuck1, P);
  let dino, obstacles, speed, score, running, spawnT, frame, duckHeld;

  function reset() {
    dino = { x: 44, y: GROUND() - standH, vy: 0, duck: false };
    obstacles = []; speed = 6; score = 0; running = true; spawnT = 0; frame = 0; duckHeld = false;
    clouds = []; pebbles = [];
    for (let i = 0; i < 3; i++) clouds.push({ x: Math.random() * W, y: 40 + Math.random() * 90 });
    for (let i = 0; i < 50; i++) pebbles.push({ x: Math.random() * W, y: GROUND() + 6 + Math.random() * 40, big: Math.random() < 0.3 });
  }
  let clouds, pebbles;

  function curH() { return dino.duck ? duckH : standH; }
  function onGround() { return dino.y >= GROUND() - curH() - 0.5; }
  function jump() { if (running && onGround() && !dino.duck) dino.vy = -15; }
  function setDuck(on) { duckHeld = on; }

  function isNight() { return Math.floor(score / 700) % 2 === 1; }

  function pickType() {
    const pool = ['small', 'small', 'large'];
    if (score > 60) pool.push('cluster', 'birdLow');
    if (score > 180) pool.push('birdMid', 'cluster', 'large');
    if (score > 380) pool.push('birdMid', 'birdLow', 'cluster', 'birdHigh');
    return pool[(Math.random() * pool.length) | 0];
  }

  function spawn() {
    const t = pickType();
    if (t === 'small') {
      obstacles.push({ kind: 'cactus', x: W + 10, parts: [{ map: S.cactusS, dx: 0 }], w: spriteW(S.cactusS, P) });
    } else if (t === 'large') {
      obstacles.push({ kind: 'cactus', x: W + 10, parts: [{ map: S.cactusL, dx: 0 }], w: spriteW(S.cactusL, P) });
    } else if (t === 'cluster') {
      const n = 2 + (Math.random() * 2 | 0);
      const parts = []; let cx = 0;
      for (let i = 0; i < n; i++) {
        const map = Math.random() < 0.5 ? S.cactusS : S.cactusL;
        parts.push({ map, dx: cx }); cx += spriteW(map, P) + 3;
      }
      obstacles.push({ kind: 'cactus', x: W + 10, parts, w: cx });
    } else {
      let y;
      if (t === 'birdLow') y = GROUND() - spriteH(S.birdUp, P) - 6;
      else if (t === 'birdMid') y = GROUND() - 54;
      else y = GROUND() - 96;
      obstacles.push({ kind: 'bird', x: W + 10, y, w: spriteW(S.birdUp, P), h: spriteH(S.birdUp, P) });
    }
  }

  function loop() {
    if (!running) return;
    frame++;
    speed = Math.min(13.5, 6 + score * 0.006);

    const night = isNight();
    const bg = night ? '#1b1b1b' : '#f7f7f7';
    const fg = night ? '#d0d0d0' : '#535353';
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // moon / sun
    if (night) {
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath(); ctx.arc(W - 64, 58, 16, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(W - 57, 53, 13, 0, Math.PI * 2); ctx.fill();
      // a couple stars
      ctx.fillStyle = '#bbb';
      ctx.fillRect(W - 120, 40, 2, 2); ctx.fillRect(W - 90, 80, 2, 2); ctx.fillRect(W - 160, 64, 2, 2);
    }

    // clouds (pixel)
    for (const c of clouds) {
      c.x -= speed * 0.3;
      if (c.x < -spriteW(S.cloud, 3)) { c.x = W + 20; c.y = 40 + Math.random() * 90; }
      drawSprite(S.cloud, c.x, c.y, 3, night ? '#444' : '#c4c4c4');
    }

    // ground line
    ctx.strokeStyle = fg; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, GROUND()); ctx.lineTo(W, GROUND()); ctx.stroke();
    // pebbles / bumps
    ctx.fillStyle = fg;
    for (const pb of pebbles) {
      pb.x -= speed;
      if (pb.x < -4) { pb.x = W + Math.random() * 40; pb.y = GROUND() + 6 + Math.random() * 40; pb.big = Math.random() < 0.3; }
      if (pb.big) { ctx.fillRect(pb.x, pb.y, 4, 2); ctx.fillRect(pb.x + 5, pb.y, 2, 2); }
      else ctx.fillRect(pb.x, pb.y, 2, 2);
    }

    // ---- dino physics + duck ----
    dino.vy += 0.85; dino.y += dino.vy;
    const grounded = dino.y >= GROUND() - standH;
    dino.duck = duckHeld && grounded;
    const dh = curH();
    if (dino.y > GROUND() - dh) { dino.y = GROUND() - dh; dino.vy = 0; }

    // draw dino sprite
    let dmap;
    if (dino.duck) dmap = (Math.floor(frame / 6) % 2 === 0) ? S.dinoDuck1 : S.dinoDuck2;
    else if (!onGround()) dmap = S.dinoRun1;
    else dmap = (Math.floor(frame / 6) % 2 === 0) ? S.dinoRun1 : S.dinoRun2;
    drawSprite(dmap, dino.x, dino.y, P, fg);

    // ---- spawn ----
    spawnT++;
    const last = obstacles[obstacles.length - 1];
    const spacing = Math.max(230, 640 - speed * 26) + Math.random() * 170;
    if ((!last || (W - last.x - (last.w || 0)) > spacing) && spawnT > 22) { spawn(); spawnT = 0; }

    // ---- obstacles ----
    const dw = dino.duck ? spriteW(S.dinoDuck1, P) : standW;
    const dx1 = dino.x + 6, dx2 = dino.x + dw - 8;
    const dy1 = dino.y + 6, dy2 = dino.y + dh - 2;
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.x -= (o.kind === 'bird' ? speed + 1.2 : speed);
      if (o.kind === 'cactus') {
        for (const pt of o.parts) {
          const cw = spriteW(pt.map, P), ch = spriteH(pt.map, P);
          const cx = o.x + pt.dx;
          drawSprite(pt.map, cx, GROUND() - ch, P, fg);
          if (dx2 > cx + 2 && dx1 < cx + cw - 2 && dy2 > GROUND() - ch + 4) gameOver();
        }
      } else {
        const bmap = (Math.floor(frame / 10) % 2 === 0) ? S.birdUp : S.birdDown;
        drawSprite(bmap, o.x, o.y, P, fg);
        if (dx2 > o.x + 3 && dx1 < o.x + o.w - 3 && dy1 < o.y + o.h - 3 && dy2 > o.y + 3) gameOver();
      }
      const right = o.x + (o.w || 0);
      if (right < -8) obstacles.splice(i, 1);
    }

    if (frame % 5 === 0) score++;
    document.getElementById('dn-score').textContent = String(score).padStart(5, '0');
    window._gameRAF = requestAnimationFrame(loop);
  }

  function start() { reset(); document.getElementById('dn-overlay').style.display = 'none'; window._gameRAF = requestAnimationFrame(loop); }
  function gameOver() {
    if (!running) return;
    running = false;
    if (window._gameRAF) cancelAnimationFrame(window._gameRAF);
    if (score > best) localStorage.setItem('dino_best', score);
    const ov = document.getElementById('dn-overlay');
    ov.style.display = 'flex';
    ov.querySelector('.game-title').textContent = 'G A M E   O V E R';
    ov.querySelector('.game-sub').innerHTML = `Счёт: <b>${String(score).padStart(5,'0')}</b><br>Рекорд: <b>${String(Math.max(score, best)).padStart(5,'0')}</b>`;
    ov.querySelector('.game-btn').textContent = '↻ Ещё раз';
    document.getElementById('dn-best').textContent = String(Math.max(score, best)).padStart(5, '0');
  }

  const onKey = (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); }
    else if (e.code === 'ArrowDown') { e.preventDefault(); setDuck(true); }
  };
  const onKeyUp = (e) => { if (e.code === 'ArrowDown') setDuck(false); };
  const onDown = (e) => {
    const rect = canvas.getBoundingClientRect();
    const y = (e.clientY || 0) - rect.top;
    if (running && y > rect.height * 0.6) setDuck(true);
    else jump();
  };
  const onUp = () => setDuck(false);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  document.getElementById('dn-start').addEventListener('click', (e) => { e.stopPropagation(); start(); });
  window._gameCleanup = () => {
    running = false;
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('keyup', onKeyUp);
  };

};
