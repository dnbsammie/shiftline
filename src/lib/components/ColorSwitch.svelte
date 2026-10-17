<script lang="ts">
	import { onMount } from 'svelte';

	const colors = [
		{ name: 'crimson', value: 'var(--accent-crimson)' },
		{ name: 'vermilion', value: 'var(--accent-vermilion)' },
		{ name: 'chartreuse', value: 'var(--accent-chartreuse)' },
		{ name: 'emerald', value: 'var(--accent-emerald)' },
		{ name: 'turquoise', value: 'var(--accent-turquoise)' },
		{ name: 'indigo', value: 'var(--accent-indigo)' },
		{ name: 'violet', value: 'var(--accent-violet)' }
	];

	let currentIndex = $state(0);
	let currentColor = $derived(colors[currentIndex]);

	onMount(() => {
		const savedColor = localStorage.getItem('site-accent-color');
		if (savedColor) {
			const foundIndex = colors.findIndex((c) => c.value === savedColor);
			if (foundIndex !== -1) {
				currentIndex = foundIndex;
				document.documentElement.style.setProperty('--accent-color', savedColor);
			}
		}

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === 'site-accent-color' && event.newValue) {
				document.documentElement.style.setProperty('--accent-color', event.newValue);
				const foundIndex = colors.findIndex((c) => c.value === event.newValue);
				if (foundIndex !== -1) currentIndex = foundIndex;
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	});

	function toggleColor() {
		currentIndex = (currentIndex + 1) % colors.length;
		const selectedColor = colors[currentIndex].value;

		document.documentElement.style.setProperty('--accent-color', selectedColor);
		localStorage.setItem('site-accent-color', selectedColor);
	}
</script>

<button
	class="color-status"
	onclick={toggleColor}
	style="--accent-color: {currentColor.value};"
	type="button"
	aria-label="Change color accent"
>
	{currentColor.name}
	<i style="background-color: var(--accent-color);"></i>
</button>

<style>
	.color-status {
		justify-self: end;
		font-size: var(--fs-xs);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.color-status i {
		width: 7px;
		height: 7px;
		background: var(--accent-color);
		border: 1px solid var(--neutral-950);
		display: inline-block;
		margin-right: 8px;
	}
</style>
