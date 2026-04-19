"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Scene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas>
        <ambientLight intensity={1.2} />
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
          <Sphere args={[1, 100, 200]} scale={2.5}>
            <MeshDistortMaterial
              color="#22d3ee"
              distort={0.5}
              speed={2}
            />
          </Sphere>
        </Float>
      </Canvas>
    </div>
  );
}