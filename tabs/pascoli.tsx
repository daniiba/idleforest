import { useEffect } from "react"
import Mellowtel from "mellowtel"

function PascoliPage() {
    useEffect(() => {
        const initMellowtel = async () => {
            const mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
            await mellowtel.initPascoli()
        }

        initMellowtel().catch(console.error)
    }, [])

    return (
        <div
            style={{
                padding: 0,
                margin: 0,
                height: "100vh",
                width: "100vw",
                overflow: "hidden",
                backgroundColor: "transparent"
            }}>
        </div>
    )
}

export default PascoliPage