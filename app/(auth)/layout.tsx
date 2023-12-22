import Provider from "./context/Provider"

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <Provider>
            {children}
        </Provider>
    )
  }