'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { catchError } from "@/utils/catch-error"
import { pb } from "@/lib/pocketbase"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
 
const formSchema = z.object({
    mail: z.string().email({ message: 'Niepoprawny adres email' }),
    password: z.string().min(8, { message: 'Hasło musi mieć minimum 8 znaków' })
})

export default function LoginPage(){
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mail: '',
            password: ''
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        const [error] = await catchError(pb.collection('users').authWithPassword(values.mail, values.password))
        if (error) {
            setIsLoading(false)
            return toast({
                title: 'Błąd logowania',
                description: 'Niepoprawne dane logowania albo konto nie istnieje',
                variant: 'destructive'
            })
        }
        router.push('/track')
        setIsLoading(false)
        return toast({
            title: 'Zalogowano',
            description: 'Zostałeś pomyślnie zalogowany'
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full flex justify-center items-center p-8">
                <Card className="md:w-[500px] w-full">
                    <CardHeader>
                        <CardTitle>Zaloguj się</CardTitle>
                        <CardDescription className="text-wrap">Aby stworzyć konto w systemie, skontaktuj się z Zielonogórskim Sztabem Wielkiej Orkkiestry Świątecznej Pomocy</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FormField
                        control={form.control}
                        name="mail"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Adres E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="kontakt@mopsior.pl" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem className="mt-4">
                                <FormLabel>Hasło</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading} aria-label="Zaloguj się">Zaloguj się {isLoading && <LoaderCircle className="animate-spin" />}</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
} 