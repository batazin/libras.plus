"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { onMotion } from "@/lib/motionInput";

/*
 * Anatomical rigged hand (WebXR "generic-hand" model, W3C license — see
 * public/models/LICENSE-hand.md). Its 25 joints ship as a flat list; we
 * rebuild the finger chains so bending a knuckle carries the rest of
 * the finger with it, then pose the bones to form Libras handshapes.
 */
const MODEL_URL = "/models/hand-right.glb";

/* ------------------------------------------------------------------ */
/* Handshapes (Libras manual alphabet)                                 */
/*                                                                     */
/* Finger: [spread, knuckle, middle joint, tip joint]  (+ = bend in)   */
/* Thumb:  [across palm, away from palm, twist, middle bend, tip bend] */
/* Finger order: index, middle, ring, pinky.                           */
/* ------------------------------------------------------------------ */
type FingerPose = [number, number, number, number];
type ThumbPose = [number, number, number, number, number];
interface HandPose {
  fingers: [FingerPose, FingerPose, FingerPose, FingerPose];
  thumb: ThumbPose;
}

const C: FingerPose = [0, 1.45, 1.65, 0.85]; // curled into the palm
const ext = (spread = 0, bend = 0.05): FingerPose => [spread, bend, 0.06, 0.04];
const THUMB_ACROSS: ThumbPose = [0.75, 0.15, 0, 0.55, 0.45];

export const HANDSHAPES: Record<string, HandPose> = {
  L: { fingers: [ext(0.05), C, C, C], thumb: [-0.55, 0.45, 0, 0, 0] },
  I: { fingers: [C, C, C, ext(-0.1)], thumb: THUMB_ACROSS },
  B: {
    fingers: [ext(0.04), ext(0), ext(-0.03), ext(-0.08)],
    thumb: [0.85, 0, 0, 0.35, 0.3],
  },
  R: { fingers: [ext(-0.24), ext(0.36, 0.24), C, C], thumb: THUMB_ACROSS },
  A: { fingers: [C, C, C, C], thumb: [0.48, -0.45, 0, 0.08, 0] },
  S: { fingers: [C, C, C, C], thumb: [0.9, 0.35, 0, 0.6, 0.35] },
  OPEN: {
    fingers: [ext(0.16, 0.08), ext(0.04, 0.08), ext(-0.08, 0.08), ext(-0.2, 0.1)],
    thumb: [-0.3, 0.3, 0, 0.05, 0.05],
  },
};

function poseToArray(p: HandPose): number[] {
  return [...p.fingers.flat(), ...p.thumb];
}

/* ------------------------------------------------------------------ */
/* Rig                                                                 */
/* ------------------------------------------------------------------ */
const FINGER_NAMES = ["index", "middle", "ring", "pinky"] as const;
const FINGER_JOINTS = [
  "metacarpal",
  "phalanx-proximal",
  "phalanx-intermediate",
  "phalanx-distal",
  "tip",
] as const;
const THUMB_JOINTS = [
  "thumb-metacarpal",
  "thumb-phalanx-proximal",
  "thumb-phalanx-distal",
  "thumb-tip",
] as const;

interface Rig {
  root: THREE.Object3D;
  mesh: THREE.SkinnedMesh;
  /** [finger][0=proximal,1=intermediate,2=distal] */
  fingers: THREE.Bone[][];
  /** metacarpal, proximal, distal */
  thumb: THREE.Bone[];
  rest: Map<THREE.Bone, THREE.Quaternion>;
}

