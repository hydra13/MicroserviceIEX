// production url: 
// publicToken: 'https://cloud.iexapis.com/stable'
// development url
// urlServer: 'https://sandbox.iexapis.com/stable'
const path = require('path')
module.exports = {
    publicToken: process.env.PUBLIC_TOCKEN || '<YOUR_PUBLIC_TOCKEN>',
    urlServer: process.env.INPUT_SERVICE_URL || 'https://sandbox.iexapis.com/stable',
    port: process.env.PORT || 30330,
    projectId: process.env.PRJ_GCD_ID || '<YOUR_PROJECT_ID>',
    keyFilename: path.resolve(__dirname, '<YOUR_KEYFILENAME>.json')
}