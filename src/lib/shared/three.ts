// lib/shared/three.ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface LoadModelOptions {
	/** Largest bounding-box dimension after normalising, in scene units. @default 1 */
	size?: number;
	/**
	 * Re-center the model on its bounding box, so position/rotation pivot around
	 * its visual center. With `false` the pivot stays at the model's own origin.
	 * @default true
	 */
	center?: boolean;
}

/** Called once per rendered frame. `delta` and `elapsed` are in seconds. */
export type FrameCallback = (delta: number, elapsed: number) => void;

export interface ViewerOptions {
	/** Element the canvas is appended to. Needs a non-zero size (CSS). */
	container: HTMLElement;
	/** @default 50 */
	fov?: number;
	/** @default [0, 0, 2] */
	cameraPosition?: [number, number, number];
	/** Lights added to the scene. Pass `[]` for none. @default ambient + directional rig */
	lights?: THREE.Light[];
	/** Transparent canvas background. @default true */
	alpha?: boolean;
	/** @default true */
	antialias?: boolean;
	/** Upper bound for `devicePixelRatio` (keeps fill-rate under control). @default 2 */
	maxPixelRatio?: number;
	/** Stop rendering while the container is off-screen. @default true */
	pauseWhenHidden?: boolean;
	/** Start rendering immediately. @default true */
	autoStart?: boolean;
}

export interface Viewer {
	readonly scene: THREE.Scene;
	readonly camera: THREE.PerspectiveCamera;
	readonly renderer: THREE.WebGLRenderer;
	/**
	 * Loads a glTF, normalises it (see {@link fitModel}) and adds it to the scene.
	 * Rejects with an `AbortError` if the viewer is destroyed while loading.
	 */
	loadModel(url: string, options?: LoadModelOptions): Promise<THREE.Group>;
	/** Registers a per-frame callback. Returns an unsubscribe function. */
	onFrame(callback: FrameCallback): () => void;
	start(): void;
	stop(): void;
	/** Re-reads the container size. Called automatically by a `ResizeObserver`. */
	resize(): void;
	/** Stops the loop and frees everything in the scene + the WebGL context. */
	destroy(): void;
}

/* -------------------------------------------------------------------------- */
/*  Models (standalone: usable with your own renderer, e.g. in the game)      */
/* -------------------------------------------------------------------------- */

let gltfLoader: GLTFLoader | undefined;
const getLoader = () => (gltfLoader ??= new GLTFLoader());

/**
 * Wraps `object` in a pivot `Group`, scales it so its largest dimension equals
 * `size`, and (optionally) centers it on its bounding box.
 * Move/rotate the returned group, never the inner object.
 */
export function fitModel(object: THREE.Object3D, { size = 1, center = true }: LoadModelOptions = {}): THREE.Group {
	const pivot = new THREE.Group();
	pivot.add(object);

	const dimensions = new THREE.Box3().setFromObject(object).getSize(new THREE.Vector3());
	const maxDimension = Math.max(dimensions.x, dimensions.y, dimensions.z);
	if (maxDimension > 0) object.scale.multiplyScalar(size / maxDimension);

	if (center) {
		pivot.updateMatrixWorld(true);
		const middle = new THREE.Box3().setFromObject(pivot).getCenter(new THREE.Vector3());
		object.position.sub(middle);
	}

	return pivot;
}

/** Loads a glTF/GLB and returns it already normalised by {@link fitModel}. */
export async function loadModel(url: string, options?: LoadModelOptions): Promise<THREE.Group> {
	const gltf = await getLoader().loadAsync(url);
	return fitModel(gltf.scene, options);
}

/** Disposes geometries, materials and textures under `root` (GPU memory). */
export function disposeObject(root: THREE.Object3D): void {
	root.traverse((node) => {
		const { geometry, material } = node as Partial<THREE.Mesh>;
		geometry?.dispose();
		if (!material) return;

		for (const mat of Array.isArray(material) ? material : [material]) {
			for (const value of Object.values(mat)) {
				if (value instanceof THREE.Texture) value.dispose();
			}
			mat.dispose();
		}
	});
}

/* -------------------------------------------------------------------------- */
/*  Viewer (a canvas inside a div: UI widgets, footer, garage, previews)      */
/* -------------------------------------------------------------------------- */

function defaultLights(): THREE.Light[] {
	const sun = new THREE.DirectionalLight(0xffffff, 4);
	sun.position.set(2, 2, 2);
	return [new THREE.AmbientLight(0xffffff, 1.5), sun];
}

/**
 * Creates a renderer + scene + camera inside `container`.
 * Browser only: call it from `onMount`, `$effect` or a `{@attach}` function.
 */
export function createViewer(options: ViewerOptions): Viewer {
	const {
		container,
		fov = 50,
		cameraPosition = [0, 0, 2],
		lights,
		alpha = true,
		antialias = true,
		maxPixelRatio = 2,
		pauseWhenHidden = true,
		autoStart = true
	} = options;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 1000);
	camera.position.set(...cameraPosition);

	const renderer = new THREE.WebGLRenderer({ alpha, antialias });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxPixelRatio));
	Object.assign(renderer.domElement.style, { display: 'block', width: '100%', height: '100%' });
	container.appendChild(renderer.domElement);

	for (const light of lights ?? defaultLights()) scene.add(light);

	/* ---- render loop: runs only while started AND visible ---- */

	const callbacks = new Set<FrameCallback>();
	let wantsRunning = autoStart;
	let visible = true;
	let running = false;
	let destroyed = false;
	let last = 0;
	let elapsed = 0;

	function tick(time: number) {
		const delta = last ? Math.min((time - last) / 1000, 0.1) : 0;
		last = time;
		elapsed += delta;

		for (const callback of callbacks) callback(delta, elapsed);
		renderer.render(scene, camera);
	}

	function sync() {
		const shouldRun = !destroyed && wantsRunning && visible;
		if (shouldRun === running) return;

		running = shouldRun;
		last = 0; // avoids a huge delta when resuming
		renderer.setAnimationLoop(shouldRun ? tick : null);
	}

	/* ---- sizing ---- */

	function resize() {
		const { clientWidth: width, clientHeight: height } = container;
		if (!width || !height) return;

		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height, false); // CSS controls the canvas size
		if (!running) renderer.render(scene, camera); // resizing clears the buffer
	}

	const resizeObserver = new ResizeObserver(() => resize());
	resizeObserver.observe(container);
	resize();

	let intersectionObserver: IntersectionObserver | undefined;
	if (pauseWhenHidden) {
		intersectionObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			sync();
		});
		intersectionObserver.observe(container);
	}

	sync();

	/* ---- public API ---- */

	return {
		scene,
		camera,
		renderer,

		async loadModel(url, modelOptions) {
			const model = await loadModel(url, modelOptions);

			if (destroyed) {
				disposeObject(model);
				throw new DOMException('Viewer destroyed while loading the model', 'AbortError');
			}

			scene.add(model);
			return model;
		},

		onFrame(callback) {
			callbacks.add(callback);
			return () => {
				callbacks.delete(callback);
			};
		},

		start() {
			wantsRunning = true;
			sync();
		},

		stop() {
			wantsRunning = false;
			sync();
		},

		resize,

		destroy() {
			if (destroyed) return;
			destroyed = true;

			sync(); // stops the loop
			callbacks.clear();
			resizeObserver.disconnect();
			intersectionObserver?.disconnect();

			disposeObject(scene);
			scene.clear();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		}
	};
}
