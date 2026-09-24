/* =========================================================
   FaceTime App — Main Module
   ========================================================= */

/**
 * FaceTime Application State
 */
const FaceTimeState = {
  // Application states: 'idle', 'requesting-permissions', 'calling', 'active', 'ending'
  state: 'idle',
  
  // Current active tab: 'recents' or 'contacts'
  activeTab: 'contacts',
  
  // Contacts list
  contacts: [],
  
  // Call history
  callHistory: [],
  
  // Search query
  searchQuery: '',
  
  // Current call session
  currentCall: null,
  
  // Media state
  isMuted: false,
  isCameraOff: false,
  currentCameraFacing: 'user', // 'user' (front) or 'environment' (back)
  
  // Available cameras
  availableCameras: [],
  
  // Call timer interval
  callTimerInterval: null
};

/**
 * Initialize FaceTime Application
 * @param {HTMLElement} container - Container element for the app
 */
function initFaceTimeApp(container) {
  // Load data from storage
  loadFaceTimeData();
  
  // Initialize default contacts if none exist
  if (FaceTimeState.contacts.length === 0) {
    initializeDefaultContacts();
  }
  
  // Render initial view
  renderFaceTimeApp(container);
}

/**
 * Load FaceTime data from localStorage
 */
function loadFaceTimeData() {
  try {
    const contactsData = localStorage.getItem('facetime_contacts');
    if (contactsData) {
      const parsed = JSON.parse(contactsData);
      FaceTimeState.contacts = parsed.map(c => Contact.fromJSON(c));
    }
    
    const historyData = localStorage.getItem('facetime_history');
    if (historyData) {
      const parsed = JSON.parse(historyData);
      FaceTimeState.callHistory = parsed.map(h => CallHistoryEntry.fromJSON(h));
    }
  } catch (error) {
    console.error('[FaceTime] Error loading data:', error);
  }
}

/**
 * Save FaceTime data to localStorage
 */
function saveFaceTimeData() {
  try {
    localStorage.setItem('facetime_contacts', JSON.stringify(
      FaceTimeState.contacts.map(c => c.toJSON())
    ));
    
    localStorage.setItem('facetime_history', JSON.stringify(
      FaceTimeState.callHistory.map(h => h.toJSON())
    ));
  } catch (error) {
    console.error('[FaceTime] Error saving data:', error);
  }
}

/**
 * Initialize default contacts for demo
 */
function initializeDefaultContacts() {
  FaceTimeState.contacts = [
    new Contact({
      id: generateId(),
      name: 'Алина',
      avatar: '👩',
      status: 'available',
      phoneNumber: '+998 90 123 4567'
    }),
    new Contact({
      id: generateId(),
      name: 'Дима',
      avatar: '👨',
      status: 'available',
      phoneNumber: '+998 91 234 5678'
    }),
    new Contact({
      id: generateId(),
      name: 'Мама',
      avatar: '👩‍🦳',
      status: 'available',
      phoneNumber: '+998 93 345 6789'
    }),
    new Contact({
      id: generateId(),
      name: 'Папа',
      avatar: '👨‍🦱',
      status: 'busy',
      phoneNumber: '+998 94 456 7890'
    }),
    new Contact({
      id: generateId(),
      name: 'Катя',
      avatar: '👧',
      status: 'offline',
      phoneNumber: '+998 95 567 8901'
    })
  ];
  
  saveFaceTimeData();
}

/**
 * Render FaceTime App UI
 * @param {HTMLElement} container - Container element
 */
function renderFaceTimeApp(container) {
  if (FaceTimeState.state === 'idle') {
    renderContactsView(container);
  } else if (FaceTimeState.state === 'calling') {
    renderCallingView(container);
  } else if (FaceTimeState.state === 'active') {
    renderActiveCallView(container);
  }
}

/**
 * Render Contacts View
 * @param {HTMLElement} container - Container element
 */
