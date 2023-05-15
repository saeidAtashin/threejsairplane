import { Text } from "@react-three/drei"

export const TextSection = ({ title, subtitle, ...props }) => {



    return (



        <group {...props} >
            {!!title && (
                <Text
                    color="white"
                    anchorX={"left"}
                    anchorY="bottom"
                    fontSize={0.3}
                    maxWidth={2.5}
                    lineHeight={1.8}
                    font={"./fonts/GloriaHallelujah-Regular.ttf"}
                    >
                    {title}
                </Text>
            )}


            <Text
                color="white"
                anchorX={"left"}
                anchorY="top"
                
                fontSize={0.17}
                maxWidth={2.5}
                font={"./fonts/Pacifico-Regular.ttf"}>
                {subtitle}
            </Text>
        </group >
    )
}