<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { favicon, ColorSwitch } from '#lib';

	type Page = {
		id: 'home' | 'game';
		label: string;
		href: '/' | '/game';
	};

	const pages: Page[] = [
		{ id: 'home', label: 'Home', href: '/' },
		{ id: 'game', label: 'Play', href: '/game' }
	];

	let open = $state(false);

	function isActive(href: Page['href']) {
		if (href === '/') {
			return page.url.pathname === resolve('/');
		}
		return page.url.pathname === resolve(href);
	}
</script>

<header class="site-header">
	<a class="brand" href={resolve('/')} aria-label="Go to home">
		<img src={favicon} alt="icon" />
	</a>
	<button class="menu-toggle" onclick={() => (open = !open)} aria-expanded={open}>
		{open ? 'Close' : 'Menu'}
	</button>
	<nav class:open class="nav" aria-label="Main navigation">
		{#each pages as item (item.id)}
			<a
				href={resolve(item.href)}
				class:active={isActive(item.href)}
				aria-current={isActive(item.href) ? 'page' : undefined}
				onclick={() => (open = false)}
			>
				{item.label}
			</a>
		{/each}
	</nav>
	<ColorSwitch />
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		left: 0;
		width: 100vw;
		height: calc(3rem + var(--space-sm));
		padding: 0 var(--space-xs);
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		border-bottom: 1px solid var(--neutral-950);
		background: hsl(from var(--neutral-50) h s l / 0.85);
		backdrop-filter: blur(100px);
		pointer-events: all;
		z-index: var(--z-header);
	}

	.nav {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		height: 100%;
	}

	.nav a {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 0;
		height: 100%;
		width: 6rem;
		text-align: center;
		background: transparent;
		text-transform: uppercase;
		font-size: var(--fs-xs);
		letter-spacing: -0.1em;
		padding: 0;
		cursor: pointer;
		position: relative;
	}

	.nav a.active::after {
		content: '';
		position: absolute;
		height: 5px;
		background: var(--accent-color);
		left: 0;
		right: 0;
		bottom: -1px;
	}

	.menu-toggle {
		display: none;
	}

	.brand img {
		height: 3rem;
		width: auto;
	}
</style>
