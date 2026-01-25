import React from "react";
import { Plane } from "@react-three/drei";

export const WhiteRoomEnv = () => {
    return (
        <>
            <color attach="background" args={['#f8fafc']} />

            {/* Soft Ambient Light for bright room */}
            <ambientLight intensity={1.0} />
            <pointLight position={[10, 20, 10]} intensity={1.0} />

            {/* White Floor */}
            <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
                <meshStandardMaterial color="#f8fafc" />
            </Plane>
        </>
    );
};
