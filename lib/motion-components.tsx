'use client'

import { Card, CardTitle } from "@/components/ui/card"
import { motion } from "motion/react"
import Image from "next/image"

export const MotionCard = motion.create(Card)
export const MotionCardTitle = motion.create(CardTitle)
export const MotionImage = motion.create(Image)