/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import 'reflect-metadata'
import { Type, Expose, classToPlain, plainToClass } from 'class-transformer'

declare global {
    const Prop: () => (object: Record<string, any> | Function, propertyName?: string) => void
    const Class: (typeFunction: () => Function) => (target: any, key: string) => void
}

const g = global as any

g.Prop = (): ((object: Record<string, any> | Function, propertyName?: string) => void) => {
    return Expose()
}

g.Class = (typeFunction: () => Function): ((target: any, key: string) => void) => {
    return Type(typeFunction)
}

type ClassType<T> = {
    new (...args: unknown[]): T
}

export class Serialize {
    public static makePlain<T>(object: T): Record<string, unknown>
    public static makePlain<T>(object: T[]): Record<string, unknown>[]
    public static makePlain(object: unknown): unknown {
        return classToPlain(object, { strategy: 'excludeAll' })
    }

    public static makeClass<T, V>(cls: ClassType<T>, plain: V[]): T[]
    public static makeClass<T, V>(cls: ClassType<T>, plain: V): T
    public static makeClass<T>(cls: ClassType<T>, plain: unknown): unknown {
        return plainToClass(cls, plain, { strategy: 'excludeAll' })
    }
}
