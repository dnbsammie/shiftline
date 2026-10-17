import { browser } from '$app/env';
import Lenis from 'lenis';
import { gsap } from '#lib';

let lenisInstance: Lenis | null = null;

export function initLenis(options?: ConstructorParameters<typeof Lenis>[0]): Lenis | null {
	if (!browser) return null;
	if (lenisInstance) return lenisInstance;

	lenisInstance = new Lenis({
		lerp: 0.1,
		...options
	});

	gsap.ticker.add((time) => {
		lenisInstance?.raf(time * 1000);
	});

	gsap.ticker.lagSmoothing(0);

	return lenisInstance;
}

export function getLenis(): Lenis | null {
	return lenisInstance;
}

export function destroyLenis(): void {
	if (lenisInstance) {
		lenisInstance.destroy();
		lenisInstance = null;
	}
}

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		destroyLenis();
	});
}
