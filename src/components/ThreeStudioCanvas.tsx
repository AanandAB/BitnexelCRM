'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Layers, 
  Globe,
  Cpu,
  Boxes,
  ArrowRight,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export type ModelType = 'processor' | 'globe' | 'spatial';

export interface ModelPreset {
  id: ModelType;
  name: string;
  tag: string;
  category: string;
  description: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  specs: { label: string; value: string }[];
}

export const MODEL_PRESETS: ModelPreset[] = [
  {
    id: 'processor',
    name: 'Quantum Compute Kernel',
    tag: 'CORE ENGINE',
    category: 'High-Throughput Systems',
    description: 'Proprietary native execution pipeline engineered with Go, Rust, and strict TypeScript. Sub-40ms P99 responses with zero runtime bloatware.',
    cameraPos: [0, 1.2, 4.4],
    targetPos: [0, 0, 0],
    specs: [
      { label: 'P99 Latency', value: '< 38ms' },
      { label: 'Cold Start', value: '0.00ms' },
      { label: 'Concurrency', value: '100k+ req/s' },
      { label: 'Architecture', value: 'Native Microservices' }
    ]
  },
  {
    id: 'globe',
    name: 'Global Distributed Mesh',
    tag: 'CLOUD INFRASTRUCTURE',
    category: 'Edge Network & SaaS',
    description: 'Multi-region edge network across 310+ global points of presence. Sub-second zero-roundtrip routing, multi-master replication, and automated failover.',
    cameraPos: [2.8, 1.6, 3.4],
    targetPos: [0, 0, 0],
    specs: [
      { label: 'Edge Locations', value: '310+ Global PoPs' },
      { label: 'Global TTFB', value: '< 45ms' },
      { label: 'Uptime SLA', value: '99.995%' },
      { label: 'Replication', value: 'Multi-Region ACID' }
    ]
  },
  {
    id: 'spatial',
    name: 'Spatial Software Platform',
    tag: 'FULL-STACK APPS',
    category: 'Enterprise Applications',
    description: 'Next-generation web applications, bespoke ERPs, and cloud SaaS platforms. Layered modular architecture with real-time state synchronization.',
    cameraPos: [2.4, 2.2, 3.6],
    targetPos: [0, 0.2, 0],
    specs: [
      { label: 'State Sync', value: '< 15ms' },
      { label: 'UI Frame Rate', value: '120 FPS' },
      { label: 'Security Standard', value: 'SOC2 / AES-256' },
      { label: 'Code Transfer', value: '100% Repository IP' }
    ]
  }
];

// Lightweight, Pleasant Web Audio Chime Engine
class AudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  public init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTone(freq = 520, duration = 0.12, type: OscillatorType = 'sine') {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, this.ctx.currentTime + duration * 0.6);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio playback fallback
    }
  }
}

const audioEngine = new AudioEngine();

interface ThreeStudioCanvasProps {
  activeModel?: ModelType;
  onSelectModel?: (model: ModelType) => void;
  onSelectDiscipline?: (disciplineKey: 'website' | 'software' | 'webapp') => void;
  className?: string;
}

