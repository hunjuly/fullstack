import { MongoClient, Db, Collection as MongoCollection } from 'mongodb'
import { Serialize } from '..'

type ConnectionOpt = {
    host: string
    port: number
    user: string
    password: string
    database: string
}

export class NosqlDb {
    public static async create(opt: ConnectionOpt): Promise<NosqlDb> {
        const client = await MongoClient.connect(`mongodb://${opt.host}:${opt.port}`, {
            auth: {
                user: opt.user,
                password: opt.password
            },
            useUnifiedTopology: true
        })

        const db = client.db(opt.database)

        return new NosqlDb(client, db)
    }

    readonly client: MongoClient
    readonly db: Db

    private constructor(client: MongoClient, db: Db) {
        this.client = client
        this.db = db
    }

    public getCollection<T>(name: string): Collection<T> {
        const collection = this.db.collection(name)

        return new Collection<T>(collection)
    }

    public async close(): Promise<void> {
        return this.client.close()
    }
}

export class Document {
    @Prop() readonly _id: string

    protected constructor(id: string) {
        this._id = id
    }
}

export class Collection<T> {
    private mongo: MongoCollection

    constructor(mongo: MongoCollection) {
        this.mongo = mongo
    }

    public async insert(t: T): Promise<void> {
        const text = Serialize.makePlain(t)

        await this.mongo.insertOne(text)
    }

    public async get(id: string): Promise<T> {
        const one = (await this.mongo.findOne({ _id: id })) as T

        return one
    }

    public async numberOfDocs(): Promise<number> {
        return await this.mongo.countDocuments()
    }
}
