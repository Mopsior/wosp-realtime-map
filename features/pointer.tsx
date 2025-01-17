'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getRelativeTime } from "@/lib/get-relative-time"
import { Clock } from "lucide-react"
import { RecordModel } from "pocketbase"
import { MutableRefObject, useEffect, useState } from "react"
import { StatusBadge } from "./status-badge"
import { Map as MapIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { carIcon } from "@/utils/icons"
import { LeafletTrackingMarker } from "react-leaflet-tracking-marker"
import { Icon, LeafletEventHandlerFnMap } from "leaflet"

export const Pointer = ({el, mapRef}: {el: RecordModel, mapRef: MutableRefObject<L.Map | null>}) => {
    const [isOpen, setIsOpen] = useState(false)
    const user = el.expand?.user

    const pointIcon = el.marker ? new Icon({
        iconUrl: `/${el.marker}`,
        iconSize : [64, 64],
        iconAnchor : [32, 32],
        popupAnchor : [32, 32],
    }) : carIcon

    return (
        <>
            <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <DialogTrigger>
                    <AnimatedMarker
                        lat={el.lat}
                        lng={el.lng}
                        key={el.id}
                        icon={pointIcon}
                        eventHandlers={{
                            click: (e) => {
                                const { current } = mapRef
                                if (!current) return
                                const zoom = current.getZoom() >= 18 ? 18 : current.getZoom()+1
                                current.flyTo([el.lat, el.lng], zoom)
                                setIsOpen(!isOpen)
                            }
                        }}>
                    </AnimatedMarker>
                </DialogTrigger>
                <DialogContent className="!z-[500] rounded-lg w-[90%] md:w-full">
                    <DialogHeader>
                        <DialogTitle>{user ? user.name : 'Nieznany pojazd'}</DialogTitle>
                        {el.description.length > 0 ? (
                            <DialogDescription>
                                {el.description}
                            </DialogDescription>
                        ): null }
                        <div className="grid grid-cols-[16px_1fr] gap-2 mt-3 px-1 text-left text-muted-foreground">
                            <StatusBadge status={el.status} />
                            <Clock size={16} className="mt-[2px]" />
                            <p>Ostatnia aktualizacja: <span className="text-primary">{getRelativeTime(el.updated)}</span></p>
                        </div>
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${el.lat},${el.lng}`}rel="noopener noreferrer" target="_blank">
                            <Button size={"sm"} className="mt-2" aria-label="Otwórz w Mapach Google">
                                <MapIcon size={16}/>
                                Otwórz w Mapach Google
                            </Button>
                        </Link>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

const AnimatedMarker = ({lat, lng, icon, eventHandlers}: {lat: number, lng: number, icon: Icon, eventHandlers: LeafletEventHandlerFnMap | undefined}) => {
    const [prevPos, setPrevPos] = useState<[number, number]>([lat, lng])

    useEffect(() => {
      if (prevPos[1] !== lng && prevPos[0] !== lat) setPrevPos([lat, lng])
    }, [lat, lng, prevPos])
  
    return <LeafletTrackingMarker icon={icon} position={[lat, lng]} previousPosition={prevPos} duration={1000} eventHandlers={eventHandlers}/>
}