function buildRig(source: THREE.Object3D): Rig {
  const root = cloneSkinned(source);
  let mesh: THREE.SkinnedMesh | null = null;
  const bones = new Map<string, THREE.Bone>();
  root.traverse((o) => {
    if ((o as THREE.SkinnedMesh).isSkinnedMesh) mesh = o as THREE.SkinnedMesh;
    if ((o as THREE.Bone).isBone) bones.set(o.name, o as THREE.Bone);
  });
  if (!mesh) throw new Error("hand mesh not found");
  root.updateMatrixWorld(true);

  const get = (n: string) => {
    const b = bones.get(n);
    if (!b) throw new Error(`bone ${n} missing`);
    return b;
  };

  // Rebuild parent/child chains (attach keeps world transforms intact,
  // so the skin's bind pose stays valid).
  const wrist = get("wrist");
  const chain = (names: string[]) => {
    let parent: THREE.Object3D = wrist;
    for (const n of names) {
      const b = get(n);
      parent.attach(b);
      parent = b;
    }
  };
  FINGER_NAMES.forEach((f) =>
    chain(FINGER_JOINTS.map((j) => `${f}-finger-${j}`))
  );
  chain([...THUMB_JOINTS]);

  const rest = new Map<THREE.Bone, THREE.Quaternion>();
  bones.forEach((b) => rest.set(b, b.quaternion.clone()));

  return {
    root,
    mesh,
    fingers: FINGER_NAMES.map((f) =>
      ["phalanx-proximal", "phalanx-intermediate", "phalanx-distal"].map((j) =>
        get(`${f}-finger-${j}`)
      )
    ),
    thumb: [
      get("thumb-metacarpal"),
      get("thumb-phalanx-proximal"),
      get("thumb-phalanx-distal"),
    ],
    rest,
  };
}

/* ------------------------------------------------------------------ */
/* Skin material                                                       */
/* ------------------------------------------------------------------ */

/* Fingertips, knuckles and palm creases are naturally rosier. */
function paintSkinTones(mesh: THREE.SkinnedMesh, base: THREE.Color) {
  const geo = mesh.geometry;
  const idx = geo.getAttribute("skinIndex");
  const wgt = geo.getAttribute("skinWeight");
  const bones = mesh.skeleton.bones;
  const rosy = new Set<number>();
  const joints = new Set<number>();
  bones.forEach((b, i) => {
    if (/distal|tip/.test(b.name)) rosy.add(i);
    if (/intermediate|proximal/.test(b.name)) joints.add(i);
  });

  const warm = base.clone().lerp(new THREE.Color("#d9776a"), 0.45);
  const knuckle = base.clone().lerp(new THREE.Color("#c98a7a"), 0.25);
  const colors = new Float32Array(idx.count * 3);
  const c = new THREE.Color();
  for (let v = 0; v < idx.count; v++) {
    let tip = 0;
    let mid = 0;
    for (let k = 0; k < 4; k++) {
      const bi = idx.getComponent(v, k);
      const w = wgt.getComponent(v, k);
      if (rosy.has(bi)) tip += w;
      if (joints.has(bi)) mid += w;
    }
    c.copy(base).lerp(knuckle, Math.min(mid, 1) * 0.5).lerp(warm, Math.min(tip, 1) * 0.8);
    colors.set([c.r, c.g, c.b], v * 3);
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
}

/* Fine noise used as a bump map for pores and micro-wrinkles. */
function makeSkinBump() {
  const size = 256;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const n = 128 + (Math.random() - 0.5) * 70;
    data.set([n, n, n, 255], i * 4);
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.needsUpdate = true;
  return tex;
}

function makeSkinMaterial() {
  const mat = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.52,
    metalness: 0,
    specularIntensity: 0.55,
    clearcoat: 0.12,
    clearcoatRoughness: 0.45,
    sheen: 0.5,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color("#ff9e8a"),
    bumpMap: makeSkinBump(),
    bumpScale: 0.6,
  });

  // Cheap subsurface scattering: light bleeds red through thin edges.
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <opaque_fragment>",
      /* glsl */ `
        float sssRim = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.2);
        outgoingLight += vec3(0.75, 0.22, 0.14) * sssRim * 0.32;
        outgoingLight *= vec3(1.0, 0.985, 0.97);
        #include <opaque_fragment>
      `
    );
  };
  return mat;
}

/* ------------------------------------------------------------------ */
/* The animated hand                                                   */
/* ------------------------------------------------------------------ */
export interface HandControl {
  jump: number | null;
}

