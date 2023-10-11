const LOG = (text, ...rest) => console.debug(`\x1b[33m +++ ${text}: \x1b[0m`, ...rest)

module.exports = {LOG}