export const ThreeStudioCanvas: React.FC<ThreeStudioCanvasProps> = ({
  activeModel = 'processor',
  onSelectModel,
  onSelectDiscipline,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentModel, setCurrentModel] = useState<ModelType>(activeModel);
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'exploded'>('solid');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [fps, setFps] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [selectedPartData, setSelectedPartData] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Sync external activeModel prop
  useEffect(() => {
    if (activeModel) {
      setCurrentModel(activeModel);
    }
  }, [activeModel]);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Model Groups
  const processorGroupRef = useRef<THREE.Group | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const spatialGroupRef = useRef<THREE.Group | null>(null);
  const clickableObjectsRef = useRef<THREE.Object3D[]>([]);
  const dataPacketsRef = useRef<{ mesh: THREE.Mesh; curve: THREE.Curve<THREE.Vector3>; t: number; speed: number }[]>([]);

  // Camera animation interpolation
  const activePreset = MODEL_PRESETS.find(p => p.id === currentModel) || MODEL_PRESETS[0];
  const targetCamPos = useRef(new THREE.Vector3(...activePreset.cameraPos));
  const currentCamPos = useRef(new THREE.Vector3(...activePreset.cameraPos));
  const targetLookAt = useRef(new THREE.Vector3(...activePreset.targetPos));
  const currentLookAt = useRef(new THREE.Vector3(...activePreset.targetPos));

  // Exploded CAD distance
  const currentExplode = useRef(0);
  const targetExplode = useRef(0);

  // Mouse / Touch Drag state
  const isDragging = useRef(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const previousMouse = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const raycaster = useRef(new THREE.Raycaster());
  const mouseCoords = useRef(new THREE.Vector2(-10, -10));

  // Update target camera when model changes
  useEffect(() => {
    const preset = MODEL_PRESETS.find(p => p.id === currentModel) || MODEL_PRESETS[0];
    targetCamPos.current.set(...preset.cameraPos);
    targetLookAt.current.set(...preset.targetPos);
    setSelectedPartData(null);

    // Show/hide respective model groups
    if (processorGroupRef.current) processorGroupRef.current.visible = currentModel === 'processor';
    if (globeGroupRef.current) globeGroupRef.current.visible = currentModel === 'globe';
    if (spatialGroupRef.current) spatialGroupRef.current.visible = currentModel === 'spatial';
  }, [currentModel]);

  // Audio Toggle
  const toggleSound = () => {
    audioEngine.init();
    audioEngine.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      audioEngine.playTone(660, 0.15);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(...activePreset.cameraPos);
    camera.lookAt(...activePreset.targetPos);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting System (Pleasant, Soft, Sophisticated)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLightKey = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLightKey.position.set(8, 14, 10);
    scene.add(dirLightKey);

    const indigoRimLight = new THREE.DirectionalLight(0x6366f1, 3.2);
    indigoRimLight.position.set(-10, -4, -8);
    scene.add(indigoRimLight);

    const skyFillLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    skyFillLight.position.set(6, -6, 6);
    scene.add(skyFillLight);

    const centerGlow = new THREE.PointLight(0x818cf8, 2.8, 14);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    clickableObjectsRef.current = [];
    dataPacketsRef.current = [];

    // ==========================================
    // MODEL 1: QUANTUM COMPUTE KERNEL (Processor)
    // ==========================================
    const processorGroup = new THREE.Group();
    scene.add(processorGroup);
    processorGroupRef.current = processorGroup;

    // Silicon Substrate PCB
    const pcbGeo = new THREE.BoxGeometry(2.6, 0.08, 2.6);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0f1422,
      metalness: 0.85,
      roughness: 0.25
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.y = -0.3;
    pcb.userData = {
      name: 'High-Density Silicon Substrate',
      tag: 'HARDWARE PLATFORM',
      desc: 'Multi-layer carrier architecture engineered with low dielectric loss and high-speed data interconnects.'
    };
    processorGroup.add(pcb);
    clickableObjectsRef.current.push(pcb);

    // Golden Circuit Traces on PCB
    const traceMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.2
    });
    for (let i = -1; i <= 1; i += 0.5) {
      const traceX = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.02, 0.04), traceMat);
      traceX.position.set(0, -0.25, i);
      processorGroup.add(traceX);

      const traceZ = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 2.3), traceMat);
      traceZ.position.set(i, -0.25, 0);
      processorGroup.add(traceZ);
    }

    // Heat Spreader Outer Shield
    const heatSpreaderGeo = new THREE.BoxGeometry(1.6, 0.14, 1.6);
    const heatSpreaderMat = new THREE.MeshStandardMaterial({
      color: 0x1e2438,
      metalness: 0.92,
      roughness: 0.2
    });
    const heatSpreader = new THREE.Mesh(heatSpreaderGeo, heatSpreaderMat);
    heatSpreader.position.y = -0.16;
    heatSpreader.userData = {
      name: 'Armored Heat Dissipation Module',
      tag: 'THERMAL REGULATION',
      desc: 'Precision copper-nickel vapor chamber ensuring zero thermal throttling during sustained high-concurrency spikes.'
    };
    processorGroup.add(heatSpreader);
    clickableObjectsRef.current.push(heatSpreader);

    // Central Crystalline Compute Core
    const coreGeo = new THREE.OctahedronGeometry(0.72, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.35,
      metalness: 0.2,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      transparent: true,
      opacity: 0.92
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.45;
    coreMesh.userData = {
      name: 'Zero-Baggage Compute Core',
      tag: 'RUNTIME KERNEL',
      desc: 'Sub-40ms P99 autonomous compute engine compiling to native binary execution targets.'
    };
    processorGroup.add(coreMesh);
    clickableObjectsRef.current.push(coreMesh);

    // Concentric Gimbal Rings
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.15
    });
    const ringInner = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.018, 16, 100), ringMat);
    ringInner.rotation.x = Math.PI / 3;
    ringInner.position.y = 0.45;
    processorGroup.add(ringInner);

    const ringOuter = new THREE.Mesh(new THREE.TorusGeometry(1.65, 0.018, 16, 100), ringMat);
    ringOuter.rotation.y = Math.PI / 4;
    ringOuter.rotation.x = -Math.PI / 6;
    ringOuter.position.y = 0.45;
    processorGroup.add(ringOuter);

    // 4 Orbiting Microservice Satellites with connecting laser beams
    const satConfigs = [
      { name: 'Digital Flagships', pos: new THREE.Vector3(1.8, 0.6, 0.6), color: 0x38bdf8, discipline: 'website' as const },
      { name: 'Custom ERP & Software', pos: new THREE.Vector3(-1.7, 0.8, 0.9), color: 0x10b981, discipline: 'software' as const },
      { name: 'Cloud SaaS Platform', pos: new THREE.Vector3(0.2, -0.1, -1.8), color: 0xa855f7, discipline: 'webapp' as const },
      { name: 'Edge Telemetry Gateway', pos: new THREE.Vector3(-1.2, 0.3, -1.4), color: 0x6366f1, discipline: 'software' as const }
    ];

    satConfigs.forEach(sat => {
      const satMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({
          color: sat.color,
          metalness: 0.85,
          roughness: 0.2,
          emissive: sat.color,
          emissiveIntensity: 0.4
        })
      );
      satMesh.position.copy(sat.pos);
      satMesh.userData = {
        name: sat.name,
        tag: 'SPECIALIZED DISCIPLINE',
        desc: `High-performance production module tailored for commercial enterprise environments.`,
        discipline: sat.discipline
      };
      processorGroup.add(satMesh);
      clickableObjectsRef.current.push(satMesh);

      // Curved data curve to core
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.45, 0),
        new THREE.Vector3(sat.pos.x * 0.5, sat.pos.y * 0.5 + 0.3, sat.pos.z * 0.5),
        sat.pos
      );
      const curveGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(30));
      const curveMat = new THREE.LineBasicMaterial({ color: sat.color, transparent: true, opacity: 0.35 });
      processorGroup.add(new THREE.Line(curveGeo, curveMat));

      // Flowing packet
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      processorGroup.add(packet);
      dataPacketsRef.current.push({
        mesh: packet,
        curve,
        t: Math.random(),
        speed: 0.005 + Math.random() * 0.003
      });
    });

    // ==============================================
    // MODEL 2: GLOBAL DISTRIBUTED CLOUD MESH (Globe)
    // ==============================================
    const globeGroup = new THREE.Group();
    globeGroup.visible = false;
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // Outer Illuminated Holographic Globe
    const globeRadius = 1.65;
    const globeSphereGeo = new THREE.SphereGeometry(globeRadius, 36, 36);
    const globeSphereMat = new THREE.MeshStandardMaterial({
      color: 0x0c101d,
      metalness: 0.9,
      roughness: 0.25,
      wireframe: false
    });
    const globeSphere = new THREE.Mesh(globeSphereGeo, globeSphereMat);
    globeGroup.add(globeSphere);

    // Wireframe Grid Overlay for globe
    const wireframeGlobe = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius + 0.015, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.22
      })
    );
    globeGroup.add(wireframeGlobe);

    // Atmospheric Glow Shell
    const auraShell = new THREE.Mesh(
      new THREE.SphereGeometry(globeRadius + 0.12, 32, 32),
      new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
      })
    );
    globeGroup.add(auraShell);

    // Key Tech Hub Cities on the Globe (lat, lng coords)
    const hubs = [
      { name: 'San Francisco (US-West)', lat: 37.77, lng: -122.41, color: 0x38bdf8 },
      { name: 'New York (US-East)', lat: 40.71, lng: -74.00, color: 0x6366f1 },
      { name: 'London (EU-West)', lat: 51.50, lng: -0.12, color: 0x38bdf8 },
      { name: 'Frankfurt (EU-Central)', lat: 50.11, lng: 8.68, color: 0x10b981 },
      { name: 'Dubai (ME-South)', lat: 25.20, lng: 55.27, color: 0xf59e0b },
      { name: 'Singapore (AP-SE)', lat: 1.35, lng: 103.81, color: 0xa855f7 },
      { name: 'Tokyo (AP-NE)', lat: 35.67, lng: 139.65, color: 0x38bdf8 }
    ];

    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const hubPoints: { name: string; pos: THREE.Vector3; color: number }[] = [];

    hubs.forEach(hub => {
      const pos = latLngToVector3(hub.lat, hub.lng, globeRadius + 0.04);
      hubPoints.push({ name: hub.name, pos, color: hub.color });

      // Beacon Pin
      const pinGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);
      const pinMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
      globeGroup.add(pin);

      // Beacon Head
      const headGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const headMat = new THREE.MeshStandardMaterial({
        color: hub.color,
        emissive: hub.color,
        emissiveIntensity: 0.7,
        metalness: 0.6,
        roughness: 0.2
      });
      const head = new THREE.Mesh(headGeo, headMat);
      const headPos = pos.clone().add(pos.clone().normalize().multiplyScalar(0.12));
      head.position.copy(headPos);
      head.userData = {
        name: hub.name,
        tag: 'GLOBAL EDGE POP',
        desc: `Sub-15ms regional edge point with active zero-downtime health clustering and cache warmers.`
      };
      globeGroup.add(head);
      clickableObjectsRef.current.push(head);
    });

    // Connect Hubs with Spline Data Arcs
    for (let i = 0; i < hubPoints.length; i++) {
      const nextIdx = (i + 1) % hubPoints.length;
      const start = hubPoints[i].pos;
      const end = hubPoints[nextIdx].pos;
      const distance = start.distanceTo(end);

      // Midpoint elevated above globe surface for parabolic arc
      const mid = start.clone().add(end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(globeRadius + 0.35 + distance * 0.15);

      const arcCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const arcPoints = arcCurve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPoints);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.4
      });
      globeGroup.add(new THREE.Line(arcGeo, arcMat));

      // Flowing data packet on arc
      const arcPacket = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      globeGroup.add(arcPacket);
      dataPacketsRef.current.push({
        mesh: arcPacket,
        curve: arcCurve,
        t: Math.random(),
        speed: 0.006 + Math.random() * 0.004
      });
    }

    // Outer Orbiting Satellite Ring
    const satOrbit = new THREE.Mesh(
      new THREE.TorusGeometry(globeRadius + 0.65, 0.015, 16, 120),
      new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.4 })
    );
    satOrbit.rotation.x = Math.PI / 3;
    globeGroup.add(satOrbit);

    // ==============================================
    // MODEL 3: SPATIAL SOFTWARE PLATFORM (App Stack)
    // ==============================================
    const spatialGroup = new THREE.Group();
    spatialGroup.visible = false;
    scene.add(spatialGroup);
    spatialGroupRef.current = spatialGroup;

    // Multi-tier Layered Platform Architecture
    // Layer 1 (Bottom): Database Tier
    const dbPlatterGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.18, 32);
    const dbPlatterMat = new THREE.MeshStandardMaterial({
      color: 0x141a2c,
      metalness: 0.88,
      roughness: 0.22
    });
    const dbPlatter = new THREE.Mesh(dbPlatterGeo, dbPlatterMat);
    dbPlatter.position.y = -0.9;
    dbPlatter.userData = {
      name: 'Persistent Distributed Storage (ACID)',
      tag: 'DATA ENGINE',
      desc: 'Multi-region PostgreSQL clustering with read-replicas, continuous WAL backups, and sub-10ms query execution.'
    };
    spatialGroup.add(dbPlatter);
    clickableObjectsRef.current.push(dbPlatter);

    // Database Cylinders on platter
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const cylMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.32, 16),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.8,
          roughness: 0.2,
          emissive: 0x0284c7,
          emissiveIntensity: 0.3
        })
      );
      cylMesh.position.set(Math.cos(angle) * 0.9, -0.65, Math.sin(angle) * 0.9);
      cylMesh.userData = {
        name: `Database Shard 0${i + 1}`,
        tag: 'CLUSTER REPLICA',
        desc: `Active-active distributed node ensuring 99.999% data durability.`
      };
      spatialGroup.add(cylMesh);
      clickableObjectsRef.current.push(cylMesh);
    }

    // Layer 2 (Middle): Microservice Compute Mesh
    const computeMeshGeo = new THREE.BoxGeometry(2.2, 0.1, 2.2);
    const computeMeshMat = new THREE.MeshStandardMaterial({
      color: 0x1a2136,
      metalness: 0.9,
      roughness: 0.2
    });
    const computeMesh = new THREE.Mesh(computeMeshGeo, computeMeshMat);
    computeMesh.position.y = 0.05;
    computeMesh.userData = {
      name: 'Event-Driven Microservices Layer',
      tag: 'BACKEND SERVICES',
      desc: 'Stateless containerized services with gRPC communication, Redis caching, and automated autoscaling.'
    };
    spatialGroup.add(computeMesh);
    clickableObjectsRef.current.push(computeMesh);

    // Microservice Floating Cubes
    const serviceColors = [0x6366f1, 0x10b981, 0xf59e0b, 0xa855f7];
    const serviceNames = ['Auth & RBAC Service', 'Billing & Stripe Gateway', 'Real-time WebSockets Engine', 'Analytics & Telemetry'];
    const serviceOffsets = [
      [-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]
    ];

    serviceOffsets.forEach(([ox, oz], i) => {
      const sMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.32, 0.4),
        new THREE.MeshStandardMaterial({
          color: serviceColors[i],
          metalness: 0.8,
          roughness: 0.2,
          emissive: serviceColors[i],
          emissiveIntensity: 0.35
        })
      );
      sMesh.position.set(ox, 0.32, oz);
      sMesh.userData = {
        name: serviceNames[i],
        tag: 'ISOLATED SERVICE',
        desc: `Independently deployable high-throughput service container.`
      };
      spatialGroup.add(sMesh);
      clickableObjectsRef.current.push(sMesh);
    });

    // Layer 3 (Top): Spatial Glass UI Platform with Holographic Cards
    const glassUIGeo = new THREE.BoxGeometry(2.4, 0.06, 2.4);
    const glassUIMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.8,
      thickness: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85
    });
    const glassUI = new THREE.Mesh(glassUIGeo, glassUIMat);
    glassUI.position.y = 0.95;
    glassUI.userData = {
      name: 'Reactive Client UI & 3D Spatial Canvas',
      tag: 'PRESENTATION TIER',
      desc: 'Sub-second digital flagship interfaces built with React 19, Tailwind CSS, and WebGL kinetic physics.'
    };
    spatialGroup.add(glassUI);
    clickableObjectsRef.current.push(glassUI);

    // Floating UI Metric Bars on Top Glass
    const barHeights = [0.45, 0.7, 0.55, 0.85, 0.6];
    barHeights.forEach((h, i) => {
      const barMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, h, 0.16),
        new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.7,
          roughness: 0.2,
          emissive: 0x0284c7,
          emissiveIntensity: 0.4
        })
      );
      barMesh.position.set(-0.7 + i * 0.35, 1.0 + h / 2, -0.4);
      barMesh.userData = {
        name: `Conversion Growth Metric #0${i + 1}`,
        tag: 'LIVE TELEMETRY',
        desc: `Verified commercial performance tracking showing immediate revenue uplift.`
      };
      spatialGroup.add(barMesh);
      clickableObjectsRef.current.push(barMesh);
    });

    // Deep Atmospheric Particle Field (Warm, subtle stars)
    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.035,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 6. Animation Loop (Silky 60+ FPS)
    let frameCounter = 0;
    let fpsTimer = performance.now();

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // FPS tracking
      frameCounter++;
      if (time - fpsTimer >= 1000) {
        setFps(frameCounter);
        frameCounter = 0;
        fpsTimer = time;
      }

      // Smooth Camera LERP towards target
      currentCamPos.current.lerp(targetCamPos.current, 0.045);
      camera.position.copy(currentCamPos.current);

      // Gentle Mouse Parallax tilt
      if (!isDragging.current) {
        camera.position.x += (mousePos.current.x * 0.35 - (camera.position.x - targetCamPos.current.x)) * 0.02;
        camera.position.y += (-mousePos.current.y * 0.35 - (camera.position.y - targetCamPos.current.y)) * 0.02;
      }

      currentLookAt.current.lerp(targetLookAt.current, 0.045);
      camera.lookAt(currentLookAt.current);

      // Rotate active model
      if (isAutoRotating && !isDragging.current) {
        if (processorGroup.visible) {
          processorGroup.rotation.y += 0.003;
          processorGroup.rotation.x = Math.sin(time * 0.0006) * 0.08;
        }
        if (globeGroup.visible) {
          globeGroup.rotation.y += 0.004;
          globeGroup.rotation.x = 0.15;
        }
        if (spatialGroup.visible) {
          spatialGroup.rotation.y += 0.003;
          spatialGroup.rotation.x = Math.sin(time * 0.0005) * 0.06;
        }
      } else if (!isAutoRotating && !isDragging.current) {
        const targetRotGroup = processorGroup.visible ? processorGroup : globeGroup.visible ? globeGroup : spatialGroup;
        targetRotGroup.rotation.y += rotationVelocity.current.y;
        targetRotGroup.rotation.x += rotationVelocity.current.x;
        rotationVelocity.current.x *= 0.93;
        rotationVelocity.current.y *= 0.93;
      }

      // Internal spins & pulses
      coreMesh.rotation.y -= 0.005;
      coreMesh.rotation.z += 0.003;
      ringInner.rotation.z += 0.003;
      ringOuter.rotation.z -= 0.002;

      // Data packets animation
      dataPacketsRef.current.forEach(pkt => {
        pkt.t = (pkt.t + pkt.speed) % 1;
        const pos = pkt.curve.getPoint(pkt.t);
        pkt.mesh.position.copy(pos);
      });

      // Background particle drift
      particles.rotation.y += 0.0004;

      renderer.render(scene, camera);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // 7. Pointer & Touch Interactions
    const dom = renderer.domElement;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = dom.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouseCoords.current.x = (clientX / rect.width) * 2 - 1;
      mouseCoords.current.y = -(clientY / rect.height) * 2 + 1;

      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      // Handle Drag Rotation
      if (isDragging.current) {
        const deltaX = e.clientX - previousMouse.current.x;
        const deltaY = e.clientY - previousMouse.current.y;

        const targetRotGroup = processorGroup.visible ? processorGroup : globeGroup.visible ? globeGroup : spatialGroup;
        targetRotGroup.rotation.y += deltaX * 0.007;
        targetRotGroup.rotation.x += deltaY * 0.007;

        rotationVelocity.current = {
          x: deltaY * 0.002,
          y: deltaX * 0.002
        };

        previousMouse.current = { x: e.clientX, y: e.clientY };
        return;
      }

      // Raycasting for interactive 3D elements
      if (cameraRef.current) {
        raycaster.current.setFromCamera(mouseCoords.current, cameraRef.current);
        const visibleObjects = clickableObjectsRef.current.filter(obj => obj.visible && obj.parent?.visible);
        const intersects = raycaster.current.intersectObjects(visibleObjects, true);

        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          if (hitObj.userData && hitObj.userData.name) {
            dom.style.cursor = 'pointer';
            setHoveredPart(hitObj.userData.name);
            setTooltipPos({ x: clientX, y: clientY });
            return;
          }
        }

        dom.style.cursor = isDragging.current ? 'grabbing' : 'grab';
        setHoveredPart(null);
        setTooltipPos(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
      audioEngine.init();
    };

    const handleMouseUp = (e: MouseEvent) => {
      isDragging.current = false;
      const delta = Math.hypot(e.clientX - previousMouse.current.x, e.clientY - previousMouse.current.y);

      // If click without dragging, perform Raycast Selection
      if (delta < 5 && cameraRef.current) {
        const rect = dom.getBoundingClientRect();
        mouseCoords.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseCoords.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.current.setFromCamera(mouseCoords.current, cameraRef.current);
        const visibleObjects = clickableObjectsRef.current.filter(obj => obj.visible && obj.parent?.visible);
        const intersects = raycaster.current.intersectObjects(visibleObjects, true);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.name) {
            audioEngine.playTone(880, 0.16, 'triangle');
            setSelectedPartData(hit.userData);

            // Smooth camera focus zoom towards hit item
            if (hit.position) {
              targetLookAt.current.copy(hit.position);
              targetCamPos.current.set(
                hit.position.x * 1.4 + 1.0,
                hit.position.y * 1.4 + 0.8,
                hit.position.z * 1.4 + 2.4
              );
            }
          }
        }
      }
    };

    // Touch Support (Ensures mobile page can scroll smoothly unless explicitly dragging canvas)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        audioEngine.init();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouse.current.x;
      const deltaY = e.touches[0].clientY - previousMouse.current.y;

      const targetRotGroup = processorGroup.visible ? processorGroup : globeGroup.visible ? globeGroup : spatialGroup;
      targetRotGroup.rotation.y += deltaX * 0.007;
      targetRotGroup.rotation.x += deltaY * 0.007;

      previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update render mode (solid vs wireframe vs exploded)
  useEffect(() => {
    const isWire = renderMode === 'wireframe';
    clickableObjectsRef.current.forEach(obj => {
      if (obj instanceof THREE.Mesh && obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => { m.wireframe = isWire; });
        } else {
          obj.material.wireframe = isWire;
        }
      }
    });
  }, [renderMode]);

  const handleSelectModelInternal = (model: ModelType) => {
    setCurrentModel(model);
    if (onSelectModel) onSelectModel(model);
    audioEngine.playTone(560, 0.12);
  };

  return (
    <div 
      className={`relative select-none transition-all duration-300 ${
        isFullScreen 
          ? 'fixed inset-0 z-50 bg-[#08090E] w-screen h-screen' 
          : `w-full h-full min-h-[460px] sm:min-h-[540px] lg:min-h-[640px] rounded-2xl overflow-hidden bg-[#0D1019]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl ${className}`
      }`}
    >
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing" 
      />

      {/* Floating 3D Hover Tooltip */}
      {hoveredPart && tooltipPos && (
        <div 
          className="absolute pointer-events-none z-30 px-3 py-1.5 rounded-xl bg-[#0F1320]/95 border border-indigo-500/40 text-xs text-white shadow-2xl backdrop-blur-md transform -translate-x-1/2 -translate-y-12 animate-in fade-in"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span>Click to Inspect · {hoveredPart}</span>
          </div>
        </div>
      )}

      {/* Top HUD: Model Switcher & Telemetry Controls */}
      <div className="absolute top-4 left-4 right-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pointer-events-none z-20">
        {/* Left: Model Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-[#0E111A]/90 p-1.5 rounded-xl border border-white/[0.08] shadow-xl backdrop-blur-xl pointer-events-auto">
          {MODEL_PRESETS.map((preset) => {
            const isSelected = currentModel === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectModelInternal(preset.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all ${
                  isSelected
                    ? 'bg-white text-[#08090E] font-semibold shadow-md shadow-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {preset.id === 'processor' && <Cpu className="w-3.5 h-3.5 text-indigo-500" />}
                {preset.id === 'globe' && <Globe className="w-3.5 h-3.5 text-sky-500" />}
                {preset.id === 'spatial' && <Boxes className="w-3.5 h-3.5 text-emerald-500" />}
                <span>{preset.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Render Controls, Sound & Fullscreen */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 pointer-events-auto">
          <div className="flex items-center gap-1 bg-[#0E111A]/90 p-1.5 rounded-xl border border-white/[0.08] shadow-xl backdrop-blur-xl">
            <button
              type="button"
              onClick={() => {
                setRenderMode(renderMode === 'wireframe' ? 'solid' : 'wireframe');
                audioEngine.playTone(600, 0.1);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                renderMode === 'wireframe'
                  ? 'bg-sky-500 text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Wireframe
            </button>

            <button
              type="button"
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              title={isAutoRotating ? 'Pause Orbit' : 'Auto Rotate'}
              className={`p-1.5 rounded-lg transition-colors ${
                isAutoRotating ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            </button>

            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute Audio Chimes' : 'Enable Audio Chimes'}
              className={`p-1.5 rounded-lg transition-colors ${
                soundEnabled
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFullScreen(!isFullScreen);
                audioEngine.playTone(740, 0.12);
              }}
              title={isFullScreen ? 'Exit Fullscreen' : 'Expand 3D Stage'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4 text-indigo-400" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E111A]/90 border border-white/[0.08] text-xs font-mono text-slate-400 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold">{fps} FPS</span>
          </div>
        </div>
      </div>

      {/* Selected 3D Node Popover Inspector */}
      {selectedPartData && (
        <div className="absolute top-20 right-4 max-w-sm w-full p-5 rounded-2xl bg-[#0F1320]/95 border border-indigo-500/30 z-30 shadow-2xl backdrop-blur-2xl animate-in fade-in pointer-events-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-wider uppercase">
              {selectedPartData.tag || 'SPECIFICATION'}
            </span>
            <button 
              type="button"
              onClick={() => {
                setSelectedPartData(null);
                targetLookAt.current.set(...activePreset.targetPos);
                targetCamPos.current.set(...activePreset.cameraPos);
              }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            <h4 className="text-base font-display font-bold text-white">
              {selectedPartData.name}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedPartData.desc || selectedPartData.description}
            </p>

            {selectedPartData.discipline && onSelectDiscipline && (
              <button
                type="button"
                onClick={() => {
                  onSelectDiscipline(selectedPartData.discipline);
                  if (isFullScreen) setIsFullScreen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#090A10] font-semibold text-xs transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Inspect Discipline Details</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom Model Details & Technical Telemetry Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0E111A]/95 p-4 sm:p-5 rounded-2xl border border-white/[0.08] pointer-events-auto backdrop-blur-2xl shadow-2xl">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
            {activePreset.id === 'processor' && <Cpu className="w-5 h-5" />}
            {activePreset.id === 'globe' && <Globe className="w-5 h-5" />}
            {activePreset.id === 'spatial' && <Boxes className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-display font-bold text-white leading-tight">
                {activePreset.name}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300 font-semibold uppercase">
                {activePreset.tag}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-1 max-w-xl">
              {activePreset.description}
            </p>
          </div>
        </div>

        {/* Live Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.08]">
          {activePreset.specs.map((spec, i) => (
            <div key={i} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="text-[10px] text-slate-400 font-medium">{spec.label}</div>
              <div className="text-xs font-semibold text-white mt-0.5">{spec.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
