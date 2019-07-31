class AbstractService {
    static getInfoAboutSymbol(symbol) {
        throw new Error('You must implement this method');
    }

    static getPrice(symbol) {
        throw new Error('You must implement this method');
    }
}

module.exports = AbstractService;