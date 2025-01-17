'use client'

import { Button } from "@/components/ui/button";

export default function GlobalError({
    reset
}: { reset: () => void }) {
    return (
        <div className=" w-full h-full flex flex-col items-center justify-center gap-y-10">
            <h1 className="text-6xl font-extrabold">Wystąpił Błąd</h1>
            <Button onClick={() => reset()} aria-label="Spróbuj ponownie">Spróbuj ponownie</Button>
        </div>
    )
}