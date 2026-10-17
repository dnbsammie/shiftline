<script lang="ts">
	import favicon from '#lib/assets/icons/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta property="og:image" content="https://shiftline.seriveramosq.workers.dev//og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:title" content="High-speed arcade action, compiled for the browser." />
	<meta property="og:description" content="Shiftline is an arcade racing game for the web." />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://shiftline.seriveramosq.workers.dev//og-image.jpg" />
</svelte:head>

{@render children()}
