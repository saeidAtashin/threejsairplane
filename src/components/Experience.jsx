import { Float, Line, OrbitControls, PerspectiveCamera, Text, useScroll } from "@react-three/drei";
import { Background } from "./Background";
import { Airplane } from "./Airplane";
import { Cloud } from "./Cloud";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three"
import { useFrame } from "@react-three/fiber";
import { TextSection } from "./TextSection";
import { gsap } from "gsap";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";

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


  const clouds = useMemo(() => [
    {
      position: new THREE.Vector3(-3.5, -3.2, -7),

    },
    {
      position: new THREE.Vector3(3.5, -4, -10),
      rotation: new THREE.Euler(0, Math.PI / 4, 0),

    },
    {
      scale: new THREE.Vector3(4, 6, 4),
      position: new THREE.Vector3(-18, 0.2, -68),
      rotation: new THREE.Euler(0, Math.PI / 6, 0),
    },
    {
      scale: new THREE.Vector3(2.5, 3.5, 2.5),
      position: new THREE.Vector3(10, -1.2, -52),
      rotation: new THREE.Euler(0, Math.PI / 4, 0),

    },

    //first point
    {
      scale: new THREE.Vector3(4, 5, 4),
      position: new THREE.Vector3(
        curvePoints[1].x + 10,
        curvePoints[1].y - 4,
        curvePoints[1].z + 64
      ),
      rotation: new THREE.Euler(0, -Math.PI / 4, 0),

    },
    {
      scale: new THREE.Vector3(3, 5, 5),
      position: new THREE.Vector3(
        curvePoints[1].x - 20,
        curvePoints[1].y + 26,
        curvePoints[1].z + 12
      ),
      rotation: new THREE.Euler(0, -Math.PI / 3.5, 0),
    },
    {
      // rotation: new THREE.Euler(0, Math.PI / 7, Math.PI / 5),
      scale: new THREE.Vector3(5, 5, 5),
      position: new THREE.Vector3(
        curvePoints[1].x - 13,
        curvePoints[1].y + 4,
        curvePoints[1].z - 62
      ),
    },
    {
      // rotation: new THREE.Euler(Math.PI / 2, Math.PI / 2, Math.PI / 3),
      scale: new THREE.Vector3(5, 7, 5),
      position: new THREE.Vector3(
        curvePoints[1].x + 54,
        curvePoints[1].y + 2,
        curvePoints[1].z - 82
      ),
    },
    {
      scale: new THREE.Vector3(5, 5, 7),
      position: new THREE.Vector3(
        curvePoints[1].x + 8,
        curvePoints[1].y - 14,
        curvePoints[1].z - 22
      ),
    },
    //second point
    {
      scale: new THREE.Vector3(3, 5, 5),
      position: new THREE.Vector3(
        curvePoints[2].x + 6,
        curvePoints[2].y - 7,
        curvePoints[2].z + 50
      ),
    },
    {
      scale: new THREE.Vector3(2, 3, 2),
      position: new THREE.Vector3(
        curvePoints[2].x - 2,
        curvePoints[2].y + 4,
        curvePoints[2].z - 26
      ),
    },
    {
      scale: new THREE.Vector3(4, 4, 5),
      position: new THREE.Vector3(
        curvePoints[2].x + 12,
        curvePoints[2].y + 1,
        curvePoints[2].z - 86
      ),
      // rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 3),
    },
    //third point
    {
      scale: new THREE.Vector3(3, 6, 4),
      position: new THREE.Vector3(
        curvePoints[3].x + 3,
        curvePoints[3].y - 10,
        curvePoints[3].z + 50
      ),
      rotation: new THREE.Euler(0, Math.PI / 2, 0),

    },
    {
      scale: new THREE.Vector3(3, 4, 6),
      position: new THREE.Vector3(
        curvePoints[3].x - 10,
        curvePoints[3].y,
        curvePoints[3].z + 30
      ),
      rotation: new THREE.Euler(0, Math.PI / 3, 0),
    },
    {
      scale: new THREE.Vector3(4, 5, 6),
      position: new THREE.Vector3(
        curvePoints[3].x - 20,
        curvePoints[3].y - 5,
        curvePoints[3].z - 8
      ),
      rotation: new THREE.Euler(0, Math.PI / 1.1, 0),
    },
    {
      scale: new THREE.Vector3(5, 7, 6),
      position: new THREE.Vector3(
        curvePoints[3].x + 0,
        curvePoints[3].y - 5,
        curvePoints[3].z - 98
      ),
      // rotation: new THREE.Euler(0, Math.PI / 3, 0),
    },
    //fourth point
    {
      scale: new THREE.Vector3(2, 3, 4),
      position: new THREE.Vector3(
        curvePoints[4].x + 3,
        curvePoints[4].y - 10,
        curvePoints[4].z + 2
      ),
      rotation: new THREE.Euler(0, Math.PI / 2, 0),

    },
    {
      scale: new THREE.Vector3(3, 4, 4),
      position: new THREE.Vector3(
        curvePoints[4].x + 24,
        curvePoints[4].y - 6,
        curvePoints[4].z - 42
      ),
      // rotation: new THREE.Euler(Math.PI / 4, 0, Math.PI / 5),
    },
    {
      scale: new THREE.Vector3(3, 3, 3),
      position: new THREE.Vector3(
        curvePoints[4].x - 4,
        curvePoints[4].y + 9,
        curvePoints[4].z - 62
      ),
      // rotation: new THREE.Euler(Math.PI / 3, 0, Math.PI / 3),
    },
    //final
    {
      scale: new THREE.Vector3(3, 5, 5),
      position: new THREE.Vector3(
        curvePoints[7].x + 12,
        curvePoints[7].y - 5,
        curvePoints[7].z + 60
      ),
      // rotation: new THREE.Euler(-Math.PI / 4, -Math.PI / 6, 0),
    },
    {
      scale: new THREE.Vector3(2, 4, 4),
      position: new THREE.Vector3(
        curvePoints[7].x,
        curvePoints[7].y,
        curvePoints[7].z
      ),
      rotation: new THREE.Euler(0, Math.PI / 5, 0),
    },
    {
      scale: new THREE.Vector3(2, 5, 5),
      position: new THREE.Vector3(
        curvePoints[7].x - 15,
        curvePoints[7].y + 12,
        curvePoints[7].z + 35
      ),
      rotation: new THREE.Euler(0, Math.PI / 5, 0),
    },
  ],
    []
  )






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
  const lastScroll = useRef(0)


  useFrame((_state, delta) => {

    const scrollOffset = Math.max(0, scroll.offset)
    let friction = 1
    let resetCameraRail = true

    // Look to close text

    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      )

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1)
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

    //Calculate lerped scroll offset

    let lerpedScrollOffset = THREE.MathUtils.lerp(
      lastScroll.current,
      scrollOffset,
      delta * friction
    )
    // protect below  and above 1 
    lerpedScrollOffset = Math.min(lerpedScrollOffset, 1)
    lerpedScrollOffset = Math.max(lerpedScrollOffset, 0)

    lastScroll.current = lerpedScrollOffset



    const curPoint = curve.getPoint(lerpedScrollOffset)
    tl.current.seek(lerpedScrollOffset * tl.current.duration())



    //follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24)

    //make the group look ahead on the curve

    const lookAtPoint = curve.getPoint(
      Math.min(lerpedScrollOffset + CURVE_AHEAD_CAMERA, 1)
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

    const tangent = curve.getTangent(lerpedScrollOffset + CURVE_AHEAD_AIRPLANE)

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

  const tl = useRef()
  const backgroundColors = useRef({
    colorA: "#3535cc",
    colorB: "#abaadd",
  })

  useLayoutEffect(() => {
    tl.current = gsap.timeline()

    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#6f35cc",
      colorB: "#ffad30",
    })
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#424242",
      colorB: "#ffcc00",
    })
    tl.current.to(backgroundColors.current, {
      duration: 1,
      colorA: "#81318b",
      colorB: "#55ab8f",
    })
    tl.current.pause()

  }, [])




  return (
    <>

      <directionalLight position={[0, 3, 1]} intensity={0.1} />

      {/* <OrbitControls /> */}
      <group ref={cameraGroup}>
        <Background backgroundColors={backgroundColors} />
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
          <meshStandardMaterial
            color={"white"}
            opacity={1}
            transparent
            envMapIntensity={2}
            onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>





      {
        clouds.map((cloud, index) => (
          <Cloud {...cloud} key={index} />
        ))
      }

    </>
  );
};
