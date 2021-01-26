import { NosqlDb, Document } from '.'
import { util } from '..'

class TestDoc extends Document {
    @Prop() desc: string
    @Prop() age: number

    constructor(id: string, desc: string, age: number) {
        super(id)

        this.desc = desc
        this.age = age
    }
}

describe('Nosql DB 테스트', () => {
    let db = NosqlDb.prototype
    const doc = new TestDoc('docid', 'tester', 18)

    let containerId = ''

    beforeAll(async () => {
        containerId = (
            await util.exec(
                'docker run --rm -d -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=adminpw" mongo:4'
            )
        ).slice(0, -1)
    }, 60 * 1000)

    afterAll(async () => {
        await util.exec(`docker stop ${containerId}`)
    })

    test('connet', async () => {
        const ipAddr = await util.exec(
            `docker inspect ${containerId} | jq -r .[0].NetworkSettings.IPAddress`
        )

        db = await NosqlDb.create({
            host: ipAddr,
            port: 27017,
            user: 'admin',
            password: 'adminpw',
            database: 'dbname'
        })
    })

    test('insert', async () => {
        const collection = db.getCollection<TestDoc>('colname')

        await collection.insert(doc)

        const count = await collection.numberOfDocs()

        expect(1).toEqual(count)
    })

    test('get', async () => {
        const collection = db.getCollection<TestDoc>('colname')

        const recv = await collection.get(doc._id)

        expect(doc).toEqual(recv)
    })

    test('get 실패', async () => {
        const collection = db.getCollection<TestDoc>('colname')
        const a = await collection.get('invalid id')

        expect(a).toBeNull()
    })

    test('close', async () => {
        await db.close()
    })
})
