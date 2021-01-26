import { Tar, File } from './'

describe('Tar', () => {
    const workingDir = 'output/test/utils/tar'
    const tarfile = Path.join(workingDir, 'output.tar')

    const samples = Path.join(workingDir, 'samples')
    const chunk1 = Path.join(samples, 'large1.txt')
    const chunk2 = Path.join(samples, 'large2.txt')
    const chunk3 = Path.join(samples, 'large3.txt')

    beforeAll(async () => {
        jest.setTimeout(15 * 1000)

        Path.remkdir(workingDir)

        Path.mkdir(samples)

        await File.createChunk(chunk1, 1 * 1024 * 1024)
        await File.createChunk(chunk2, 10 * 1024 * 1024)
        await File.createChunk(chunk3, 50 * 1024 * 1024)
    })

    test('output stream', (done) => {
        const output = File.writeStream(tarfile)

        const input = Tar.pack(samples)

        input.pipe(output)

        output.on('close', () => {
            expect(Path.exists(tarfile)).toBeTruthy()
            done()
        })
    })

    test('input stream', async () => {
        Path.rmdir(samples)

        const input = File.readStream(tarfile)

        await Tar.unpack(workingDir, input)

        expect(Path.exists(chunk1)).toBeTruthy()
        expect(Path.exists(chunk2)).toBeTruthy()
        expect(Path.exists(chunk3)).toBeTruthy()
    })
})
