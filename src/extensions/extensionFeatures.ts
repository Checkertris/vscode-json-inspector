import { Disposer } from "~/disposer"

export abstract class ExtensionFeatures {
    private static registerdStates: Record<string, boolean> = {}

    protected static tryRegister(subjectId: string, callback: () => Disposer): Disposer {
        if (!this.registerdStates[subjectId]) {
            this.registerdStates[subjectId] = true

            let disposer = new Disposer()
            disposer.register(() => (this.registerdStates[subjectId] = false))
            disposer.push(callback())
            return disposer
        } else {
            throw ReferenceError(subjectId + " already registered once")
        }
    }
}
