import React from "react";
import { Plane } from "@react-three/drei";

export const SchoolEnv = () => {
    return (
        <>
            <color attach="background" args={['#e0f2fe']} /> {/* Sky Blue-ish suggestion of outside */}

            {/* Classroom lighting - slightly warmer */}
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.0} castShadow />

            {/* Wooden Floor */}
            <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
                <meshStandardMaterial color="#d4a373" />
                {/* Simple grid to resemble wood planks or tiles */}
                <gridHelper args={[200, 100, "#a98467", "#c2956e"]} />
            </Plane>

            {/* Simple Walls (Visual cue) */}
            <Plane position={[0, 10, -50]} args={[200, 20]}>
                <meshStandardMaterial color="#fefae0" />
            </Plane>
        </>
    );
};
