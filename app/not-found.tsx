import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className=" w-full h-full flex flex-col items-center justify-center gap-y-8">
            <h1 className="text-9xl font-extrabold">404</h1>
            <p className="text-lg">Nie znaleziono strony</p>
            <Link href={'/'}>
                <Button aria-label="Wróć do strony głównej">Wróć do strony głównej</Button>
            </Link>
        </div>
    )
}