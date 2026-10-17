<script lang="ts">
	import favicon from '#lib/assets/icons/favicon.svg';
	import type { LayoutProps } from './$types';
  import '@fontsource-variable/jetbrains-mono';
  import '@fontsource-variable/orbitron';
  import '../styles/index.css';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<meta name="description" content="Shiftline is an arcade racing game for the web." />
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:description" content="Shiftline, an arcade racing game featuring 3D graphics, manual transmission, and dynamic tracks." />
  <meta name="twitter:image" content="https://shiftline.seriveramosq.workers.dev//og-image.jpg" />
  <!-- Open Graph -->
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="Shiftline" />
  <meta property="og:title" content="Shiftline | Arcade Racing Game" />
  <meta property="og:description" content="Shiftline is an arcade racing game for the web." />
  <meta property="og:url" content="https://shiftline.seriveramosq.workers.dev" />
	<meta property="og:image" content="https://shiftline.seriveramosq.workers.dev//og-image.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
  <!-- icons -->
  <link rel="icon" href={favicon} />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="shortcut icon" href="/meta/favicon.ico" />
  <link rel="manifest" href="/site.webmanifest">
  <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffffff">
  <!-- Browser Appearance -->
  <meta name="msapplication-TileColor" content="#ffffff" />
  <meta name="theme-color" content="#000000">
</svelte:head>

{@render children()}
