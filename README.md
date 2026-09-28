# iPhone Remote Experience

A desktop-class iPhone web simulator designed to feel like a live device connection rather than a static mockup.

## Live experience

- Four display modes: Device, Screen Mirror, Presentation and Floating
- Mouse-as-touch pointer, click ripples, swipe gestures and hardware controls
- Desktop keyboard bridge and virtual keyboard
- Spotlight app launcher and app switcher
- Shortcuts for Home, Lock, Control Center, notifications and screenshots
- Device Inspector with live FPS, battery, active process and permissions
- Screen capture, display recording and state export
- Portrait/landscape rotation, fullscreen mode and adaptive scaling
- Persistent runtime preferences and PWA offline shell
- 36 apps, Lock Screen, PIN, Home Screen, widgets, Dynamic Island, Control Center, notifications and FaceTime

## Keyboard map

| Action | Shortcut |
|---|---|
| Home | `Ctrl/Cmd + H` |
| Lock | `Ctrl/Cmd + L` |
| Spotlight | `Ctrl/Cmd + Space` |
| App switcher | `Ctrl/Cmd + Tab` |
| Screenshot | `Ctrl/Cmd + Shift + 3` |
| Control Center | `Ctrl/Cmd + ↑` |
| Notifications | `Ctrl/Cmd + ↓` |
| Back / close | `Esc` |

## Run locally

```bash
python3 -m http.server 8000
```

Camera, microphone and display recording require browser permission and HTTPS in production.
