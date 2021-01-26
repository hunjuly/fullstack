import { File } from 'common'
import { Application } from './Application'

assert.truthy(process.argv.length === 3, 'service port undefined.')

const httpPort = parseInt(process.argv[2])

assert.truthy(!isNaN(httpPort), `wrong service port, '${process.argv[2]}'`)

const pkgInfo = File.readJson('package.json') as SafeObj
const app = Application.create({ name: pkgInfo.name as string, version: pkgInfo.version as string })

app.start({ port: httpPort })
