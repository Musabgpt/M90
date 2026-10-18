import React, { useEffect, useRef } from 'react';
import { CharacterId, SubjectCode } from '../types/game';
import { CHARACTERS, VEHICLES } from '../data/characters';
import { soundManager } from '../utils/audio';

export interface Barrier {
  id: string;
  x: number;
  w: number;
  h: number;
  lessonId: string;
  lessonTitle: string;
  unitId: string;
  barrierIndex: number;
  cleared: boolean;
  hasStar: boolean;
  starCollected: boolean;
  questionBlockY: number;
}

interface MarioCanvasProps {
  characterId: CharacterId;
  vehicleId: string;
  subjectCode: SubjectCode;
  streak: number;
  barriers: Barrier[];
  onEncounterBarrier: (barrier: Barrier) => void;
  onCollectCoin: () => void;
  onStompCritter: () => void;
  isPaused: boolean;
  activeJumpTriggerRef: React.MutableRefObject<(() => void) | null>;
}

export const MarioCanvas: React.FC<MarioCanvasProps> = ({
  characterId,
  vehicleId,
  subjectCode,
  streak,
  barriers,
  onEncounterBarrier,
  onCollectCoin,
  onStompCritter,
  isPaused,
  activeJumpTriggerRef
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game internal state
  const stateRef = useRef({
    player: {
      x: 100,
      y: 0,
      vx: 0,
      vy: 0,
      w: 36,
      h: 52,
      baseSpeed: 4.5,
      speed: 4.5,
      jumpForce: -16.5,
      onGround: false,
      facing: 1 as 1 | -1,
      animTimer: 0,
      animFrame: 0,
      isSuperVaulting: false,
      superVaultTargetX: 0,
      vaultProgress: 0,
      rotation: 0,
      boostTimer: 0
    },
    camera: { x: 0, y: 0, zoom: 1 },
    keys: { left: false, right: false, jump: false },
    particles: [] as Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      size: number;
      alpha: number;
      life: number;
    }>,
    clouds: [] as Array<{ x: number; y: number; speed: number; w: number; h: number }>,
    hills: [] as Array<{ x: number; y: number; r: number; color: string }>,
    floatingCoins: [] as Array<{ id: string; x: number; y: number; collected: boolean; floatOffset: number }>,
    hitBlocks: [] as Array<{ id: string; x: number; y: number; w: number; h: number; hit: boolean; bumpTimer: number }>,
    springboards: [] as Array<{ x: number; y: number; compressed: number }>,
    critters: [] as Array<{ id: string; x: number; y: number; w: number; h: number; vx: number; squished: boolean; squishTimer: number }>,
    boostPads: [] as Array<{ x: number; y: number }>,
    floatingTexts: [] as Array<{ x: number; y: number; text: string; color: string; alpha: number }>,
    groundY: 0,
    currentEncounteredBarrierId: null as string | null
  });

  const character = CHARACTERS.find(c => c.id === characterId) || CHARACTERS[0];
  const vehicle = VEHICLES.find(v => v.id === vehicleId) || VEHICLES[0];

  // Set up Super Vault method trigger
  useEffect(() => {
    activeJumpTriggerRef.current = () => {
      const p = stateRef.current.player;
      p.isSuperVaulting = true;
      p.vaultProgress = 0;
      p.vy = -19.5 * vehicle.jumpMultiplier;
      p.vx = 8.0 * vehicle.speedMultiplier;
      p.facing = 1;
      p.onGround = false;

      soundManager.playSuperVault();

      // Spawn burst particles
      for (let i = 0; i < 28; i++) {
        stateRef.current.particles.push({
          x: p.x + p.w / 2,
          y: p.y + p.h,
          vx: (Math.random() - 0.5) * 10,
          vy: -Math.random() * 10,
          color: ['#FFD700', '#FF4500', '#00E5FF', '#76FF03'][Math.floor(Math.random() * 4)],
          size: 4 + Math.random() * 6,
          alpha: 1,
          life: 35 + Math.random() * 20
        });
      }

      // Add floating combo text
      if (streak >= 2) {
        stateRef.current.floatingTexts.push({
          x: p.x + 30,
          y: p.y - 20,
          text: `🔥 ${streak}x STREAK!`,
          color: '#F59E0B',
          alpha: 1
        });
        soundManager.playComboFanfare(streak);
      }
    };

    return () => {
      activeJumpTriggerRef.current = null;
    };
  }, [vehicle, streak]);

  // Generate interactive in-world elements between barriers
  useEffect(() => {
    const coins: Array<{ id: string; x: number; y: number; collected: boolean; floatOffset: number }> = [];
    const hitBlocks: Array<{ id: string; x: number; y: number; w: number; h: number; hit: boolean; bumpTimer: number }> = [];
    const springboards: Array<{ x: number; y: number; compressed: number }> = [];
    const critters: Array<{ id: string; x: number; y: number; w: number; h: number; vx: number; squished: boolean; squishTimer: number }> = [];
    const boostPads: Array<{ x: number; y: number }> = [];

    // Between each pair of barriers, create interactive playgrounds
    barriers.forEach((b, idx) => {
      const startX = idx === 0 ? 180 : barriers[idx - 1].x + barriers[idx - 1].w + 50;
      const endX = b.x - 70;
      const gap = endX - startX;

      if (gap > 200) {
        // Floating coin arc in the middle
        const midX = startX + gap * 0.45;
        for (let c = 0; c < 3; c++) {
          coins.push({
            id: `coin-${idx}-${c}`,
            x: midX + c * 32,
            y: 0, // calculated from groundY in loop
            collected: false,
            floatOffset: c * 0.4
          });
        }

        // Bumping Question Block [?]
        hitBlocks.push({
          id: `block-${idx}`,
          x: startX + gap * 0.25,
          y: 0,
          w: 36,
          h: 36,
          hit: false,
          bumpTimer: 0
        });

        // Springboard Trampoline
        if (idx % 2 === 0) {
          springboards.push({
            x: startX + gap * 0.72,
            y: 0,
            compressed: 0
          });
        }

        // Walking cute Goomba Critter
        critters.push({
          id: `critter-${idx}`,
          x: startX + gap * 0.55,
          y: 0,
          w: 32,
          h: 30,
          vx: -1.2,
          squished: false,
          squishTimer: 0
        });

        // Speed Boost Pad
        if (idx % 3 === 1) {
          boostPads.push({
            x: startX + 60,
            y: 0
          });
        }
      }
    });

    stateRef.current.floatingCoins = coins;
    stateRef.current.hitBlocks = hitBlocks;
    stateRef.current.springboards = springboards;
    stateRef.current.critters = critters;
    stateRef.current.boostPads = boostPads;
  }, [barriers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Set ground level
      stateRef.current.groundY = h - 90;
      if (stateRef.current.player.onGround) {
        stateRef.current.player.y = stateRef.current.groundY - stateRef.current.player.h;
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // Initialize decorative clouds and hills
    const clouds = [];
    for (let i = 0; i < 12; i++) {
      clouds.push({
        x: i * 280 + Math.random() * 100,
        y: 40 + Math.random() * 90,
        speed: 0.2 + Math.random() * 0.4,
        w: 60 + Math.random() * 50,
        h: 24 + Math.random() * 16
      });
    }
    stateRef.current.clouds = clouds;

    const hills = [];
    for (let i = 0; i < 15; i++) {
      hills.push({
        x: i * 360,
        y: 0,
        r: 120 + Math.random() * 80,
        color: i % 2 === 0 ? '#48bb78' : '#38a169'
      });
    }
    stateRef.current.hills = hills;

    // Keyboard handlers
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        stateRef.current.keys.left = true;
      }
      if (key === 'arrowright' || key === 'd') {
        stateRef.current.keys.right = true;
      }
      if (key === ' ' || key === 'arrowup' || key === 'w') {
        e.preventDefault();
        const p = stateRef.current.player;
        if (p.onGround && !p.isSuperVaulting) {
          p.vy = p.jumpForce * vehicle.jumpMultiplier;
          p.onGround = false;
          soundManager.playJump();
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') stateRef.current.keys.left = false;
      if (key === 'arrowright' || key === 'd') stateRef.current.keys.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Main animation loop
    const loop = () => {
      animId = requestAnimationFrame(loop);

      const w = window.innerWidth;
      const h = window.innerHeight;
      const groundY = stateRef.current.groundY;
      const p = stateRef.current.player;
      const keys = stateRef.current.keys;

      // Update speed based on vehicle & boost
      const boostMultiplier = p.boostTimer > 0 ? 1.6 : 1.0;
      if (p.boostTimer > 0) p.boostTimer--;
      p.speed = p.baseSpeed * vehicle.speedMultiplier * boostMultiplier;

      // Physics update if not paused or if super vaulting
      if (!isPaused || p.isSuperVaulting) {
        if (p.isSuperVaulting) {
          // Epic somersault vault across obstacle!
          p.x += p.vx;
          p.vy += 0.82; // Gravity
          p.y += p.vy;
          p.rotation += 0.22; // Somersault spin!

          // Sparkle trail
          if (Math.random() > 0.3) {
            stateRef.current.particles.push({
              x: p.x + p.w / 2,
              y: p.y + p.h / 2,
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 3,
              color: '#FFD700',
              size: 4 + Math.random() * 4,
              alpha: 1,
              life: 22
            });
          }

          // Land after vault
          if (p.y + p.h >= groundY) {
            p.y = groundY - p.h;
            p.vy = 0;
            p.vx = 0;
            p.onGround = true;
            p.isSuperVaulting = false;
            p.rotation = 0;

            // Landing dust
            for (let i = 0; i < 10; i++) {
              stateRef.current.particles.push({
                x: p.x + p.w / 2,
                y: groundY,
                vx: (Math.random() - 0.5) * 5,
                vy: -Math.random() * 3,
                color: '#d4d4d8',
                size: 3 + Math.random() * 4,
                alpha: 0.8,
                life: 18
              });
            }
          }
        } else {
          // Normal parkour movement
          let move = 0;
          if (keys.left) move = -1;
          if (keys.right) move = 1;

          p.vx = move * p.speed;
          p.x += p.vx;

          if (move !== 0) {
            p.facing = move as 1 | -1;
          }

          // Gravity
          p.vy += 0.78;
          p.y += p.vy;

          if (p.y + p.h >= groundY) {
            p.y = groundY - p.h;
            p.vy = 0;
            p.onGround = true;
          } else {
            p.onGround = false;
          }

          // Animation step
          if (p.onGround && Math.abs(p.vx) > 0.1) {
            p.animTimer++;
            if (p.animTimer % 6 === 0) {
              p.animFrame = (p.animFrame + 1) % 4;
            }
          } else {
            p.animFrame = 0;
          }

          // ------------------------------------
          // INTERACTIVE IN-WORLD COLLISIONS
          // ------------------------------------

          // 1. Floating Coins pickup
          stateRef.current.floatingCoins.forEach(coin => {
            if (coin.collected) return;
            const coinY = groundY - 80 - Math.sin(Date.now() / 250 + coin.floatOffset) * 8;
            const dist = Math.hypot(p.x + p.w / 2 - coin.x, p.y + p.h / 2 - coinY);
            if (dist < 32) {
              coin.collected = true;
              soundManager.playCoin();
              onCollectCoin();

              // Sparkles
              for (let i = 0; i < 6; i++) {
                stateRef.current.particles.push({
                  x: coin.x,
                  y: coinY,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: '#FACC15',
                  size: 3,
                  alpha: 1,
                  life: 15
                });
              }
            }
          });

          // 2. Hitting [?] Question Block from underneath with head
          stateRef.current.hitBlocks.forEach(blk => {
            const blockY = groundY - 110;
            if (
              !blk.hit &&
              p.vy < 0 &&
              p.x + p.w > blk.x &&
              p.x < blk.x + blk.w &&
              p.y <= blockY + blk.h &&
              p.y >= blockY
            ) {
              blk.hit = true;
              blk.bumpTimer = 10;
              p.vy = 2; // bounce down
              soundManager.playBlockHit();
              onCollectCoin();

              stateRef.current.floatingTexts.push({
                x: blk.x + blk.w / 2,
                y: blockY - 10,
                text: '+1 🪙',
                color: '#F59E0B',
                alpha: 1
              });
            }
            if (blk.bumpTimer > 0) blk.bumpTimer--;
          });

          // 3. Stepping on Springboards (Super Boing!)
          stateRef.current.springboards.forEach(sp => {
            const springY = groundY - 14;
            if (
              p.x + p.w > sp.x &&
              p.x < sp.x + 38 &&
              p.y + p.h >= springY &&
              p.y + p.h <= groundY + 5 &&
              p.vy >= 0
            ) {
              sp.compressed = 8;
              p.vy = -22; // High spring launch!
              p.onGround = false;
              soundManager.playSpring();

              stateRef.current.floatingTexts.push({
                x: sp.x + 19,
                y: springY - 20,
                text: 'BOING! 🚀',
                color: '#10B981',
                alpha: 1
              });
            }
            if (sp.compressed > 0) sp.compressed--;
          });

          // 4. Stomping or interacting with Critters (Goombas)
          stateRef.current.critters.forEach(cr => {
            if (cr.squished) {
              cr.squishTimer++;
              return;
            }
            // Move critter
            cr.x += cr.vx;
            // Reverse direction if walking too far
            const crY = groundY - cr.h;

            // Stomp collision from above
            if (
              p.x + p.w > cr.x &&
              p.x < cr.x + cr.w &&
              p.y + p.h >= crY &&
              p.y + p.h <= crY + 16 &&
              p.vy > 0
            ) {
              cr.squished = true;
              p.vy = -12; // bounce off critter
              soundManager.playStomp();
              onStompCritter();

              stateRef.current.floatingTexts.push({
                x: cr.x + cr.w / 2,
                y: crY - 12,
                text: '+10 XP! ⭐',
                color: '#10B981',
                alpha: 1
              });
            }
          });

          // 5. Speed Boost Pads
          stateRef.current.boostPads.forEach(bp => {
            if (
              p.x + p.w > bp.x &&
              p.x < bp.x + 50 &&
              p.y + p.h >= groundY - 6 &&
              p.boostTimer === 0
            ) {
              p.boostTimer = 45; // boost speed
              soundManager.playDash();

              stateRef.current.floatingTexts.push({
                x: bp.x + 25,
                y: groundY - 30,
                text: 'TURBO BOOST! ⚡',
                color: '#06B6D4',
                alpha: 1
              });
            }
          });

          // 6. Barrier Collisions
          barriers.forEach(b => {
            if (b.cleared) return;

            const pillarTop = groundY - b.h;

            // Collision check: player hits the left edge of the pillar
            if (
              p.x + p.w > b.x &&
              p.x < b.x + b.w &&
              p.y + p.h > pillarTop
            ) {
              // Push player back
              p.x = b.x - p.w;
              p.vx = 0;

              // Trigger interactive question challenge!
              if (stateRef.current.currentEncounteredBarrierId !== b.id) {
                stateRef.current.currentEncounteredBarrierId = b.id;
                onEncounterBarrier(b);
              }
            }

            // Also trigger challenge when walking right in front of the pillar (within 90px)
            const dist = b.x - (p.x + p.w);
            if (dist > 0 && dist < 90 && !b.cleared) {
              if (stateRef.current.currentEncounteredBarrierId !== b.id) {
                stateRef.current.currentEncounteredBarrierId = b.id;
                onEncounterBarrier(b);
              }
            }
          });
        }
      }

      // Camera smoothly follows player
      const targetCamX = p.x - w * 0.32;
      stateRef.current.camera.x += (targetCamX - stateRef.current.camera.x) * 0.14;
      const camX = stateRef.current.camera.x;

      // Update particles
      stateRef.current.particles.forEach(pt => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 1 / pt.life;
      });
      stateRef.current.particles = stateRef.current.particles.filter(pt => pt.alpha > 0);

      // Update floating texts
      stateRef.current.floatingTexts.forEach(ft => {
        ft.y -= 1.2;
        ft.alpha -= 0.02;
      });
      stateRef.current.floatingTexts = stateRef.current.floatingTexts.filter(ft => ft.alpha > 0);

      // Update clouds
      stateRef.current.clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x < camX - 150) {
          c.x = camX + w + 100 + Math.random() * 200;
        }
      });

      // ------------------------------------
      // RENDER GAME
      // ------------------------------------
      ctx.clearRect(0, 0, w, h);

      // 1. Sky Gradient based on Subject
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      if (subjectCode === 'ENG') {
        // Sunset orange/gold
        skyGrad.addColorStop(0, '#f97316');
        skyGrad.addColorStop(0.5, '#fb923c');
        skyGrad.addColorStop(1, '#fed7aa');
      } else if (subjectCode === 'SCI') {
        // Emerald aurora
        skyGrad.addColorStop(0, '#065f46');
        skyGrad.addColorStop(0.6, '#10b981');
        skyGrad.addColorStop(1, '#a7f3d0');
      } else if (subjectCode === 'HIS') {
        // Castle dusk
        skyGrad.addColorStop(0, '#581c87');
        skyGrad.addColorStop(0.6, '#7e22ce');
        skyGrad.addColorStop(1, '#e9d5ff');
      } else if (subjectCode === 'GEO') {
        // Tropical turquoise
        skyGrad.addColorStop(0, '#0891b2');
        skyGrad.addColorStop(0.6, '#06b6d4');
        skyGrad.addColorStop(1, '#cffafe');
      } else if (subjectCode === 'ART') {
        // Cosmic rainbow
        skyGrad.addColorStop(0, '#db2777');
        skyGrad.addColorStop(0.6, '#f43f5e');
        skyGrad.addColorStop(1, '#fbcfe8');
      } else {
        // Classic Mario blue
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.6, '#7dd3fc');
        skyGrad.addColorStop(1, '#bae6fd');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Distant Clouds (Parallax 0.2x)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      stateRef.current.clouds.forEach(c => {
        const cx = c.x - camX * 0.2;
        if (cx < -150 || cx > w + 150) return;
        ctx.beginPath();
        ctx.ellipse(cx, c.y, c.w * 0.5, c.h * 0.5, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + c.w * 0.25, c.y - 8, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
        ctx.ellipse(cx - c.w * 0.2, c.y - 4, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Rolling Green Hills (Parallax 0.4x)
      stateRef.current.hills.forEach(hill => {
        const hx = hill.x - camX * 0.4;
        if (hx < -hill.r * 2 || hx > w + hill.r * 2) return;
        ctx.fillStyle = hill.color;
        ctx.beginPath();
        ctx.arc(hx, groundY + 30, hill.r, Math.PI, 0, false);
        ctx.fill();
      });

      // 4. Ground (Mario Grass & Soil Bricks)
      ctx.fillStyle = '#48bb78';
      ctx.fillRect(0, groundY, w, 22);
      ctx.fillStyle = '#68d391';
      ctx.fillRect(0, groundY, w, 5);
      ctx.fillStyle = '#9c4221';
      ctx.fillRect(0, groundY + 22, w, h - (groundY + 22));

      // Grid seams for ground blocks
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 1.5;
      const blockSize = 32;
      const startX = -(camX % blockSize);
      for (let x = startX; x < w; x += blockSize) {
        ctx.beginPath();
        ctx.moveTo(x, groundY + 22);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = groundY + 22; y < h; y += blockSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 5. Draw Interactive In-World Objects

      // A. Speed Boost Pads
      stateRef.current.boostPads.forEach(bp => {
        const bx = bp.x - camX;
        if (bx < -80 || bx > w + 80) return;
        ctx.fillStyle = '#06B6D4';
        ctx.fillRect(bx, groundY - 4, 50, 6);
        ctx.fillStyle = '#FACC15';
        ctx.font = '900 12px Fredoka, sans-serif';
        ctx.fillText('>>>', bx + 25, groundY - 6);
      });

      // B. Springboard Trampolines
      stateRef.current.springboards.forEach(sp => {
        const sx = sp.x - camX;
        if (sx < -60 || sx > w + 60) return;
        const comp = sp.compressed > 0 ? 6 : 0;
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(sx, groundY - 14 + comp, 38, 14 - comp);
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(sx + 4, groundY - 16 + comp, 30, 4);
      });

      // C. Bumping Question Blocks [?] in the path
      stateRef.current.hitBlocks.forEach(blk => {
        const bx = blk.x - camX;
        const bumpY = blk.bumpTimer > 0 ? -8 : 0;
        const by = groundY - 110 + bumpY;
        if (bx < -60 || bx > w + 60) return;

        ctx.fillStyle = blk.hit ? '#9CA3AF' : '#EAB308';
        ctx.fillRect(bx, by, blk.w, blk.h);
        ctx.strokeStyle = '#854D0E';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bx, by, blk.w, blk.h);
        ctx.fillStyle = blk.hit ? '#4B5563' : '#713F12';
        ctx.font = '900 20px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(blk.hit ? '•' : '?', bx + blk.w / 2, by + blk.h / 2 + 7);
      });

      // D. Floating Coins
      stateRef.current.floatingCoins.forEach(coin => {
        if (coin.collected) return;
        const cx = coin.x - camX;
        const cy = groundY - 80 - Math.sin(Date.now() / 250 + coin.floatOffset) * 8;
        if (cx < -40 || cx > w + 40) return;

        ctx.fillStyle = '#FACC15';
        ctx.strokeStyle = '#CA8A04';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // Spinning width effect
        const spinWidth = Math.abs(Math.sin(Date.now() / 200 + coin.floatOffset)) * 10 + 2;
        ctx.ellipse(cx, cy, spinWidth, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // E. Walking Critters (Goombas)
      stateRef.current.critters.forEach(cr => {
        const cx = cr.x - camX;
        const cy = groundY - cr.h;
        if (cx < -60 || cx > w + 60) return;

        if (cr.squished) {
          // Squished pancake critter
          ctx.fillStyle = '#78350F';
          ctx.fillRect(cx, groundY - 8, cr.w, 8);
        } else {
          // Mushroom cap
          ctx.fillStyle = '#B45309';
          ctx.beginPath();
          ctx.arc(cx + cr.w / 2, cy + 12, 16, Math.PI, 0, false);
          ctx.fill();

          // Body
          ctx.fillStyle = '#FDE68A';
          ctx.fillRect(cx + 6, cy + 12, cr.w - 12, 14);

          // Eyes
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(cx + 9, cy + 14, 3, 5);
          ctx.fillRect(cx + cr.w - 12, cy + 14, 3, 5);

          // Feet waddle
          ctx.fillStyle = '#1E293B';
          const waddle = Math.sin(Date.now() / 150) * 3;
          ctx.fillRect(cx + 2, groundY - 4, 10, 4 + waddle);
          ctx.fillRect(cx + cr.w - 12, groundY - 4, 10, 4 - waddle);
        }
      });

      // 6. Draw Obstacle Pillars / Pipes & Question Blocks
      barriers.forEach((b, idx) => {
        const bx = b.x - camX;
        const by = groundY - b.h;

        if (bx < -150 || bx > w + 150) return;

        if (b.cleared) {
          // Cleared barrier: celebratory Mario flag post
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(bx + b.w / 2 - 4, groundY - 140, 8, 140);
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.arc(bx + b.w / 2, groundY - 144, 10, 0, Math.PI * 2);
          ctx.fill();

          // Green Victory Checkmark Flag waving
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.moveTo(bx + b.w / 2 + 4, groundY - 138);
          ctx.lineTo(bx + b.w / 2 + 38, groundY - 120);
          ctx.lineTo(bx + b.w / 2 + 4, groundY - 102);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.font = '900 12px Fredoka, sans-serif';
          ctx.fillText('✓', bx + b.w / 2 + 14, groundY - 116);
          return;
        }

        // UNCLEARED PILLAR
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(bx + b.w / 2, groundY, b.w * 0.55, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        const pillarGrad = ctx.createLinearGradient(bx, by, bx + b.w, by);
        pillarGrad.addColorStop(0, '#ea580c');
        pillarGrad.addColorStop(0.5, '#fb923c');
        pillarGrad.addColorStop(1, '#c2410c');
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(bx, by, b.w, b.h);

        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(bx, by, b.w, b.h);

        for (let rowY = by + 24; rowY < groundY; rowY += 24) {
          ctx.beginPath();
          ctx.moveTo(bx, rowY);
          ctx.lineTo(bx + b.w, rowY);
          ctx.stroke();
        }

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(bx + 4, by + 6, b.w - 8, 22);
        ctx.fillStyle = '#ffffff';
        ctx.font = '800 12px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Pillar ${idx + 1}/10`, bx + b.w / 2, by + 22);

        // MYSTERY QUESTION BLOCK [?] on top of pillar
        const qbSize = 42;
        const qbX = bx + (b.w - qbSize) / 2;
        const qbY = by - qbSize - 10 + Math.sin(Date.now() / 250) * 4;

        ctx.fillStyle = '#eab308';
        ctx.fillRect(qbX, qbY, qbSize, qbSize);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(qbX + 3, qbY + 3, qbSize - 6, qbSize - 6);

        ctx.strokeStyle = '#854d0e';
        ctx.lineWidth = 3;
        ctx.strokeRect(qbX, qbY, qbSize, qbSize);

        ctx.fillStyle = '#713f12';
        ctx.font = '900 24px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('?', qbX + qbSize / 2, qbY + qbSize / 2 + 8);

        // ROTATING GOLDEN STAR ⭐
        const starY = qbY - 32 + Math.sin(Date.now() / 200 + idx) * 6;
        const starX = bx + b.w / 2;

        const glow = ctx.createRadialGradient(starX, starY, 0, starX, starY, 28);
        glow.addColorStop(0, 'rgba(250, 204, 21, 0.9)');
        glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(starX, starY, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const ang = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const ang2 = ((i + 0.5) * 2 * Math.PI) / 5 - Math.PI / 2;
          const r1 = 16;
          const r2 = 7;
          const x1 = starX + Math.cos(ang) * r1;
          const y1 = starY + Math.sin(ang) * r1;
          const x2 = starX + Math.cos(ang2) * r2;
          const y2 = starY + Math.sin(ang2) * r2;
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(starX - 4, starY - 4, 2.5, 6);
        ctx.fillRect(starX + 1.5, starY - 4, 2.5, 6);
      });

      // 7. Draw Floating Flying Text (e.g. +10 XP, BOING!, +1 COIN)
      stateRef.current.floatingTexts.forEach(ft => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.fillStyle = ft.color;
        ctx.font = '900 16px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x - camX, ft.y);
        ctx.restore();
      });

      // 8. Draw Particles
      stateRef.current.particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x - camX, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 9. Draw Player Character & Equipped Vehicle
      const px = p.x - camX;
      const py = p.y;

      ctx.save();
      ctx.translate(px + p.w / 2, py + p.h / 2);
      ctx.scale(p.facing, 1);
      if (p.rotation !== 0) {
        ctx.rotate(p.rotation);
      }

      // Boost speed trails
      if (p.boostTimer > 0) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.fillRect(-24, -p.h / 2, 14, p.h);
      }

      // Ground shadow
      if (p.onGround) {
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(0, p.h / 2 + 2, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vehicle graphic below or around player
      if (vehicle.id !== 'walk') {
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(vehicle.icon, 0, p.h / 2 + 10);
      }

      // Overalls (Legs & Torso)
      ctx.fillStyle = character.overallsColor;
      const legSwing = Math.sin(p.animFrame * 1.5) * 8;
      ctx.fillRect(-12, 10, 8, 14 + (p.onGround ? legSwing : 0));
      ctx.fillRect(4, 10, 8, 14 - (p.onGround ? legSwing : 0));

      ctx.fillRect(-12, -4, 24, 16);

      // Yellow straps/buttons
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-6, 0, 2.5, 0, Math.PI * 2);
      ctx.arc(6, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Shirt (Red/Green/Pink)
      ctx.fillStyle = character.hatColor;
      ctx.fillRect(-10, -10, 20, 8);

      // Head
      ctx.fillStyle = '#fed7aa';
      ctx.beginPath();
      ctx.arc(0, -18, 12, 0, Math.PI * 2);
      ctx.fill();

      // Moustache
      ctx.fillStyle = '#451a03';
      ctx.fillRect(0, -16, 10, 4);

      // Eye
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(4, -20, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Cap / Hat
      ctx.fillStyle = character.hatColor;
      ctx.beginPath();
      ctx.ellipse(0, -25, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(0, -24, 15, 4);

      // Cap Emblem badge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2, -26, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = character.color;
      ctx.font = '900 6px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(character.name[0], -2, -24);

      ctx.restore();
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [character, vehicle, barriers, isPaused, subjectCode]);

  // Touch control handlers
  const handleTouchLeft = (pressed: boolean) => {
    stateRef.current.keys.left = pressed;
  };
  const handleTouchRight = (pressed: boolean) => {
    stateRef.current.keys.right = pressed;
  };
  const handleTouchJump = () => {
    const p = stateRef.current.player;
    if (p.onGround && !p.isSuperVaulting) {
      p.vy = p.jumpForce * vehicle.jumpMultiplier;
      p.onGround = false;
      soundManager.playJump();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* On-Screen Touch Controls (Mobile Friendly) */}
      <div className="fixed bottom-4 left-4 right-4 z-20 flex justify-between pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <button
            type="button"
            onPointerDown={() => handleTouchLeft(true)}
            onPointerUp={() => handleTouchLeft(false)}
            onPointerLeave={() => handleTouchLeft(false)}
            className="w-16 h-16 rounded-2xl bg-white/90 active:bg-white text-slate-800 font-black text-2xl shadow-[0_5px_0_#94a3b8] active:translate-y-1 active:shadow-none flex items-center justify-center border-2 border-white backdrop-blur-sm transition-all"
            aria-label="Move Left"
          >
            ⬅️
          </button>
          <button
            type="button"
            onPointerDown={() => handleTouchRight(true)}
            onPointerUp={() => handleTouchRight(false)}
            onPointerLeave={() => handleTouchRight(false)}
            className="w-16 h-16 rounded-2xl bg-white/90 active:bg-white text-slate-800 font-black text-2xl shadow-[0_5px_0_#94a3b8] active:translate-y-1 active:shadow-none flex items-center justify-center border-2 border-white backdrop-blur-sm transition-all"
            aria-label="Move Right"
          >
            ➡️
          </button>
        </div>

        <div className="pointer-events-auto">
          <button
            type="button"
            onPointerDown={handleTouchJump}
            className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 active:from-amber-500 text-amber-950 font-black text-2xl shadow-[0_5px_0_#b45309] active:translate-y-1 active:shadow-none flex items-center justify-center border-2 border-white backdrop-blur-sm transition-all"
            aria-label="Jump"
          >
            ⬆️
          </button>
        </div>
      </div>
    </div>
  );
};