interface HandProps {
  mode: "spell" | "wave";
  word: string;
  skinTone: string;
  sleeve: string;
  onLetter?: (index: number) => void;
  control?: MutableRefObject<HandControl>;
  fixedPose?: string;
}

const HOLD = 1.3; // seconds per letter
const REST = 1.5; // seconds on the open hand between loops
const SCALE = 11;

/* hand follows the mouse on desktop and the gyroscope on phones */
const motion = { x: 0, y: 0 };

const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();
const qc = new THREE.Quaternion();
const AX = new THREE.Vector3(1, 0, 0);
const AY = new THREE.Vector3(0, 1, 0);
const AZ = new THREE.Vector3(0, 0, 1);

function Hand({
  mode,
  word,
  skinTone,
  sleeve,
  onLetter,
  control,
  fixedPose,
}: HandProps) {
  const gltf = useLoader(GLTFLoader, MODEL_URL);
  const group = useRef<THREE.Group>(null);

  const rig = useMemo(() => buildRig(gltf.scene), [gltf]);
  const skin = useMemo(() => makeSkinMaterial(), []);
  const cloth = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.9 }),
    []
  );

  useEffect(() => {
    paintSkinTones(rig.mesh, new THREE.Color(skinTone));
    rig.mesh.material = skin;
    rig.mesh.frustumCulled = false;
  }, [rig, skin, skinTone]);

  useEffect(() => {
    cloth.color.set(sleeve);
  }, [cloth, sleeve]);

  // Orient the model: fingers up, palm toward the camera.
  const orientation = useMemo(() => {
    const m = new THREE.Matrix4().makeBasis(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(-1, 0, 0)
    );
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, []);

  const letters = useMemo(
    () => word.split("").filter((l) => HANDSHAPES[l]),
    [word]
  );
  const current = useRef<number[]>(
    poseToArray(HANDSHAPES[fixedPose ?? "OPEN"] ?? HANDSHAPES.OPEN)
  );
  const state = useRef({ index: -1, timer: 0 });

  const applyPose = (p: number[]) => {
    for (let f = 0; f < 4; f++) {
      const o = f * 4;
      const [prox, mid, dist] = rig.fingers[f];
      // knuckle: spread (around Y) then bend toward the palm (around -X)
      qa.setFromAxisAngle(AY, p[o]);
      qb.setFromAxisAngle(AX, -p[o + 1]);
      prox.quaternion.copy(rig.rest.get(prox)!).multiply(qa).multiply(qb);
      qa.setFromAxisAngle(AX, -p[o + 2]);
      mid.quaternion.copy(rig.rest.get(mid)!).multiply(qa);
      qa.setFromAxisAngle(AX, -p[o + 3]);
      dist.quaternion.copy(rig.rest.get(dist)!).multiply(qa);
    }
    const t = 16;
    const [meta, prox, dist] = rig.thumb;
    qa.setFromAxisAngle(AX, -p[t]);
    qb.setFromAxisAngle(AY, p[t + 1]);
    qc.setFromAxisAngle(AZ, p[t + 2]);
    meta.quaternion.copy(rig.rest.get(meta)!).multiply(qb).multiply(qa).multiply(qc);
    qa.setFromAxisAngle(AX, -p[t + 3]);
    prox.quaternion.copy(rig.rest.get(prox)!).multiply(qa);
    qa.setFromAxisAngle(AX, -p[t + 4]);
    dist.quaternion.copy(rig.rest.get(dist)!).multiply(qa);
  };

  useEffect(
    () =>
      onMotion((x, y) => {
        motion.x = x * 2;
        motion.y = -y * 2;
      }),
    []
  );

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05);
    const time = clock.getElapsedTime();
    const s = state.current;

    let target: HandPose = HANDSHAPES.OPEN;
    if (fixedPose && HANDSHAPES[fixedPose]) {
      target = HANDSHAPES[fixedPose];
    } else if (mode === "spell" && letters.length > 0) {
      if (control?.current.jump != null) {
        s.index = control.current.jump;
        s.timer = 0;
        control.current.jump = null;
        onLetter?.(s.index);
      }
      s.timer += dt;
      if (s.timer > (s.index === -1 ? REST : HOLD)) {
        s.timer = 0;
        s.index = s.index + 1 >= letters.length ? -1 : s.index + 1;
        onLetter?.(s.index);
      }
      if (s.index >= 0) target = HANDSHAPES[letters[s.index]];
    }

    const goal = poseToArray(target);
    const k = fixedPose ? 1 : 1 - Math.exp(-dt * 8);
    const cur = current.current;
    for (let i = 0; i < cur.length; i++) cur[i] += (goal[i] - cur[i]) * k;
    applyPose(cur);

    const g = group.current;
    if (g) {
      const wave = mode === "wave" ? Math.sin(time * 5.5) * 0.3 : 0;
      const tz = wave + Math.sin(time * 0.8) * 0.03;
      const ty = motion.x * 0.5 + Math.sin(time * 0.6) * 0.06;
      const tx = -motion.y * 0.25;
      g.rotation.z += (tz - g.rotation.z) * (mode === "wave" ? 0.35 : 0.08);
      g.rotation.y += (ty - g.rotation.y) * 0.06;
      g.rotation.x += (tx - g.rotation.x) * 0.06;
      g.position.y = -1.15 + Math.sin(time * 1.2) * 0.04;
    }
  });

  // wrist sits at the model origin after centering below
  const wristOffset = useMemo(() => {
    const w = rig.root.getObjectByName("wrist")!;
    const p = new THREE.Vector3();
    w.getWorldPosition(p);
    return p;
  }, [rig]);

  return (
    <group ref={group} position={[0, -1.15, 0]}>
      <group quaternion={orientation} scale={SCALE}>
        <primitive
          object={rig.root}
          position={[-wristOffset.x, -wristOffset.y, -wristOffset.z]}
        />
      </group>
      {/* dark sleeve — interpreters traditionally wear black */}
      <mesh position={[0, -0.72, 0]} material={cloth}>
        <cylinderGeometry args={[0.36, 0.44, 1.3, 40]} />
      </mesh>
      <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]} material={cloth}>
        <torusGeometry args={[0.35, 0.05, 16, 48]} />
      </mesh>
    </group>
  );
}

