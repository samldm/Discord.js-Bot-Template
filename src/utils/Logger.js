module.exports = class Logger {
    constructor() {
        this._logs = [];
    }

    log(...args) {
        this._logs.push({
            type: 'log',
            data: args
        });
        console.log(`[LOG]`, ...args);
    }

    warn(...args) {
        this._logs.push({
            type: 'warn',
            data: args
        });
        console.warn(`[WARN]`, ...args);
    }

    error(...args) {
        this._logs.push({
            type: 'error',
            data: args
        });
        console.error(`[ERROR]`, ...args);
    }

    get logs() {
        return this._logs;
    }
}