import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, Html, useTexture } from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { products, atlasCrop } from "../../data/products";
import type { Product } from "../../data/products";
import { useReducedMotion } from "../../hooks/useMotion";
import { ProductVisual } from "../ui/ProductVisual";

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function ContextMonitor({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => {
      event.preventDefault();
      onLost();
    };
    canvas.addEventListener("webglcontextlost", lost);
    // Remove our listener before R3F deliberately disposes its context on unmount.
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onLost]);
  return null;
}
function Photo({
  product,
  opacity,
  reduced,
}: {
  product: Product;
  opacity: number;
  reduced: boolean;
}) {
  const crop = atlasCrop(product);
  const source = useTexture(crop.src);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const initialOpacity = useRef(opacity);
  const invalidate = useThree((state) => state.invalidate);
  const texture = useMemo(() => {
    const t = source.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(crop.width / crop.total, 1);
    t.offset.set(crop.x / crop.total, 0);
    t.needsUpdate = true;
    return t;
  }, [source, crop.width, crop.total, crop.x]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    if (!material.current) return;
    const tween = gsap.to(material.current, {
      opacity,
      duration: reduced ? 0 : 1.2,
      ease: "power2.inOut",
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [opacity, reduced, invalidate]);
  return (
    <mesh>
      <planeGeometry args={[(4.15 * crop.width) / crop.height, 4.15]} />
      <meshBasicMaterial
        ref={material}
        map={texture}
        transparent
        alphaTest={0.015}
        opacity={initialOpacity.current}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
function Bottle({
  product,
  index,
  active,
  focused,
  reduced,
  onSelect,
}: {
  product: Product;
  index: number;
  active: number;
  focused: boolean;
  reduced: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const photo = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  let distance = index - active;
  if (distance > products.length / 2) distance -= products.length;
  if (distance < -products.length / 2) distance += products.length;
  const opacity = focused
    ? distance === 0
      ? 1
      : 0.1
    : distance === 0
      ? 1
      : 0.14;
  useEffect(() => {
    if (!group.current) return;
    const target = {
      x: distance * 2.9 + (focused ? -0.9 : 1.05),
      y: distance === 0 ? -0.05 : Math.sin(index) * 0.35,
      z: -Math.abs(distance) * 1.65,
    };
    const tween = gsap.to(group.current.position, {
      ...target,
      duration: reduced ? 0 : 1.5,
      ease: "power3.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [distance, focused, index, reduced]);
  useFrame(({ clock }) => {
    if (!photo.current) return;
    const t = clock.getElapsedTime();
    photo.current.position.y = reduced ? 0 : Math.sin(t * 0.65 + index) * 0.085;
    photo.current.rotation.z = reduced ? 0 : Math.sin(t * 0.38 + index) * 0.012;
    const scale = THREE.MathUtils.lerp(
      photo.current.scale.x,
      hover ? 1.045 : 1,
      0.075,
    );
    photo.current.scale.set(scale, scale, 1);
  });
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );
  if (Math.abs(distance) >= 4) return null;
  return (
    <group
      ref={group}
      position={[distance * 2.9 + 1.05, 0, -Math.abs(distance) * 1.65]}
      visible={Math.abs(distance) < 4}
    >
      <Billboard follow lockZ>
        <group
          ref={photo}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHover(false);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {product.imageColumn !== undefined ? (
            <Photo product={product} opacity={opacity} reduced={reduced} />
          ) : (
            <Html
              center
              transform
              distanceFactor={5}
              style={{
                pointerEvents: "none",
                opacity: focused ? (distance === 0 ? 1 : 0.1) : 0.6,
              }}
            >
              <div className="scene-placeholder">
                <span>{product.brand}</span>
                <strong>{product.name}</strong>
                <small>Фото ожидается</small>
              </div>
            </Html>
          )}
        </group>
      </Billboard>
      {distance !== 0 && Math.abs(distance) < 3 && !focused && (
        <Html center position={[0, -2.25, 0]} style={{ pointerEvents: "auto" }}>
          <button className="scene-label" onClick={onSelect}>
            <span>{product.brand}</span>
            {product.name}
          </button>
        </Html>
      )}
    </group>
  );
}
function Particles({ reduced }: { reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const { positions, targets } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 170;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "white";
    ctx.font = "500 68px Arial";
    ctx.textAlign = "center";
    ctx.fillText("NEXUS", 320, 87);
    ctx.font = "400 21px Arial";
    ctx.fillText("P A R F U M", 320, 127);
    const pixels = ctx.getImageData(0, 0, 640, 170).data;
    const targets: number[] = [];
    for (let y = 10; y < 145; y += 5)
      for (let x = 30; x < 610; x += 5)
        if (pixels[(y * 640 + x) * 4 + 3] > 100)
          targets.push((x - 320) / 75, (85 - y) / 75, 0);
    const positions = targets.map((_, i) => Math.sin(i * 137.5) * 12);
    return {
      positions: new Float32Array(positions),
      targets: new Float32Array(targets),
    };
  }, []);
  const [intro] = useState(
    () => !sessionStorage.getItem("nexus-intro-seen") && !reduced,
  );
  useFrame(({ clock, pointer }) => {
    if (!points.current) return;
    const t = clock.getElapsedTime();
    const p = points.current.geometry.attributes.position;
    const forming = intro && t < 2.7;
    for (let i = 0; i < p.count; i++) {
      const k = i * 3;
      const f = forming ? Math.min(1, t / 1.3) : 0;
      const x = THREE.MathUtils.lerp(Math.sin(i * 137.5) * 10, targets[k], f);
      const y = THREE.MathUtils.lerp(Math.cos(i * 72.3) * 5, targets[k + 1], f);
      const z = THREE.MathUtils.lerp(-3 - Math.abs(Math.sin(i)) * 8, 0, f);
      p.setXYZ(
        i,
        x + (reduced ? 0 : Math.sin(t * 0.13 + i) * 0.08 + pointer.x * 0.08),
        y + (reduced ? 0 : Math.cos(t * 0.15 + i) * 0.06 + pointer.y * 0.08),
        z,
      );
    }
    p.needsUpdate = true;
    points.current.rotation.y = reduced ? 0 : Math.sin(t * 0.06) * 0.025;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#cbd6e4"
        size={0.015}
        transparent
        opacity={0.42}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
function CameraRig({
  focused,
  reduced,
}: {
  focused: boolean;
  reduced: boolean;
}) {
  const { camera, pointer, size } = useThree();
  const progress = useRef({
    x: 0,
    z: reduced || sessionStorage.getItem("nexus-intro-seen") ? 7.4 : 9.2,
  });
  useEffect(() => {
    const tween = gsap.to(progress.current, {
      x: focused ? -0.15 : 0,
      z: focused ? 5.8 : 7.4,
      duration: reduced ? 0 : 1.6,
      ease: "power3.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [focused, reduced]);
  useFrame(() => {
    const mobile = size.width < 700;
    camera.position.x = progress.current.x + (reduced ? 0 : pointer.x * 0.06);
    camera.position.y = (reduced ? 0 : pointer.y * 0.04) + 0.1;
    camera.position.z = progress.current.z + (mobile ? 1.6 : 0);
    camera.lookAt(mobile && !focused ? 0.7 : 0, 0, 0);
  });
  return null;
}
function World({
  active,
  focused,
  reduced,
  onChoose,
}: {
  active: number;
  focused: boolean;
  reduced: boolean;
  onChoose: (id: string) => void;
}) {
  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 8, 24]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[2, 5, 1]} intensity={20} color="#cbd7e7" />
      <pointLight position={[-4, 1, -2]} intensity={10} />
      <Particles reduced={reduced} />
      <group position={[focused ? -0.9 : 1.05, -1.96, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.25, 96]} />
          <meshStandardMaterial
            color="#17191d"
            metalness={0.7}
            roughness={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
        {[2.25, 2.9, 3.6].map((radius, i) => (
          <mesh
            key={radius}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -i * 0.006, 0]}
          >
            <ringGeometry args={[radius, radius + 0.009, 128]} />
            <meshBasicMaterial
              color="#8c99a9"
              transparent
              opacity={0.16 - i * 0.035}
            />
          </mesh>
        ))}
      </group>
      {products.map((p, i) => (
        <Suspense key={p.id} fallback={null}>
          <Bottle
            product={p}
            index={i}
            active={active}
            focused={focused}
            reduced={reduced}
            onSelect={() => onChoose(p.id)}
          />
        </Suspense>
      ))}
      <CameraRig focused={focused} reduced={reduced} />
    </>
  );
}
export default function Showroom({
  activeId,
  focused,
  onChoose,
  onStep,
}: {
  activeId: string;
  focused: boolean;
  onChoose: (id: string) => void;
  onStep: (dir: number) => void;
}) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const active = Math.max(
    0,
    products.findIndex((p) => p.id === activeId),
  );
  const touch = useRef(0);
  const wheelTime = useRef(0);
  useEffect(() => {
    const c = document.createElement("canvas");
    const context = c.getContext("webgl2") || c.getContext("webgl");
    setAvailable(!!context);
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const fallback = (
    <div className="scene-fallback">
      <ProductVisual product={products[active]} reflection />
      <span>Коллекция в 2D</span>
      <button className="text-button" onClick={() => onChoose(activeId)}>
        Подробнее об аромате ↗
      </button>
    </div>
  );
  return (
    <div
      ref={container}
      className={`showroom-canvas ${ready && available ? "scene-ready" : ""}`}
      aria-label="Пространственная галерея ароматов"
      onWheel={(e) => {
        if (
          focused ||
          Math.abs(e.deltaY) < 15 ||
          Date.now() - wheelTime.current < 900
        )
          return;
        wheelTime.current = Date.now();
        if (
          e.currentTarget === e.target ||
          (e.target as HTMLElement).tagName === "CANVAS"
        )
          onStep(e.deltaY > 0 ? 1 : -1);
      }}
      onTouchStart={(e) => {
        touch.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const delta = touch.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 50 && !focused) onStep(delta > 0 ? 1 : -1);
      }}
    >
      {available === null ? (
        <div className="scene-loading">Подготавливаем пространство</div>
      ) : available ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            frameloop={visible ? (reduced ? "demand" : "always") : "never"}
            dpr={[1, window.innerWidth < 700 ? 1.2 : 1.5]}
            gl={{
              alpha: false,
              antialias: true,
              powerPreference: "high-performance",
            }}
            camera={{ position: [0, 0.1, 7.4], fov: 39 }}
            onCreated={({ gl }) => {
              setReady(true);
              gl.setClearColor("#050505");
            }}
          >
            <ContextMonitor onLost={() => setAvailable(false)} />
            <World
              active={active}
              focused={focused}
              reduced={reduced}
              onChoose={onChoose}
            />
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
