import { Box } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useSpring, a } from "@react-spring/three";

const AnimatedBox = a(Box);

function Scene() {
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { mass: 1, friction: 40, tension: 800 },
  }));
  const bind = useDrag(({ movement: [x, y], down }) =>
    api.start({
      config: { mass: down ? 1 : 4, tension: down ? 2000 : 800 },
      position: down ? [x / aspect, -y / aspect, 0] : [0, 0, 0],
      // immediate: down,
    })
  );

  return (
    <>
      <AnimatedBox {...spring} {...bind()} castShadow>
        {/* <sphereGeometry args={[1, 64, 64]} /> */}
        <Box />
        <meshNormalMaterial />
      </AnimatedBox>
    </>
  );
}

function App() {
  return (
    <div className="h-full">
      <Canvas orthographic camera={{ zoom: 50, position: [0, 0, 100] }} shadows>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <mesh receiveShadow position={[0, 0, -1]}>
          <planeGeometry args={[1000, 1000]} />
          <meshStandardMaterial color="#303040" />
        </mesh>
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
