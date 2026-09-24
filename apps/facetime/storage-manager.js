/**
 * StorageManager - Handles persistent data storage for FaceTime app
 * Uses localStorage API for contacts, call history, and settings
 * 
 * Storage Keys:
 * - facetime_contacts: Array of contact objects
 * - facetime_history: Array of call history entries
 * - facetime_settings: Object of app settings
 * 
 * Requirements: 2.4, 8.6
 */

class StorageManager {
  constructor() {
    // Define storage keys as constants
    this.STORAGE_KEYS = {
      CONTACTS: 'facetime_contacts',
      HISTORY: 'facetime_history',
      SETTINGS: 'facetime_settings'
    };
    
    // Initialize storage if empty
    this._initializeStorage();
  }

  /**
   * Initialize storage with default values if keys don't exist
   * @private
   */
  _initializeStorage() {
    try {
      if (!localStorage.getItem(this.STORAGE_KEYS.CONTACTS)) {
        this.saveContacts([]);
      }
      if (!localStorage.getItem(this.STORAGE_KEYS.HISTORY)) {
        localStorage.setItem(this.STORAGE_KEYS.HISTORY, JSON.stringify([]));
      }
      if (!localStorage.getItem(this.STORAGE_KEYS.SETTINGS)) {
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify({}));
      }
    } catch (error) {
      console.error('[StorageManager] Failed to initialize storage:', error);
    }
  }

  /**
   * Serialize data to JSON string
   * @private
   * @param {*} data - Data to serialize
   * @returns {string} JSON string
   * @throws {Error} If serialization fails
   */
  _serialize(data) {
    try {
      return JSON.stringify(data);
    } catch (error) {
      throw new Error(`Failed to serialize data: ${error.message}`);
    }
  }

  /**
   * Deserialize JSON string to data
   * @private
   * @param {string} jsonString - JSON string to deserialize
   * @param {*} defaultValue - Default value if deserialization fails
   * @returns {*} Deserialized data or default value
   */
  _deserialize(jsonString, defaultValue = null) {
    try {
      return jsonString ? JSON.parse(jsonString) : defaultValue;
    } catch (error) {
      console.error('[StorageManager] Failed to deserialize data:', error);
      return defaultValue;
    }
  }

  /**
   * Store data in localStorage with error handling
   * @private
   * @param {string} key - Storage key
   * @param {*} data - Data to store
   * @throws {Error} If storage quota exceeded or other error
   */
  _store(key, data) {
    try {
      const serialized = this._serialize(data);
      localStorage.setItem(key, serialized);
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        throw new Error('Storage quota exceeded. Please clear some data and try again.');
      }
      throw new Error(`Failed to store data: ${error.message}`);
    }
  }

  /**
   * Retrieve data from localStorage
   * @private
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Retrieved data or default value
   */
  _retrieve(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return this._deserialize(data, defaultValue);
    } catch (error) {
      console.error(`[StorageManager] Failed to retrieve data for key ${key}:`, error);
      return defaultValue;
    }
  }

  // ========== CONTACTS MANAGEMENT ==========

  /**
   * Get all contacts from storage
   * @returns {Array} Array of contact objects
   */
  getContacts() {
    return this._retrieve(this.STORAGE_KEYS.CONTACTS, []);
  }

  /**
   * Save contacts list to storage
   * @param {Array} contacts - Array of contact objects
   * @throws {Error} If save fails or storage quota exceeded
   */
  saveContacts(contacts) {
    if (!Array.isArray(contacts)) {
      throw new Error('Contacts must be an array');
    }
    this._store(this.STORAGE_KEYS.CONTACTS, contacts);
  }

  /**
   * Add a single contact to storage
   * @param {Object} contact - Contact object to add
   * @param {string} contact.id - Unique contact ID
   * @param {string} contact.name - Contact name
   * @param {string} contact.avatar - Contact avatar (emoji or URL)
   * @param {string} contact.status - Contact status (available/busy/offline)
   * @returns {Object} The added contact
   * @throws {Error} If contact is invalid or already exists
   */
  addContact(contact) {
    if (!contact || typeof contact !== 'object') {
      throw new Error('Contact must be a valid object');
    }
    
    if (!contact.id || !contact.name) {
      throw new Error('Contact must have id and name properties');
    }

    const contacts = this.getContacts();
    
    // Check if contact already exists
    const existingIndex = contacts.findIndex(c => c.id === contact.id);
    if (existingIndex !== -1) {
      throw new Error(`Contact with id ${contact.id} already exists`);
    }

    // Add contact with default values
    const newContact = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar || '👤',
      status: contact.status || 'available',
      phoneNumber: contact.phoneNumber || ''
    };

    contacts.push(newContact);
    this.saveContacts(contacts);
    
    return newContact;
  }

  /**
   * Remove a contact from storage
   * @param {string} contactId - ID of contact to remove
   * @returns {boolean} True if contact was removed, false if not found
   */
  removeContact(contactId) {
    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    const contacts = this.getContacts();
    const initialLength = contacts.length;
    const filteredContacts = contacts.filter(c => c.id !== contactId);
    
    if (filteredContacts.length === initialLength) {
      return false; // Contact not found
    }

    this.saveContacts(filteredContacts);
    return true;
  }

  // ========== CALL HISTORY MANAGEMENT ==========

  /**
   * Get call history from storage
   * @returns {Array} Array of call history entry objects
   */
  getCallHistory() {
    return this._retrieve(this.STORAGE_KEYS.HISTORY, []);
  }

  /**
   * Add a call history entry
   * @param {Object} entry - Call history entry object
   * @param {string} entry.id - Unique entry ID
   * @param {string} entry.contactId - Contact ID
   * @param {string} entry.contactName - Contact name
   * @param {string} entry.contactAvatar - Contact avatar
   * @param {number} entry.timestamp - Unix timestamp
   * @param {number} entry.duration - Call duration in seconds
   * @param {string} entry.type - Call type (outgoing/incoming/missed)
   * @returns {Object} The added entry
   * @throws {Error} If entry is invalid
   */
  addCallHistoryEntry(entry) {
    if (!entry || typeof entry !== 'object') {
      throw new Error('Call history entry must be a valid object');
    }

    // Validate required fields
    const requiredFields = ['id', 'contactId', 'contactName', 'timestamp', 'type'];
    for (const field of requiredFields) {
      if (entry[field] === undefined || entry[field] === null) {
        throw new Error(`Call history entry must have ${field} property`);
      }
    }

    // Validate call type
    const validTypes = ['outgoing', 'incoming', 'missed'];
    if (!validTypes.includes(entry.type)) {
      throw new Error(`Call type must be one of: ${validTypes.join(', ')}`);
    }

    const history = this.getCallHistory();
    
    // Create entry with default values
    const newEntry = {
      id: entry.id,
      contactId: entry.contactId,
      contactName: entry.contactName,
      contactAvatar: entry.contactAvatar || '👤',
      timestamp: entry.timestamp,
      duration: entry.duration || 0,
      type: entry.type,
      date: new Date(entry.timestamp).toLocaleDateString()
    };

    // Add to beginning of history (most recent first)
    history.unshift(newEntry);
    
    this._store(this.STORAGE_KEYS.HISTORY, history);
    
    return newEntry;
  }

  /**
   * Clear all call history
   * @returns {boolean} True if cleared successfully
   */
  clearCallHistory() {
    try {
      this._store(this.STORAGE_KEYS.HISTORY, []);
      return true;
    } catch (error) {
      console.error('[StorageManager] Failed to clear call history:', error);
      return false;
    }
  }

  // ========== SETTINGS MANAGEMENT ==========

  /**
   * Get a setting value by key
   * @param {string} key - Setting key
   * @returns {*} Setting value or null if not found
   */
  getSetting(key) {
    if (!key) {
      throw new Error('Setting key is required');
    }

    const settings = this._retrieve(this.STORAGE_KEYS.SETTINGS, {});
    return settings[key] !== undefined ? settings[key] : null;
  }

  /**
   * Set a setting value by key
   * @param {string} key - Setting key
   * @param {*} value - Setting value
   * @throws {Error} If key is invalid or storage fails
   */
  setSetting(key, value) {
    if (!key) {
      throw new Error('Setting key is required');
    }

    const settings = this._retrieve(this.STORAGE_KEYS.SETTINGS, {});
    settings[key] = value;
    
    this._store(this.STORAGE_KEYS.SETTINGS, settings);
  }

  /**
   * Get all settings
   * @returns {Object} All settings as key-value pairs
   */
  getAllSettings() {
    return this._retrieve(this.STORAGE_KEYS.SETTINGS, {});
  }

  /**
   * Clear all settings
   * @returns {boolean} True if cleared successfully
   */
  clearAllSettings() {
    try {
      this._store(this.STORAGE_KEYS.SETTINGS, {});
      return true;
    } catch (error) {
      console.error('[StorageManager] Failed to clear settings:', error);
      return false;
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Check if storage is available
   * @returns {boolean} True if localStorage is available
   */
  static isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get storage usage information
   * @returns {Object} Storage usage stats
   */
  getStorageInfo() {
    try {
      const contacts = this._serialize(this.getContacts());
      const history = this._serialize(this.getCallHistory());
      const settings = this._serialize(this.getAllSettings());
      
      return {
        contactsSize: new Blob([contacts]).size,
        historySize: new Blob([history]).size,
        settingsSize: new Blob([settings]).size,
        totalSize: new Blob([contacts, history, settings]).size,
        contactsCount: this.getContacts().length,
        historyCount: this.getCallHistory().length
      };
    } catch (error) {
      console.error('[StorageManager] Failed to get storage info:', error);
      return null;
    }
  }

  /**
   * Clear all FaceTime data from storage
   * @returns {boolean} True if all data cleared successfully
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.CONTACTS);
      localStorage.removeItem(this.STORAGE_KEYS.HISTORY);
      localStorage.removeItem(this.STORAGE_KEYS.SETTINGS);
      this._initializeStorage();
      return true;
    } catch (error) {
      console.error('[StorageManager] Failed to clear all data:', error);
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}
