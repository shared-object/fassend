const TokenGenerator = require('uuid-token-generator')
const bcrypt = require('bcrypt')


const tokgen = new TokenGenerator(256, TokenGenerator.BASE62)


async function hashToken(token) {
    const hash = await bcrypt.hash(token, 10)

    return hash
}
 
async function compareToken(token, hash) {
    const result = await bcrypt.compare(token, hash)
    return result;
}


module.exports = { tokgen, hashToken, compareToken }