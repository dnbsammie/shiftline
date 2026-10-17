import favicon from './assets/icons/favicon.svg';
import logo from './assets/icons/logo.svg';
export { favicon, logo };
// ==== Components ====
export { default as BrandLogo } from './components/BrandLogo.svelte';
export { default as ChunkyButton } from './components/ChunkyButton.svelte';
export { default as ColorSwitch } from './components/ColorSwitch.svelte';
export { default as SiteFooter } from './components/SiteFooter.svelte';
export { default as SiteHeader } from './components/SiteHeader.svelte';
// ==== Shared ====
export * from './shared/gsap';
export * from './shared/lenis';
export * from './shared/three.ts';
