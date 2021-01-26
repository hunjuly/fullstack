import compression from 'compression'
import errorHandler from 'errorhandler'
import express from 'express'
import { Server, createServer } from 'http'
import {} from 'common'

import * as route from './routes'

export type ApplicationCfg = {
    name: string
    version: string
}

type HttpServerCfg = {
    port: number
}

export class Application {
    public static create(cfg: ApplicationCfg): Application {
        const app = express()
        app.use(compression())
        app.use(errorHandler())
        app.use(express.json())
        app.use(express.urlencoded({ extended: false }))

        app.use('/', route.Default.create(cfg))

        return new Application(app)
    }

    private server?: Server
    private readonly app: express.Express

    private constructor(app: express.Express) {
        this.app = app
    }

    public start(cfg: HttpServerCfg): void {
        const server = createServer(this.app)

        server.on('error', (err?: NodeJS.ErrnoException) => {
            if (typeof err !== 'undefined') {
                if (err.syscall !== 'listen') {
                    throw err
                }

                switch (err.code) {
                    case 'EACCES':
                        assert.fail(`Port ${cfg.port} requires elevated privileges`)
                    // eslint-disable-next-line no-fallthrough
                    case 'EADDRINUSE':
                        assert.fail(`Port ${cfg.port} is already in use!`)
                    // eslint-disable-next-line no-fallthrough
                    default:
                        assert.fail(err.message)
                }
            }
        })

        server.listen(cfg.port)

        this.server = server
    }

    public close(): void {
        this.server?.close()
    }
}
