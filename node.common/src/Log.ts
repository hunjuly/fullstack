/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as NodeAssert from 'assert'

class Log {
    public static info(msg: string | SafeObj) {
        console.log(msg)
    }

    public static warning(msg: string | SafeObj) {
        console.log(msg)
    }

    public static error(msg: string | SafeObj): Error {
        let errMsg = ''

        if (typeof msg === 'string') {
            errMsg = msg
        } else {
            errMsg = JSON.stringify(msg)
        }

        return new Error(errMsg)
    }
}

declare global {
    const log: {
        info(msg: string | SafeObj): void
        warning(msg: string | SafeObj): void
        error(msg: string | SafeObj): Error
    }
}

const g = global as any
g.log = Log

class Assert {
    public static fail(msg: string, reject?: (reason?: any) => void): never {
        if (reject === undefined) {
            throw new Error(msg)
        }

        const neverCall = reject as (reason?: any) => never

        return neverCall(msg)
    }

    public static truthy(value: boolean, msg?: string) {
        if (!value) {
            throw new Error(msg ?? 'assert fail')
        }
    }

    public static notUsed(..._: unknown[]) {
        NodeAssert.ok(true)
    }

    public static empty() {
        NodeAssert.ok(true)
    }
}

declare global {
    const assert: {
        fail(msg: string, reject?: (reason?: any) => void): never
        truthy(value: boolean, msg?: string): void
        notUsed(...args: unknown[]): void
        empty(): void
    }
}

g.assert = Assert
