import { DockerImage } from './DockerImage'

test('image list', async () => {
    const images = await DockerImage.list()

    expect(images.length).toBeGreaterThan(0)
})
