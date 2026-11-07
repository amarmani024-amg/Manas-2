import { triggerGlobalFireworks } from '../components/NeuralCanvas';

/**
 * Triggers full confetti/fireworks celebration across the screen.
 */
export function fireCelebration(x?: number, y?: number) {
  triggerGlobalFireworks(x, y, 55);
  // Double burst
  setTimeout(() => {
    triggerGlobalFireworks(
      (x ?? window.innerWidth * 0.5) + (Math.random() - 0.5) * 160,
      (y ?? window.innerHeight * 0.3) + (Math.random() - 0.5) * 80,
      40
    );
  }, 160);
}
