/**
 *  将文件大小标准化，并用空格填充统一长度
 *  @param {Number} a 文件大小
 *  @param {Number} b 保留有效值位数
 */
function formatBytes (a, b = 2) {
    const c = 1024,
        d = ['B', 'KB', 'MB', 'GB', 'TB'],
        e = Math.floor(Math.log(a) / Math.log(c))
    let result = parseFloat((a / Math.pow(c, e)).toFixed(b)) + d[e]

    const length = 10 - result.length
    for (let i = 0; i < length; i++) {
        result += ' '
    }
    return result
}

module.exports = {
    formatBytes,
}
