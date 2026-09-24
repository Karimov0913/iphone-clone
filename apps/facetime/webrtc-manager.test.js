/* =========================================================
   FaceTime App — WebRTC Manager Tests
   ========================================================= */

/**
 * Mock getUserMedia for testing
 */
class MockMediaStreamTrack {
  constructor(kind, settings = {}) {
    this.kind = kind;
    this.label = `${kind} track`;
    this.readyState = 'live';
    this.enabled = true;
    this._settings = {
      deviceId: settings.deviceId || 'mock-device-id',
      facingMode: settings.facingMode || 'user',
      width: settings.width || 1280,
      height: settings.height || 720,
      frameRate: settings.frameRate || 30,
      ...settings
    };
  }

  getSettings() {
    return { ...this._settings };
  }

  stop() {
    this.readyState = 'ended';
  }
}

class MockMediaStream {
  constructor(tracks = []) {
    this.id = `mock-stream-${Math.random().toString(36).substr(2, 9)}`;
    this._tracks = tracks;
  }

  getTracks() {
    return [...this._tracks];
  }

  getVideoTracks() {
    return this._tracks.filter(t => t.kind === 'video');
  }

  getAudioTracks() {
    return this._tracks.filter(t => t.kind === 'audio');
  }

  addTrack(track) {
    this._tracks.push(track);
  }

  removeTrack(track) {
    const index = this._tracks.indexOf(track);
    if (index > -1) {
      this._tracks.splice(index, 1);
    }
  }
}

/**
 * Setup mock navigator.mediaDevices
 */
function setupMockMediaDevices() {
  const mockDevices = [
    {
      deviceId: 'front-camera-id',
      kind: 'videoinput',
      label: 'Front Camera',
      groupId: 'group1'
    },
    {
      deviceId: 'back-camera-id',
      kind: 'videoinput',
      label: 'Back Camera',
      groupId: 'group1'
    },
    {
      deviceId: 'microphone-id',
      kind: 'audioinput',
      label: 'Microphone',
      groupId: 'group2'
    }
  ];

  global.navigator = {
    mediaDevices: {
      getUserMedia: async (constraints) => {
        // Simulate permission grant
        const videoTrack = new MockMediaStreamTrack('video', {
          deviceId: constraints.video.deviceId?.exact || 'front-camera-id',
          facingMode: constraints.video.facingMode || 'user',
          width: constraints.video.width?.ideal || 1280,
          height: constraints.video.height?.ideal || 720,
          frameRate: constraints.video.frameRate?.ideal || 30
        });

        const audioTrack = new MockMediaStreamTrack('audio', {
          deviceId: 'microphone-id'
        });

        return new MockMediaStream([videoTrack, audioTrack]);
      },
      enumerateDevices: async () => {
        return mockDevices;
      }
    }
  };
}

/**
 * Setup mock for permission denied scenario
 */
function setupPermissionDeniedMock() {
  global.navigator = {
    mediaDevices: {
      getUserMedia: async () => {
        const error = new Error('Permission denied');
        error.name = 'NotAllowedError';
        throw error;
      },
      enumerateDevices: async () => []
    }
  };
}

/**
 * Setup mock for device not found scenario
 */
function setupDeviceNotFoundMock() {
  global.navigator = {
    mediaDevices: {
      getUserMedia: async () => {
        const error = new Error('Device not found');
        error.name = 'NotFoundError';
        throw error;
      },
      enumerateDevices: async () => []
    }
  };
}

/**
 * Test Suite for WebRTCManager
 */
