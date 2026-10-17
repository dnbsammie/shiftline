<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { ChunkyButton, destroyLenis, initLenis, SiteFooter, SiteHeader } from '#lib';

	const features = [
		{
			number: '01',
			title: 'True physics',
			copy: 'Every weight transfer, every loss of traction. A model engineered for drivers.'
		},
		{
			number: '02',
			title: 'Your machine',
			copy: 'Tune every parameter and build a vehicle that responds to your driving style.'
		},
		{
			number: '03',
			title: 'Competition',
			copy: 'Global rankings, weekly events and a single benchmark: the fastest time.'
		}
	];

	onMount(() => {
		initLenis();

		return () => {
			destroyLenis();
		};
	});
</script>

<svelte:head>
	<title>SHIFTLINE | Home</title>
	<meta name="description" content="Home page for Shiftline - Web Racing Game" />
</svelte:head>

<main>
	<SiteHeader />
	<section class="hero">
		<div class="hero__pane hero__pane--left">
			<div class="hero__copy">
				<div class="eyebrow">
					<h6><span>V 0.1</span> / Competitive arcade</h6>
				</div>
				<h1>master<br />every <em>corner.</em></h1>
				<p class="hero__intro">
					A racing experience where every millisecond matters. Tune. Compete. Push beyond the limit.
				</p>
				<div class="hero__actions">
					<ChunkyButton label="Enter the track" tone="light" href={resolve('/game')} icon="↗" />
					<a href={resolve('/game')} class="text-anchor">Configure vehicle <span>→</span></a>
				</div>
				<small>Recommendation: mobile devices are not yet supported.</small>
			</div>
		</div>
		<div class="hero__pane hero__pane--right">
			<img src="https://placehold.co/1920x1080/black/0a0a0a" alt="hero banner" />
			<span class="image-code">FIG. 001 / VELOCITY</span>
			<div class="telemetry">
				<span>SPEED</span>
				<b>284</b>
				<small>KM/H</small>
			</div>
		</div>
	</section>
	<section class="manifesto">
		<div class="section-inner">
			<div class="manifesto__label">
				<h6>01 — The game</h6>
			</div>
			<div class="manifesto__content">
				<h2>It is not only<br />about finishing first.</h2>
				<p>
					SHIFTLINE combines precise physics, direct competition and deep customization. No distractions. Just you, the
					machine and the clock.
				</p>
			</div>
		</div>
	</section>

	<section class="features">
		<div class="section-inner">
			{#each features as feature (feature.number)}
				<article class="feature-card">
					<h6>{feature.number}</h6>
					<div class="feature-card__glyph">
						{feature.number === '01' ? '◢' : feature.number === '02' ? '⌁' : '↗'}
					</div>
					<div class="feature-card__ct">
						<h4>{feature.title}</h4>
						<p>{feature.copy}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="callout">
		<div class="section-inner">
			<div class="callout__content">
				<h6>First Release / OCT 19</h6>
				<h2>The track<br />is waiting.</h2>
			</div>
			<ChunkyButton label="Start Now" tone="dark" href={resolve('/game')} icon="↗" />
		</div>
	</section>
	<SiteFooter />
</main>

<style>
	/* ==== Hero ==== */
	.hero {
		flex-direction: column;
		justify-content: center;
		align-items: stretch;
		height: calc(100vh - (3rem + var(--space-sm)));
	}

	.hero__pane {
		flex: 1;
		position: relative;
		overflow: hidden;
	}

	.hero__pane--right {
		display: none;
	}

	.hero__pane--right::after {
		content: '';
		position: absolute;
		inset: 0;
		background:
			linear-gradient(120deg, hsl(from var(--accent-color) h s l / 0.25), transparent 75%),
			repeating-linear-gradient(90deg, transparent 0 79px, hsl(from var(--neutral-500) h s l / 0.09) 80px);
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.hero__pane--right img {
		filter: grayscale(1) contrast(1.25);
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero__copy {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		margin-left: auto;
		padding: var(--space-sm);
		max-width: var(--container-md);
		gap: var(--space-sm);
	}

	.eyebrow {
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.eyebrow span {
		background: var(--accent-color);
		padding: 6px 10px;
		color: var(--neutral-950);
		font-weight: 700;
	}

	.hero__intro {
		max-width: var(--container-xs);
		line-height: 1.5;
	}

	.hero__actions {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.image-code {
		position: absolute;
		top: 1.25rem;
		right: 1.25rem;
		z-index: 2;
		font-size: 8px;
		color: var(--neutral-50);
		letter-spacing: 0.15em;
		writing-mode: vertical-rl;
	}

	.telemetry {
		position: absolute;
		left: 0;
		bottom: 0;
		background: var(--accent-color);
		width: fit-content;
		padding: 16px 18px;
		color: var(--neutral-950);
		border-top: 1px solid var(--neutral-950);
		border-right: 1px solid var(--neutral-950);
		z-index: var(--z-modal);
	}

	.telemetry span {
		display: block;
		font-size: var(--fs-xs);
		letter-spacing: 0.15em;
	}

	.telemetry b {
		font-family: var(--ff-hl), sans-serif;
		font-size: var(--fs-xxl);
		letter-spacing: -0.08em;
	}

	.telemetry small {
		margin-left: 8px;
	}

	/* ==== Manifesto ==== */
	.manifesto .section-inner {
		gap: var(--space-md);
	}

	.manifesto__content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		gap: var(--space-sm);
	}

	.manifesto__content p {
		max-width: var(--container-sm);
		line-height: 1.9;
	}
	/* ==== Features ==== */
	.features {
		min-height: 80svh;
	}

	.features .section-inner {
		padding: 0;
	}

	.feature-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: var(--space-md);
		border-bottom: 1px solid var(--neutral-950);
	}

	.feature-card:last-child {
		border-bottom: 0;
	}

	.feature-card__glyph {
		font-family: var(--ff-hl), sans-serif;
		font-size: var(--fs-4xl);
		font-weight: var(--fw-bold);
		color: var(--neutral-900);
	}

	.feature-card__ct {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-template-rows: 1fr;
		gap: var(--space-md);
	}

	/* ==== CTA Band Section ==== */
	.callout {
		background: hsl(from var(--neutral-950) h s calc(l + 5));
		color: var(--neutral-100);
	}

	.callout .section-inner {
		padding: var(--space-xxl);
		align-items: flex-start;
		justify-content: space-evenly;
		gap: var(--space-md);
	}

	.callout h2 {
		color: var(--neutral-50);
		margin-top: 20px;
	}

	.callout h6 {
		color: var(--accent-color);
	}
	/* Media Queries */
	@media (min-width: 1000px) {
		.hero {
			flex-direction: row;
		}

		.hero__pane--right {
			display: block;
			border-left: 1px solid var(--neutral-950);
		}

		.manifesto .section-inner {
			justify-content: flex-start;
			padding: calc(3rem + var(--space-sm)) var(--space-sm);
		}

		.manifesto__label {
			max-width: var(--container-xxs);
		}

		.features .section-inner {
			align-items: center;
			justify-content: center;
			height: 80svh;
		}

		.feature-card {
			height: 80svh;
			border-bottom: 0;
			border-right: 1px solid var(--neutral-950);
			padding: var(--space-xxl) var(--space-sm);
			gap: var(--space-xxs);
		}

		.feature-card:last-child {
			border-right: 0;
		}

		.feature-card__ct {
			display: grid;
			height: 30svh;
			grid-template-columns: 1fr;
			grid-template-rows: repeat(2, 1fr);
		}

		.callout .section-inner {
			align-items: flex-end;
			justify-content: space-between;
		}
	}
</style>
