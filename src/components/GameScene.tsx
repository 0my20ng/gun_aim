"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Html, Plane, Edges } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import { soundManager } from "@/utils/sound";
import { WhiteRoomEnv } from "./environments/WhiteRoomEnv";
import { SpaceEnv } from "./environments/SpaceEnv";
import { SchoolEnv } from "./environments/SchoolEnv";
import * as THREE from "three";

// --- Constants & Data ---
const NEGATIVE_WORDS = [
    "짜증나", "힘들어", "망했어", "포기해", "싫어", "우울해",
    "바보", "실패", "야근", "스트레스", "불안", "귀찮아",
    "틀렸어", "최악이야", "답답해"
];

const POSITIVE_WORDS = [
    "최고야!", "잘했어!", "넌 멋져", "사랑해", "행복해",
    "성공!", "괜찮아", "할수있어", "대단해", "완벽해",
    "빛나고있어", "좋은하루", "파이팅", "용기내", "자랑스러워"
];

interface Target {
    id: string;
    position: [number, number, number];
    word: string;
    isHit: boolean;
    hitTime?: number;
    offset: number;
}

// --- Player Controller ---
const PlayerController = () => {
    const { camera } = useThree();
    const [move, setMove] = useState({ f: false, b: false, l: false, r: false });

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.code === "KeyW") setMove(m => ({ ...m, f: true }));
            if (e.code === "KeyS") setMove(m => ({ ...m, b: true }));
            if (e.code === "KeyA") setMove(m => ({ ...m, l: true }));
            if (e.code === "KeyD") setMove(m => ({ ...m, r: true }));
        };
        const up = (e: KeyboardEvent) => {
            if (e.code === "KeyW") setMove(m => ({ ...m, f: false }));
            if (e.code === "KeyS") setMove(m => ({ ...m, b: false }));
            if (e.code === "KeyA") setMove(m => ({ ...m, l: false }));
            if (e.code === "KeyD") setMove(m => ({ ...m, r: false }));
        };
        window.addEventListener("keydown", down);
        window.addEventListener("keyup", up);
        return () => {
            window.removeEventListener("keydown", down);
            window.removeEventListener("keyup", up);
        };
    }, []);

    useFrame((_, delta) => {
        const speed = 12 * delta;
        const direction = new THREE.Vector3();
        const front = new THREE.Vector3(0, 0, Number(move.b) - Number(move.f));
        const side = new THREE.Vector3(Number(move.l) - Number(move.r), 0, 0);
        direction.subVectors(front, side).normalize().multiplyScalar(speed).applyEuler(camera.rotation);
        camera.position.add(direction);
        camera.position.y = Math.max(1.6, camera.position.y); // Prevent sinking
    });
    return null;
};

// --- Explosion Particles Component (Brightness) ---
const ExplosionParticles = ({ position }: { position: [number, number, number] }) => {
    const group = useRef<THREE.Group>(null);
    const [particles] = useState(() => Array.from({ length: 20 }).map(() => ({
        offset: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
        speed: 3 + Math.random() * 5,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        scale: 0.1 + Math.random() * 0.3
    })));

    useFrame((_, delta) => {
        if (!group.current) return;
        group.current.children.forEach((child, i) => {
            const p = particles[i];
            if (!p) return;
            const mesh = child as THREE.Mesh;
            mesh.position.x += p.offset[0] * delta * p.speed;
            mesh.position.y += p.offset[1] * delta * p.speed;
            mesh.position.z += p.offset[2] * delta * p.speed;
            mesh.rotation.x += delta * 5;
            if (mesh.scale.x > 0) mesh.scale.subScalar(delta * 0.8);
            if (!Array.isArray(mesh.material)) {
                (mesh.material as THREE.Material).opacity = Math.max(0, (mesh.material as THREE.Material).opacity - delta * 2);
            }
        });
    });

    return (
        <group position={position} ref={group}>
            {particles.map((p, i) => (
                <mesh key={i} rotation={[p.rotation[0], p.rotation[1], 0]} scale={[p.scale, p.scale, p.scale]}>
                    <octahedronGeometry args={[1, 0]} />
                    <meshBasicMaterial color="#F59E0B" transparent opacity={1} />
                </mesh>
            ))}
            <pointLight distance={5} intensity={5} color="#F59E0B" decay={2} />
        </group>
    );
};

