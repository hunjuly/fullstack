import * as http from 'http'
import { Writable, Readable } from 'stream'
import { BufferWriteStream, HttpRequest, HttpResponse, NullStream } from '../'

export class DockerRequest {
    public static getStream(href: string, writer: Writable): Promise<HttpResponse> {
        const opts = this.createOpts(href)
        opts.method = 'GET'

        return HttpRequest.sendStream(opts, NullStream.create(), writer)
    }

    public static async putStream(href: string, reader: Readable): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'PUT'
        opts.headers = { 'Content-Type': 'application/octet-stream' }

        const writer = BufferWriteStream.create()

        const res = await HttpRequest.sendStream(opts, reader, writer)

        if (!res.isSuccess()) {
            assert.fail(`${res.message}, ${writer.getString()}`)
        }

        return writer.hasBuffer() ? writer.getJson() : {}
    }

    public static get(href: string): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'GET'

        return HttpRequest.sendBuffer(opts)
    }

    public static post(href: string, body?: SafeObj): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'POST'
        opts.headers = { 'Content-Type': 'application/json' }

        return HttpRequest.sendBuffer(opts, body)
    }

    public static delete(href: string): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'DELETE'

        return HttpRequest.sendBuffer(opts)
    }

    private static createOpts(path: string): http.RequestOptions {
        return {
            socketPath: '/var/run/docker.sock',
            path: `http:/v1.40/${path}`
        }
    }
}
