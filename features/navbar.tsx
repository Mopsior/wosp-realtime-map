import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-20 w-full px-4 pt-4 flex md:flex-row flex-col justify-between gap-2">
            <Card>
                <CardHeader className="flex-row items-center gap-x-4 p-2 md:p-6 text-center md:text-start">
                    <Image src={'/wosp.png'} alt="Serduszko WOŚP" width={48} height={48} />
                    <CardTitle className="text-xl md:text-2xl">Zielonogórska mapa mobilnych puszek WOŚP</CardTitle>
                </CardHeader>
            </Card>
            <Card className="flex flex-row">
                <CardHeader>
                    <p className="text-sm w-4/5 md:w-full">Chcesz abyśmy pojechali w konkretną okolice?</p>
                    <CardTitle className="text-xl">Zadzwoń!</CardTitle>
                </CardHeader>
                <CardHeader className="justify-center relative max-md:px-4">
                    <CardTitle>
                        <span className="text-base text-muted-foreground absolute right-16 max-[345px]:hidden visible top-[25px] sm:text-2xl sm:static">+48&nbsp;</span>
                    {process.env.NEXT_PUBLIC_PHONE_NUMBER?.slice(0, 3)}&nbsp;<br className="visible sm:hidden"/>
                    {process.env.NEXT_PUBLIC_PHONE_NUMBER?.slice(3, 6)}&nbsp;<br className="visible sm:hidden"/> 
                    {process.env.NEXT_PUBLIC_PHONE_NUMBER?.slice(6, 9)}</CardTitle>
                </CardHeader>
            </Card>
        </nav>
    )
}