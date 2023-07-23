export class Mutex {
    _queue: Array<any>
    _locked: boolean;
    constructor() {
        this._queue = [];
        this._locked = false;
    }

    lock(): Promise<Function> {
        let unlockNext: Function;
        const willLock:Promise<Function> = new Promise(resolve => unlockNext = resolve);
        this._queue.push(unlockNext);
        if (!this._locked) this._unlock();
        return willLock;
    }

    _unlock() {
        if (this._queue.length > 0) {
            this._locked = true;
            this._queue.shift()(() => this._unlock());
        } else {
            this._locked = false;
        }
    }
}

