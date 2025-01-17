import { Funding } from "@/features/funding";
import { Info } from "@/features/info";
import { Navbar } from "@/features/navbar";
import { LoaderCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function Page() {
    const Map = useMemo(() => dynamic(
        () => import('@/features/map'),
        {
            loading: () => <div className="w-full h-full"><LoaderCircle className="animate-spin w-[100vw] maxh-[100dvh] fixed m-auto inset-0" size={64} /></div>,
            ssr: false
        }
    ), [])

    return (
        <>
            <div className="bg-white-700 w-full h-full relative">
                <Navbar />
                <Map posix={[51.94117, 15.50231]} />
                <Info />
                <Funding />
            </div>
        </>
    )
}