import { ChildProcess, spawn, spawnSync } from 'child_process'
import fs from 'fs'

import type { Library, ReadOptions, SofTalkExecOptions } from './types.js'

export class SofTalk {
    private static createOption(text: string, options?: ReadOptions, file?: string, read?: boolean, lib?: Library): SofTalkExecOptions {
        return {
            text,
            voice: options?.voice ?? 0,
            pitch: options?.pitch ?? 100,
            accent: options?.accent ?? 100,
            interval: options?.interval ?? 100,
            speed: options?.speed ?? 100,
            read: read ?? true,
            lib,
            file,
        }
    }

    private static createArgs(options: SofTalkExecOptions) {
        return [
            `/M:${options.voice}`,
            `/PS:${options.read ? 'False' : 'True'}`,
            `/J:${options.pitch ?? 100}`,
            `/K:${options.accent ?? 100}`,
            `/O:${options.interval ?? 100}`,
            `/S:${options.speed ?? 100}`,
            options.lib ? `/T:${options.lib}` : '',
            options.file ? `/R:${options.file}` : '',
        ]
    }

    public bin = 'sofTalk.exe'
    private proc: ChildProcess | null = null

    constructor(bin?: string) {
        if (bin) this.bin = bin
        if (!fs.existsSync(this.bin)) {
            throw new Error(`${this.bin} not found. SofTalkが見つかりません。インストールしてください。`)
        }
        this.proc = spawn(this.bin, ['/X:1'], { stdio: 'inherit' })
        this.proc.on('close', () => {
            this.proc = null
        })
    }

    public close() {
        if (this.proc) this.proc.kill()
    }

    private runSync(options: SofTalkExecOptions) {
        const args = SofTalk.createArgs(options)
        args.push('/X:1')
        args.push(`/W:${options.text}`)
        const ps = spawnSync(this.bin, args)

        if (ps.error) throw ps.error

        return `${ps.stdout}${ps.stderr}`
    }
    private run(options: SofTalkExecOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            const args = SofTalk.createArgs(options)
            args.push('/X:1')
            args.push(`/W:${options.text}`)

            const ps = spawn(this.bin, args)

            let stdout = ''
            ps.once('error', reject)
            ps.stderr.on('data', (data) => reject(data))
            ps.stdout.on('data', (data) => (stdout += data))
            ps.once('close', () => resolve())
        })
    }

    public async read(text: string, readOptions?: ReadOptions, lib?: Library) {
        await this.run(SofTalk.createOption(text, readOptions, undefined, true, lib))
    }

    public save(text: string, path: string, readOptions?: ReadOptions, lib?: Library, timeout?: number) {
        return new Promise<void>((resolve, reject) => {
            fs.writeFileSync(path, '')

            const watcher = fs.watch(path)
            watcher.on('change', (e) => {
                if (e !== 'change') return
                clearTimeout(t)
                watcher.close()
                resolve()
            })
            const t = setTimeout(() => {
                console.error('SofTalk.save timeout')
                watcher.close()
                if (fs.existsSync(path)) resolve()
                else reject(new Error('timeout'))
            }, timeout ?? 10 * 1000)

            this.run(SofTalk.createOption(text, readOptions, path, false, lib))
        })
    }

    public readSync(text: string, readOptions?: ReadOptions) {
        this.runSync(SofTalk.createOption(text, readOptions))
    }

    public saveSync(text: string, path: string, readOptions?: ReadOptions) {
        this.runSync(SofTalk.createOption(text, readOptions, path, false))
    }
}
