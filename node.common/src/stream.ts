import { Writable, Readable, Duplex } from 'stream'

export class NullStream extends Duplex {
    public static create(): NullStream {
        return new NullStream()
    }

    _read(): void {
        this.push(null)
    }

    _write(
        chunk: unknown,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void
    ): void {
        callback()
    }
}

export class BufferReadStream extends Readable {
    private buffer: Buffer

    public static fromObject(val: SafeObj): BufferReadStream {
        const str = JSON.stringify(val)
        const buffer = Buffer.from(str)

        return new BufferReadStream(buffer)
    }

    private constructor(buffer: Buffer) {
        super()
        this.buffer = buffer
    }

    _read(): void {
        this.push(this.buffer)
        this.push(null)
    }
}

export class BufferWriteStream extends Writable {
    public readonly buffer: Buffer[]

    public static create(): BufferWriteStream {
        return new BufferWriteStream()
    }

    constructor() {
        super()
        this.buffer = []
    }

    public hasBuffer(): boolean {
        return this.buffer.length > 0
    }

    public getBuffer(): Buffer {
        return Buffer.concat(this.buffer)
    }

    public getString(): string {
        const res = this.getBuffer()

        return res.toString()
    }

    public getJson(): SafeObj {
        const res = this.getBuffer()

        return JSON.parse(res.toString()) as SafeObj
    }

    _write(
        chunk: Buffer,
        encoding: BufferEncoding,
        callback: (error?: Error | null) => void
    ): void {
        this.buffer.push(chunk)

        callback()
    }
}
