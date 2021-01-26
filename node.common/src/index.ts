/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-empty-function */

export * from './common.Path'
export * from './File'
export * from './Tar'
export * from './Base64'
export * from './Serialize'
export * from './stream'
export * from './util'
export * from './HttpRequest'
export * from './Log'
export * from './docker'

declare global {
    enum StatusCode {
        Ok = 200,
        Error = 400,
        NotFound = 404
    }

    type SafeObj = Record<string, unknown>
    type Success = <T>(value: T) => void
    type Fail = (err?: Error) => void
}
