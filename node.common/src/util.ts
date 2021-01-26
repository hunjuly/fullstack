import { randomBytes } from 'crypto'
import { spawn } from 'child_process'
import { Readable, Writable } from 'stream'
import { BufferWriteStream } from '.'

export class util {
    public static uuid(): string {
        return randomBytes(16).toString('hex')
    }

    public static exec(command: string): Promise<string>
    public static exec(
        command: string,
        opts: { input?: Readable; output?: Writable }
    ): Promise<void>
    public static exec(command: string, opts?: { input?: Readable; output?: Writable }): unknown {
        return new Promise((resolve, reject) => {
            try {
                const process = spawn(command, {
                    shell: true
                })

                const buffer = BufferWriteStream.create()

                if (opts === undefined) {
                    process.stdout.pipe(buffer)
                } else {
                    if (opts.input !== undefined) {
                        opts.input?.pipe(process.stdin)
                    }

                    if (opts.output !== undefined) {
                        process.stdout.pipe(opts.output)
                    }
                }

                let errMsg = ''

                process.stderr.on('data', (data: Buffer) => {
                    errMsg = data.toString('utf8')
                })

                process.on('close', (code: number) => {
                    if (code === 0) {
                        resolve(buffer.getString())
                    } else {
                        assert.fail(`${errMsg}, code=${code}`, reject)
                    }
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    public static env(name: string): string {
        return process.env[name] ?? ''
    }
}
