import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { GraphicsPalette } from './Header';

interface FluidShaderCanvasProps {
  palette?: GraphicsPalette;
  className?: string;
}

const PALETTE_COLORS: Record<GraphicsPalette, { primary: string; accent: string; bg: string }> = {
  saphir:    { primary: '#2563EB', accent: '#F59E0B', bg: '#0A0E17' },
  mandarine: { primary: '#FF5C00', accent: '#6366F1', bg: '#0F1115' },
  carmin:    { primary: '#E11D48', accent: '#38BDF8', bg: '#0B0D13' },
  cyan:      { primary: '#06B6D4', accent: '#F97316', bg: '#040711' },
  monochrome:{ primary: '#E2E8F0', accent: '#D4AF37', bg: '#0B0D11' },
};

// GLSL Vertex Shader: Multi-octave algorithmic wave topography with interactive mouse ripple
const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Dynamic wave harmonics representing urban transport flows
    float wave1 = sin(modelPosition.x * 0.18 + uTime * 0.7) * cos(modelPosition.y * 0.18 + uTime * 0.5) * 1.5;
    float wave2 = sin(modelPosition.x * 0.35 - uTime * 0.45 + modelPosition.y * 0.28) * 0.75;
    float wave3 = sin(modelPosition.y * 0.65 + uTime * 0.95) * 0.35;

    // Interactive mouse displacement ripple
    float distToMouse = distance(uv, uMouse);
    float mouseRipple = sin(distToMouse * 14.0 - uTime * 3.5) * exp(-distToMouse * 3.8) * 0.4;

    float elevation = wave1 + wave2 + wave3 + mouseRipple;
    modelPosition.z += elevation;

    vElevation = elevation;
    vPosition = modelPosition.xyz;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

// GLSL Fragment Shader: Procedural telematics grid lines & dynamic chromatic mesh blending
const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vPosition;
  uniform vec3 uColorPrimary;
  uniform vec3 uColorAccent;
  uniform vec3 uColorDark;
  uniform float uTime;
  uniform vec2 uMouse;

  void main() {
    // Procedural antialiased telematics grid lines via screen-space derivatives
    float gridFreq = 28.0;
    float gridX = abs(fract(vUv.x * gridFreq - 0.5) - 0.5) / fwidth(vUv.x * gridFreq);
    float gridY = abs(fract(vUv.y * gridFreq - 0.5) - 0.5) / fwidth(vUv.y * gridFreq);
    float gridLine = 1.0 - min(min(gridX, gridY), 1.0);

    // Height-based chromatic ramp
    float mixFactor = smoothstep(-2.2, 2.4, vElevation);
    vec3 surfaceColor = mix(uColorDark, uColorPrimary, mixFactor * 0.82);

    // Interactive mouse proximity halo
    float distToMouse = distance(vUv, uMouse);
    float mouseGlow = smoothstep(0.38, 0.02, distToMouse);
    surfaceColor = mix(surfaceColor, uColorAccent, mouseGlow * 0.45 + pow(mixFactor, 2.4) * 0.35);

    // Additive grid line illumination
    surfaceColor += uColorAccent * gridLine * 0.16;

    // Edge falloff vignette to blend directly into surrounding container
    float edgeFadeX = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
    float edgeFadeY = smoothstep(0.0, 0.16, vUv.y) * smoothstep(1.0, 0.84, vUv.y);
    float alpha = edgeFadeX * edgeFadeY * 0.82;

    gl_FragColor = vec4(surfaceColor, alpha);
  }
`;

// Helper: parse hex color into THREE.Color safely
function parseCssColor(cssColorStr: string, fallback: string): THREE.Color {
  const trimmed = cssColorStr.trim();
  if (trimmed.startsWith('#')) {
    return new THREE.Color(trimmed);
  }
  return new THREE.Color(fallback);
}

export const FluidShaderCanvas: React.FC<FluidShaderCanvasProps> = ({ palette, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -18, 32);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Group for unified spatial motion
    const fluidGroup = new THREE.Group();
    scene.add(fluidGroup);

    // Read initial computed CSS variables or selected palette configuration
    const computedStyle = window.getComputedStyle(document.documentElement);
    const palConfig = palette ? PALETTE_COLORS[palette] : null;
    const initialPrimary = palConfig ? new THREE.Color(palConfig.primary) : parseCssColor(computedStyle.getPropertyValue('--brand-primary'), '#FF5C00');
    const initialAccent = palConfig ? new THREE.Color(palConfig.accent) : parseCssColor(computedStyle.getPropertyValue('--brand-accent'), '#6366F1');
    const initialDark = palConfig ? new THREE.Color(palConfig.bg) : parseCssColor(computedStyle.getPropertyValue('--brand-canvas-dark'), '#0F1115');

    // 1. Fluid Shader Plane
    const planeGeo = new THREE.PlaneGeometry(48, 36, 72, 72);
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uColorPrimary: { value: initialPrimary },
      uColorAccent: { value: initialAccent },
      uColorDark: { value: initialDark },
    };

    const planeMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    fluidGroup.add(planeMesh);

    // 2. Floating Telematics Particles (Luminous Fleet Nodes)
    const particleCount = 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const px = (Math.random() - 0.5) * 44;
      const py = (Math.random() - 0.5) * 32;
      const pz = Math.random() * 5 + 0.5;

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      const pickAccent = Math.random() > 0.45;
      const c = pickAccent ? initialAccent : initialPrimary;
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.65,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particlePoints = new THREE.Points(particleGeo, particleMat);
    fluidGroup.add(particlePoints);

    // 3. Mouse Tracking & Target Parallax
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;
    let currentMouseX = 0.5;
    let currentMouseY = 0.5;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      const normY = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);

      targetMouseX = normX;
      targetMouseY = 1.0 - normY;

      targetRotY = (normX - 0.5) * 0.22;
      targetRotX = (normY - 0.5) * 0.14;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 4. Dynamic Palette Sync via MutationObserver
    const observer = new MutationObserver(() => {
      const cs = window.getComputedStyle(document.documentElement);
      const newP = parseCssColor(cs.getPropertyValue('--brand-primary'), '#FF5C00');
      const newA = parseCssColor(cs.getPropertyValue('--brand-accent'), '#6366F1');
      const newD = parseCssColor(cs.getPropertyValue('--brand-canvas-dark'), '#0F1115');

      uniforms.uColorPrimary.value.copy(newP);
      uniforms.uColorAccent.value.copy(newA);
      uniforms.uColorDark.value.copy(newD);

      // Refresh particle colors
      const colors = particleGeo.attributes.color.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const isA = (i % 2 === 0);
        const c = isA ? newA : newP;
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      particleGeo.attributes.color.needsUpdate = true;
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });

    // 5. Resize Listener
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 6. Animation Loop with Visibility Throttling
    let animId: number;
    const startTime = performance.now();

    // Viewport IntersectionObserver to prevent offscreen rendering
    let isVisible = true;
    const viewObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    viewObserver.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isVisible || document.hidden) return;

      const elapsed = (performance.now() - startTime) * 0.001;
      uniforms.uTime.value = elapsed;

      // Mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      if (!prefersReducedMotion) {
        fluidGroup.rotation.z = Math.sin(elapsed * 0.12) * 0.03;
        fluidGroup.rotation.x = -0.38 + targetRotX;
        fluidGroup.rotation.y = targetRotY;

        // Subtle particle drift
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 2] = 0.5 + Math.sin(elapsed * 0.8 + i) * 1.5;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      viewObserver.disconnect();
      cancelAnimationFrame(animId);

      planeGeo.dispose();
      planeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [palette]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
