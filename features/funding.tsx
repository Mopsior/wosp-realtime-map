import { CardHeader } from "@/components/ui/card"
import { MotionCard, MotionCardTitle } from "@/lib/motion-components"
import { Variants } from "motion/react"
import { FundingImage } from "./funding-image"
import Link from "next/link"

const cardVariants: Variants = {
    hover: { width: '330px' }
}

const titleVariants: Variants = {
    hover: { display: 'block', opacity: 1 },
}

export const Funding = () => {
    return (
        <Link href={process.env.NEXT_PUBLIC_ESKARBONKA as string}>
            <MotionCard className="fixed z-20 right-0 bottom-0 mb-4 mr-4 h-[76px] flex flex-row items-center align-center transition-transform items-inside-dont-overlap cursor-pointer hover:bg-secondary"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            variants={cardVariants}>
                <CardHeader className="py-1 px-5 flex flex-row items-center align-center gap-x-4 !justify-between">
                    <FundingImage />
                    <MotionCardTitle
                        className="text-nowrap"
                        variants={titleVariants}
                        initial={{ display: 'none', opacity: 0 }}>
                            Wpłać elektronicznie
                    </MotionCardTitle>
                </CardHeader>
            </MotionCard>
        </Link>
    )
}