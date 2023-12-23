import Provider from "./context/Provider"

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