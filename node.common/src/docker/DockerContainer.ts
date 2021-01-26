import { File, DockerRequest, Tar } from '../'

export class DockerContainer {
    public static async list(): Promise<ContainerInfo[]> {
        const res = await DockerRequest.get('containers/json?all=true')

        return (res as unknown) as ContainerInfo[]
    }

    public static async create(option: CreateOpt): Promise<DockerContainer> {
        let command = 'containers/create'

        if (option.name) {
            command += `?name=${option.name}`
        }

        const res = await DockerRequest.post(command, (option as unknown) as SafeObj)

        const result = res as { Id: string }

        return this.attach(result.Id)
    }

    public static attach(containerId: string): DockerContainer {
        return new DockerContainer(containerId)
    }

    private readonly containerId: string

    private constructor(containerId: string) {
        this.containerId = containerId
    }

    public async start(): Promise<void> {
        await DockerRequest.post(`containers/${this.containerId}/start`)
    }

    public async wait(): Promise<void> {
        await DockerRequest.post(`containers/${this.containerId}/wait`)
    }

    public async stop(): Promise<void> {
        await DockerRequest.post(`containers/${this.containerId}/stop`)
    }

    public logs(): Promise<SafeObj> {
        return DockerRequest.get(`containers/${this.containerId}/logs?stderr=true&stdout=true`)
    }

    public info(): Promise<ContainerInfo> {
        return DockerRequest.get(`containers/${this.containerId}/json`) as Promise<ContainerInfo>
    }

    public async remove(): Promise<void> {
        await DockerRequest.delete(`containers/${this.containerId}?v=true&force=true`)
    }

    public async getDir(hostPath: string, containerPath: string): Promise<void> {
        const tarfile = Path.join(Path.tempdir(), 'get.tar')

        const writter = File.writeStream(tarfile)

        await DockerRequest.getStream(
            `containers/${this.containerId}/archive?path=${containerPath}`,
            writter
        )

        const reader = File.readStream(tarfile)

        await Tar.unpack(hostPath, reader)
    }

    public async putDir(hostPath: string, containerPath: string): Promise<void> {
        const output = Tar.pack(hostPath)

        await DockerRequest.putStream(
            `containers/${this.containerId}/archive?path=${containerPath}`,
            output
        )
    }

    public waitLog(msg: string, seconds: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let count = 0

            const timeLoop = () => {
                count += 1

                this.logs()
                    .then((_value: SafeObj): void => {
                        const res = _value as { body: string }

                        if (res.body.includes(msg)) {
                            resolve(true)
                        } else if (count < seconds) {
                            setTimeout(timeLoop, 1000)
                        } else {
                            resolve(false)
                        }
                    })
                    .catch((err) => {
                        reject(err)
                    })
            }

            setTimeout(timeLoop, 1000)
        })
    }
}

type CreateOpt = {
    Image: string
    name?: string
    Cmd?: string[]
    Env?: string[]
    HostConfig?: {
        AutoRemove?: boolean
        Binds?: string[]
        NetworkMode?: string
    }
}

type ContainerInfo = {
    Id: string
    Names: string[]
    Image: string
    ImageID: string
    Command: string
    Created: number
    Ports: string[]
    Labels: SafeObj
    State: string
    Status: string
    HostConfig: SafeObj
    NetworkSettings: {
        IPAddress: string
        MacAddress: string
    }
    Mounts: SafeObj[]
}
