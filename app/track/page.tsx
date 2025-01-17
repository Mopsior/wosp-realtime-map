'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/features/status-badge"
import { StatusRadio } from "@/features/status-radio"
import { toast } from "@/hooks/use-toast"
import { pb } from "@/lib/pocketbase"
import { catchError } from "@/utils/catch-error"
import dynamic from "next/dynamic"
import { RecordModel } from "pocketbase"
import { useEffect, useMemo, useState } from "react"

export default function TrackPage() {
    const [geoError, setGeoError] = useState<GeolocationPositionError | Error>()
    const [isError, setIsError] = useState<string | null>(null)
    const [lat, setLat] = useState<number | null>(null)
    const [lng, setLng] = useState<number | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [record, setRecord] = useState<RecordModel | null>(null)
    const [status, setStatus] = useState<string | undefined>()
    const [isSharing, setIsSharing] = useState<boolean>(true)

    const Map = useMemo(() => dynamic(
        () => import('@/features/track-map').then(mod => mod.MiniMap),
        { 
          loading: () => <p>Mapa ładuje się</p>,
          ssr: false
        }
      ), [])

    const getRecordID = async () => {
        const [fetchError, data] = await catchError(pb.collection('localization').getFirstListItem(`user="${pb.authStore.record?.id}"`))
        if (fetchError) {
            const errorCause = 'Nie znaleziono rekordu. Możliwe, że jeszcze nie ma dodanego twojego znacznika'
            console.error(fetchError)
            setIsError(errorCause)
            return toast({
                title: 'Wystąpił błąd',
                description: errorCause,
                variant: 'destructive'
            })
        }
        setStatus(data.status)
        return setRecord(data)
    }

    if (!record) getRecordID()

    const getGeo = async () => {
        const geo = navigator.geolocation
        geo.getCurrentPosition(async (position) => {
            setLat(Number(position.coords.latitude.toFixed(5)))
            setLng(Number(position.coords.longitude.toFixed(5)))

            if (!record) return console.error('brak aktualizacji')
            if (!isSharing) return console.error('nie aktualizuje')
            const [updateError] = await catchError(pb.collection('localization').update(record.id, {
                lat: Number(position.coords.latitude.toFixed(5)),
                lng: Number(position.coords.longitude.toFixed(5))
            }))

            if (updateError) {
                console.error(updateError)
                return toast({
                    title: 'Wystąpił błąd',
                    description: 'Nie udało się zaktualizować lokalizacji',
                    variant: 'destructive'
                })
            }
        }, (err) => {setGeoError(err); console.error(err)}, { enableHighAccuracy: true })
    }

    const updateStatus = async (value: string) => {
        setLoading(true)
        if (!record) {
            console.error('Brak aktualizacji - brak recordID')
            toast({
                title: 'Nie można zaktualizować statusu',
                description: 'Nie pobrano jeszcze rekordu lokalizacji (aka nie wiemy jakim punktem jesteś)',
                variant: 'destructive'
            })
            return setLoading(false)
        }

        const [updateError] = await catchError(pb.collection('localization').update(record.id, {
            status: value
        }))
        if (updateError) {
            console.error(updateError)
            toast({
                title: 'Wystąpił błąd',
                description: 'Nie udało się zaktualizować statusu',
                variant: 'destructive'
            })
            return setLoading(false)
        }
        setLoading(false)
        setStatus(value)
        return toast({
            title: 'Zaktualizowano status',
            description: 'Status został zaktualizowany pomyślnie',
        })
    }

    const wakeLockError = (error: Error) => {
        console.error(error)
        return toast({
            title: 'Twój ekran może zgasnąć',
            description: 'Strona nie będzie automatycznie blokować ekranu, więc upewnij się, że masz ustawiony odpowiedni czas blokady ekranu. Jeśli ekran zgaśnie, lokalizacja nie będzie aktualizowana.',
        })
    }

    const requestWakeLock = async () => {
        const [error] = await catchError(navigator.wakeLock.request('screen'))
        if (error) return wakeLockError(error)
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!('geolocation' in navigator)) return setGeoError(new Error('Geolocation API is not supported'))
            if (!('wakeLock' in navigator)) {
                wakeLockError(new Error('WakeLock API is not supported'))
                return
            }
            requestWakeLock()
            getGeo()
            const intervalId = setInterval(() => {
                getGeo()
            }, 2000)

            return () => clearInterval(intervalId)
        } else return setGeoError(new Error('Window is not defined'))
    }, [record, isSharing])

    const user = pb.authStore.record
    if (!user) return <div>loading...</div>
    if (geoError) throw geoError

    return (
        <div className="p-4">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Śledzenie pojazdu</h1>
                <p className="text-muted-foreground mt-3">Jesteś zalogowany jako <span className="text-primary">{user.name}</span></p>
            </header>
            <main className="space-y-4 md:w-fit mx-auto">
                <Card className="mt-4">
                    <CardHeader className="pb-0">
                        <div className="flex align-center gap-x-3">
                            <CardTitle>Położenie</CardTitle>
                            <StatusBadge status={(geoError || isError || !lat || !lng || !record ) ? 'offline' : (isSharing ? 'info' : 'stop')} withoutDescription />
                        </div>
                        <CardDescription>
                            <p>Szerokość: {lat}</p>
                            <p>Wysokość: {lng}</p>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-4">
                        <div className="flex align-center gap-x-2 items-center">
                            <Switch id="update-location" checked={isSharing} onCheckedChange={() => setIsSharing(!isSharing)} />
                            <Label htmlFor="update-location">Udostępnianie lokalizacji</Label>
                        </div>
                        {(lat && lng) && (
                                <Map lat={lat} lng={lng} />
                        )}
                    </CardContent>
                    <CardFooter className="text-sm text-muted-foreground">
                        Jeśli kropka świeci się na szaro, to nie udało się pobrać lokalizacji. Jeśli błąd nie ustępuje, przeładuj stronę.
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={status} className="grid grid-cols-3" onValueChange={(value) => updateStatus(value)}>
                            <StatusRadio value="online" name="Jesteśmy w drodze!" loading={loading || !record}>
                                <StatusBadge status="online" withoutDescription disableAnimation size="lg" />
                            </StatusRadio>
                            <StatusRadio value="stop" name="Stoimy w miejscu" loading={loading || !record}>
                                <StatusBadge status="stop" withoutDescription disableAnimation size="lg" />
                            </StatusRadio>
                            <StatusRadio value="offline" name="Jesteśmy na przerwie" loading={loading || !record}>
                                <StatusBadge status="offline" withoutDescription disableAnimation size="lg" />
                            </StatusRadio>
                        </RadioGroup>
                        {!record && <p className="text-sm text-muted-foreground">Nie załadowaliśmy jeszcze rekordu - aka. nie wiemy jakim punktem na mapie jesteś. Jeśli te przyciski w najbliższym czasie nie zostaną odblokowane, a kropka na górze nie zmieni koloru, przeładuj stronę.</p>}
                    </CardContent>
                </Card>
            </main>
            <div className="md:fixed md:top-4 md:right-4 md:mt-0 flex justify-center mt-4">
                <Button variant={'destructive'} aria-label="Spróbuj ponownie">Wyloguj się</Button>
            </div>
        </div>
    )
}