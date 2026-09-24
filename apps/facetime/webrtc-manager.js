/* =========================================================
   FaceTime App — WebRTC Manager
   ========================================================= */

/**
 * WebRTCManager Class
 * Encapsulates all WebRTC functionality and media stream management
 * 
 * Handles:
 * - Media device access (camera and microphone)
 * - Camera enumeration and switching
 * - Local stream state tracking
 * - Media track manipulation
 * - Error handling for permissions and devices
 */
class WebRTCManager {
  constructor() {
    // Local media stream
    this.localStream = null;
    
    // Remote media stream (for peer connection)
    this.remoteStream = null;
    
    // Available camera devices
    this.availableCameras = [];
    
    // Current camera device ID
    this.currentCameraId = null;
    
    // Current facing mode ('user' or 'environment')
    this.currentFacingMode = 'user';
    
    // Media constraints configuration
    this.defaultConstraints = {
      video: {
        width: { ideal: 1280, min: 640 },
        height: { ideal: 720, min: 480 },
        frameRate: { ideal: 30, min: 24 },
        facingMode: 'user'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 48000
      }
    };
    
    // Event handlers
    this.onStreamReady = null;
    this.onStreamError = null;
    this.onCameraSwitched = null;
  }

  /**
   * Request media access (camera and microphone)
   * @param {Object} constraints - Optional custom constraints
   * @returns {Promise<MediaStream>} Media stream
   * @throws {PermissionDeniedError} When user denies permissions
   * @throws {DeviceNotFoundError} When requested device is not available
   */
  async requestMediaAccess(constraints = null) {
    try {
      const mediaConstraints = constraints || this.defaultConstraints;
      
      console.log('[WebRTC] Requesting media access with constraints:', mediaConstraints);
      
      // Request user media
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      
      // Get current video track settings
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        this.currentCameraId = settings.deviceId || null;
        this.currentFacingMode = settings.facingMode || 'user';
        
        console.log('[WebRTC] Media access granted:', {
          videoDeviceId: this.currentCameraId,
          facingMode: this.currentFacingMode,
          resolution: `${settings.width}x${settings.height}`,
          frameRate: settings.frameRate
        });
      }
      
      // Enumerate cameras after getting access
      await this.enumerateCameras();
      
      // Call success callback if set
      if (this.onStreamReady) {
        this.onStreamReady(this.localStream);
      }
      
      return this.localStream;
      
    } catch (error) {
      console.error('[WebRTC] Media access error:', error);
      
      // Handle different error types
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        const permissionError = new Error('Доступ к камере и микрофону отклонен. Пожалуйста, разрешите доступ в настройках браузера.');
        permissionError.name = 'PermissionDeniedError';
        permissionError.deniedDevices = ['camera', 'microphone'];
        
        if (this.onStreamError) {
          this.onStreamError(permissionError);
        }
        
        throw permissionError;
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        const deviceError = new Error('Камера или микрофон не найдены. Проверьте подключение устройств.');
        deviceError.name = 'DeviceNotFoundError';
        deviceError.requestedDevice = 'camera or microphone';
        
        if (this.onStreamError) {
          this.onStreamError(deviceError);
        }
        
        throw deviceError;
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        const deviceError = new Error('Не удалось получить доступ к устройству. Возможно, оно используется другим приложением.');
        deviceError.name = 'DeviceNotFoundError';
        deviceError.requestedDevice = 'camera or microphone';
        
        if (this.onStreamError) {
          this.onStreamError(deviceError);
        }
        
        throw deviceError;
      } else {
        // Generic error
        if (this.onStreamError) {
          this.onStreamError(error);
        }
        
        throw error;
      }
    }
  }

  /**
   * Enumerate available camera devices
   * @returns {Promise<Array>} Array of camera device objects
   */
  async enumerateCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Filter only video input devices (cameras)
      this.availableCameras = devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
          deviceId: device.deviceId,
          label: device.label || `Camera ${device.deviceId.substr(0, 5)}`,
          kind: device.kind
        }));
      
      console.log('[WebRTC] Enumerated cameras:', this.availableCameras);
      
      return this.availableCameras;
      
    } catch (error) {
      console.error('[WebRTC] Error enumerating cameras:', error);
      return [];
    }
  }

  /**
   * Switch to a different camera
   * @param {string} deviceId - Optional device ID (if null, switches to next available camera)
   * @returns {Promise<void>}
   */
  async switchCamera(deviceId = null) {
    try {
      if (!this.localStream) {
        throw new Error('No active media stream. Call requestMediaAccess() first.');
      }
      
      // If no deviceId provided, determine next camera
      let targetDeviceId = deviceId;
      
      if (!targetDeviceId) {
        // Switch facing mode
        const newFacingMode = this.currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Try to find a camera with the opposite facing mode
        const targetCamera = this.availableCameras.find(cam => {
          // On mobile devices, camera labels might indicate front/back
          const label = cam.label.toLowerCase();
          if (newFacingMode === 'environment') {
            return label.includes('back') || label.includes('rear');
          } else {
            return label.includes('front') || label.includes('user');
          }
        });
        
        if (targetCamera) {
          targetDeviceId = targetCamera.deviceId;
        } else {
          // Fallback: just pick the next camera in the list
          const currentIndex = this.availableCameras.findIndex(cam => cam.deviceId === this.currentCameraId);
          const nextIndex = (currentIndex + 1) % this.availableCameras.length;
          targetDeviceId = this.availableCameras[nextIndex]?.deviceId;
        }
      }
      
      if (!targetDeviceId) {
        console.warn('[WebRTC] No alternative camera available');
        return;
      }
      
      console.log('[WebRTC] Switching camera to:', targetDeviceId);
      
      // Create new constraints with specific device
      const newConstraints = {
        video: {
          deviceId: { exact: targetDeviceId },
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          frameRate: { ideal: 30, min: 24 }
        },
        audio: true // Keep existing audio track
      };
      
      // Get new media stream with the selected camera
      const newStream = await navigator.mediaDevices.getUserMedia(newConstraints);
      const newVideoTrack = newStream.getVideoTracks()[0];
      
      // Get the old video track
      const oldVideoTrack = this.localStream.getVideoTracks()[0];
      
      // Replace the video track in the local stream
      if (oldVideoTrack) {
        this.localStream.removeTrack(oldVideoTrack);
        oldVideoTrack.stop();
      }
      
      this.localStream.addTrack(newVideoTrack);
      
      // Stop the new stream's audio track (we're keeping the original)
      const newAudioTrack = newStream.getAudioTracks()[0];
      if (newAudioTrack) {
        newAudioTrack.stop();
      }
      
      // Update current camera info
      const settings = newVideoTrack.getSettings();
      this.currentCameraId = settings.deviceId || targetDeviceId;
      this.currentFacingMode = settings.facingMode || this.currentFacingMode;
      
      console.log('[WebRTC] Camera switched successfully:', {
        deviceId: this.currentCameraId,
        facingMode: this.currentFacingMode
      });
      
      // Call callback if set
      if (this.onCameraSwitched) {
        this.onCameraSwitched(this.currentCameraId, this.currentFacingMode);
      }
      
    } catch (error) {
      console.error('[WebRTC] Error switching camera:', error);
      
      if (this.onStreamError) {
        this.onStreamError(error);
      }
      
      throw error;
    }
  }

  /**
   * Get the local media stream
   * @returns {MediaStream|null} Local media stream
   */
  getLocalStream() {
    return this.localStream;
  }

  /**
   * Get the remote media stream
   * @returns {MediaStream|null} Remote media stream
   */
  getRemoteStream() {
    return this.remoteStream;
  }

  /**
   * Set the remote media stream
   * @param {MediaStream} stream - Remote media stream
   */
  setRemoteStream(stream) {
    this.remoteStream = stream;
  }

  /**
   * Check if local stream is active
   * @returns {boolean} True if local stream exists and has active tracks
   */
  isLocalStreamActive() {
    if (!this.localStream) {
      return false;
    }
    
    const videoTracks = this.localStream.getVideoTracks();
    const audioTracks = this.localStream.getAudioTracks();
    
    const hasActiveVideo = videoTracks.some(track => track.readyState === 'live');
    const hasActiveAudio = audioTracks.some(track => track.readyState === 'live');
    
    return hasActiveVideo || hasActiveAudio;
  }

  /**
   * Toggle audio track (mute/unmute)
   * @param {boolean} enabled - True to enable, false to disable
   */
  toggleAudio(enabled) {
    if (!this.localStream) {
      console.warn('[WebRTC] No local stream available');
      return;
    }
    
    const audioTracks = this.localStream.getAudioTracks();
    audioTracks.forEach(track => {
      track.enabled = enabled;
    });
    
    console.log('[WebRTC] Audio', enabled ? 'enabled' : 'disabled');
  }

  /**
   * Toggle video track (camera on/off)
   * @param {boolean} enabled - True to enable, false to disable
   */
  toggleVideo(enabled) {
    if (!this.localStream) {
      console.warn('[WebRTC] No local stream available');
      return;
    }
    
    const videoTracks = this.localStream.getVideoTracks();
    videoTracks.forEach(track => {
      track.enabled = enabled;
    });
    
    console.log('[WebRTC] Video', enabled ? 'enabled' : 'disabled');
  }

  /**
   * Check if audio is enabled
   * @returns {boolean} True if audio is enabled
   */
  isAudioEnabled() {
    if (!this.localStream) {
      return false;
    }
    
    const audioTracks = this.localStream.getAudioTracks();
    return audioTracks.length > 0 && audioTracks[0].enabled;
  }

  /**
   * Check if video is enabled
   * @returns {boolean} True if video is enabled
   */
  isVideoEnabled() {
    if (!this.localStream) {
      return false;
    }
    
    const videoTracks = this.localStream.getVideoTracks();
    return videoTracks.length > 0 && videoTracks[0].enabled;
  }

  /**
   * Get current camera device ID
   * @returns {string|null} Current camera device ID
   */
  getCurrentCameraId() {
    return this.currentCameraId;
  }

  /**
   * Get current facing mode
   * @returns {string} Current facing mode ('user' or 'environment')
   */
  getCurrentFacingMode() {
    return this.currentFacingMode;
  }

  /**
   * Get available cameras
   * @returns {Array} Array of camera device objects
   */
  getAvailableCameras() {
    return this.availableCameras;
  }

  /**
   * Release all media access and stop all tracks
   * Cleans up local and remote streams
   */
  releaseMediaAccess() {
    console.log('[WebRTC] Releasing media access');
    
    // Stop all local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log('[WebRTC] Stopped track:', track.kind, track.label);
      });
      
      this.localStream = null;
    }
    
    // Stop all remote stream tracks
    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => {
        track.stop();
      });
      
      this.remoteStream = null;
    }
    
    // Reset state
    this.currentCameraId = null;
    this.currentFacingMode = 'user';
    this.availableCameras = [];
    
    console.log('[WebRTC] Media access released');
  }

  /**
   * Get media stream statistics
   * @returns {Object} Stream statistics
   */
  getStreamStats() {
    const stats = {
      hasLocalStream: !!this.localStream,
      hasRemoteStream: !!this.remoteStream,
      localStreamActive: this.isLocalStreamActive(),
      audioEnabled: this.isAudioEnabled(),
      videoEnabled: this.isVideoEnabled(),
      currentCamera: this.currentCameraId,
      facingMode: this.currentFacingMode,
      availableCameras: this.availableCameras.length
    };
    
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        stats.videoSettings = {
          width: settings.width,
          height: settings.height,
          frameRate: settings.frameRate,
          aspectRatio: settings.aspectRatio
        };
      }
    }
    
    return stats;
  }
}

// Custom error classes
class PermissionDeniedError extends Error {
  constructor(message, deniedDevices = []) {
    super(message);
    this.name = 'PermissionDeniedError';
    this.deniedDevices = deniedDevices;
  }
}

class DeviceNotFoundError extends Error {
  constructor(message, requestedDevice = '') {
    super(message);
    this.name = 'DeviceNotFoundError';
    this.requestedDevice = requestedDevice;
  }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WebRTCManager,
    PermissionDeniedError,
    DeviceNotFoundError
  };
}
