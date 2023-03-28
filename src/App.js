import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import colors from "nice-color-palettes";
import {
  Physics,
  useBox,
  useCylinder,
  useSphere,
  usePlane
} from "@react-three/cannon";
import utils from "./utils";
import "./styles.css";

const palette = colors[6];

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 1.5, 7] }}>
      <fog attach="fog" args={["#7C83FD", 0, 40]} />
      <OrbitControls />
      <ambientLight />
      <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
      <Suspense fallback={null}>
        <World />
      </Suspense>
    </Canvas>
  );
}

function World() {
  const [sphereMap, cylinderMap, planeMap] = useTexture([
    "/map-sphere.jpg",
    "/map-cylinder.jpg",
    "/map-plane.jpg"
  ]);

  return (
    <Physics
      allowSleep
      broadphase="Naive"
      iterations={20}
      tolerance={0.0001}
      defaultContactMaterial={{
        friction: 0.9,
        restitution: 0.7,
        contactEquationStiffness: 1e7,
        contactEquationRelaxation: 1,
        frictionEquationStiffness: 1e7,
        frictionEquationRelaxation: 2
      }}
    >
      {utils.range(5).map((i) => (
        <Sphere
          key={i}
          r={0.2 + utils.rand(0.3)}
          position={[utils.rand(4, -4), utils.rand(6, 3), utils.rand(4, -4)]}
          color={utils.randChoise(palette)}
          map={sphereMap}
        />
      ))}
      {utils.range(5).map((i) => (
        <Box
          key={i}
          size={[
            0.1 + utils.rand(0.5),
            0.1 + utils.rand(0.5),
            0.1 + utils.rand(0.5)
          ]}
          position={[utils.rand(4, -4), utils.rand(6, 3), utils.rand(4, -4)]}
          color={utils.randChoise(palette)}
        />
      ))}
      {utils.range(6).map((i) => (
        <Cylinder
          key={i}
          args={[
            0.1 + utils.rand(0.4),
            0.1 + utils.rand(0.4),
            0.5 + utils.rand(2),
            32
          ]}
          map={cylinderMap}
          position={[utils.rand(4, -4), utils.rand(6, 3), utils.rand(4, -4)]}
          color={utils.randChoise(palette)}
        />
      ))}

      <Plane map={planeMap} />
    </Physics>
  );
}

function Box({ position, size, color }) {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: size
  }));
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry args={size} />
      <meshPhongMaterial color={color} />
    </mesh>
  );
}

function Cylinder({ color, position, args, map }) {
  const [ref] = useCylinder(() => ({
    mass: 10,
    args,
    position
  }));
  return (
    <mesh ref={ref} castShadow receiveShadow>
      <cylinderBufferGeometry args={args} />
      <meshPhongMaterial
        color={color}
        normalMap={map}
        normalScale={[1, 1]}
        normalMap-wrapS={THREE.RepeatWrapping}
        normalMap-wrapT={THREE.RepeatWrapping}
        normalMap-repeat={[10, 10]}
      />
    </mesh>
  );
}

function Sphere({ r = 0.5, position = [0, 2, 0], color, map }) {
  const [ref] = useSphere(() => ({
    mass: 1,
    args: r,
    position
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereBufferGeometry args={[r, 32, 32]} />
      <meshPhongMaterial
        color={color}
        normalMap={map}
        normalScale={[1, 1]}
        normalMap-wrapS={THREE.RepeatWrapping}
        normalMap-wrapT={THREE.RepeatWrapping}
        normalMap-repeat={[10, 10]}
      />
    </mesh>
  );
}

function Plane({ map }) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0] }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[100, 100]} />
      <meshPhongMaterial
        color="#7C83FD"
        normalMap={map}
        normalScale={[1, 1]}
        normalMap-wrapS={THREE.RepeatWrapping}
        normalMap-wrapT={THREE.RepeatWrapping}
        normalMap-repeat={[10, 10]}
      />
    </mesh>
  );
}
