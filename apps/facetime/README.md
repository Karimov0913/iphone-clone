# FaceTime App - Project Structure

## Overview
WebRTC-powered FaceTime application for iPhone 16 Pro Max simulator.

## Directory Structure
```
apps/facetime/
├── facetime-models.js      # Data models (Contact, CallSession, CallHistoryEntry)
├── facetime-utils.js       # Utility functions (time formatting, validation, filtering)
├── facetime-app.js         # Main application logic and UI rendering
├── facetime-styles.css     # Application styles
└── README.md              # This file
```

## Files Created

### 1. facetime-models.js
Defines three core data models:
- **Contact**: Represents a contact with id, name, avatar, status, phoneNumber
- **CallSession**: Represents an active/past call session with streams and metadata
- **CallHistoryEntry**: Represents a call history record

Each model includes:
- Constructor with validation
- `fromJSON()` static method for deserialization
- `toJSON()` method for serialization

### 2. facetime-utils.js
Utility functions for:
- **Time formatting**: `formatCallDuration()`, `formatDate()`, `formatTime()`
- **Validation**: `validateContact()`, `validatePhoneNumber()`
- **Helpers**: `generateId()`, `debounce()`, `filterContacts()`
- **UI helpers**: `getCallTypeIcon()`, `getCallTypeColor()`
- **Security**: `escapeHtml()` to prevent XSS

### 3. facetime-app.js
Main application module:
- **FaceTimeState**: Central state object managing app state
- **initFaceTimeApp()**: Initialization function
- **Storage functions**: Load/save contacts and history to localStorage
- **UI rendering**: Contact list, call history, calling view, active call view
- **Event handlers**: Tab switching, search, call initiation, media controls

Features implemented:
- Contact list with search functionality
- Call history (recents) view
- Calling screen with animated rings
- Active call interface with media controls (mute, camera, switch, end)
- Demo mode with simulated call connection
- Call timer with live updates
- LocalStorage persistence

### 4. facetime-styles.css
CSS styles for:
- Tab navigation
- Contact list items
- Call animations (pulse effect)
- Media controls
- Local video PIP (picture-in-picture)
- Accessibility features (focus states, reduced motion)
- Responsive design

## Integration

### In apps.js
Added FaceTime renderer to `APP_RENDERERS` object:
```javascript
APP_RENDERERS.facetime = function(container) {
  initFaceTimeApp(container);
};
```

### In iphone.html
Added script and style includes:
```html
<!-- CSS -->
<link rel="stylesheet" href="apps/facetime/facetime-styles.css">

<!-- Scripts (order matters) -->
<script src="apps/facetime/facetime-models.js"></script>
<script src="apps/facetime/facetime-utils.js"></script>
<script src="apps/facetime/facetime-app.js"></script>
```

## Requirements Validated

This implementation satisfies:
- **Requirement 13.1**: Integration with existing simulator infrastructure
- **Requirement 13.3**: Modular structure with proper exports/imports
- **Requirement 13.5**: Data models defined in separate module

## Current State

✅ Project structure created
✅ Data models defined (Contact, CallSession, CallHistoryEntry)
✅ Utility functions implemented
✅ Main app module with UI rendering
✅ Styles created with iOS design patterns
✅ Registered in APP_RENDERERS
✅ Integrated into HTML

## Demo Features

Default contacts initialized:
- Алина 👩
- Дима 👨
- Мама 👩‍🦳
- Папа 👨‍🦱
- Катя 👧

Call simulation:
- 2-3 second connection delay
- Call timer with proper formatting
- Media controls (mute, camera, switch)
- Call history persistence

## Next Steps

Future tasks will implement:
- WebRTC media access (camera/microphone)
- Real video streaming
- Camera switching functionality
- Virtual peer system for demo mode
- Full error handling
- Permission management
