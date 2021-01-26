import { Serialize } from '.'

class Info {
    @Prop() id!: number
    @Prop() desc!: string
}

class User {
    @Prop() id!: number
    @Prop() name!: string
    @Prop() @Class(() => Info) infos!: Info[]
}

test('serialization array', () => {
    const users = Serialize.makeClass(User, userJson)

    expect(users.length).toBeGreaterThan(0)

    const user = users[0]

    expect(user.constructor.name).toEqual('User')
    expect(user.infos[0].constructor.name).toEqual('Info')

    const text = Serialize.makePlain(users)
    expect(text.length).toBeGreaterThan(0)
})

test('serialization an object', () => {
    const user = Serialize.makeClass(User, userJson[0])

    expect(user.constructor.name).toEqual('User')
    expect(user.infos[0].constructor.name).toEqual('Info')

    const text = Serialize.makePlain(user)
    expect(text).toEqual(userJson[0])
})

const userJson = [
    {
        id: 1,
        name: 'Johny',
        infos: [
            {
                id: 9,
                desc: 'cool_wale.jpg'
            }
        ]
    },
    {
        id: 2,
        name: 'Ismoil',
        infos: [
            {
                id: 9,
                desc: 'cool_wale.jpg'
            }
        ]
    },
    {
        id: 3,
        name: 'Luke',
        infos: [
            {
                id: 9,
                desc: 'cool_wale.jpg'
            }
        ]
    }
]