async function runWebRTCManagerTests() {
  console.log('====================================');
  console.log('WebRTCManager Test Suite');
  console.log('====================================\n');

  let passedTests = 0;
  let failedTests = 0;

  // Helper function to run a test
  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passedTests++;
    } catch (error) {
      console.error(`✗ ${name}`);
      console.error(`  Error: ${error.message}`);
      failedTests++;
    }
  }

  // Test 1: Constructor initializes properly
  await test('Constructor initializes with default values', async () => {
    const manager = new WebRTCManager();
    
    if (manager.localStream !== null) throw new Error('localStream should be null');
    if (manager.remoteStream !== null) throw new Error('remoteStream should be null');
    if (manager.availableCameras.length !== 0) throw new Error('availableCameras should be empty');
    if (manager.currentCameraId !== null) throw new Error('currentCameraId should be null');
    if (manager.currentFacingMode !== 'user') throw new Error('currentFacingMode should be "user"');
  });

  // Test 2: requestMediaAccess with permission granted
  await test('requestMediaAccess successfully acquires media stream', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    const stream = await manager.requestMediaAccess();
    
    if (!stream) throw new Error('Stream should not be null');
    if (stream.getVideoTracks().length === 0) throw new Error('Stream should have video track');
    if (stream.getAudioTracks().length === 0) throw new Error('Stream should have audio track');
    if (!manager.getLocalStream()) throw new Error('Local stream should be set');
  });

  // Test 3: requestMediaAccess with permission denied
  await test('requestMediaAccess throws PermissionDeniedError when denied', async () => {
    setupPermissionDeniedMock();
    const manager = new WebRTCManager();
    
    let errorThrown = false;
    try {
      await manager.requestMediaAccess();
    } catch (error) {
      if (error.name === 'PermissionDeniedError') {
        errorThrown = true;
      }
    }
    
    if (!errorThrown) throw new Error('PermissionDeniedError should be thrown');
  });

  // Test 4: requestMediaAccess with device not found
  await test('requestMediaAccess throws DeviceNotFoundError when device missing', async () => {
    setupDeviceNotFoundMock();
    const manager = new WebRTCManager();
    
    let errorThrown = false;
    try {
      await manager.requestMediaAccess();
    } catch (error) {
      if (error.name === 'DeviceNotFoundError') {
        errorThrown = true;
      }
    }
    
    if (!errorThrown) throw new Error('DeviceNotFoundError should be thrown');
  });

  // Test 5: enumerateCameras returns camera list
  await test('enumerateCameras returns available cameras', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    const cameras = await manager.enumerateCameras();
    
    if (cameras.length !== 2) throw new Error('Should find 2 cameras');
    if (!cameras[0].deviceId) throw new Error('Camera should have deviceId');
    if (!cameras[0].label) throw new Error('Camera should have label');
  });

  // Test 6: getLocalStream returns stream
  await test('getLocalStream returns local stream', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const stream = manager.getLocalStream();
    
    if (!stream) throw new Error('Should return local stream');
  });

  // Test 7: isLocalStreamActive checks stream state
  await test('isLocalStreamActive returns correct state', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    if (manager.isLocalStreamActive()) throw new Error('Should be false before access');
    
    await manager.requestMediaAccess();
    
    if (!manager.isLocalStreamActive()) throw new Error('Should be true after access');
  });

  // Test 8: toggleAudio mutes/unmutes audio
  await test('toggleAudio enables and disables audio track', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    
    if (!manager.isAudioEnabled()) throw new Error('Audio should be enabled initially');
    
    manager.toggleAudio(false);
    if (manager.isAudioEnabled()) throw new Error('Audio should be disabled after toggle');
    
    manager.toggleAudio(true);
    if (!manager.isAudioEnabled()) throw new Error('Audio should be enabled after toggle');
  });

  // Test 9: toggleVideo enables/disables video
  await test('toggleVideo enables and disables video track', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    
    if (!manager.isVideoEnabled()) throw new Error('Video should be enabled initially');
    
    manager.toggleVideo(false);
    if (manager.isVideoEnabled()) throw new Error('Video should be disabled after toggle');
    
    manager.toggleVideo(true);
    if (!manager.isVideoEnabled()) throw new Error('Video should be enabled after toggle');
  });

  // Test 10: switchCamera switches to different camera
  await test('switchCamera switches to a different camera device', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const initialCameraId = manager.getCurrentCameraId();
    
    await manager.switchCamera('back-camera-id');
    const newCameraId = manager.getCurrentCameraId();
    
    if (newCameraId === initialCameraId) throw new Error('Camera should have changed');
    if (newCameraId !== 'back-camera-id') throw new Error('Should switch to specified camera');
  });

  // Test 11: releaseMediaAccess stops all tracks
  await test('releaseMediaAccess stops all media tracks', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const stream = manager.getLocalStream();
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    
    manager.releaseMediaAccess();
    
    if (videoTrack.readyState !== 'ended') throw new Error('Video track should be stopped');
    if (audioTrack.readyState !== 'ended') throw new Error('Audio track should be stopped');
    if (manager.getLocalStream() !== null) throw new Error('Local stream should be null');
  });

  // Test 12: getStreamStats returns correct statistics
  await test('getStreamStats returns stream statistics', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const stats = manager.getStreamStats();
    
    if (!stats.hasLocalStream) throw new Error('hasLocalStream should be true');
    if (!stats.localStreamActive) throw new Error('localStreamActive should be true');
    if (!stats.audioEnabled) throw new Error('audioEnabled should be true');
    if (!stats.videoEnabled) throw new Error('videoEnabled should be true');
    if (stats.availableCameras !== 2) throw new Error('Should have 2 available cameras');
  });

  // Test 13: Event handler callbacks are called
  await test('Event handlers are triggered correctly', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    let streamReadyCalled = false;
    manager.onStreamReady = () => { streamReadyCalled = true; };
    
    await manager.requestMediaAccess();
    
    if (!streamReadyCalled) throw new Error('onStreamReady should be called');
  });

  // Test 14: getCurrentCameraId returns camera ID
  await test('getCurrentCameraId returns current camera device ID', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const cameraId = manager.getCurrentCameraId();
    
    if (!cameraId) throw new Error('Should return camera ID');
  });

  // Test 15: getAvailableCameras returns camera list
  await test('getAvailableCameras returns list of cameras', async () => {
    setupMockMediaDevices();
    const manager = new WebRTCManager();
    
    await manager.requestMediaAccess();
    const cameras = manager.getAvailableCameras();
    
    if (cameras.length !== 2) throw new Error('Should return 2 cameras');
  });

  // Print summary
  console.log('\n====================================');
  console.log('Test Summary');
  console.log('====================================');
  console.log(`Total: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log('====================================\n');

  return { passedTests, failedTests };
}

// Run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  // Load WebRTCManager
  const { WebRTCManager } = require('./webrtc-manager.js');
  global.WebRTCManager = WebRTCManager;
  
  runWebRTCManagerTests().then(results => {
    process.exit(results.failedTests > 0 ? 1 : 0);
  });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runWebRTCManagerTests,
    setupMockMediaDevices,
    setupPermissionDeniedMock,
    setupDeviceNotFoundMock
  };
}
