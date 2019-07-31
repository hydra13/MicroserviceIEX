class AbstractDBClient {
    getInfoAboutSymbol(symbol) {
        throw new Error('You must implement this method');
    }
    saveInfoAboutSymbol(symbol, name, logo) {
        throw new Error('You must implement this method');
    }
    getPrices(symbol, afterDate, beforeDate) {
        throw new Error('You must implement this method');
    }
    savePrice(symbol, price) {
        throw new Error('You must implement this method');
    }
}

module.exports = AbstractDBClient;