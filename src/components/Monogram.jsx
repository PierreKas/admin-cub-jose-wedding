import React from "react";
import logo from "../assets/logo.webp";

/**
 * The real "CJ" wedding logo (images/Logo.png - compressed from an
 * original 17MB/5619px source down to this ~165KB WebP, see
 * src/assets/logo.webp) - reused everywhere the app shows its brand mark
 * (login, public invitation header, admin sidebar, the invitation card).
 * No rounded-full/border wrapper here on purpose - the artwork's black
 * circle and floral sprays are already baked into the transparent image
 * and extend past a perfect circle, clipping it would cut the flowers off.
 */
const Monogram = ({ size = "w-14 h-14" }) => (
  <img
    src={logo}
    alt="Christian & Joséphine"
    className={`inline-block object-contain shrink-0 ${size}`}
  />
);

export default Monogram;
