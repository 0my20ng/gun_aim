"use client";

import React, { useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Sky, Plane, Box } from "@react-three/drei";
import { useGameStore } from "@/store/gameStore";
import * as THREE from "three";

// --- Player Controller (Movement) ---
const PlayerController = () => {
    const { camera } = useThree();
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyW": setMoveForward(true); break;
                case "KeyA": setMoveLeft(true); break;
                case "KeyS": setMoveBackward(true); break;
                case "KeyD": setMoveRight(true); break;
            }
        };
        const onKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyW": setMoveForward(false); break;
                case "KeyA": setMoveLeft(false); break;
                case "KeyS": setMoveBackward(false); break;
                case "KeyD": setMoveRight(false); break;
            }
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, []);

    useFrame((_, delta) => {
        const speed = 10 * delta;
        const direction = new THREE.Vector3();
        const frontVector = new THREE.Vector3(
            0,
            0,
            Number(moveBackward) - Number(moveForward)
        );
        const sideVector = new THREE.Vector3(
            Number(moveLeft) - Number(moveRight),
            0,
            0
        );

        direction
            .subVectors(frontVector, sideVector)
            .normalize()
            .multiplyScalar(speed)
            .applyEuler(camera.rotation);

        camera.position.add(direction);
        camera.position.y = 1.6; // Eye height
    });

    return null;
};

// --- Main Scene Manager ---
const SceneManager = () => {
    const { camera, scene, raycaster } = useThree();
    const addScore = useGameStore((state) => state.addScore);

    // Initial targets
    const [targets, setTargets] = useState<{ id: string; position: [number, number, number] }[]>([
        { id: '1', position: [0, 1, -5] },
        { id: '2', position: [4, 2, -10] },
        { id: '3', position: [-4, 3, -8] },
        { id: '4', position: [6, 1, -12] },
        { id: '5', position: [-2, 4, -15] },
    ]);

    useEffect(() => {
        const handleMouseDown = () => {
            // Raycast from the center of the screen
            raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

            // Check intersections
            // Note: We only check intersection with direct children of scene or specific meshes
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // Find the first object that is a valid target
                const hit = intersects.find(
                    (i) => i.object.userData && i.object.userData.isTarget
                );

                if (hit && hit.object.userData.id) {
                    const hitId = hit.object.userData.id;
                    setTargets((prev) => prev.filter((t) => t.id !== hitId));
                    addScore(100);

                    // Optional: Respawn logic could go here
                }
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        return () => document.removeEventListener("mousedown", handleMouseDown);
    }, [camera, raycaster, scene, addScore]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Sky sunPosition={[100, 10, 100]} />

            {/* Floor */}
            <Plane rotation={[-Math.PI / 2, 0, 0]} args={[100, 100]}>
                <meshStandardMaterial color="#444" />
            </Plane>

            {/* Targets */}
            {targets.map((t) => (
                <Box
                    key={t.id}
                    position={t.position}
                    args={[1, 1, 1]}
                    userData={{ isTarget: true, id: t.id }}
                >
                    <meshStandardMaterial color="red" />
                </Box>
            ))}

            <PlayerController />
            <PointerLockControls />
        </>
    );
};

export default function GameScene() {
    return (
        <div className="w-full h-full">
            <Canvas shadows camera={{ fov: 45 }}>
                <SceneManager />
            </Canvas>
        </div>
    );
}