// --- Dark Mind Cluster Component (Negative State) ---
const DarkCluster = ({ animationOffset, id }: { animationOffset: number, id: string }) => {
    const group = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (!group.current) return;
        // Jitter/Float effect
        const t = state.clock.elapsedTime;
        group.current.rotation.y = Math.sin(t * 0.5 + animationOffset) * 0.2;
        group.current.rotation.z = Math.cos(t * 0.3 + animationOffset) * 0.1;

        // Inner cubes wobble
        group.current.children.forEach((child, i) => {
            child.rotation.x += delta * (0.2 + i * 0.1);
            child.rotation.y -= delta * (0.1 + i * 0.05);
            child.position.y += Math.sin(t * 2 + i) * 0.002;
        });
    });

    // Create a cluster of overlapping cubes
    const cubes = [
        { size: [2.2, 2.2, 2.2], pos: [0, 0, 0] },
        { size: [2.0, 2.0, 2.0], pos: [0.2, 0.2, 0.2] },
        { size: [1.8, 1.8, 1.8], pos: [-0.2, -0.2, -0.1] },
    ];

    return (
        <group ref={group}>
            {cubes.map((c, i) => (
                <mesh key={i} position={c.pos as [number, number, number]} userData={{ isTarget: true, id }}>
                    <boxGeometry args={c.size as [number, number, number]} />
                    {/* Kept Black Box with White Edges as requested */}
                    <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.8} />
                    <Edges color="#FFFFFF" threshold={15} scale={1.0} />
                </mesh>
            ))}
        </group>
    );
};

// --- Target Box Component ---
const TargetBox = ({ data }: { data: Target }) => {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (groupRef.current && !data.isHit) {
            // General floating for the whole group
            groupRef.current.position.y = data.position[1] + Math.sin(state.clock.elapsedTime + data.offset) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={data.position}>
            {/* Main Box - Hidden when hit */}
            {!data.isHit && <DarkCluster animationOffset={data.offset} id={data.id} />}

            {/* Explosion Effect - Shown when hit */}
            {data.isHit && <ExplosionParticles position={[0, 0, 0]} />}

            {/* Floating Text - Always visible, detached from mesh to stay legible */}
            <Html
                position={[0, data.isHit ? 2 : 2.5, 0]}
                center
                transform={false}   // Never rotate with the box
                sprite={true}       // Always face the camera
                distanceFactor={12}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                    transition: 'all 0.3s ease-out'
                }}
            >
                <div className={`
                    text-3xl font-extrabold whitespace-nowrap px-6 py-3 rounded-2xl border-4
                    ${data.isHit
                        ? 'text-blue-600 border-blue-400 bg-white shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110'
                        : 'text-gray-900 border-gray-900 bg-white/80 shadow-xl'}
                `}>
                    {data.word}
                </div>
            </Html>
        </group>
    );
};

