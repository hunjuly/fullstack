import * as client from 'superagent'
import { Application } from './Application'

describe('certs & network 생성', () => {
    const port = 4000
    const baseUrl = `http://localhost:${port}/`

    let app = Application.prototype

    beforeAll(() => {
        app = Application.create({
            name: 'app name',
            version: '1.0.0'
        })

        app.start({ port: port })
    })

    afterAll(() => {
        app.close()
    })

    test('default route', async () => {
        const res = await client.get(baseUrl).send()
        expect(res.ok).toBeTruthy()
    })

    test('default route', async () => {
        const body = { name: 'test', age: 99 }
        const res = await client.post(baseUrl).send(body)
        expect(body).toEqual(res.body)
    })
})
