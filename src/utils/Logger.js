let dayjs = require('dayjs');
let chalk = require('chalk');
let util = require('util');

module.exports = class Logger
{
    static send(content, { color = 'grey', prefix = 'LOG', prefixColor = 'green', error = false } = {}) {
        let time = dayjs().format("YYYY-MM-DD HH:mm:ss");
        let prefixTxt = chalk[prefixColor].bold(`[${prefix}]`);
        let cleanedContent = chalk[color](this.clean_content(content));
        let stream = error ? process.stderr : process.stdout;
        stream.write(`(${time}) ${prefixTxt} ${cleanedContent}\n`);
    }

    static clean_content(content) {
        if (typeof content === 'string') return content;
        const cleaned = util.inspect(content, { depth: Infinity });
        return cleaned;
    }

    static log(content, { color = 'grey', prefix = 'LOG', prefixColor = 'green' } = {}) {
        this.send(content, { color, prefix, prefixColor, error: false });
    }

    static info(content, { color = 'blue', prefix = 'INFO', prefixColor = 'blue' } = {}) {
        this.send(content, { color, prefix, prefixColor, error: false });
    }

    static debug(content, { color = 'yellow', prefix = 'DEBUG', prefixColor = 'yellow' } = {}) {
        this.send(content, { color, prefix, prefixColor, error: false });
    }

    static error(content, { color = 'red', prefix = 'ERROR', prefixColor = 'red' } = {}) {
        this.send(content, { color, prefix, prefixColor, error: true });
    }

}