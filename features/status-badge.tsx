import { cn } from "@/lib/utils"

export const StatusBadge = ({ status = 'offline', withoutDescription = false, disableAnimation = false, size = 'default' }: { status: 'online' | 'stop' | 'offline' | 'info', withoutDescription?: boolean, disableAnimation?: boolean, size?: 'default' | 'lg' }) => {
    return (
        <>
            <div className="relative h-3 w-3">
                <div className={cn("rounded-full w-3 h-3 mt-1", {
                    "bg-gray-500": status === 'offline',
                    "bg-yellow-500": status === 'stop',
                    "bg-green-500": status === 'online',
                    'bg-blue-500': status === 'info',
                    'w-4 h-4': size === 'lg'
                })} />
                {!disableAnimation && (<div className={cn("rounded-full w-3 h-3 animate-ping absolute bg-green-500 top-1", {
                    "bg-gray-500": status === 'offline',
                    "bg-yellow-500": status === 'stop',
                    "bg-green-500": status === 'online',
                    'bg-blue-500': status === 'info',
                    'w-4 h-4': size === 'lg'
                })} />)}
            </div>
            {!withoutDescription && (
                <p className="text-primary">
                    {status === 'offline' && 'Jesteśmy na przerwie'}
                    {status === 'stop' && 'Stoimy w miejscu. Podejdź do nas!'}
                    {status === 'online' && 'Jesteśmy w drodze!'},
                    {status === 'info' && 'Dane są aktualizowane'}
                </p>
            )}
        </>
    )
}