function renderContactsView(container) {
  const filteredContacts = filterContacts(FaceTimeState.contacts, FaceTimeState.searchQuery);
  
  container.innerHTML = `
    <div id="facetime-app" style="background:#000;height:100%;display:flex;flex-direction:column">
      <!-- Header -->
      <div style="padding:16px 16px 8px;background:#1c1c1e;border-bottom:1px solid #2c2c2e">
        <div style="display:flex;justify-content:center;gap:20px;margin-bottom:12px">
          <button 
            class="ft-tab ${FaceTimeState.activeTab === 'contacts' ? 'active' : ''}"
            onclick="switchFaceTimeTab('contacts')"
            style="background:none;border:none;color:${FaceTimeState.activeTab === 'contacts' ? '#fff' : 'rgba(255,255,255,0.5)'};font-size:15px;font-weight:600;padding:8px 16px;cursor:pointer;border-radius:8px;transition:all 0.2s"
          >
            Контакты
          </button>
          <button 
            class="ft-tab ${FaceTimeState.activeTab === 'recents' ? 'active' : ''}"
            onclick="switchFaceTimeTab('recents')"
            style="background:none;border:none;color:${FaceTimeState.activeTab === 'recents' ? '#fff' : 'rgba(255,255,255,0.5)'};font-size:15px;font-weight:600;padding:8px 16px;cursor:pointer;border-radius:8px;transition:all 0.2s"
          >
            Недавние
          </button>
        </div>
        <input 
          id="ft-search" 
          placeholder="Поиск" 
          value="${escapeHtml(FaceTimeState.searchQuery)}"
          oninput="handleFaceTimeSearch(this.value)"
          style="width:100%;background:#2c2c2e;border:none;border-radius:10px;padding:8px 12px;color:#fff;font-size:14px;outline:none"
        >
      </div>
      
      <!-- Content -->
      <div style="flex:1;overflow-y:auto">
        ${FaceTimeState.activeTab === 'contacts' ? renderContactsList(filteredContacts) : renderCallHistory()}
      </div>
    </div>
  `;
}

/**
 * Render contacts list
 * @param {Array} contacts - Filtered contacts array
 * @returns {string} HTML string
 */
