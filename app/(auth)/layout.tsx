import { ModalProvider } from "./board/[id]/table-components/card-modal/ModalProvider"
import { NavBar } from "./components/NavBar"
import Provider from "./context/Provider"
import { QueryProvider } from "./context/QueryProvider"
import { OPTIONS } from "@/utils/authOptions"
import { getServerSession } from 'next-auth/next'

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(OPTIONS)
    if (session === null) {
        return (<div>Error no session</div>)
    }

    return (
        <Provider session={session}>
            <QueryProvider>
                <ModalProvider />
                <NavBar />
                {children}
            </QueryProvider>
        </Provider>
    )
}
