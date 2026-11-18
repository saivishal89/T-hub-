'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

type ChinniAvatarProps = {
  isListening?: boolean;
  isThinking?: boolean;
  isSpeaking?: boolean;
  isCelebrating?: boolean;
};

function ElephantModel({ isListening, isThinking, isSpeaking, isCelebrating }: ChinniAvatarProps) {
  const root = useRef<THREE.Group | null>(null);
  const trunk = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh | null>(null);
  const leftEar = useRef<THREE.Mesh>(null);
  const rightEar = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, isListening ? -0.16 : 0, 4, delta);
      root.current.position.y = isCelebrating ? Math.abs(Math.sin(t * 7)) * 0.22 : Math.sin(t * 1.8) * 0.045;
      root.current.rotation.z = isThinking ? Math.sin(t * 2) * 0.07 : 0;
    }
    if (trunk.current) {
      trunk.current.rotation.x = isSpeaking ? Math.sin(t * 13) * 0.2 : Math.sin(t * 1.8) * 0.08;
      trunk.current.rotation.z = isCelebrating ? Math.sin(t * 8) * 0.2 : 0;
    }
    if (mouth.current) {
      mouth.current.scale.y = isSpeaking ? 0.35 + Math.abs(Math.sin(t * 12)) * 1.2 : 0.25;
    }
    if (leftEar.current && rightEar.current) {
      const flap = Math.sin(t * (isCelebrating ? 12 : 2.2)) * (isCelebrating ? 0.22 : 0.06);
      leftEar.current.rotation.z = 0.18 + flap;
      rightEar.current.rotation.z = -0.18 - flap;
    }
  });

  return (
    <group ref={root} position={[0, -0.45, 0]}>
      {/* round baby-elephant body and head */}
      <mesh position={[0, -0.05, -0.12]} castShadow>
        <sphereGeometry args={[0.68, 40, 40]} />
        <meshStandardMaterial color="#91c8d5" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.68, 0.12]} castShadow>
        <sphereGeometry args={[0.62, 48, 48]} />
        <meshStandardMaterial color="#a8d9e2" roughness={0.58} />
      </mesh>
      {/* ears */}
      <mesh ref={leftEar} position={[-0.58, 0.78, 0]} rotation={[0, 0, 0.18]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#79b8c8" roughness={0.75} />
      </mesh>
      <mesh ref={rightEar} position={[0.58, 0.78, 0]} rotation={[0, 0, -0.18]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#79b8c8" roughness={0.75} />
      </mesh>
      <mesh position={[-0.59, 0.78, 0.28]}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color="#f2aeb5" roughness={0.8} />
      </mesh>
      <mesh position={[0.59, 0.78, 0.28]}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color="#f2aeb5" roughness={0.8} />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.23, 0.78, 0.64]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial color="#172b3a" />
      </mesh>
      <mesh position={[0.23, 0.78, 0.64]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshStandardMaterial color="#172b3a" />
      </mesh>
      <mesh position={[-0.25, 0.81, 0.7]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0.21, 0.81, 0.7]}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="white" />
      </mesh>
      {/* trunk */}
      <group ref={trunk} position={[0, 0.35, 0.67]}>
        <mesh position={[0, -0.18, 0.08]} rotation={[0.22, 0, 0]}>
          <capsuleGeometry args={[0.14, 0.43, 8, 20]} />
          <meshStandardMaterial color="#91c8d5" roughness={0.62} />
        </mesh>
        <mesh position={[0, -0.4, 0.12]} rotation={[0.2, 0, 0]}>
          <sphereGeometry args={[0.15, 24, 24]} />
          <meshStandardMaterial color="#91c8d5" roughness={0.62} />
        </mesh>
      </group>
      {/* smile */}
      <mesh ref={mouth} position={[0, 0.34, 0.65]} scale={[0.13, 0.25, 0.045]}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#744b55" />
      </mesh>
      {/* feet */}
      {[-0.38, 0.38].map((x) => (
        <mesh key={x} position={[x, -0.58, 0.05]} castShadow>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#79b8c8" roughness={0.75} />
        </mesh>
      ))}
      {/* little learning backpack */}
      <mesh position={[0, 0.02, -0.62]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.48, 0.48, 0.2]} />
        <meshStandardMaterial color="#f2a94b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, -0.74]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color="#fff1c7" />
      </mesh>
    </group>
  );
}

export default function ChinniAvatar(props: ChinniAvatarProps) {
  const status = props.isListening ? 'Listening' : props.isThinking ? 'Thinking' : props.isSpeaking ? 'Speaking Telugu' : props.isCelebrating ? 'Celebrating' : 'Ready to learn';
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50 via-cyan-50 to-amber-50 sm:h-72" role="img" aria-label={`Chinni the 3D baby elephant tutor. Status: ${status}`}>
      <Canvas camera={{ position: [0, 0.35, 4.2], fov: 36 }} dpr={[1, 1.75]} shadows>
        <ambientLight intensity={1.25} />
        <directionalLight position={[3, 5, 4]} intensity={2} castShadow />
        <Environment preset="studio" />
        <Float speed={props.isCelebrating ? 4 : 1.5} rotationIntensity={0.12} floatIntensity={0.25}>
          <ElephantModel {...props} />
        </Float>
        <ContactShadows position={[0, -1.08, 0]} opacity={0.28} scale={3.5} blur={2.5} far={2} />
      </Canvas>
      <div className="absolute bottom-3 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
        🐘 Chinni · {status}
      </div>
    </div>
  );
}
