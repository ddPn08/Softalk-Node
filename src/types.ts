export enum Library {
    AquesTalk = 7,
    SAPI = 8,
    Speech_Platform = 9,
    AquesTalk2 = 10,
    AquesTalk10 = 11,
}

export type SofTalkExecOptions = {
    text: string
    read?: boolean
    voice: number
    pitch?: number
    accent?: number
    interval?: number
    speed?: number
    volume?: number
    lib: Library | undefined
    file: string | undefined
}

export type ReadOptions = {
    voice?: number
    pitch?: number
    accent?: number
    interval?: number
    speed?: number
    volume?: number
}
