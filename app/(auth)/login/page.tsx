'use client'

import { useEffect, useState } from 'react'

const ReeRee = () => {
    const [accessToken, setAccessToken] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/hello')
                const data = await response.json()

                if (response.ok) {
                    const token = data.user.token
                    setAccessToken(token)
                } else {
                    console.error("Response error:", data.error)
                }
            } catch (error) {
                console.error("Fetch error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!accessToken) return <p>Token could not be fetch</p>

    return (
        <main>
            Text Top
            <hr />
            <p>{accessToken}</p>
            <hr />
            Some other text here too
        </main>
    )
}

export default ReeRee;
