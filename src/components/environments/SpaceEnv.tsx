import React from "react";
import { Plane, Sky, Stars } from "@react-three/drei";

export const SpaceEnv = () => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 20, 10]} intensity={1.5} />

            <Sky sunPosition={[100, 20, 100]} />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Plane rotation={[-Math.PI / 2, 0, 0]} args={[200, 200]}>
                <meshStandardMaterial color="#222" />
                <gridHelper args={[200, 20]} />
            </Plane>
        </>
    );
};
