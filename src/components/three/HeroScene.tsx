"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { onMotion } from "@/lib/motionInput";

/* ------------------------------------------------------------------ */
/* Shared pointer state (window-level, so the canvas can stay          */
/* pointer-events: none and never block clicks on the hero content).   */
/* ------------------------------------------------------------------ */
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

function usePointerTracking() {
  // mouse on desktop, gyroscope (or a slow drift) on phones
  useEffect(
    () =>
      onMotion((x, y) => {
        pointer.tx = x * 2;
        pointer.ty = -y * 2;
      }),
    []
  );
}

/* Reads the brand color from CSS tokens and follows light/dark toggles. */
function useBrandColor() {
  const [color, setColor] = useState("#ba4f07");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => {
      const value = getComputedStyle(root).getPropertyValue("--brand").trim();
      if (value) setColor(value);
      setIsDark(root.classList.contains("dark"));
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return { color, isDark };
}

/* ------------------------------------------------------------------ */
/* Particle wave: a grid of points displaced in the vertex shader.     */
/* The pointer pushes a ripple through the field.                      */
/* ------------------------------------------------------------------ */
const waveVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vLift;

  void main() {
    vec3 p = position;
    float wave =
      sin(p.x * 0.35 + uTime * 0.9) * 0.45 +
      cos(p.z * 0.55 + uTime * 0.7) * 0.35 +
      sin((p.x + p.z) * 0.18 + uTime * 0.5) * 0.4;

    float d = distance(p.xz, uMouse);
    float ripple = exp(-d * 0.45) * sin(d * 1.6 - uTime * 3.0) * 0.9;

    p.y += wave + ripple;
    vLift = clamp(ripple * 1.4 + 0.2, 0.0, 1.0);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (2.6 + vLift * 3.0) * uPixelRatio * (11.0 / -mv.z);

    // fade toward the far edge and the sides
    float edge = smoothstep(16.0, 8.0, abs(p.x)) * smoothstep(-11.0, -4.0, p.z);
    vAlpha = edge;
  }
`;

const waveFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vLift;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = smoothstep(0.5, 0.1, r);
    vec3 col = mix(uColor, vec3(1.0, 0.85, 0.6), vLift * 0.55);
    gl_FragColor = vec4(col, soft * vAlpha * uOpacity * (0.45 + vLift));
  }
`;

function ParticleWave({ color, isDark }: { color: string; isDark: boolean }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { gl } = useThree();

  const geometry = useMemo(() => {
    const cols = 140;
    const rows = 70;
    const positions = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        positions[i++] = (c / (cols - 1) - 0.5) * 34;
        positions[i++] = 0;
        positions[i++] = (r / (rows - 1)) * 17 - 12;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: 1 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uColor.value.set(color);
    uniforms.uOpacity.value = isDark ? 1 : 0.85;
  }, [color, isDark, uniforms]);

  useFrame((_, delta) => {
    uniforms.uTime.value += delta;
    uniforms.uMouse.value.set(pointer.x * 12, -pointer.y * 5 - 3);
  });

  return (
    <points geometry={geometry} position={[0, -2.2, 0]}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={waveVertex}
        fragmentShader={waveFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

/* Smooth pointer easing + subtle camera parallax. */
function Rig() {
  useFrame(({ camera }, delta) => {
    const k = 1 - Math.pow(0.001, delta);
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
    camera.position.x = pointer.x * 0.8;
    camera.position.y = 2.2 + pointer.y * 0.5;
    camera.lookAt(0, 0.4, 0);
  });
  return null;
}

export default function HeroScene() {
  usePointerTracking();
  const { color, isDark } = useBrandColor();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting)
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frameloop = reduceMotion ? "demand" : visible ? "always" : "never";

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.2, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Rig />
        <ParticleWave color={color} isDark={isDark} />
      </Canvas>
    </div>
  );
}
