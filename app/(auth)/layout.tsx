import { SettingModalProvider } from "./board/[id]/settings-modal/components/SettingModalProvider"
import { ModalProvider } from "./board/[id]/table-components/card-modal/ModalProvider"
import { NavBar } from "./components/NavBar"
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
        <SettingModalProvider />
        <ModalProvider />
        <NavBar />
        {children}
      </QueryProvider>
    </Provider>
  )
}
