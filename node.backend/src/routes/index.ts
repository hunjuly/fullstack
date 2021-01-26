export * from './Default'

// export class HttpTransaction {
//     public static create(request: express.Request, response: express.Response): HttpTransaction {
//         return new HttpTransaction(request, response)
//     }

//     protected constructor(request: express.Request, response: express.Response) {
//         this.request = request
//         this.response = response
//     }

//     private readonly request: express.Request
//     private readonly response: express.Response

//     public address(): string {
//         return this.request.ip
//     }

//     public text(): string {
//         return JSON.stringify(this.body())
//     }

//     public body(): SafeObj {
//         return this.request.body as SafeObj
//     }

//     public query(): { [key: string]: string } {
//         return this.request.query as { [key: string]: string }
//     }

//     public params(name: string): string {
//         return this.request.params[name]
//     }

//     public method(): string {
//         return this.request.method
//     }

//     public path(): string {
//         return this.request.path
//     }

//     public fail(body: SafeObj): void {
//         this.send(StatusCode.Error, body)
//     }

//     public success(body: SafeObj): void {
//         this.send(StatusCode.Ok, body)
//     }

//     private send(status: StatusCode, body: SafeObj): void {
//         this.response.status(status).json(body).end()
//     }
// }
