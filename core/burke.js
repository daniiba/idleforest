import Mellowtel from "mellowtel";

let mellowtel;

(async () => {
    mellowtel = new Mellowtel(process.env.PLASMO_PUBLIC_MELLOWTEL);
    await mellowtel.initBurke();
})();