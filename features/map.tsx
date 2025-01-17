"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { ReactNode, useEffect, useRef, useState } from "react";
import { RecordModel } from "pocketbase";
import { pb } from "@/lib/pocketbase";
import { Pointer } from "./pointer";
import { catchError } from "@/utils/catch-error";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Navbar } from "./navbar";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
    children?: ReactNode
}

const defaults = {
    zoom: 14,
}

const Map = ({ posix, zoom = defaults.zoom, children }: MapProps) => {
    const mapRef = useRef<L.Map | null>(null)
    const [pointers, setPointers] = useState<RecordModel[] | null>()
    const router = useRouter()

    const getList = async () => {
        const [error, results] = await catchError(pb.collection('localization').getFullList({
            expand: 'user'
        }))
        if (error) {
            console.error(error)
            return toast({
                title: 'Bład',
                description: 'Nie udało się pobrać danych',
                action: <Button onClick={() => router.refresh()} aria-label="Przeładuj stronę">Przeładuj strone</Button>
            })
        }
        setPointers(results)
    }

    useEffect(() => {
        getList()
    }, [])

    pb.collection('localization').subscribe('*', async (e) => {
        if (e.action === 'update') {
            setPointers((prevPointers) => {
                if (!prevPointers) return null
                return prevPointers.map(pointer => 
                    pointer.id === e.record.id ? e.record : pointer
                )
            })
            return
        }
        getList()
    }, { expand: 'user' })

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={true}
            ref={mapRef}
            style={{ height: "100%", width: "100%", zIndex: 5 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pointers?.map((el) => {
                return (
                    <Pointer el={el} mapRef={mapRef} key={el.id} />
                )
            })}
        </MapContainer>
    )
}

export default Map