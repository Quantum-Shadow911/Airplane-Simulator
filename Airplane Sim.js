import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRef, useState } from "react";

/* ---------------- PLANE ---------------- */

function Plane({ aircraft, airline }) {
  const ref = useRef();

  const speed = aircraft === "Cessna" ? 0.15 : 0.3;

  useFrame(() => {
    if (!ref.current) return;

    ref.current.position.z -= speed;

    // simple flying motion
    ref.current.position.y = 5 + Math.sin(Date.now() * 0.002) * 1;
    ref.current.rotation.z = Math.sin(Date.now() * 0.002) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 0.3, 2]} />
      <meshStandardMaterial
        color={
          airline === "United"
            ? "dodgerblue"
            : airline === "Delta"
            ? "red"
            : "white"
        }
      />
    </mesh>
  );
}

/* ---------------- WORLD ---------------- */

function World() {
  const buildings = [];

  for (let i = 0; i < 80; i++) {
    buildings.push(
      <mesh
        key={i}
        position={[
          Math.random() * 60 - 30,
          Math.random() * 5,
          Math.random() * -120
        ]}
      >
        <boxGeometry args={[2, Math.random() * 10 + 2, 2]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }

  return (
    <>
      {/* ocean */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="lightblue" />
      </mesh>

      {/* “Golden Gate Bridge” */}
      <mesh position={[0, 2, -20]}>
        <boxGeometry args={[15, 0.5, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>

      {/* skyline */}
      {buildings}
    </>
  );
}

/* ---------------- UI ---------------- */

function UI({ aircraft, setAircraft, airline, setAirline }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        background: "white",
        padding: 10,
        borderRadius: 8,
        fontFamily: "sans-serif"
      }}
    >
      <h3>✈️ Airplane Simulator</h3>

      <div>
        <p>Aircraft:</p>
        <button onClick={() => setAircraft("Cessna")}>Cessna</button>
        <button onClick={() => setAircraft("Jet")}>Jet</button>
      </div>

      <div>
        <p>Airline:</p>
        <button onClick={() => setAirline("United")}>United</button>
        <button onClick={() => setAirline("Delta")}>Delta</button>
        <button onClick={() => setAirline("Other")}>Other</button>
      </div>

      <p>
        Current: {aircraft} | {airline}
      </p>
    </div>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  const [aircraft, setAircraft] = useState("Cessna");
  const [airline, setAirline] = useState("United");

  return (
    <>
      <UI
        aircraft={aircraft}
        setAircraft={setAircraft}
        airline={airline}
        setAirline={setAirline}
      />

      <Canvas camera={{ position: [0, 10, 25], fov: 60 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={1} />
        <directionalLight position={[10, 20, 10]} intensity={2} />

        <World />
        <Plane aircraft={aircraft} airline={airline} />
      </Canvas>
    </>
  );
}
