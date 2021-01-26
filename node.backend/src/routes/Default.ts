import { Router, Request, Response } from 'express'

export class Default {
    public static create(info: SafeObj): Router {
        const handle = Router()

        handle.get('/', (req: Request, res: Response): void => {
            assert.notUsed(req, res)

            res.json(info)
        })

        handle.post('/d', (req: Request, res: Response): void => {
            res.json(req.body)
        })

        return handle
    }
}
