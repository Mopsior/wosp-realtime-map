'use client'

import { MotionImage } from "@/lib/motion-components"
import { useAnimation, Variants } from "motion/react"
import { useEffect } from "react"

const rotateValue = 20

export const FundingImage = () => {
    const imageVariants: Variants = {
        vibrate: { rotate: rotateValue, transition: { repeat: 9, duration: 0.10, repeatType: 'reverse', } },
    }

    const imageControl = useAnimation()

    useEffect(() => {
        const vibrateInterval = setInterval(() => {
            imageControl.start('vibrate')
        }, 5000)

        return () => clearInterval(vibrateInterval)
    }, [])

    return (
        <MotionImage
            src={'/can.svg'}
            alt="puszka WOŚP"
            width={48} height={48}
            className="!mt-0"
            variants={imageVariants}
            initial={{ rotate: -rotateValue }}
            animate={imageControl}/>
    )
}