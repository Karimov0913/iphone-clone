/* =========================================================
   FaceTime App — Utility Functions
   ========================================================= */

/**
 * Format call duration in MM:SS or H:MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time string
 */
function formatCallDuration(seconds) {
  if (seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format timestamp to readable date string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date >= today) {
    return 'Сегодня';
  } else if (date >= yesterday) {
    return 'Вчера';
  } else {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

/**
 * Format time from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time string (HH:MM)
 */
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Validate contact object
 * @param {Object} contact - Contact object to validate
 * @returns {boolean} True if valid
 */
function validateContact(contact) {
  return (
    contact &&
    typeof contact.id === 'string' &&
    contact.id.length > 0 &&
    typeof contact.name === 'string' &&
    contact.name.length > 0 &&
    typeof contact.avatar === 'string'
  );
}

/**
 * Validate phone number format
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean} True if valid format
 */
function validatePhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== 'string') return false;
  // Simple validation: allow digits, spaces, +, -, (, )
  const phoneRegex = /^[\d\s+\-()]+$/;
  return phoneRegex.test(phoneNumber) && phoneNumber.replace(/\D/g, '').length >= 7;
}

/**
 * Generate unique ID
 * @returns {string} Unique identifier
 */
function generateId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Filter contacts by search query
 * @param {Array} contacts - Array of contact objects
 * @param {string} query - Search query
 * @returns {Array} Filtered contacts
 */
function filterContacts(contacts, query) {
  if (!query || query.trim() === '') {
    return contacts;
  }
  
  const lowerQuery = query.toLowerCase().trim();
  return contacts.filter(contact => 
    contact.name.toLowerCase().includes(lowerQuery) ||
    (contact.phoneNumber && contact.phoneNumber.includes(lowerQuery))
  );
}

/**
 * Get call type icon
 * @param {string} type - Call type ('outgoing' | 'incoming' | 'missed')
 * @returns {string} Icon/emoji for call type
 */
function getCallTypeIcon(type) {
  switch (type) {
    case 'outgoing':
      return '📤';
    case 'incoming':
      return '📲';
    case 'missed':
      return '📵';
    default:
      return '📞';
  }
}

/**
 * Get call type color
 * @param {string} type - Call type
 * @returns {string} CSS color value
 */
function getCallTypeColor(type) {
  switch (type) {
    case 'missed':
      return '#ff3b30';
    case 'incoming':
      return '#30d158';
    case 'outgoing':
      return '#007AFF';
    default:
      return '#8e8e93';
  }
}

/**
 * Clamp number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatCallDuration,
    formatDate,
    formatTime,
    validateContact,
    validatePhoneNumber,
    generateId,
    debounce,
    filterContacts,
    getCallTypeIcon,
    getCallTypeColor,
    clamp,
    escapeHtml
  };
}
