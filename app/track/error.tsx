'use client'

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
 
export default function Error({
    error,
    reset,
  }: {
    error: GeolocationPositionError | Error
    reset: () => void
  }) {
    const [errorCode, setErrorCode] = useState<number | null>(null)

    useEffect(() => {
        if ('code' in error) {
            setErrorCode(error.code)
        }
        console.error(error)
    }, [error])

    return (
        <div className="text-center mt-10 px-2">
            <h2 className="text-red-500 text-xl font-semibold tracking-tight">Wystąpił problem podczas pobierania lokalizacji</h2>
            <p>Potrzebujemy twojej lokalizacji do śledzenia pojazu.</p>
            {errorCode && <p className="mt-4">Prawdopodobnie, <span className="font-bold">
                {errorCode === 1 && 'nie zezwoliłeś/aś na lokalizację'}
                {errorCode === 2 && 'masz wyłączoną lokalizację w telefonie'}
            </span></p>}
            <p className="mt-2">Upewnij się, że:</p>
            <ol className="list-decimal list-inside">
                <li >Masz odpaloną lokalizacje w telefonie</li>
                <li>Przeglądarka ma dostęp do lokalizacji</li>
                <li>Zezwoliłeś stronie na lokalizacje</li>
            </ol>
            <Button className="mt-4" onClick={() => reset()} aria-label="Spróbuj ponownie">Spróbuj ponownie</Button>
        </div>
    )
}