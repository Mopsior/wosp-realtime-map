import { CheckUserLogedIn } from "@/components/check-user";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <CheckUserLogedIn variant="allow">
                {children}
            </CheckUserLogedIn>
        </>
    )
}
