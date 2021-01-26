import { DockerContainer, util, File } from '../'

test('도커 컨테이너 목록', async () => {
    const images = await DockerContainer.list()

    expect(images.length).toBeGreaterThan(0)
})

describe('도커 컨테이너 실행부터 중지까지', () => {
    jest.setTimeout(20 * 1000)

    const testimage = 'alpine:latest'

    const workingDir = 'output/test/docker'
    const samples = Path.join(workingDir, 'samples')
    const chunk1 = Path.join(samples, 'large1.txt')
    const chunk2 = Path.join(samples, 'large2.txt')
    const chunk3 = Path.join(samples, 'large3.txt')

    beforeAll(async () => {
        await util.exec(`docker pull ${testimage}`)

        Path.remkdir(workingDir)

        Path.mkdir(samples)

        await File.createChunk(chunk1, 1 * 1024 * 1024)
        await File.createChunk(chunk2, 10 * 1024 * 1024)
        await File.createChunk(chunk3, 50 * 1024 * 1024)
    })

    let container = DockerContainer.prototype

    test('create container', async () => {
        const option = {
            Image: testimage,
            Cmd: ['echo', 'hello world']
        }

        container = await DockerContainer.create(option)
    })

    test('put files to container', async () => {
        await container.putDir(samples, '/tmp')
    })

    test('get files from container', async () => {
        Path.remkdir('output/test/tmp')

        await container.getDir('output/test/tmp', '/tmp/samples')

        const res = Path.exists('output/test/tmp/samples/large3.txt')

        expect(res).toBeTruthy()
    })

    test('start container', async () => {
        await container.start()
        await container.wait()

        await container.remove()
    })
})
