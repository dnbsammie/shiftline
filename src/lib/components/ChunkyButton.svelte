<script lang="ts">
	interface Props {
		tone?: 'light' | 'dark';
		label?: string;
		icon?: string;
		ariaLabel?: string;
		href?: string;
		newTab?: boolean;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		class?: string;
		[key: string]: unknown;
	}

	let {
		tone = 'light',
		label,
		icon,
		ariaLabel,
		href,
		newTab = false,
		type = 'button',
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const computedAriaLabel = $derived(ariaLabel ?? label);

	$effect(() => {
		if (!computedAriaLabel) {
			console.warn("ChunkyButton: An 'aria-label' or 'label' is required for accessibility reasons.");
		}
	});
</script>

{#if href}
	<a
		{href}
		target={newTab ? '_blank' : undefined}
		rel={newTab ? 'noopener noreferrer' : undefined}
		aria-label={computedAriaLabel}
		class={`chunky ${tone} ${className}`}
		{...rest}
	>
		{#if label}
			<span>{label}</span>
		{/if}
		{#if icon}
			<i>{icon}</i>
		{/if}
	</a>
{:else}
	<button {type} {disabled} aria-label={computedAriaLabel} class="chunky ${tone} ${className}" {...rest}>
		{#if label}
			<span>{label}</span>
		{/if}
		{#if icon}
			<i>{icon}</i>
		{/if}
	</button>
{/if}

<style>
	.chunky.light {
		--btn-box: var(--neutral-950);
		--btn-text: var(--neutral-950);
	}

	.chunky.dark {
		--btn-box: var(--neutral-50);
		--btn-text: var(--neutral-50);
	}

	.chunky {
		--btn-box: var(--neutral-950);
		--btn-text: var(--neutral-950);
		background: var(--accent-color);
		border: 1px solid var(--btn-box);
		text-transform: uppercase;
		padding: var(--space-md);
		font-size: var(--fs-xs);
		letter-spacing: 0.08em;
		color: var(--btn-text);
		font-weight: var(--fw-medium);
		cursor: pointer;
		box-shadow: 5px 5px 0 var(--btn-box);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		margin-bottom: 10px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.chunky:hover:not(:disabled) {
		transform: translate(3px, 3px);
		box-shadow: 2px 2px 0 var(--btn-box);
	}

	.chunky:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: 5px 5px 0 var(--btn-box);
	}

	.chunky i {
		margin-left: 40px;
	}
</style>
