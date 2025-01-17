'use client'

import { CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { MotionCard } from "@/lib/motion-components";
import { Info as InfoIcon } from "lucide-react";
import Image from 'next/image'
import Link from "next/link";
import { useState } from "react";

const snapPoints = ['200px', '500px', 1];

export const Info = () => {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

    if (isDesktop) {
        return (
            <Dialog>
                <DialogTrigger className="absolute"><Trigger /></DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-center">O projekcie</DialogTitle>
                    </DialogHeader>
                    <Content />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer snapPoints={snapPoints} activeSnapPoint={snap} setActiveSnapPoint={setSnap} fadeFromIndex={1}>
            <DrawerTrigger className="absolute"><Trigger /></DrawerTrigger>
            <DrawerContent className="pb-4">
                <DrawerHeader>
                    <DrawerTitle>O projekcie</DrawerTitle>
                </DrawerHeader>
                <Content />
            </DrawerContent>
        </Drawer>
    )
}

const Trigger = () => {
    return (
            <MotionCard
                className="transition-all hover:bg-secondary cursor-help fixed z-20 bottom-0 left-0 flex ml-4 mb-4"
                initial={false}
                animate={{ scale: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}>
                <CardHeader className="flex flex-row gap-4 align-center items-center">
                    <InfoIcon />
                    <CardTitle className="!mt-1 hidden md:block">O projekcie</CardTitle>
                </CardHeader>
            </MotionCard>
    )
}

const Content = () => {
    return (
        <div className="px-4 text-balance text-center">
            <p>Ta strona to mapa tzw. <b>mobilnych puszek</b>: aut/busów, które w dniu finału jeżdżą po ulicach Zielonej Góry (i nie tylko!)</p>
            <h2 className="text-2xl font-semibold tracking-tight mt-4">Legenda</h2>
            <div className="grid grid-cols-[64px_auto] gap-x-2 gap-y-6 mt-2">
                <Image src={'/bus.png'} alt="bus" width={64} height={64} className="my-auto"/>
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Mobilna Scena WOŚP</h3>
                    <p>Tutaj odbywają się koncerty, licytacje oraz inne atrakcje.</p>
                </div>
                <Image src={'/orange-car.png'} alt="car" width={64} height={64} className="my-auto" />
                <div>
                    <h3 className="text-lg font-semibold tracking-tight">Mobilna puszka - wolontariusze</h3>
                    <p>To auta przemieszczające się po Zielonej Górze wraz z wolontariuszami. Możesz do nich <b>zadzwonić, aby pojechali w konkretny rejon miasta i tam kwestowali!</b></p>
                </div>
            </div>
            <Separator className="mt-6" />
            <p className="mt-6">W każdą <b>ikonkę pojazdu możesz kliknąć</b>, aby uzyskać więcej informacji:</p>
            <ul className="my-2 md:ml-20 ml-12 list-disc text-left">
                <li>godzinę ostatniej lokalizacji,</li>
                <li>nazwę,</li>
                <li>dokładną lokalizację,</li>
                <li>i czy jesteśmy akurat na przerwie ;)</li>
            </ul>
            <p className="text-sm text-muted-foreground">Użyto grafiki z <Link href="https://www.freepik.com/free-vector/top-view-flat-cars-trucks_1349627.htm" className="underline underline-offset-2">Freepik</Link></p>
        </div>
    )
}