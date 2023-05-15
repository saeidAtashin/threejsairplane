import { Float, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import { useMemo, useRef } from "react";
import * as THREE from "three"
import { useFrame } from "@react-three/fiber";
import { TextSection } from "./TextSection";

const LINE_NB_POINTS = 1000
const CURVE_DISTANCE = 250
const CURVE_AHEAD_CAMERA = 0.008
const CURVE_AHEAD_AIRPLANE = 0.02
const AIRPLANE_MAX_ANGLE = 35
const FRICTION_DISTANCE = 42
export const Experience = () => {

  const curvePoints = useMemo(
    () => [

      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
      new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
      new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
      new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),

    ],
    []
  )


  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      curvePoints,
      false,
      "catmullrom",
      0.5)
  }, [])

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[1].x - 3,
          curvePoints[1].y,
          curvePoints[1].z

        ),
        subtitle: `Welcome to Atashin Airplane,
        Have a seat and enjoy the ride`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[2].x + 2,
          curvePoints[2].y,
          curvePoints[2].z
        ),
        title: "Services",
        subtitle: `Do you want a drink?
        We have a wide range of beverages!`,
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(
          curvePoints[3].x - 3,
          curvePoints[3].y,
          curvePoints[3].z
        ),
        title: "Fear of flying?",
        subtitle: `Our flight attendants will help you have a great journey`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          curvePoints[4].x + 3.5,
          curvePoints[4].y,
          curvePoints[4].z - 12
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during flight`,
      },
    ];
  }, [])

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS)
  }, [curve])

  const shape = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, -0.08)
    shape.lineTo(0, 0.08)
    return shape
  }, [curve])

  const cameraGroup = useRef()
  const cameraRail = useRef()
  const scroll = useScroll()


  useFrame((_state, delta) => {

    const scrollOffset = Math.max(0, scroll.offset)

    let resetCameraRail = true

    // Look to close text

    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      )

      if (distance < FRICTION_DISTANCE) {
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        )
        cameraRail.current.position.lerp(targetCameraRailPosition, delta)
        resetCameraRail = false
      }
    })


    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0)
      cameraRail.current.position.lerp(targetCameraRailPosition, delta)

    }


    const curPoint = curve.getPoint(scrollOffset)




    //follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24)

    //make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
    )


    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    )

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize()

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24)
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)



    )
    //airplane rotation

    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE)

    const nonLerpLookAt = new THREE.Group()
    nonLerpLookAt.position.copy(curPoint)
    nonLerpLookAt.lookAt(nonLerpLookAt.position.clone().add(targetLookAt))

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookAt.rotation.y
    )
    let angle = Math.atan2(-tangent.z, tangent.x)
    angle = -Math.PI / 2 + angle

    let angleDegree = (angle * 180) / Math.PI
    angleDegree *= 2.4


    //limit plane angle
    if (angleDegree < 0) {
      angleDegree = Math.max(angleDegree, -AIRPLANE_MAX_ANGLE)
    }
    if (angleDegree > 0) {
      angleDegree = Math.min(angleDegree, AIRPLANE_MAX_ANGLE)
    }


    //set back angle

    angle = (angleDegree * Math.PI) / 180

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    )

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 2)
  })

  const airplane = useRef()

  return (
    <>

      <directionalLight position={[0, 3, 1]} intensity={0.1} />

      {/* <OrbitControls /> */}
      <group ref={cameraGroup}>
        <Background />
        <group ref={cameraRail}>

          <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        </group>

        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-y={0.1}
            />
          </Float>
        </group>
      </group>



      {/* TEXT */}

      {textSections.map((textSection, index) => (
        <TextSection {...textSection} key={index} />
      ))}

      {/* LINE */}

      <group position-y={-1}>
        {/* <Line 
  points={linePoints}
  color={"white"}
  opacity={0.7}
  transparent
  lineWidth={16}
  /> */}

        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              }
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={1} transparent
            envMapIntensity={2}
          />
        </mesh>
      </group>


      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.2, 0.3, 0.4]} position={[1.5, -0.5, -2]} />
      {/* <Cloud opacity={0.5} scale={[0.4, 0.4, 0.4]} rotation-y={Math.PI / 9} position={[1, -0.2, -12]} /> */}
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1, -3]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-5, 1, -5]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-5, 1, -15]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-8, 3, -10]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[-2, 3, -20]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[-5, 3, -30]} />
      <Cloud opacity={0.5} scale={[0.4, 0.4, 0.9]} position={[-5, 3, -40]} />
      <Cloud opacity={0.5} scale={[0.2, 0.2, 0.9]} position={[-2, 1, -43]} />
      <Cloud opacity={0.5} scale={[0.2, 0.2, 0.9]} position={[5, 2, -40]} />
      <Cloud opacity={0.5} scale={[0.5, 0.5, 0.9]} position={[8, 2, -35]} />
      <Cloud opacity={0.5} scale={[0.2, 0.2, 0.9]} position={[4, 3, -50]} />



      {/* <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[5, 1.5, -200]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 2, -180]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[8, 2.5, -300]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 2, -320]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-2, 1.5, -350]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-5, 1.8, -250]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-5, 1.1, -190]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[-8, 2.8, -290]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[-2, 3.2, -230]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[-5, 3.4, -330]} />
      <Cloud opacity={0.5} scale={[0.4, 0.4, 0.9]} position={[-5, 2.4, -240]} />
      <Cloud opacity={0.5} scale={[0.2, 0.2, 0.9]} position={[-2, 1.9, -403]} /> */}



      {/* <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[5, 1.5, -200]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 2, -180]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[20, 2.5, -300]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[45, 2, -320]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[35, 1.5, -350]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[50, 1.8, -250]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[41, 1.1, -190]} />
      <Cloud opacity={0.5} scale={[0.3, 0.3, 0.3]} position={[39, 2.8, -290]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[18, 3.2, -230]} />
      <Cloud opacity={0.4} scale={[0.4, 0.5, 0.8]} position={[24, 3.4, -330]} />
      <Cloud opacity={0.5} scale={[0.4, 0.4, 0.9]} position={[28, 2.4, -240]} />
      <Cloud opacity={0.5} scale={[0.2, 0.2, 0.9]} position={[50, 1.9, -403]} /> */}
    </>
  );
};
