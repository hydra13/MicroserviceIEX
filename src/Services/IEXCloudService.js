// IEX Cloud Service
const axios = require('axios')
const config = require('./../config');
const AbstractService = require('./AbstractService');

class ServiceIEXCloud extends AbstractService {
    static getSymbols() {
        return this.getUrlWithPublicToken(`/ref-data/symbols?filter=symbol,name`);
    }
    static getLogo(symbol) {
        return this.getUrlWithPublicToken(`/stock/${symbol}/logo`);
    }
    static getPrice(symbol) {
        return this.getUrlWithPublicToken(`/stock/${symbol}/price`);
    }
    static getName(symbol) {
        return this.getUrlWithPublicToken(`/stock/${symbol}/company?filter=companyName`);
    }
    static getUrlWithPublicToken(url) {
        const { publicToken, urlServer } = config;
        return axios.get(`${urlServer}${url}${url.indexOf('?') !== -1 ? '&' : '?'}token=${publicToken}`);
    }
    static async getInfoAboutSymbol(symbol) {
        try {
            const name = (await this.getName(symbol)).data.companyName;
            const logo = (await this.getLogo(symbol)).data.url;
            return { symbol, name, logo };
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = ServiceIEXCloud;