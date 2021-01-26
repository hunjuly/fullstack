import * as http from 'http'
import * as url from 'url'
import { Readable, Writable, pipeline } from 'stream'
import { BufferReadStream, BufferWriteStream, NullStream } from './'

// "  https:   //    user   :   pass   @ sub.example.com : 8080   /p/a/t/h  ?  query=string   #hash "
// ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
// │                                              href                                              │
// ├──────────┬──┬─────────────────────┬────────────────────────┬───────────────────────────┬───────┤
// │ protocol │  │        auth         │          host          │           path            │ hash  │
// │          │  │                     ├─────────────────┬──────┼──────────┬────────────────┤       │
// │          │  │                     │    hostname     │ port │ pathname │     search     │       │
// │          │  │                     │                 │      │          ├─┬──────────────┤       │
// │          │  │                     │                 │      │          │ │    query     │       │
// │          │  │          │          │    hostname     │ port │          │                │       │
// │          │  │          │          ├─────────────────┴──────┤          │                │       │
// │ protocol │  │ username │ password │          host          │          │                │       │
// ├──────────┴──┼──────────┴──────────┼────────────────────────┤          │                │       │
// │   origin    │                     │         origin         │ pathname │     search     │ hash  │
// ├─────────────┴─────────────────────┴────────────────────────┴──────────┴────────────────┴───────┤
// │                                              href                                              │
// └────────────────────────────────────────────────────────────────────────────────────────────────┘

export class HttpResponse {
    public readonly code: StatusCode
    public readonly message: string

    public static create(res: http.IncomingMessage): HttpResponse {
        const code = res.statusCode ?? -1
        const message = res.statusMessage ?? 'res.statusMessage is undefined'

        return new HttpResponse(code, message)
    }

    constructor(code: StatusCode, message: string) {
        this.code = code
        this.message = message
    }

    public isSuccess(): boolean {
        return this.code < 300
    }
}

export class HttpRequest {
    public static sendStream(
        opts: http.RequestOptions,
        reader: Readable,
        writer: Writable
    ): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            const callback = (res: http.IncomingMessage) => {
                if (res.statusCode) {
                    res.on('end', () => resolve(HttpResponse.create(res)))
                        .on('error', reject)
                        .pipe(writer)
                } else {
                    assert.fail('unexpected error. res.statusCode is undefined.', reject)
                }
            }

            const req = http.request(opts, callback).on('error', reject)

            pipeline(reader, req, (err: Error | null) => {
                if (err != null) {
                    reject(err)
                }
            })
        })
    }

    public static async sendBuffer(opts: http.RequestOptions, body?: SafeObj): Promise<SafeObj> {
        const reader = body === undefined ? NullStream.create() : BufferReadStream.fromObject(body)
        const writer = BufferWriteStream.create()

        const res = await this.sendStream(opts, reader, writer)

        if (!res.isSuccess()) {
            assert.fail(res.message + writer.getString())
        }

        return writer.hasBuffer() ? writer.getJson() : {}
    }

    public static get(href: string): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'GET'

        return this.sendBuffer(opts, undefined)
    }

    public static post(href: string, body?: SafeObj): Promise<SafeObj> {
        const opts = this.createOpts(href)
        opts.method = 'POST'
        opts.headers = { 'Content-Type': 'application/json' }

        return this.sendBuffer(opts, body)
    }

    private static createOpts(href: string): http.RequestOptions {
        const parts = url.parse(href)

        return {
            host: parts.host,
            port: parts.port,
            path: parts.path,
            protocol: parts.protocol
        }
    }
}