/* Soft studio reflections without loading an HDR file. */
function StudioEnvironment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.7;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function useThemeColors() {
  const [colors, setColors] = useState({ brand: "#ba4f07", dark: false });
  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setColors({
        brand:
          getComputedStyle(root).getPropertyValue("--brand").trim() || "#ba4f07",
        dark: root.classList.contains("dark"),
      });
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);
  return colors;
}

export interface SigningHandCanvasProps {
  mode?: "spell" | "wave";
  word?: string;
  onLetter?: (index: number) => void;
  control?: MutableRefObject<HandControl>;
  cameraZ?: number;
  /** Render a single static handshape (e.g. "B") instead of animating. */
  fixedPose?: string;
  /** Base skin color of the hand. */
  skinTone?: string;
}

export default function SigningHandCanvas({
  mode = "spell",
  word = "LIBRAS",
  onLetter,
  control,
  cameraZ = 4.6,
  fixedPose,
  skinTone = "#b8795a",
}: SigningHandCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const { brand, dark } = useThemeColors();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0.35, cameraZ], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <StudioEnvironment />
        <hemisphereLight args={["#fff4ea", "#3a2a22", dark ? 0.5 : 0.8]} />
        {/* key light */}
        <directionalLight position={[2.5, 3.5, 4]} intensity={dark ? 2.2 : 2.6} color="#fff1e4" />
        {/* warm rim from behind gives the skin a translucent edge */}
        <directionalLight position={[-3, 2, -3]} intensity={dark ? 3 : 2} color={brand} />
        <directionalLight position={[3, -1, -2]} intensity={1.2} color="#ffd2b8" />
        <Suspense fallback={null}>
          <Hand
            mode={mode}
            word={word}
            skinTone={skinTone}
            sleeve={dark ? "#0d0b0a" : "#1b1815"}
            onLetter={onLetter}
            control={control}
            fixedPose={fixedPose}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
