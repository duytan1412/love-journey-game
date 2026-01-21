/**
 * 🎲 LOVE GAME BOARD - Dice Module
 * 3D Dice animation and rolling logic
 */

class Dice {
    constructor() {
        this.diceElement = document.getElementById('dice');
        this.resultElement = document.getElementById('dice-result');
        this.isRolling = false;

        // Dice face rotations (CSS transform values)
        this.faceRotations = {
            1: 'rotateX(0deg) rotateY(0deg)',      // Front
            2: 'rotateX(-90deg) rotateY(0deg)',   // Top
            3: 'rotateY(-90deg) rotateX(0deg)',   // Right
            4: 'rotateY(90deg) rotateX(0deg)',    // Left
            5: 'rotateX(90deg) rotateY(0deg)',    // Bottom
            6: 'rotateY(180deg) rotateX(0deg)',   // Back
        };
    }

    /**
     * Roll the dice with animation
     * @returns {Promise<number>} The dice result (1-6)
     */
    async roll() {
        if (this.isRolling) return null;

        this.isRolling = true;
        this.resultElement.textContent = '';

        // Add rolling animation class
        this.diceElement.classList.add('rolling');

        // Generate random result
        const result = Math.floor(Math.random() * 6) + 1;

        // Play rolling sound if available
        this.playRollSound();

        // Wait for animation
        await this.sleep(800);

        // Remove rolling class
        this.diceElement.classList.remove('rolling');

        // Set final rotation to show correct face
        this.diceElement.style.transform = this.faceRotations[result];

        // Show result
        this.resultElement.textContent = `Bạn được ${result}! 🎯`;

        // Add bounce effect
        this.addBounceEffect();

        this.isRolling = false;

        return result;
    }

    /**
     * Add bounce effect after roll
     */
    addBounceEffect() {
        this.diceElement.style.animation = 'none';
        this.diceElement.offsetHeight; // Trigger reflow
        this.diceElement.style.animation = 'diceBounce 0.3s ease';
    }

    /**
     * Play dice roll sound
     */
    playRollSound() {
        // Create a simple click/roll sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 200;
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            // Audio not supported or blocked
        }
    }

    /**
     * Reset dice to initial state
     */
    reset() {
        this.diceElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
        this.resultElement.textContent = '';
        this.isRolling = false;
    }

    /**
     * Helper function to sleep
     * @param {number} ms - Milliseconds to sleep
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add dice bounce keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes diceBounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);
