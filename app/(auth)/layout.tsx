import Provider from "./context/Provider"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
        <Provider session={-1}>
            {children}
        </Provider>
    )
  }