import { ModalProvider } from "./board/[id]/components/card-modal/ModalProvider"
import Provider from "./context/Provider"

export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {

    return (
        <Provider session={-1}>
          <ModalProvider />
            {children}
        </Provider>
    )
  }