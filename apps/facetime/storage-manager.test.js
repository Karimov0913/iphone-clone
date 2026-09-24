/**
 * Unit tests for StorageManager
 * Tests all core functionality including contacts, call history, and settings management
 */

// Mock localStorage for testing environment
const createLocalStorageMock = () => {
  let store = {};
  
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
};

// Setup global localStorage mock if not available
if (typeof localStorage === 'undefined') {
  global.localStorage = createLocalStorageMock();
}

// Import StorageManager (adjust path if needed)
let StorageManager;
try {
  StorageManager = require('./storage-manager.js');
} catch (e) {
  // If module system not available, assume it's loaded in browser
  if (typeof window !== 'undefined' && window.StorageManager) {
    StorageManager = window.StorageManager;
  } else {
    console.error('StorageManager not found. Make sure it is loaded.');
  }
}

// Test suite
describe('StorageManager', () => {
  let storageManager;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    storageManager = new StorageManager();
  });

  // ========== INITIALIZATION TESTS ==========
  
  describe('Initialization', () => {
    test('should initialize with empty arrays and objects', () => {
      expect(storageManager.getContacts()).toEqual([]);
      expect(storageManager.getCallHistory()).toEqual([]);
      expect(storageManager.getAllSettings()).toEqual({});
    });

    test('should define storage keys correctly', () => {
      expect(storageManager.STORAGE_KEYS.CONTACTS).toBe('facetime_contacts');
      expect(storageManager.STORAGE_KEYS.HISTORY).toBe('facetime_history');
      expect(storageManager.STORAGE_KEYS.SETTINGS).toBe('facetime_settings');
    });
  });

  // ========== CONTACTS TESTS ==========

  describe('Contacts Management', () => {
    test('getContacts should return empty array initially', () => {
      const contacts = storageManager.getContacts();
      expect(Array.isArray(contacts)).toBe(true);
      expect(contacts.length).toBe(0);
    });

    test('saveContacts should store contacts array', () => {
      const contacts = [
        { id: '1', name: 'John Doe', avatar: '👨', status: 'available' },
        { id: '2', name: 'Jane Smith', avatar: '👩', status: 'busy' }
      ];
      
      storageManager.saveContacts(contacts);
      const retrieved = storageManager.getContacts();
      
      expect(retrieved).toEqual(contacts);
      expect(retrieved.length).toBe(2);
    });

    test('saveContacts should throw error for non-array input', () => {
      expect(() => {
        storageManager.saveContacts('not an array');
      }).toThrow('Contacts must be an array');
    });

    test('addContact should add a new contact', () => {
      const contact = {
        id: '1',
        name: 'Alice Johnson',
        avatar: '👧',
        status: 'available'
      };
      
      const added = storageManager.addContact(contact);
      const contacts = storageManager.getContacts();
      
      expect(added).toEqual(contact);
      expect(contacts.length).toBe(1);
      expect(contacts[0]).toEqual(contact);
    });

    test('addContact should add default values for missing fields', () => {
      const contact = {
        id: '1',
        name: 'Bob'
      };
      
      const added = storageManager.addContact(contact);
      
      expect(added.avatar).toBe('👤');
      expect(added.status).toBe('available');
      expect(added.phoneNumber).toBe('');
    });

    test('addContact should throw error for duplicate ID', () => {
      const contact = { id: '1', name: 'Test' };
      
      storageManager.addContact(contact);
      
      expect(() => {
        storageManager.addContact(contact);
      }).toThrow('Contact with id 1 already exists');
    });

    test('addContact should throw error for invalid contact', () => {
      expect(() => {
        storageManager.addContact(null);
      }).toThrow('Contact must be a valid object');

      expect(() => {
        storageManager.addContact({ id: '1' }); // missing name
      }).toThrow('Contact must have id and name properties');
    });

    test('removeContact should remove existing contact', () => {
      storageManager.addContact({ id: '1', name: 'Test 1' });
      storageManager.addContact({ id: '2', name: 'Test 2' });
      
      const removed = storageManager.removeContact('1');
      const contacts = storageManager.getContacts();
      
      expect(removed).toBe(true);
      expect(contacts.length).toBe(1);
      expect(contacts[0].id).toBe('2');
    });

    test('removeContact should return false for non-existent contact', () => {
      const removed = storageManager.removeContact('999');
      expect(removed).toBe(false);
    });

    test('removeContact should throw error for missing ID', () => {
      expect(() => {
        storageManager.removeContact();
      }).toThrow('Contact ID is required');
    });
  });

  // ========== CALL HISTORY TESTS ==========

  describe('Call History Management', () => {
    test('getCallHistory should return empty array initially', () => {
      const history = storageManager.getCallHistory();
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBe(0);
    });

    test('addCallHistoryEntry should add a valid entry', () => {
      const entry = {
        id: '1',
        contactId: 'c1',
        contactName: 'John Doe',
        contactAvatar: '👨',
        timestamp: Date.now(),
        duration: 120,
        type: 'outgoing'
      };
      
      const added = storageManager.addCallHistoryEntry(entry);
      const history = storageManager.getCallHistory();
      
      expect(history.length).toBe(1);
      expect(history[0].id).toBe('1');
      expect(history[0].duration).toBe(120);
      expect(history[0].type).toBe('outgoing');
      expect(added.date).toBeDefined();
    });

    test('addCallHistoryEntry should add entries in reverse chronological order', () => {
      const entry1 = {
        id: '1',
        contactId: 'c1',
        contactName: 'First',
        timestamp: 1000,
        type: 'outgoing'
      };
      
      const entry2 = {
        id: '2',
        contactId: 'c2',
        contactName: 'Second',
        timestamp: 2000,
        type: 'incoming'
      };
      
      storageManager.addCallHistoryEntry(entry1);
      storageManager.addCallHistoryEntry(entry2);
      
      const history = storageManager.getCallHistory();
      
      expect(history[0].id).toBe('2'); // Most recent first
      expect(history[1].id).toBe('1');
    });

    test('addCallHistoryEntry should set default duration to 0', () => {
      const entry = {
        id: '1',
        contactId: 'c1',
        contactName: 'Test',
        timestamp: Date.now(),
        type: 'missed'
      };
      
      const added = storageManager.addCallHistoryEntry(entry);
      expect(added.duration).toBe(0);
    });

    test('addCallHistoryEntry should throw error for invalid type', () => {
      const entry = {
        id: '1',
        contactId: 'c1',
        contactName: 'Test',
        timestamp: Date.now(),
        type: 'invalid_type'
      };
      
      expect(() => {
        storageManager.addCallHistoryEntry(entry);
      }).toThrow('Call type must be one of: outgoing, incoming, missed');
    });

    test('addCallHistoryEntry should throw error for missing required fields', () => {
      const invalidEntry = {
        id: '1',
        contactName: 'Test'
        // missing contactId, timestamp, type
      };
      
      expect(() => {
        storageManager.addCallHistoryEntry(invalidEntry);
      }).toThrow();
    });

    test('clearCallHistory should remove all entries', () => {
      storageManager.addCallHistoryEntry({
        id: '1',
        contactId: 'c1',
        contactName: 'Test',
        timestamp: Date.now(),
        type: 'outgoing'
      });
      
      const cleared = storageManager.clearCallHistory();
      const history = storageManager.getCallHistory();
      
      expect(cleared).toBe(true);
      expect(history.length).toBe(0);
    });
  });

  // ========== SETTINGS TESTS ==========

  describe('Settings Management', () => {
    test('getSetting should return null for non-existent key', () => {
      const value = storageManager.getSetting('nonexistent');
      expect(value).toBeNull();
    });

    test('setSetting should store and retrieve setting', () => {
      storageManager.setSetting('theme', 'dark');
      const value = storageManager.getSetting('theme');
      
      expect(value).toBe('dark');
    });

    test('setSetting should handle different data types', () => {
      storageManager.setSetting('count', 42);
      storageManager.setSetting('enabled', true);
      storageManager.setSetting('config', { key: 'value' });
      storageManager.setSetting('list', [1, 2, 3]);
      
      expect(storageManager.getSetting('count')).toBe(42);
      expect(storageManager.getSetting('enabled')).toBe(true);
      expect(storageManager.getSetting('config')).toEqual({ key: 'value' });
      expect(storageManager.getSetting('list')).toEqual([1, 2, 3]);
    });

    test('setSetting should throw error for missing key', () => {
      expect(() => {
        storageManager.setSetting('', 'value');
      }).toThrow('Setting key is required');
    });

    test('getAllSettings should return all settings', () => {
      storageManager.setSetting('setting1', 'value1');
      storageManager.setSetting('setting2', 'value2');
      
      const allSettings = storageManager.getAllSettings();
      
      expect(allSettings).toEqual({
        setting1: 'value1',
        setting2: 'value2'
      });
    });

    test('clearAllSettings should remove all settings', () => {
      storageManager.setSetting('test', 'value');
      
      const cleared = storageManager.clearAllSettings();
      const allSettings = storageManager.getAllSettings();
      
      expect(cleared).toBe(true);
      expect(allSettings).toEqual({});
    });
  });

  // ========== UTILITY TESTS ==========

  describe('Utility Methods', () => {
    test('isStorageAvailable should return true when localStorage works', () => {
      expect(StorageManager.isStorageAvailable()).toBe(true);
    });

    test('getStorageInfo should return usage statistics', () => {
      storageManager.addContact({ id: '1', name: 'Test' });
      storageManager.addCallHistoryEntry({
        id: '1',
        contactId: 'c1',
        contactName: 'Test',
        timestamp: Date.now(),
        type: 'outgoing'
      });
      
      const info = storageManager.getStorageInfo();
      
      expect(info).toBeDefined();
      expect(info.contactsCount).toBe(1);
      expect(info.historyCount).toBe(1);
      expect(info.totalSize).toBeGreaterThan(0);
    });

    test('clearAllData should remove all FaceTime data', () => {
      storageManager.addContact({ id: '1', name: 'Test' });
      storageManager.setSetting('test', 'value');
      
      const cleared = storageManager.clearAllData();
      
      expect(cleared).toBe(true);
      expect(storageManager.getContacts()).toEqual([]);
      expect(storageManager.getAllSettings()).toEqual({});
    });
  });

  // ========== PERSISTENCE TESTS ==========

  describe('Storage Persistence', () => {
    test('data should persist across StorageManager instances', () => {
      const manager1 = new StorageManager();
      manager1.addContact({ id: '1', name: 'Test' });
      
      const manager2 = new StorageManager();
      const contacts = manager2.getContacts();
      
      expect(contacts.length).toBe(1);
      expect(contacts[0].name).toBe('Test');
    });

    test('contacts round-trip should preserve data', () => {
      const originalContacts = [
        { id: '1', name: 'Alice', avatar: '👧', status: 'available', phoneNumber: '123' },
        { id: '2', name: 'Bob', avatar: '👦', status: 'busy', phoneNumber: '456' }
      ];
      
      storageManager.saveContacts(originalContacts);
      const retrieved = storageManager.getContacts();
      
      expect(retrieved).toEqual(originalContacts);
    });
  });
});

// Run tests if in Node.js environment with test runner
if (typeof module !== 'undefined' && module.exports) {
  console.log('StorageManager tests loaded. Run with Jest or similar test runner.');
}
