import { createClient } from 'redis'

const client = createClient({
    url: process.env.REDIS_URL
})

client.on('error', err => console.log('Redis Client Error', err))

if (!client.isOpen) {
    client.connect()
}

const add = (key: string, value: string) => client.set(key, value)
const get = (key: string) => client.get(key)

export { add, get }
