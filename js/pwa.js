/**
 * 💕 Love Journey - PWA Installer
 * Handles service worker registration and iOS install prompt
 */

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('💕 Service Worker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('💕 Service Worker registration failed:', error);
            });
    });
}

// iOS detection and install prompt
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

// Show install prompt for iOS Safari (not in standalone mode)
if (isIOS && !isInStandaloneMode) {
    document.addEventListener('DOMContentLoaded', () => {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.classList.remove('hidden');
        }
    });
}

// Offline indicator
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
        if (navigator.onLine) {
            indicator.classList.add('hidden');
        } else {
            indicator.classList.remove('hidden');
        }
    }
}
