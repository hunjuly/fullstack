import { DockerRequest } from '../'

type ImageInfo = {
    Containers: number
    Created: number
    Id: string
    Labels: null
    ParentId: string
    RepoDigests: null
    RepoTags: string[]
    SharedSize: number
    Size: number
    VirtualSize: number
}

export class DockerImage {
    public static async list(): Promise<ImageInfo[]> {
        const recv = await DockerRequest.get('images/json?all=true')

        return (recv as unknown) as ImageInfo[]
    }
}
