import { MongoClient } from 'mongodb'
import { util } from '..'

describe('mongodb 실행부터 중지까지', () => {
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

    test('create container', async () => {
        const ipAddr = await util.exec(
            `docker inspect ${containerId} | jq -r .[0].NetworkSettings.IPAddress`
        )

        const client = new MongoClient('mongodb://' + ipAddr + ':27017', {
            auth: {
                user: 'admin',
                password: 'adminpw'
            },
            useUnifiedTopology: true
        })

        await client.connect()

        const db = client.db('dbname')
        const collection = db.collection('colname')

        await collection.insertOne({ _id: 'abc', name: 'apples', qty: 5, rating: 3 })

        const count = await collection.countDocuments()
        expect(count).toEqual(1)

        const one = (await collection.findOne({ _id: 'abc' })) as unknown
        expect(one).not.toBeNull()

        await client.close()
    })
})
