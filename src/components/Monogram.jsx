import React from "react";

/**
 * Gold-on-black "CJ" badge echoing the save-the-date design
 * (images/save-the-date.jpeg) - reused everywhere the app previously
 * showed a plain heart-in-circle logo (login, public invitation header,
 * admin sidebar, the invitation card itself).
 */
const Monogram = ({ size = "w-14 h-14", textSize = "text-xl" }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-secondary border-2 border-accent shrink-0 ${size}`}
  >
    <span className={`font-script text-accent leading-none ${textSize}`}>CJ</span>
  </span>
);

export default Monogram;
