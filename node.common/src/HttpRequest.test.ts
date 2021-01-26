import nock from 'nock'
import { BufferReadStream, BufferWriteStream, HttpRequest } from '.'

describe('http request for client', () => {
    afterEach(() => {
        nock.cleanAll()
    })

    test('raw request method', async () => {
        const send = {
            test: 'value',
            arg: 'test1'
        }

        const recv = {
            test: 'value',
            arg: 'test2'
        }

        nock('http://localhost').post('/path', send).reply(200, recv)

        const reader = BufferReadStream.fromObject(send)
        const writer = BufferWriteStream.create()

        const body = await HttpRequest.sendStream(
            {
                host: 'localhost',
                port: 80,
                path: '/path',
                protocol: 'http:',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            },
            reader,
            writer
        )

        expect(nock.isDone()).toBeTruthy()
        expect(body.isSuccess()).toBeTruthy()

        const res = writer.getJson()
        expect(recv).toEqual(res)
    })

    test('get method', async () => {
        nock('http://localhost').get('/path').reply(200)

        const body = await HttpRequest.get('http://localhost/path')

        expect(nock.isDone()).toBeTruthy()
        expect(body).toBeDefined()
    })

    test('post method', async () => {
        const send = {
            test: 'value',
            arg: 'test1'
        }

        const recv = {
            test: 'value',
            arg: 'test2'
        }

        nock('http://localhost').post('/path', send).reply(200, recv)

        const body = await HttpRequest.post('http://localhost/path', send)

        expect(nock.isDone()).toBeTruthy()
        expect(recv).toEqual(body)
    })
})
