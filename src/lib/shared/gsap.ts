import { browser } from '$app/env';
import gsap from 'gsap';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (browser) {
	gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
