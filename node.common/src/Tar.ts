import { spawn } from 'child_process'
import { Readable } from 'stream'

export class Tar {
    public static pack(target: string): Readable {
        const path = Path.dirname(target)
        const folder = Path.basename(target)

        const command = `tar c ${folder} -C ${path}`

        const process = spawn(command, {
            shell: true
        })

        let errMsg = ''

        process.stderr.on('data', (data: Buffer) => {
            errMsg += data.toString('utf8')
        })
        // 여기서 클로즈 되기 전에 테스트가 끝나버린다.
        // 기다려야 한다. 그런데 어떻게?
        process.on('close', (code: number) => {
            if (code !== 0) {
                assert.fail(`${errMsg}, code=${code}`)
            }
        })

        return process.stdout
    }

    public static unpack(target: string, input: Readable): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = `tar x -C ${target}`

            const process = spawn(command, {
                shell: true
            })
            input.pipe(process.stdin)

            let errMsg = ''

            process.stderr.on('data', (data: Buffer) => {
                errMsg += data.toString('utf8')
            })

            process.on('close', (code: number) => {
                if (code === 0) {
                    resolve()
                } else {
                    assert.fail(`${errMsg}, code=${code}`, reject)
                }
            })
        })
    }
}
