export enum Library {
    AquesTalk = 7,
    SAPI = 8,
    Speech_Platform = 9,
    AquesTalk2 = 10,
    AquesTalk10 = 11,
}

export type SofTalkExecOptions = {
    text: string
    voice: number
    read?: boolean
    pitch?: number
    accent?: number
    interval?: number
    speed?: number
    lib: Library | undefined
    file: string | undefined
}

export type ReadOptions = {
    voice?: number
    pitch?: number
    accent?: number
    interval?: number
    speed?: number
}
