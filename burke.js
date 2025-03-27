
import Mellowtel from "mellowtel"
        const initMellowtel = async () => {
           
            const mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
           //@ts-ignore
            await mellowtel.initBurke()
        }

        initMellowtel().catch(console.error)
 