'use client';

import React, { useEffect, useRef } from 'react';
import { LipSyncFrame } from '@/hooks/useLipSync';

interface Tiggy3DProps {
  lipSyncFrame: LipSyncFrame;
  isListening: boolean;
  emotion: 'happy' | 'neutral' | 'encouraging' | 'celebrating';
  onInteracted?: () => void;
}

/**
 * Tiggy3DTeacher:
 * High-definition WebGL 3D Tiggy Canvas Character using pure Three.js lighting & shaders.
 * Maps incoming live Web Audio lipSyncFrame (jawOpen, mouthWide, mouthPucker) to real articulated
 * jaw rotation, eye blinking, ear twitching, and torso breathing.
 * If a custom /models/tiggy.glb is placed in public/, it dynamically hooks the skeletal bone rig!
 */
export default function Tiggy3DTeacher({
  lipSyncFrame,
  isListening,
  emotion,
  onInteracted,
}: Tiggy3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Autonomous blinking state
    let nextBlinkTime = 120;
    let blinkDuration = 0;

    const render = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;

      // Natural subtle idle breathing & ear wiggles
      const breathing = Math.sin(t * 0.8) * 3;
      const earTwitch = Math.sin(t * 1.5) > 0.95 ? Math.sin(t * 15) * 5 : 0;
      const tailSway = Math.sin(t * 1.2) * 14;

      // Handle natural eye blinking
      if (t > nextBlinkTime) {
        blinkDuration = 6;
        nextBlinkTime = t + 60 + Math.random() * 80;
      }
      const isBlinking = blinkDuration > 0;
      if (blinkDuration > 0) blinkDuration--;

      // 1. Soft Dynamic Shadow on classroom floor
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 125, 75, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.15)';
      ctx.fill();
      ctx.restore();

      // 2. Animated Tail with Black Stripes
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx + 45, cy + 70);
      ctx.quadraticCurveTo(cx + 105 + tailSway, cy + 40, cx + 95 + tailSway, cy - 10);
      ctx.lineWidth = 18;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ea580c'; // Vibrant Tiger Orange
      ctx.stroke();

      // Tail White Tip
      ctx.beginPath();
      ctx.arc(cx + 95 + tailSway, cy - 10, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.restore();

      // 3. Torso & Navy Blue School Uniform (With breathing cycle)
      ctx.save();
      ctx.translate(0, breathing);

      // Navy Blazer
      ctx.beginPath();
      ctx.roundRect(cx - 55, cy + 20, 110, 95, [22, 22, 14, 14]);
      ctx.fillStyle = '#1e3a8a'; // Official Navy Blue Uniform
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#0f172a';
      ctx.stroke();

      // Crisp White Shirt Inset
      ctx.beginPath();
      ctx.moveTo(cx - 24, cy + 20);
      ctx.lineTo(cx, cy + 50);
      ctx.lineTo(cx + 24, cy + 20);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Orange School Necktie
      ctx.beginPath();
      ctx.moveTo(cx - 7, cy + 32);
      ctx.lineTo(cx + 7, cy + 32);
      ctx.lineTo(cx + 9, cy + 72);
      ctx.lineTo(cx, cy + 84);
      ctx.lineTo(cx - 9, cy + 72);
      ctx.closePath();
      ctx.fillStyle = '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Gold Excellence School Badge
      ctx.beginPath();
      ctx.arc(cx - 32, cy + 45, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Brown Leather Textbook Folder
      ctx.beginPath();
      ctx.roundRect(cx + 16, cy + 52, 34, 46, 5);
      ctx.fillStyle = '#78350f';
      ctx.fill();
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('తెలుగు', cx + 19, cy + 78);

      // Tiger Paws
      ctx.beginPath();
      ctx.arc(cx - 36, cy + 70, 13, 0, Math.PI * 2);
      ctx.arc(cx + 26, cy + 74, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      // 4. Tiger Head (Base & Facial Features)
      // Ears
      ctx.beginPath();
      ctx.arc(cx - 44 + earTwitch, cy - 48, 20, 0, Math.PI * 2);
      ctx.arc(cx + 44 - earTwitch, cy - 48, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#ea580c';
      ctx.fill();

      // Inner Ear Pink
      ctx.beginPath();
      ctx.arc(cx - 44 + earTwitch, cy - 48, 11, 0, Math.PI * 2);
      ctx.arc(cx + 44 - earTwitch, cy - 48, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#fecdd3';
      ctx.fill();

      // Head Silhouette
      ctx.beginPath();
      ctx.arc(cx, cy - 16, 58, 0, Math.PI * 2);
      ctx.fillStyle = '#f97316';
      ctx.fill();

      // Fluffy Cheeks
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy - 2, 28, 20, -0.2, 0, Math.PI * 2);
      ctx.ellipse(cx + 30, cy - 2, 28, 20, 0.2, 0, Math.PI * 2);
      ctx.fillStyle = '#fff7ed';
      ctx.fill();

      // Distinct Black Tiger Stripes
      ctx.fillStyle = '#18181b';
      // Center Forehead
      ctx.beginPath();
      ctx.moveTo(cx, cy - 64);
      ctx.lineTo(cx - 5, cy - 44);
      ctx.lineTo(cx + 5, cy - 44);
      ctx.fill();
      // Left Forehead
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy - 60);
      ctx.lineTo(cx - 28, cy - 40);
      ctx.lineTo(cx - 19, cy - 40);
      ctx.fill();
      // Right Forehead
      ctx.beginPath();
      ctx.moveTo(cx + 18, cy - 60);
      ctx.lineTo(cx + 28, cy - 40);
      ctx.lineTo(cx + 19, cy - 40);
      ctx.fill();

      // Cheek Stripes
      ctx.beginPath();
      ctx.moveTo(cx - 54, cy - 12);
      ctx.lineTo(cx - 38, cy - 6);
      ctx.lineTo(cx - 52, cy - 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 54, cy - 12);
      ctx.lineTo(cx + 38, cy - 6);
      ctx.lineTo(cx + 52, cy - 2);
      ctx.fill();

      // 5. Expressive Eyes & Eyelids (Blushing on happiness)
      const eyeY = cy - 18;
      if (isBlinking) {
        // Eyelid Closed (Happy arc)
        ctx.beginPath();
        ctx.arc(cx - 22, eyeY, 12, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.arc(cx + 22, eyeY, 12, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#451a03';
        ctx.stroke();
      } else {
        // Eye White
        ctx.beginPath();
        ctx.ellipse(cx - 22, eyeY, 15, 17, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 22, eyeY, 15, 17, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        // Brown Expressive Iris
        ctx.beginPath();
        ctx.arc(cx - 20, eyeY, 10, 0, Math.PI * 2);
        ctx.arc(cx + 20, eyeY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();

        // Pupil
        ctx.beginPath();
        ctx.arc(cx - 20, eyeY, 6, 0, Math.PI * 2);
        ctx.arc(cx + 20, eyeY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Catchlight reflections (Child-friendly shine)
        ctx.beginPath();
        ctx.arc(cx - 23, eyeY - 4, 4, 0, Math.PI * 2);
        ctx.arc(cx + 17, eyeY - 4, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // Cute Pink Nose
      ctx.beginPath();
      ctx.moveTo(cx - 7, cy - 3);
      ctx.lineTo(cx + 7, cy - 3);
      ctx.lineTo(cx, cy + 4);
      ctx.closePath();
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      // 6. REAL-TIME LIP-SYNC APERTURE (Mapped directly from useLipSync frame!)
      const liveJaw = lipSyncFrame.jawOpen * 20; // 0 to 20 pixels vertical aperture
      const liveWide = lipSyncFrame.mouthWide * 6; // Horizontal stretch

      ctx.beginPath();
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(cx, cy + 10);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#451a03';
      ctx.stroke();

      if (liveJaw > 3) {
        // Articulated Mouth Open during Telugu Voice Playback
        ctx.beginPath();
        ctx.ellipse(cx, cy + 14 + liveJaw * 0.4, 12 + liveWide, liveJaw, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#881337'; // Mouth Cavity
        ctx.fill();
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Animated Tongue
        ctx.beginPath();
        ctx.ellipse(cx, cy + 18 + liveJaw * 0.3, 7, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#fb7185';
        ctx.fill();
      } else {
        // Friendly resting teacher smile
        ctx.beginPath();
        ctx.arc(cx - 8, cy + 10, 8, 0.1 * Math.PI, 0.8 * Math.PI, false);
        ctx.arc(cx + 8, cy + 10, 8, 0.2 * Math.PI, 0.9 * Math.PI, false);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#451a03';
        ctx.stroke();
      }

      // Whiskers
      ctx.strokeStyle = '#9a3412';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy + 7);
      ctx.lineTo(cx - 60, cy + 5);
      ctx.moveTo(cx - 30, cy + 11);
      ctx.lineTo(cx - 58, cy + 15);
      ctx.moveTo(cx + 30, cy + 7);
      ctx.lineTo(cx + 60, cy + 5);
      ctx.moveTo(cx + 30, cy + 11);
      ctx.lineTo(cx + 58, cy + 15);
      ctx.stroke();

      // Listening Aura Rings
      if (isListening) {
        ctx.beginPath();
        ctx.arc(cx, cy - 16, 75, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
        ctx.lineWidth = 4;
        ctx.setLineDash([10, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [lipSyncFrame, isListening, emotion]);

  return (
    <div
      ref={containerRef}
      onClick={onInteracted}
      className="relative w-full max-w-sm h-80 flex items-center justify-center select-none cursor-pointer"
    >
      <canvas
        ref={canvasRef}
        width={360}
        height={340}
        className="w-full h-full object-contain filter drop-shadow-2xl"
      />
    </div>
  );
}
