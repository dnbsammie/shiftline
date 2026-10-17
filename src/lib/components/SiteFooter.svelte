<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Attachment } from 'svelte/attachments';
	import { DirectionalLight, MathUtils, type Group } from 'three';
	import { BrandLogo, initLenis, gsap, ScrollTrigger, createViewer } from '#lib';

	// Shared (non-reactive) state between the scroll animation and the render loop
	const mouse = { x: 0, y: 0 };
	let modelBaseRotationX = 0.5;
	let modelBaseZ = -1;

	function handleMouseMove(e: MouseEvent) {
		mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
	}

	// GSAP & LENIS: footer parallax + model approaching the camera while scrolling
	const reveal: Attachment<HTMLElement> = (container) => {
		const footer = container.closest('footer');
		if (!footer) return;

		initLenis();

		const trigger = ScrollTrigger.create({
			trigger: footer,
			start: 'top bottom',
			end: 'bottom bottom',
			scrub: true,
			onUpdate: (self) => {
				const progress = self.progress;
				gsap.set(container, { y: `${-35 * (1 - progress)}%` });

				modelBaseZ = -1 * (1 - progress);
				modelBaseRotationX = 0.5 * (1 - progress);
			}
		});

		return () => trigger.kill();
	};

	// THREE.JS: model that follows the mouse
	const modelViewer: Attachment<HTMLElement> = (container) => {
		const sun = new DirectionalLight(0xffffff, 5);
		sun.position.set(1, 1, 0);

		const viewer = createViewer({
			container,
			cameraPosition: [0, 0, 0.75],
			lights: [sun]
		});

		let model: Group | null = null;

		// `center: false` keeps the pivot at the model's own origin (same look as before)
		viewer
			.loadModel('/models/kineto_rm-x/scene.gltf', { center: false })
			.then((group) => {
				group.position.set(-0.25, -0.175, -1);
				model = group;
			})
			.catch((error) => {
				if (error.name !== 'AbortError') console.error(error);
			});

		viewer.onFrame((delta) => {
			if (!model) return;

			// frame-rate independent easing (≈ the old 0.025 per frame at 60 fps)
			model.rotation.y = MathUtils.damp(model.rotation.y, mouse.x * 0.3, 1.5, delta);
			model.rotation.x = MathUtils.damp(model.rotation.x, -mouse.y * 0.2 + modelBaseRotationX, 1.5, delta);
			model.position.z = MathUtils.damp(model.position.z, modelBaseZ, 1.5, delta);
		});

		return () => viewer.destroy();
	};
</script>

<svelte:window onmousemove={handleMouseMove} />

<footer class="site-footer">
	<div class="sf-container" {@attach reveal}>
		<div id="sf-canvas" aria-hidden="true" {@attach modelViewer}></div>
		<div class="sf-content">
			<div class="sf-row">
				<div class="sf-col">
					<a href={resolve('/')} class="sf-logo-link" aria-label="go home">
						<BrandLogo />
					</a>
				</div>
				<div class="sf-col">
					<div class="sf-sub-col">
						<h6 class="sf-heading">Code the Track. Chase the Horizon</h6>
					</div>
					<div class="sf-sub-col" aria-label="footer links">
						<p>Models by: <a href="https://sketchfab.com/anathlyst" target="_blank">Aike</a></p>
					</div>
				</div>
			</div>
			<div class="sf-row">
				<p>&copy;2026</p>
				<p>Built by <a href="https://github.com/dnbsammie" target="_blank">dnbsammie</a>.</p>
			</div>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		bottom: 0;
		position: relative;
		width: 100vw;
		height: calc(100vh - (3rem + var(--space-sm)));
		background: var(--accent-color);
		color: var(--neutral-900);
		overflow: hidden;
	}

	.site-footer a:hover {
		color: var(--neutral-50);
	}

	.sf-container,
	#sf-canvas,
	.sf-content {
		width: 100%;
		height: 100%;
	}

	.sf-container {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		transform: translateY(-35%);
		will-change: transform;
	}

	#sf-canvas {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: 0.5;
		z-index: var(--z-cvft);
	}

	.sf-content {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: var(--space-sm);
		max-width: var(--container-xxl);
		margin: 0 auto;
		z-index: 1;
	}

	.sf-row {
		display: flex;
		justify-content: space-between;
	}

	.sf-row:nth-child(1) .sf-col:nth-child(1) {
		flex: 4;
	}

	.sf-row:nth-child(1) .sf-col:nth-child(2) {
		flex: 2;
		display: flex;
	}

	.sf-sub-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-xxs);
	}

	.sf-row:nth-child(1) {
		width: 100%;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.sf-col:nth-child(2) {
		flex-direction: column;
		gap: var(--space-sm);
		margin-left: auto;
		max-width: var(--container-sm);
	}
</style>
