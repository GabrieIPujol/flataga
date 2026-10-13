import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { Flip } from "gsap/Flip"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, Flip, DrawSVGPlugin)

export const MOTION = "(prefers-reduced-motion: no-preference)"
export const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)"

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP }
