'use client'

import { pb } from "@/lib/pocketbase"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoaderCircle } from "lucide-react"

export const CheckUserLogedIn = ({ children, variant }: { children: React.ReactNode, variant: 'block' | 'allow' }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const state = pb.authStore.isValid

    useEffect(() => {
        if (variant === 'block' && state) {
            return router.push('/')
        }
        if (variant === 'allow' && !state) {
            return router.push('/login')
        }

        setIsLoading(false)
    }, [state, variant, router])

    if (!isLoading) {
        return <>{children}</>
    }

    return (
        <div className="w-full h-full flex justify-center items-center">
            <LoaderCircle className="animate-spin" height={80} width={80} />
        </div>
    )

}