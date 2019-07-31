// Google Cloud Datastore Client
const path = require('path')
const { Datastore } = require('@google-cloud/datastore');
const AbstractDBClient = require('./AbstractDBClient');

class GCDClient extends AbstractDBClient {
    constructor(params) {
        super();
        const { projectId, keyFilename } = params;

        this.datastore = new Datastore(
            {
                projectId: projectId,
                keyFilename: keyFilename
            }
        );
        this.kindPrices = 'SymbolPrices';
        this.kindInfo = 'SymbolInfo';
    }
    async getInfoAboutSymbol(symbol) {
        const infoKey = this.datastore.key([this.kindInfo, symbol]);
        const query = this.datastore.createQuery(this.kindInfo).filter('__key__', infoKey);
        const [infoArr] = await this.datastore.runQuery(query);
        const { name, logo } = infoArr[0];
        return { symbol, name, logo };
    }
    async saveInfoAboutSymbol(symbol, name, logo) {
        const infoKey = this.datastore.key([this.kindInfo, symbol]);
        const infoRecord = {
            key: infoKey,
            data: { name, logo }
        };

        await this.datastore.save(infoRecord);
    }
    async getPrices(symbol, afterDate, beforeDate) {
        let query = this.datastore.createQuery(this.kindPrices).filter('symbol', '=', symbol);
        if (afterDate) {
            query = query.filter('datetime', '>', afterDate)
        }
        if (beforeDate) {
            query = query.filter('datetime', '<', beforeDate)
        }
        const [prices] = await this.datastore.runQuery(query);
        return prices.map(item => { return { datetime: new Date(item.datetime), symbol: item.symbol, price: item.price } });
    }
    async savePrice(symbol, price) {
        const priceKey = this.datastore.key(this.kindPrices);
        const priceRecord = {
            key: priceKey,
            data: {
                symbol: symbol,
                price: price,
                datetime: new Date().getTime()
            }
        };

        await this.datastore.save(priceRecord);
    }
}

module.exports = GCDClient;