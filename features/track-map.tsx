'use client'

import { Marker, TileLayer, useMap } from 'react-leaflet'
import { useRef } from 'react'
import { MapContainer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

export const MiniMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const mapRef = useRef<L.Map | null>(null)
    
    return (
        <div className='mt-4 w-[100%] h-[300px] mx-auto'>
            <MapContainer
                center={[lat, lng]}
                zoom={16}
                scrollWheelZoom={true}
                ref={mapRef}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} />
                <SetView lat={lat} lng={lng} />
            </MapContainer>
        </div>
    )
}


const SetView = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap()
    map.setView([lat, lng], map.getZoom())
    
    return null
}