import { RadioGroupItem } from "@/components/ui/radio-group"
import { ReactNode } from "react"
import { motion } from "motion/react"
import { Label } from "@/components/ui/label"

export const StatusRadio = ({ value, name, children, loading }: { value: string, name: string, children: ReactNode, loading: boolean }) => {
    return (
        <div>
            <RadioGroupItem
                value={value}
                id={value}
                className="peer sr-only"
                disabled={loading}
                />
            <MotionLabel
                initial={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}   
                htmlFor={value}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 gap-y-5 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                {children}
                {name}
            </MotionLabel>
        </div>
    )
}

const MotionLabel = motion.create(Label)