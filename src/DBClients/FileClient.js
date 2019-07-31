// File Client

const fs = require('fs');
const AbstractDBClient = require('./AbstractDBClient');

class FileClient extends AbstractDBClient {
    constructor(params) {
        super();
        const { filePath } = params;
        this.filePath = filePath;
        this.infoServices = new Map();
        this.prices = new Map();
        this.loadFromFile();
    }
    getInfoAboutSymbol(symbol) {
        return this.infoServices.get(symbol);
    }
    saveInfoAboutSymbol(symbol, name, logo) {
        this.infoServices.set(symbol, { symbol, name, logo });
        this.saveToFile();
    }
    getPrices(symbol, afterDate, beforeDate) {
        let values = this.prices.get(symbol);
        values = values.filter(value => value.datetime >= afterDate && value.datetime <= beforeDate);
        return values;
    }
    savePrice(symbol, price) {
        const pricesArray = this.prices.get(symbol) || [];
        pricesArray.push({ datetime: new Date().getTime(), price: price, symbol: symbol });
        this.prices.set(symbol, pricesArray);
        this.saveToFile()
    }
    loadFromFile() {
        if (this.filePath && fs.existsSync(this.filePath)) {
            const buffer = fs.readFileSync(this.filePath);
            if (buffer) {
                const dbObj = JSON.parse(buffer.toString());
                const { infoServicesObj, pricesObj } = dbObj;
                for (let key in infoServicesObj) {
                    this.infoServices.set(key, infoServicesObj[key]);
                }
                for (let key in pricesObj) {
                    this.prices.set(key, pricesObj[key]);
                }
            }
        }
    }
    saveToFile() {
        if (this.filePath) {
            let dbObj = {};

            const infoServicesObj = {};
            this.infoServices.forEach((value, key) => { infoServicesObj[key] = value });

            const pricesObj = {};
            this.prices.forEach((value, key) => { pricesObj[key] = value });

            dbObj.infoServices = infoServicesObj;
            dbObj.prices = pricesObj;

            fs.writeFileSync(this.filePath, JSON.stringify(dbObj));
        }
    }
}

module.exports = FileClient;