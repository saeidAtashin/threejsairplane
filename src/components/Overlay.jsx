import { useProgress } from "@react-three/drei"

export const Overlay = () => {
    const { progress } = useProgress()
    return (
        <div className="overlay">
            <div className={`loader ${progress === 100 ? "loader--disapear" : ""}`} />
            {
                progress === 100 && (
                    <div className="intro">
                    <h1 className="logo">Atashin Air
                        <div className="spinner">
                            <div className="spinnner__image" />
                        </div>
                    </h1>
                    <button className="explore">
                        Explore
                    </button>
                </div>
                )
            }
         
        </div>
    )
}