function renderContactsList(contacts) {
  if (contacts.length === 0) {
    return `
      <div style="display:flex;align-items:center;justify-content:center;height:200px;color:rgba(255,255,255,0.5);font-size:15px">
        ${FaceTimeState.searchQuery ? 'Контакты не найдены' : 'Нет контактов'}
      </div>
    `;
  }
  
  return contacts.map(contact => `
    <div 
      onclick="selectContact('${contact.id}')"
      style="display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid #1c1c1e;cursor:pointer;gap:12px"
    >
      <div style="width:50px;height:50px;border-radius:50%;background:#2c2c2e;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">
        ${contact.avatar}
      </div>
      <div style="flex:1;overflow:hidden">
        <div style="color:#fff;font-size:16px;font-weight:600">${escapeHtml(contact.name)}</div>
        <div style="color:rgba(255,255,255,0.4);font-size:13px">${escapeHtml(contact.phoneNumber)}</div>
      </div>
      <button 
        onclick="event.stopPropagation();initiateCall('${contact.id}')"
        style="width:40px;height:40px;border-radius:50%;background:#30d158;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0"
        aria-label="Видеозвонок"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * Render call history
 * @returns {string} HTML string
 */
function renderCallHistory() {
  if (FaceTimeState.callHistory.length === 0) {
    return `
      <div style="display:flex;align-items:center;justify-content:center;height:200px;color:rgba(255,255,255,0.5);font-size:15px">
        Нет недавних звонков
      </div>
    `;
  }
  
  // Sort by timestamp descending
  const sorted = [...FaceTimeState.callHistory].sort((a, b) => b.timestamp - a.timestamp);
  
  return sorted.map(entry => `
    <div 
      onclick="selectContact('${entry.contactId}')"
      style="display:flex;align-items:center;padding:14px 16px;border-bottom:1px solid #1c1c1e;cursor:pointer;gap:12px"
    >
      <div style="width:50px;height:50px;border-radius:50%;background:#2c2c2e;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0">
        ${entry.contactAvatar}
      </div>
      <div style="flex:1;overflow:hidden">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="color:${getCallTypeColor(entry.type)};font-size:14px">${getCallTypeIcon(entry.type)}</span>
          <span style="color:#fff;font-size:16px;font-weight:600">${escapeHtml(entry.contactName)}</span>
        </div>
        <div style="color:rgba(255,255,255,0.4);font-size:13px">
          ${entry.date} в ${formatTime(entry.timestamp)} • ${formatCallDuration(entry.duration)}
        </div>
      </div>
      <button 
        onclick="event.stopPropagation();initiateCall('${entry.contactId}')"
        style="width:32px;height:32px;border-radius:50%;background:none;border:1px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0"
        aria-label="Перезвонить"
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#007AFF">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
      </button>
    </div>
  `).join('');
}

/**
 * Switch between tabs
 * @param {string} tab - Tab name ('contacts' or 'recents')
 */
function switchFaceTimeTab(tab) {
  FaceTimeState.activeTab = tab;
  const container = document.getElementById('app-content');
  if (container) {
    renderFaceTimeApp(container);
  }
}

/**
 * Handle search input
 * @param {string} query - Search query
 */
function handleFaceTimeSearch(query) {
  FaceTimeState.searchQuery = query;
  const container = document.getElementById('app-content');
  if (container) {
    renderFaceTimeApp(container);
  }
}

/**
 * Select contact (show contact details - placeholder for now)
 * @param {string} contactId - Contact ID
 */
function selectContact(contactId) {
  const contact = FaceTimeState.contacts.find(c => c.id === contactId);
  if (!contact) return;
  
  // For now, just initiate call
  initiateCall(contactId);
}

/**
 * Initiate video call
 * @param {string} contactId - Contact ID
 */
function initiateCall(contactId) {
  const contact = FaceTimeState.contacts.find(c => c.id === contactId);
  if (!contact) {
    console.error('[FaceTime] Contact not found:', contactId);
    return;
  }
  
  // Create call session
  FaceTimeState.currentCall = new CallSession({
    id: generateId(),
    contactId: contact.id,
    contactName: contact.name,
    startTime: Date.now(),
    type: 'outgoing'
  });
  
  FaceTimeState.state = 'calling';
  
  const container = document.getElementById('app-content');
  if (container) {
    renderFaceTimeApp(container);
  }
  
  // Simulate call connection after 2-3 seconds
  setTimeout(() => {
    if (FaceTimeState.state === 'calling') {
      startActiveCall();
    }
  }, 2000 + Math.random() * 1000);
}

/**
 * Render calling view (waiting for connection)
 * @param {HTMLElement} container - Container element
 */
function renderCallingView(container) {
  const contact = FaceTimeState.contacts.find(c => c.id === FaceTimeState.currentCall.contactId);
  if (!contact) return;
  
  container.innerHTML = `
    <div id="facetime-calling" style="background:#000;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative">
      <div style="font-size:80px;margin-bottom:20px">${contact.avatar}</div>
      <div style="color:#fff;font-size:28px;font-weight:600;margin-bottom:8px">${escapeHtml(contact.name)}</div>
      <div style="color:rgba(255,255,255,0.6);font-size:17px">Звоним...</div>
      
      <!-- Animated rings -->
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:200px;height:200px;pointer-events:none">
        <div class="call-ring" style="position:absolute;width:100%;height:100%;border:2px solid rgba(48,209,88,0.3);border-radius:50%;animation:pulse 1.5s ease-out infinite"></div>
        <div class="call-ring" style="position:absolute;width:100%;height:100%;border:2px solid rgba(48,209,88,0.3);border-radius:50%;animation:pulse 1.5s ease-out 0.5s infinite"></div>
      </div>
      
      <!-- Cancel button -->
      <button 
        onclick="cancelCall()"
        style="position:absolute;bottom:80px;width:64px;height:64px;border-radius:50%;background:#ff3b30;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer"
        aria-label="Отменить"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>
    </div>
    
    <style>
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    </style>
  `;
}

/**
 * Start active call
 */
function startActiveCall() {
  FaceTimeState.state = 'active';
  
  const container = document.getElementById('app-content');
  if (container) {
    renderFaceTimeApp(container);
  }
  
  // Start call timer
  startCallTimer();
}

/**
 * Start call timer
 */
function startCallTimer() {
  if (FaceTimeState.callTimerInterval) {
    clearInterval(FaceTimeState.callTimerInterval);
  }
  
  FaceTimeState.callTimerInterval = setInterval(() => {
    updateCallTimer();
  }, 1000);
}

/**
 * Update call timer display
 */
function updateCallTimer() {
  const timerEl = document.getElementById('call-timer');
  if (timerEl && FaceTimeState.currentCall) {
    const duration = FaceTimeState.currentCall.getDuration();
    timerEl.textContent = formatCallDuration(duration);
  }
}

/**
 * Cancel call
 */
function cancelCall() {
  endCall();
}

/**
 * End active call
 */
function endCall() {
  // Stop call timer
  if (FaceTimeState.callTimerInterval) {
    clearInterval(FaceTimeState.callTimerInterval);
    FaceTimeState.callTimerInterval = null;
  }
  
  // Save to history if call was active
  if (FaceTimeState.currentCall && FaceTimeState.state === 'active') {
    FaceTimeState.currentCall.end();
    
    const contact = FaceTimeState.contacts.find(c => c.id === FaceTimeState.currentCall.contactId);
    if (contact) {
      const historyEntry = new CallHistoryEntry({
        id: generateId(),
        contactId: contact.id,
        contactName: contact.name,
        contactAvatar: contact.avatar,
        timestamp: FaceTimeState.currentCall.startTime,
        duration: FaceTimeState.currentCall.duration,
        type: FaceTimeState.currentCall.type,
        date: formatDate(FaceTimeState.currentCall.startTime)
      });
      
      FaceTimeState.callHistory.push(historyEntry);
      saveFaceTimeData();
    }
  }
  
  // Reset state
  FaceTimeState.currentCall = null;
  FaceTimeState.state = 'idle';
  FaceTimeState.isMuted = false;
  FaceTimeState.isCameraOff = false;
  
  const container = document.getElementById('app-content');
  if (container) {
    renderFaceTimeApp(container);
  }
}

/**
 * Render active call view (placeholder)
 * @param {HTMLElement} container - Container element
 */
function renderActiveCallView(container) {
  const contact = FaceTimeState.contacts.find(c => c.id === FaceTimeState.currentCall.contactId);
  if (!contact) return;
  
  container.innerHTML = `
    <div id="facetime-active" style="background:#000;height:100%;display:flex;flex-direction:column;position:relative">
      <!-- Contact info overlay -->
      <div style="position:absolute;top:20px;left:50%;transform:translateX(-50%);z-index:10;text-align:center">
        <div style="color:#fff;font-size:20px;font-weight:600;text-shadow:0 1px 4px rgba(0,0,0,0.5)">${escapeHtml(contact.name)}</div>
        <div id="call-timer" style="color:rgba(255,255,255,0.8);font-size:15px;margin-top:4px;text-shadow:0 1px 4px rgba(0,0,0,0.5)">0:00</div>
      </div>
      
      <!-- Remote video placeholder -->
      <div style="flex:1;background:#1c1c1e;display:flex;align-items:center;justify-content:center;position:relative">
        <div style="font-size:120px">${contact.avatar}</div>
        <div style="position:absolute;bottom:0;left:0;right:0;text-align:center;padding:20px;color:rgba(255,255,255,0.6);font-size:15px">
          Ожидание видео...
        </div>
      </div>
      
      <!-- Local video preview (PIP) -->
      <div id="local-video-pip" style="position:absolute;top:80px;right:16px;width:100px;height:133px;background:#2c2c2e;border-radius:12px;overflow:hidden;border:2px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:40px">
        👤
      </div>
      
      <!-- Media controls -->
      <div style="padding:30px 20px 40px;background:linear-gradient(to top, rgba(0,0,0,0.8), transparent);position:absolute;bottom:0;left:0;right:0">
        <div style="display:flex;justify-content:space-around;align-items:center">
          <!-- Mute button -->
          <button 
            onclick="toggleMute()"
            style="width:56px;height:56px;border-radius:50%;background:${FaceTimeState.isMuted ? '#ff3b30' : 'rgba(255,255,255,0.2)'};border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(20px)"
            aria-label="${FaceTimeState.isMuted ? 'Включить микрофон' : 'Выключить микрофон'}"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
              ${FaceTimeState.isMuted 
                ? '<path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v.18l5.98 5.99zM4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c.91-.13 1.77-.45 2.54-.9L19.73 21 21 19.73 4.27 3z"/>'
                : '<path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>'
              }
            </svg>
          </button>
          
          <!-- Camera off button -->
          <button 
            onclick="toggleCamera()"
            style="width:56px;height:56px;border-radius:50%;background:${FaceTimeState.isCameraOff ? '#ff3b30' : 'rgba(255,255,255,0.2)'};border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(20px)"
            aria-label="${FaceTimeState.isCameraOff ? 'Включить камеру' : 'Выключить камеру'}"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
              ${FaceTimeState.isCameraOff
                ? '<path d="M21 6.5l-4 4V7c0-.55-.45-1-1-1H9.82L21 17.18V6.5zM3.27 2L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.54-.18L19.73 21 21 19.73 3.27 2z"/>'
                : '<path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>'
              }
            </svg>
          </button>
          
          <!-- End call button -->
          <button 
            onclick="endCall()"
            style="width:64px;height:64px;border-radius:50%;background:#ff3b30;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer"
            aria-label="Завершить звонок"
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
              <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.68-1.36-2.66-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z"/>
            </svg>
          </button>
          
          <!-- Camera switch button -->
          <button 
            onclick="switchCamera()"
            style="width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.2);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(20px)"
            aria-label="Переключить камеру"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
              <path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 11.5V13H9v2.5L5.5 12 9 8.5V11h6V8.5l3.5 3.5-3.5 3.5z"/>
            </svg>
          </button>
          
          <!-- Placeholder button -->
          <div style="width:56px;height:56px"></div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Toggle mute state
 */
function toggleMute() {
  FaceTimeState.isMuted = !FaceTimeState.isMuted;
  const container = document.getElementById('app-content');
  if (container && FaceTimeState.state === 'active') {
    renderActiveCallView(container);
  }
}

/**
 * Toggle camera state
 */
function toggleCamera() {
  FaceTimeState.isCameraOff = !FaceTimeState.isCameraOff;
  const container = document.getElementById('app-content');
  if (container && FaceTimeState.state === 'active') {
    renderActiveCallView(container);
  }
}

/**
 * Switch camera (front/back)
 */
function switchCamera() {
  FaceTimeState.currentCameraFacing = FaceTimeState.currentCameraFacing === 'user' ? 'environment' : 'user';
  // In a real implementation, this would switch the camera device
  console.log('[FaceTime] Switched to', FaceTimeState.currentCameraFacing, 'camera');
}

// Make functions globally available for onclick handlers
if (typeof window !== 'undefined') {
  window.switchFaceTimeTab = switchFaceTimeTab;
  window.handleFaceTimeSearch = handleFaceTimeSearch;
  window.selectContact = selectContact;
  window.initiateCall = initiateCall;
  window.cancelCall = cancelCall;
  window.endCall = endCall;
  window.toggleMute = toggleMute;
  window.toggleCamera = toggleCamera;
  window.switchCamera = switchCamera;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initFaceTimeApp,
    FaceTimeState
  };
}
