import { Box, softShadows } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag, useGesture } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";
import colors from "tailwindcss/colors";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { useEffect, useRef } from "react";

const AnimatedBox = a(Box);

softShadows();

function Plane() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));
  return (
    <mesh receiveShadow ref={ref}>
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial color={colors.green[900]} />
    </mesh>
  );
}

function Cube() {
  const [ref] = useBox(() => ({
    position: [1, 0, 1],
    rotation: [1, 2, 3],
  }));
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry />
      <meshStandardMaterial color={colors.yellow[900]} />
    </mesh>
  );
}

function DraggableBox() {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  // const [spring, api] = useSpring(() => ({
  //   position: [0, 0, 0],
  //   config: { mass: 1, friction: 40, tension: 800 },
  // }));

  const position = useRef([0, 0, 0]);
  const startingPosition = useRef([0, 0, 0]);

  const [ref, api] = useBox(() => ({
    position: [0, 0, 1],
  }));

  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v));
    return unsubscribe;
  }, []);

  const bind = useGesture({
    onDragStart: () => {
      startingPosition.current = position.current;
    },
    onDrag: ({ movement: [x, y] }) => {
      const [x0, , y0] = startingPosition.current;
      api.position.set(x0 + x / aspect, 1, y0 + y / aspect);
    },
    onDragEnd: ({ movement: [x, y] }) => {
      const [x0, , y0] = startingPosition.current;
      api.position.set(x0 + x / aspect, 0, y0 + y / aspect);
    },
    // ({
    //   config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
    //   position: down ? [x / aspect, 1, y / aspect] : [0, 0, 0],
    //   immediate: down,
    // })
  });

  return (
    <>
      <AnimatedBox castShadow {...bind()} ref={ref}>
        <meshStandardMaterial color={colors.blue[900]} />
      </AnimatedBox>
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
          <Plane />
          <DraggableBox />
          <Cube />
        </Physics>
      </Canvas>
    </div>
  );
}

export default App;
