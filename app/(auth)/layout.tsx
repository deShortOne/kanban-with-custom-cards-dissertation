import { ModalProvider } from "./board/[id]/table-components/card-modal/ModalProvider"
import Provider from "./context/Provider"
import { QueryProvider } from "./context/QueryProvider"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <Provider session={-1}>
      <QueryProvider>
        <ModalProvider />
        {children}
      </QueryProvider>
    </Provider>
  )
}