'use client';

import React, { useEffect, useRef } from 'react';

interface AnimatedAnimalProps {
  animalId: 'tiggy' | 'mimi' | 'piku';
  isSpeaking: boolean;
  isListening: boolean;
  emotion: 'happy' | 'neutral' | 'encouraging' | 'celebrating';
  size?: 'sm' | 'md' | 'lg';
}

export default function AnimatedAnimalAvatar({
  animalId = 'tiggy',
  isSpeaking = false,
  isListening = false,
  emotion = 'neutral',
  size = 'md',
}: AnimatedAnimalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const breathOffset = Math.sin(frame * 0.05) * 4;
      const earWiggle = Math.sin(frame * 0.1) * 3;
      const tailWag = Math.sin(frame * 0.08) * 12;

      // Real-time lip-sync mouth aperture calculation
      const mouthOpen = isSpeaking ? (Math.sin(frame * 0.35) > 0 ? 14 : 3) : 2;

      // 1. Soft Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 90, 65, 16, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
      ctx.fill();
      ctx.restore();

      // ==========================================
      // ANIMAL: TIGGY THE TIGER TEACHER
      // ==========================================
      if (animalId === 'tiggy') {
        // --- Tail with black stripes ---
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx + 40, cy + 50);
        ctx.quadraticCurveTo(cx + 85 + tailWag, cy + 30, cx + 80 + tailWag, cy - 10);
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#f97316';
        ctx.stroke();

        // Tail tip (white)
        ctx.beginPath();
        ctx.arc(cx + 80 + tailWag, cy - 10, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // --- Body: Navy Blue School Uniform Blazer ---
        ctx.save();
        ctx.translate(0, breathOffset);

        // Navy Suit Jacket
        ctx.beginPath();
        ctx.roundRect(cx - 45, cy + 10, 90, 75, [18, 18, 12, 12]);
        ctx.fillStyle = '#1e3a8a'; // Navy Blue School Uniform
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#172554';
        ctx.stroke();

        // White Inner Shirt Collar
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy + 10);
        ctx.lineTo(cx, cy + 35);
        ctx.lineTo(cx + 18, cy + 10);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Orange Necktie
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy + 22);
        ctx.lineTo(cx + 5, cy + 22);
        ctx.lineTo(cx + 7, cy + 52);
        ctx.lineTo(cx, cy + 62);
        ctx.lineTo(cx - 7, cy + 52);
        ctx.closePath();
        ctx.fillStyle = '#ea580c';
        ctx.fill();
        ctx.strokeStyle = '#c2410c';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Golden School Excellence Badge
        ctx.beginPath();
        ctx.arc(cx - 25, cy + 32, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Paws holding Brown Book Folder
        ctx.beginPath();
        ctx.roundRect(cx + 12, cy + 38, 28, 36, 4);
        ctx.fillStyle = '#78350f'; // Leather Book
        ctx.fill();
        ctx.fillStyle = '#fef3c7'; // Gold embossed book symbol
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('తెలుగు', cx + 15, cy + 58);

        // Orange Tiger Paws
        ctx.beginPath();
        ctx.arc(cx - 28, cy + 52, 11, 0, Math.PI * 2);
        ctx.arc(cx + 20, cy + 55, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316';
        ctx.fill();

        // --- Head ---
        // Tiger Ears
        ctx.beginPath();
        ctx.arc(cx - 36 + earWiggle * 0.2, cy - 42, 17, 0, Math.PI * 2);
        ctx.arc(cx + 36 - earWiggle * 0.2, cy - 42, 17, 0, Math.PI * 2);
        ctx.fillStyle = '#ea580c';
        ctx.fill();

        // Inner Ear (Pale Pink)
        ctx.beginPath();
        ctx.arc(cx - 36 + earWiggle * 0.2, cy - 42, 9, 0, Math.PI * 2);
        ctx.arc(cx + 36 - earWiggle * 0.2, cy - 42, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#fecdd3';
        ctx.fill();

        // Head Base Circle
        ctx.beginPath();
        ctx.arc(cx, cy - 15, 48, 0, Math.PI * 2);
        ctx.fillStyle = '#f97316'; // Vibrant Tiger Orange
        ctx.fill();

        // Cheeks (Fluffy White)
        ctx.beginPath();
        ctx.ellipse(cx - 24, cy - 2, 22, 16, -0.2, 0, Math.PI * 2);
        ctx.ellipse(cx + 24, cy - 2, 22, 16, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff7ed';
        ctx.fill();

        // Tiger Stripes on Forehead
        ctx.fillStyle = '#18181b';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 54);
        ctx.lineTo(cx - 4, cy - 38);
        ctx.lineTo(cx + 4, cy - 38);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 50);
        ctx.lineTo(cx - 22, cy - 34);
        ctx.lineTo(cx - 15, cy - 34);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 14, cy - 50);
        ctx.lineTo(cx + 22, cy - 34);
        ctx.lineTo(cx + 15, cy - 34);
        ctx.fill();

        // Side Cheek Stripes
        ctx.beginPath();
        ctx.moveTo(cx - 44, cy - 12);
        ctx.lineTo(cx - 32, cy - 8);
        ctx.lineTo(cx - 42, cy - 4);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(cx + 44, cy - 12);
        ctx.lineTo(cx + 32, cy - 8);
        ctx.lineTo(cx + 42, cy - 4);
        ctx.fill();

        // Large Expressive Eyes (Brown Child-Friendly)
        const eyeSquint = emotion === 'happy' || emotion === 'celebrating' ? 0.6 : 1;
        ctx.save();
        ctx.scale(1, eyeSquint);
        const eyeY = (cy - 16) / eyeSquint;

        // Eye White
        ctx.beginPath();
        ctx.ellipse(cx - 18, eyeY, 13, 15, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 18, eyeY, 13, 15, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        // Brown Iris
        ctx.beginPath();
        ctx.arc(cx - 16, eyeY, 9, 0, Math.PI * 2);
        ctx.arc(cx + 16, eyeY, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();

        // Pupil (Deep Black)
        ctx.beginPath();
        ctx.arc(cx - 16, eyeY, 5, 0, Math.PI * 2);
        ctx.arc(cx + 16, eyeY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();

        // Eye Sparkle Catchlights
        ctx.beginPath();
        ctx.arc(cx - 19, eyeY - 4, 3.5, 0, Math.PI * 2);
        ctx.arc(cx + 13, eyeY - 4, 3.5, 0, Math.PI * 2);
        ctx.arc(cx - 14, eyeY + 3, 1.5, 0, Math.PI * 2);
        ctx.arc(cx + 18, eyeY + 3, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();

        // Tiger Cute Pink Nose
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 4);
        ctx.lineTo(cx + 6, cy - 4);
        ctx.lineTo(cx, cy + 2);
        ctx.closePath();
        ctx.fillStyle = '#f43f5e';
        ctx.fill();

        // Animated Mouth & Real-Time Lip-Sync
        ctx.beginPath();
        ctx.moveTo(cx, cy + 2);
        ctx.lineTo(cx, cy + 8);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#451a03';
        ctx.stroke();

        if (mouthOpen > 5) {
          // Open mouth speaking
          ctx.beginPath();
          ctx.ellipse(cx, cy + 12 + mouthOpen * 0.4, 10, mouthOpen, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#881337'; // Deep mouth
          ctx.fill();

          // Cute pink tongue
          ctx.beginPath();
          ctx.ellipse(cx, cy + 15 + mouthOpen * 0.4, 6, 4, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#fb7185';
          ctx.fill();
        } else {
          // Closed smiling mouth
          ctx.beginPath();
          ctx.arc(cx - 6, cy + 7, 7, 0.1 * Math.PI, 0.8 * Math.PI, false);
          ctx.arc(cx + 6, cy + 7, 7, 0.2 * Math.PI, 0.9 * Math.PI, false);
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#451a03';
          ctx.stroke();
        }

        // Whiskers
        ctx.strokeStyle = '#9a3412';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - 26, cy + 4);
        ctx.lineTo(cx - 52, cy + 2);
        ctx.moveTo(cx - 26, cy + 8);
        ctx.lineTo(cx - 50, cy + 12);
        ctx.moveTo(cx + 26, cy + 4);
        ctx.lineTo(cx + 52, cy + 2);
        ctx.moveTo(cx + 26, cy + 8);
        ctx.lineTo(cx + 50, cy + 12);
        ctx.stroke();

        // Listening Indicator Glow
        if (isListening) {
          ctx.beginPath();
          ctx.arc(cx, cy - 15, 60, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 4;
          ctx.setLineDash([8, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animalId, isSpeaking, isListening, emotion]);

  const sizeClasses = {
    sm: 'w-40 h-44',
    md: 'w-60 h-64',
    lg: 'w-80 h-84',
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} select-none pointer-events-none`}>
      <canvas
        ref={canvasRef}
        width={300}
        height={320}
        className="w-full h-full object-contain filter drop-shadow-xl"
      />
    </div>
  );
}