// --- Scene Manager ---
const SceneManager = () => {
    const { camera, scene, raycaster } = useThree();
    // Optimize selector to avoid re-renders on score change
    const addScore = useGameStore((state) => state.addScore);
    const status = useGameStore((state) => state.status);
    const timeLeft = useGameStore((state) => state.timeLeft);
    const negativeWords = useGameStore((state) => state.negativeWords);
    const positiveWords = useGameStore((state) => state.positiveWords);
    const backgroundMode = useGameStore((state) => state.backgroundMode);

    const [targets, setTargets] = useState<Target[]>([]);

    // Environment Refs
    const ambientRef = useRef<THREE.AmbientLight>(null);
    const mainLightRef = useRef<THREE.PointLight>(null);
    const flashIntensity = useRef(0);

    // Frame Loop for Environment Animation
    useFrame((_, delta) => {
        // Decay flash intensity
        flashIntensity.current = THREE.MathUtils.lerp(flashIntensity.current, 0, delta * 4);

        // Apply flash to lighting
        if (ambientRef.current) {
            ambientRef.current.intensity = 1.0 + flashIntensity.current * 0.8;
        }
        if (mainLightRef.current) {
            mainLightRef.current.intensity = 1.0 + flashIntensity.current * 2.0;
        }
    });

    // Spawn Helper
    const spawnTarget = (idOverride?: string) => {
        const id = idOverride || Math.random().toString(36).substr(2, 9);
        const x = (Math.random() - 0.5) * 30; // -15 to 15
        const y = 2 + Math.random() * 8;      // 2 to 10 height
        const z = -10 - Math.random() * 20;   // -10 to -30 depth

        // Use dynamic words, fallback if empty to prevent errors
        const sourceWords = negativeWords.length > 0 ? negativeWords : ["No Words"];
        const randomNegative = sourceWords[Math.floor(Math.random() * sourceWords.length)];

        return {
            id,
            position: [x, y, z] as [number, number, number],
            word: randomNegative,
            isHit: false,
            offset: Math.random() * 100 // Random offset for animation
        };
    };

    // Determine target count based on time
    const getTargetCountMetric = (time: number) => {
        // "Start ~ 5s before end" -> 15. "7s before end ~ end" -> 6. 
        // We prioritize the specific "7s" start for the tapering phase.
        if (time > 7) return { max: 15, shouldSpawn: true };
        if (time > 0) return { max: 6, shouldSpawn: true }; // Last 7 seconds: Taper off
        return { max: 0, shouldSpawn: false }; // Last moments: Clear the board
    };

    // Initial & Maintenance Spawn
    useEffect(() => {
        if (status === 'playing') {
            const { max, shouldSpawn } = getTargetCountMetric(timeLeft);

            setTargets(prev => {
                // If we have fewer than max and should spawn, add more
                if (shouldSpawn && prev.length < max) {
                    const needed = max - prev.length;
                    const newTargets = Array.from({ length: needed }).map(() => spawnTarget());
                    return [...prev, ...newTargets];
                }
                return prev;
            });
        } else if (status === 'idle') {
            // Reset visual targets when idle
            setTargets([]);
        }
    }, [status, timeLeft, negativeWords]); // Added negativeWords dependency

    // Handle Click (Shooting)
    useEffect(() => {
        const handleMouseDown = () => {
            if (status !== 'playing') return;

            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
            // Intersect with everything
            const intersects = raycaster.intersectObjects(scene.children, true);

            // Filter only targets that are not already hit
            const hitObj = intersects.find(i =>
                i.object.userData.isTarget &&
                targets.find(t => t.id === i.object.userData.id && !t.isHit)
            );

            if (hitObj) {
                const hitId = hitObj.object.userData.id;

                // Play Sound
                soundManager.playExplosion();

                // Use dynamic positive words
                const sourceWords = positiveWords.length > 0 ? positiveWords : ["Good!"];
                const positiveMsg = sourceWords[Math.floor(Math.random() * sourceWords.length)];

                // Trigger Flash
                flashIntensity.current = 1.0;

                // Update Interal State to "Hit"
                setTargets(prev => prev.map(t => {
                    if (t.id === hitId) {
                        return { ...t, isHit: true, word: positiveMsg };
                    }
                    return t;
                }));

                addScore(100);

                // Remove and maybe Respawn
                setTimeout(() => {
                    setTargets(prev => {
                        const filtered = prev.filter(t => t.id !== hitId);

                        return filtered;
                    });
                }, 1000); // 1.0s animation time (Slightly longer for reading)
            }
        };

        window.addEventListener("mousedown", handleMouseDown);
        return () => window.removeEventListener("mousedown", handleMouseDown);
    }, [camera, raycaster, scene, status, targets, addScore, timeLeft, positiveWords]); // Added positiveWords

    return (
        <>
            {/* Dynamic Environment */}
            {backgroundMode === 'white' && <WhiteRoomEnv />}
            {backgroundMode === 'space' && <SpaceEnv />}
            {backgroundMode === 'school' && <SchoolEnv />}

            {targets.map(t => (
                <TargetBox key={t.id} data={t} />
            ))}

            <PlayerController />
            {status === 'playing' && <PointerLockControls />}
        </>
    );
};

export default function GameScene() {
    return (
        <div className="w-full h-full">
            <Canvas shadows camera={{ fov: 60 }}>
                <SceneManager />
            </Canvas>
        </div>
    );
}
