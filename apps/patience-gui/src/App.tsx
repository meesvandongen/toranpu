import { Box, softShadows, Plane } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react";
import { useSpring, a, to } from "@react-spring/three";
import colors from "tailwindcss/colors";
import { useEffect, useRef } from "react";
import {
  Physics,
  RigidBody,
  Debug,
  CuboidCollider,
  InstancedRigidBodyApi,
  RigidBodyApi,
} from "@react-three/rapier";

softShadows();

function Ground() {
  return (
    <RigidBody
      position={[0, -0.5, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      mass={0}
      colliders="cuboid"
    >
      <Plane scale={[1000, 1000, 1]} receiveShadow>
        <meshStandardMaterial color={colors.green[900]} />
      </Plane>
    </RigidBody>
  );
}

function Cube() {
  return (
    <RigidBody position={[1, 0, 1]} rotation={[1, 2, 3]} mass={0} sensor>
      <Box castShadow>
        <meshStandardMaterial color={colors.yellow[900]} />
      </Box>
    </RigidBody>
  );
}

function DraggableBox() {
  const instancedApi = useRef<RigidBodyApi>(null);

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [spring, api] = useSpring(() => ({
    y: 0,
    config: { mass: 1, friction: 40, tension: 800 },
    onChange: ({ value }) => {
      const [x, , z] = instancedApi.current?.translation();
      instancedApi.current?.setTranslation({
        x,
        y: value.y,
        z,
      });
    },
  }));

  const initialPosition = useRef([0, 0, 0]);

  const bind = useGesture({
    onDragStart: () => {
      const [x, y, z] = instancedApi.current?.translation();
      initialPosition.current = [x, y, z];
    },
    onDrag: ({ movement: [x, z], down }) => {
      const [x0, , z0] = initialPosition.current;

      const nextX = x0 + x / aspect;
      const nextY = down ? 1 : 0;
      const nextZ = z0 + z / aspect;

      api.start({ y: nextY });

      instancedApi.current?.setTranslation({
        x: nextX,
        y: nextY,
        z: nextZ,
      });
    },
  });

  return (
    <>
      <RigidBody
        ref={instancedApi}
        mass={0}
        onIntersectionEnter={(e) => {
          console.log(e);
        }}
      >
        <Box castShadow {...bind()}>
          <meshStandardMaterial color={colors.white} />
        </Box>
      </RigidBody>
    </>
  );
}

function App() {
  return (
    <div className="h-full">
      <Canvas
        orthographic
        color="white"
        camera={{ zoom: 100, position: [0, 10, 0] }}
        shadows
        flat
        linear
      >
        <Physics>
          {/* <Droppable /> */}
          <ambientLight intensity={0.4} />
          {/* <pointLight position={[10, 10, 10]} /> */}
          <directionalLight
            castShadow
            position={[3, 5, 5]}
            intensity={0.6}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <Ground />
          <DraggableBox />
          <Cube />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
