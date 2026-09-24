/* =========================================================
   FaceTime App — Data Models
   ========================================================= */

/**
 * Contact Model
 * Represents a contact available for video calls
 */
class Contact {
  constructor({ id, name, avatar, status = 'available', phoneNumber = '' }) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.status = status; // 'available' | 'busy' | 'offline'
    this.phoneNumber = phoneNumber;
  }

  static fromJSON(json) {
    return new Contact(json);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      status: this.status,
      phoneNumber: this.phoneNumber
    };
  }
}

/**
 * CallSession Model
 * Represents an active or past call session
 */
class CallSession {
  constructor({ 
    id, 
    contactId, 
    contactName, 
    startTime, 
    endTime = null, 
    duration = 0, 
    type = 'outgoing', 
    localStream = null, 
    remoteStream = null 
  }) {
    this.id = id;
    this.contactId = contactId;
    this.contactName = contactName;
    this.startTime = startTime;
    this.endTime = endTime;
    this.duration = duration;
    this.type = type; // 'outgoing' | 'incoming' | 'missed'
    this.localStream = localStream;
    this.remoteStream = remoteStream;
  }

  isActive() {
    return this.endTime === null;
  }

  getDuration() {
    if (this.endTime) {
      return Math.floor((this.endTime - this.startTime) / 1000);
    }
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  end() {
    this.endTime = Date.now();
    this.duration = this.getDuration();
  }

  static fromJSON(json) {
    return new CallSession(json);
  }

  toJSON() {
    return {
      id: this.id,
      contactId: this.contactId,
      contactName: this.contactName,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      type: this.type
    };
  }
}

/**
 * CallHistoryEntry Model
 * Represents a call history record
 */
class CallHistoryEntry {
  constructor({ 
    id, 
    contactId, 
    contactName, 
    contactAvatar, 
    timestamp, 
    duration, 
    type, 
    date 
  }) {
    this.id = id;
    this.contactId = contactId;
    this.contactName = contactName;
    this.contactAvatar = contactAvatar;
    this.timestamp = timestamp;
    this.duration = duration;
    this.type = type; // 'outgoing' | 'incoming' | 'missed'
    this.date = date;
  }

  static fromJSON(json) {
    return new CallHistoryEntry(json);
  }

  toJSON() {
    return {
      id: this.id,
      contactId: this.contactId,
      contactName: this.contactName,
      contactAvatar: this.contactAvatar,
      timestamp: this.timestamp,
      duration: this.duration,
      type: this.type,
      date: this.date
    };
  }
}

// Export models
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Contact, CallSession, CallHistoryEntry };
}
