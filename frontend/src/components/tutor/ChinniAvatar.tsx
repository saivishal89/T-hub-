'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

interface Chinni3DProps {
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  isCorrect: boolean;
  audioVolume?: number; // Real-time 0.0 to 1.0 volume envelope for lip sync
}

export default function ChinniAvatar({
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  isCorrect = false,
  audioVolume = 0,
}: Chinni3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Store live reactive state in refs so the 60fps Three.js animation loop can read them smoothly
  const stateRef = useRef({
    isSpeaking,
    isListening,
    isThinking,
    isCorrect,
    audioVolume,
  });

  useEffect(() => {
    stateRef.current = {
      isSpeaking,
      isListening,
      isThinking,
      isCorrect,
      audioVolume,
    };
  }, [isSpeaking, isListening, isThinking, isCorrect, audioVolume]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & WebGL Renderer setup
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 3.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. High-Fidelity Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.3);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xfef08a, 0.4);
    fillLight.position.set(-3, -1, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xbfdbfe, 0.6);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 3. Root Animation Group
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, -0.65, 0);
    scene.add(mainGroup);

    let mixer: THREE.AnimationMixer | null = null;
    let glbLoaded = false;
    let glbRoot: THREE.Group | null = null;

    // Dynamic animatable parts (for procedural / fallback mode)
    let headGroup: THREE.Group | null = null;
    let trunkBase: THREE.Group | null = null;
    let trunkMid: THREE.Group | null = null;
    let trunkTip: THREE.Group | null = null;
    let leftEar: THREE.Group | null = null;
    let rightEar: THREE.Group | null = null;
    let mouthMesh: THREE.Mesh | null = null;
    let leftPupil: THREE.Mesh | null = null;
    let rightPupil: THREE.Mesh | null = null;

    // 4. Initially render procedural character as immediate fallback
    buildTripoProceduralCharacter();

    // 5. Asynchronously load Tripo3D GLB Model (/models/chinni.glb) with MeshoptDecoder
    const loadTripoGLB = async () => {
      try {
        if (MeshoptDecoder && MeshoptDecoder.ready) {
          await MeshoptDecoder.ready;
        }

        const gltfLoader = new GLTFLoader();
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);

        gltfLoader.load(
          '/models/chinni.glb',
          (gltf) => {
            glbLoaded = true;
            glbRoot = gltf.scene;

            // Auto-fit & center the Tripo3D GLB model
            const box = new THREE.Box3().setFromObject(glbRoot);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetHeight = 2.2;
            const scale = targetHeight / maxDim;
            glbRoot.scale.setScalar(scale);

            // Re-evaluate center with scale
            box.setFromObject(glbRoot);
            const center = box.getCenter(new THREE.Vector3());
            glbRoot.position.x = -center.x;
            glbRoot.position.y = -center.y + 0.35;
            glbRoot.position.z = -center.z;

            // Enable shadows, double-sided materials for all meshes
            glbRoot.traverse((child) => {
              if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh;
                m.castShadow = true;
                m.receiveShadow = true;
                if (m.material) {
                  m.material.side = THREE.DoubleSide;
                  m.material.needsUpdate = true;
                }
              }
            });

            // Setup GLB Animations if present
            if (gltf.animations && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(glbRoot);
              const idleAction = mixer.clipAction(gltf.animations[0]);
              idleAction.play();
            }

            // Remove procedural fallback and swap in Tripo3D HD model
            while (mainGroup.children.length > 0) {
              mainGroup.remove(mainGroup.children[0]);
            }
            mainGroup.add(glbRoot);
            console.log('[Chinni 3D] Successfully loaded Tripo3D HD model chinni.glb!');
          },
          (progress) => {
            if (progress.total > 0) {
              console.log(`[Chinni 3D] Loading GLB: ${Math.round((progress.loaded / progress.total) * 100)}%`);
            }
          },
          (err) => {
            console.warn('[Chinni 3D] Failed to load /models/chinni.glb:', err);
          }
        );
      } catch (decoderErr) {
        console.error('[Chinni 3D] MeshoptDecoder init error:', decoderErr);
      }
    };

    loadTripoGLB();

    // 6. Build Tripo3D-Inspired Character (Lavender Elephant in School Uniform)
    function buildTripoProceduralCharacter() {
      // Color Palette matched to Tripo3D canvas screenshot:
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0x8c9be0, // Periwinkle lavender blue skin
        roughness: 0.55,
        metalness: 0.05,
      });

      const whiteShirtMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, // Crisp school uniform shirt
        roughness: 0.4,
      });

      const royalBlueMat = new THREE.MeshStandardMaterial({
        color: 0x2563eb, // Royal blue collar, shorts & backpack
        roughness: 0.5,
      });

      const innerEarMat = new THREE.MeshStandardMaterial({
        color: 0xfca5c5, // Rosy cute baby pink
        roughness: 0.7,
      });

      const eyeWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
      });

      const pupilMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b, // Deep indigo pupil
        roughness: 0.1,
      });

      const orangeTilakMat = new THREE.MeshStandardMaterial({
        color: 0xf97316, // Orange forehead tilak stripes
        roughness: 0.4,
      });

      const cheekMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        transparent: true,
        opacity: 0.55,
      });

      const medalMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24, // Gold school logo badge
        roughness: 0.3,
        metalness: 0.6,
      });

      // --- BODY & SCHOOL UNIFORM ---
      // White School Polo Shirt (Torso)
      const shirt = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.78, 0.85, 32), whiteShirtMat);
      shirt.position.set(0, 0.35, 0);
      mainGroup.add(shirt);

      // Shirt Collar
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.07, 12, 32), royalBlueMat);
      collar.position.set(0, 0.76, 0.02);
      collar.rotation.x = Math.PI / 2.3;
      mainGroup.add(collar);

      // School Badge / Logo Pendant on Chest
      const badgePendant = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 24), royalBlueMat);
      badgePendant.position.set(0, 0.42, 0.7);
      badgePendant.rotation.x = Math.PI / 2;
      mainGroup.add(badgePendant);

      const badgeCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.035, 24), medalMat);
      badgeCenter.position.set(0, 0.42, 0.71);
      badgeCenter.rotation.x = Math.PI / 2;
      mainGroup.add(badgeCenter);

      // Royal Blue Student Shorts
      const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.79, 0.82, 0.45, 32), royalBlueMat);
      shorts.position.set(0, -0.08, 0);
      mainGroup.add(shorts);

      // Blue School Backpack on Back
      const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.45), royalBlueMat);
      backpack.position.set(0, 0.4, -0.75);
      mainGroup.add(backpack);

      const backpackStrapL = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 12, 24, Math.PI), royalBlueMat);
      backpackStrapL.position.set(0.35, 0.55, -0.35);
      backpackStrapL.rotation.x = 0.35;
      mainGroup.add(backpackStrapL);

      const backpackStrapR = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.06, 12, 24, Math.PI), royalBlueMat);
      backpackStrapR.position.set(-0.35, 0.55, -0.35);
      backpackStrapR.rotation.x = 0.35;
      mainGroup.add(backpackStrapR);

      // Rounded Elephant Feet with cute toenails
      const legGeo = new THREE.CylinderGeometry(0.24, 0.3, 0.55, 24);
      const legL = new THREE.Mesh(legGeo, skinMat);
      legL.position.set(-0.38, -0.48, 0);
      mainGroup.add(legL);

      const legR = new THREE.Mesh(legGeo, skinMat);
      legR.position.set(0.38, -0.48, 0);
      mainGroup.add(legR);

      // White toenails
      for (let i = -1; i <= 1; i++) {
        const nailL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeWhiteMat);
        nailL.position.set(-0.38 + i * 0.1, -0.72, 0.26);
        mainGroup.add(nailL);

        const nailR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), eyeWhiteMat);
        nailR.position.set(0.38 + i * 0.1, -0.72, 0.26);
        mainGroup.add(nailR);
      }

      // Short sleeves and arms
      const armGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 20);
      const sleeveGeo = new THREE.CylinderGeometry(0.23, 0.24, 0.22, 20);

      // Left Arm
      const sleeveL = new THREE.Mesh(sleeveGeo, whiteShirtMat);
      sleeveL.position.set(-0.68, 0.48, 0);
      sleeveL.rotation.z = 0.5;
      mainGroup.add(sleeveL);

      const armL = new THREE.Mesh(armGeo, skinMat);
      armL.position.set(-0.76, 0.2, 0.08);
      armL.rotation.z = 0.45;
      armL.rotation.x = 0.3;
      mainGroup.add(armL);

      // Right Arm
      const sleeveR = new THREE.Mesh(sleeveGeo, whiteShirtMat);
      sleeveR.position.set(0.68, 0.48, 0);
      sleeveR.rotation.z = -0.5;
      mainGroup.add(sleeveR);

      const armR = new THREE.Mesh(armGeo, skinMat);
      armR.position.set(0.76, 0.2, 0.08);
      armR.rotation.z = -0.45;
      armR.rotation.x = 0.3;
      mainGroup.add(armR);

      // --- HEAD & CUTE CARTOON FACIAL FEATURES ---
      headGroup = new THREE.Group();
      headGroup.position.set(0, 1.25, 0.1);
      mainGroup.add(headGroup);

      // Head Main Sphere
      const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 32), skinMat);
      headGroup.add(headSphere);

      // Cute Hair Tuft on Top of Head (as in Tripo3D model)
      const tuft1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 12), skinMat);
      tuft1.position.set(0, 0.82, 0);
      headGroup.add(tuft1);
      const tuft2 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 12), skinMat);
      tuft2.position.set(0.08, 0.79, 0.04);
      tuft2.rotation.z = -0.3;
      headGroup.add(tuft2);
      const tuft3 = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 12), skinMat);
      tuft3.position.set(-0.08, 0.79, 0.04);
      tuft3.rotation.z = 0.3;
      headGroup.add(tuft3);

      // Forehead Orange Tilak Marks (Triple Stripes)
      const tilakGeo = new THREE.BoxGeometry(0.03, 0.14, 0.02);
      const tilakMid = new THREE.Mesh(tilakGeo, orangeTilakMat);
      tilakMid.position.set(0, 0.42, 0.74);
      headGroup.add(tilakMid);

      const tilakL = new THREE.Mesh(tilakGeo, orangeTilakMat);
      tilakL.position.set(-0.06, 0.42, 0.73);
      headGroup.add(tilakL);

      const tilakR = new THREE.Mesh(tilakGeo, orangeTilakMat);
      tilakR.position.set(0.06, 0.42, 0.73);
      headGroup.add(tilakR);

      // Large Expressive Anime/Cartoon Eyes
      // Left Eye
      const eyeLWhite = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), eyeWhiteMat);
      eyeLWhite.position.set(-0.28, 0.15, 0.62);
      headGroup.add(eyeLWhite);

      leftPupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), pupilMat);
      leftPupil.position.set(-0.28, 0.15, 0.77);
      headGroup.add(leftPupil);

      const catchlightL1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeWhiteMat);
      catchlightL1.position.set(-0.24, 0.2, 0.85);
      headGroup.add(catchlightL1);

      const catchlightL2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), eyeWhiteMat);
      catchlightL2.position.set(-0.31, 0.11, 0.85);
      headGroup.add(catchlightL2);

      // Right Eye
      const eyeRWhite = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), eyeWhiteMat);
      eyeRWhite.position.set(0.28, 0.15, 0.62);
      headGroup.add(eyeRWhite);

      rightPupil = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 20), pupilMat);
      rightPupil.position.set(0.28, 0.15, 0.77);
      headGroup.add(rightPupil);

      const catchlightR1 = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeWhiteMat);
      catchlightR1.position.set(0.32, 0.2, 0.85);
      headGroup.add(catchlightR1);

      const catchlightR2 = new THREE.Mesh(new THREE.SphereGeometry(0.025, 12, 12), eyeWhiteMat);
      catchlightR2.position.set(0.25, 0.11, 0.85);
      headGroup.add(catchlightR2);

      // Rosy Cheeks
      const cheekL = new THREE.Mesh(new THREE.CircleGeometry(0.14, 20), cheekMat);
      cheekL.position.set(-0.48, -0.04, 0.54);
      cheekL.rotation.y = -0.35;
      headGroup.add(cheekL);

      const cheekR = new THREE.Mesh(new THREE.CircleGeometry(0.14, 20), cheekMat);
      cheekR.position.set(0.48, -0.04, 0.54);
      cheekR.rotation.y = 0.35;
      headGroup.add(cheekR);

      // Friendly Animated Smile Mouth
      mouthMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), pupilMat);
      mouthMesh.position.set(0, -0.25, 0.7);
      mouthMesh.rotation.x = Math.PI / 2;
      headGroup.add(mouthMesh);

      // Little White Tusks
      const tuskGeo = new THREE.ConeGeometry(0.045, 0.22, 16);
      const tuskL = new THREE.Mesh(tuskGeo, eyeWhiteMat);
      tuskL.position.set(-0.19, -0.16, 0.64);
      tuskL.rotation.set(0.5, -0.25, 0);
      headGroup.add(tuskL);

      const tuskR = new THREE.Mesh(tuskGeo, eyeWhiteMat);
      tuskR.position.set(0.19, -0.16, 0.64);
      tuskR.rotation.set(0.5, 0.25, 0);
      headGroup.add(tuskR);

      // Articulated Trunk
      trunkBase = new THREE.Group();
      trunkBase.position.set(0, 0.02, 0.72);
      headGroup.add(trunkBase);

      const trunkBaseMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.32, 20), skinMat);
      trunkBase.add(trunkBaseMesh);

      trunkMid = new THREE.Group();
      trunkMid.position.set(0, -0.26, 0.06);
      trunkBase.add(trunkMid);

      const trunkMidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.16, 0.32, 20), skinMat);
      trunkMid.add(trunkMidMesh);

      trunkTip = new THREE.Group();
      trunkTip.position.set(0, -0.25, 0.05);
      trunkMid.add(trunkTip);

      const trunkTipMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.28, 20), skinMat);
      trunkTip.add(trunkTipMesh);

      const trunkTipOpening = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), innerEarMat);
      trunkTipOpening.position.set(0, -0.14, 0);
      trunkTip.add(trunkTipOpening);

      // Oversized Curved Ears (Soft lavender outside, vibrant rosy pink inside)
      const earOuterGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.06, 24);
      const earInnerGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.07, 24);

      leftEar = new THREE.Group();
      leftEar.position.set(-0.68, 0.18, -0.05);
      const leftEarOuter = new THREE.Mesh(earOuterGeo, skinMat);
      leftEarOuter.rotation.z = Math.PI / 2;
      leftEar.add(leftEarOuter);
      const leftEarInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      leftEarInner.position.set(0.04, 0, 0);
      leftEarInner.rotation.z = Math.PI / 2;
      leftEar.add(leftEarInner);
      headGroup.add(leftEar);

      rightEar = new THREE.Group();
      rightEar.position.set(0.68, 0.18, -0.05);
      const rightEarOuter = new THREE.Mesh(earOuterGeo, skinMat);
      rightEarOuter.rotation.z = Math.PI / 2;
      rightEar.add(rightEarOuter);
      const rightEarInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      rightEarInner.position.set(-0.04, 0, 0);
      rightEarInner.rotation.z = Math.PI / 2;
      rightEar.add(rightEarInner);
      headGroup.add(rightEar);
    }

    // 6. Animation Loop (Handles GLB mixer or procedural gestures)
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const t = clock.getElapsedTime();
      const { isSpeaking, isListening, isThinking, isCorrect, audioVolume } = stateRef.current;

      // Update GLB Mixer if loaded
      if (mixer) {
        mixer.update(delta);
      }

      // Idle Floating / Breathing Dynamics
      const breath = Math.sin(t * 2) * 0.04;
      mainGroup.position.y = -0.65 + breath;

      // Responsive Head & Body Expressions
      if (headGroup) {
        if (isListening) {
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0.18, 0.1);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0.08, 0.1);
        } else if (isThinking) {
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, 0.25, 0.08);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, -0.15, 0.08);
        } else if (isCorrect) {
          headGroup.rotation.x = Math.sin(t * 8) * 0.12;
          headGroup.rotation.z = 0;
        } else {
          headGroup.rotation.y = THREE.MathUtils.lerp(headGroup.rotation.y, Math.sin(t * 0.8) * 0.06, 0.05);
          headGroup.rotation.z = THREE.MathUtils.lerp(headGroup.rotation.z, 0, 0.05);
          headGroup.rotation.x = THREE.MathUtils.lerp(headGroup.rotation.x, 0, 0.05);
        }
      }

      // Trunk Gestures & Audio Lip Sync
      if (trunkBase && trunkMid && trunkTip) {
        if (isSpeaking) {
          const syncLift = audioVolume > 0.1 ? audioVolume * 0.6 : Math.sin(t * 12) * 0.15 + 0.1;
          trunkBase.rotation.x = -0.3 + syncLift * 0.4;
          trunkMid.rotation.x = 0.4 + syncLift * 0.5;
          trunkTip.rotation.x = 0.5 + syncLift * 0.6;
        } else if (isCorrect) {
          trunkBase.rotation.x = THREE.MathUtils.lerp(trunkBase.rotation.x, 0.6, 0.15);
          trunkMid.rotation.x = THREE.MathUtils.lerp(trunkMid.rotation.x, 0.8, 0.15);
          trunkTip.rotation.x = THREE.MathUtils.lerp(trunkTip.rotation.x, 0.9 + Math.sin(t * 10) * 0.2, 0.2);
        } else if (isListening) {
          trunkBase.rotation.x = THREE.MathUtils.lerp(trunkBase.rotation.x, -0.4, 0.1);
          trunkMid.rotation.x = THREE.MathUtils.lerp(trunkMid.rotation.x, 0.2, 0.1);
          trunkTip.rotation.x = THREE.MathUtils.lerp(trunkTip.rotation.x, 0.3, 0.1);
        } else {
          trunkBase.rotation.x = THREE.MathUtils.lerp(trunkBase.rotation.x, -0.2 + Math.sin(t * 1.5) * 0.08, 0.05);
          trunkMid.rotation.x = THREE.MathUtils.lerp(trunkMid.rotation.x, 0.3 + Math.sin(t * 1.5) * 0.08, 0.05);
          trunkTip.rotation.x = THREE.MathUtils.lerp(trunkTip.rotation.x, 0.4 + Math.sin(t * 1.5) * 0.1, 0.05);
        }
      }

      // Ears Flapping
      if (leftEar && rightEar) {
        const flap = isListening
          ? 0.35
          : isSpeaking
          ? Math.sin(t * 6) * 0.12 + 0.1
          : Math.sin(t * 1.8) * 0.08;

        leftEar.rotation.y = -0.4 - flap;
        rightEar.rotation.y = 0.4 + flap;
      }

      // Mouth Aperture Sync (opens & bounces when speaking)
      if (mouthMesh) {
        if (isSpeaking) {
          const mouthAperture = THREE.MathUtils.clamp(audioVolume * 2.5 + 0.3, 0.2, 1.8);
          mouthMesh.scale.set(mouthAperture, mouthAperture, mouthAperture);
        } else {
          mouthMesh.scale.lerp(new THREE.Vector3(0.3, 0.3, 0.3), 0.15);
        }
      }

      // Natural Eye Blinking & Pupil Animation
      if (leftPupil && rightPupil) {
        const blinkCycle = t % 3.8;
        const isBlinking = blinkCycle > 3.65;
        const eyeScaleY = isBlinking ? 0.08 : 1.0;
        leftPupil.scale.y = eyeScaleY;
        rightPupil.scale.y = eyeScaleY;
      }

      // If GLB model is loaded without a custom rig, apply gentle full-body breathing and speech tilt
      if (glbRoot && !mixer) {
        if (isSpeaking) {
          glbRoot.rotation.y = Math.sin(t * 8) * 0.06;
          glbRoot.rotation.x = Math.sin(t * 12) * 0.03;
        } else if (isListening) {
          glbRoot.rotation.y = THREE.MathUtils.lerp(glbRoot.rotation.y, 0.15, 0.08);
          glbRoot.rotation.x = THREE.MathUtils.lerp(glbRoot.rotation.x, 0.05, 0.08);
        } else {
          glbRoot.rotation.y = THREE.MathUtils.lerp(glbRoot.rotation.y, Math.sin(t * 0.8) * 0.04, 0.05);
          glbRoot.rotation.x = 0;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-80 relative select-none flex items-center justify-center overflow-hidden"
    />
  );
}
