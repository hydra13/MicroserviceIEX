/*
    Min timeInterval: 5 sec
    Max timeInterval: 60 min (3600 sec)
    timeInterval must be a multiple of 5 seconds.
*/

class Parser {
    constructor(dbClient, service) {
        this.dbClient = dbClient;
        this.service = service;
        this.symbols = new Map(); //key: timeInterval, value: array of symbols
        this.timers = new Map(); //key: timeInterval, value: ID of timer
    }

    addSymbol(symbol, time) {
        if (time && this.isCorrectTime(time) && this.dbClient) {
            symbol = symbol.toLowerCase();

            this.service.getInfoAboutSymbol(symbol)
                .then(result => {
                    if (result) {
                        // save
                        this.saveInfoAboutSymbol(result);

                        // update tasks list for timers
                        const oldSymbolsList = this.symbols.get(time);
                        this.symbols.set(time, oldSymbolsList ? [...oldSymbolsList, symbol] : [symbol]);

                        // the function will add timer if it needs
                        this.addTimerIfNeed(time, this.symbols.get(time));
                    }
                });
        } else {
            throw new Error('Wrong format of time');
        }
    }
    updateSymbol(symbol, time) {
        if (this.isCorrectTime(time)) {
            this.deleteSymbol(symbol);
            this.addSymbol(symbol, time);
        }
    }
    deleteSymbol(symbol) {
        symbol = symbol.toLowerCase();
        this.symbols.forEach((value, key) => {
            const index = value.findIndex(item => item === symbol);
            if (index !== -1) {
                value.splice(index, 1);
                if (value.length === 0) {
                    // if array of values is empty then remove the timer
                    this.removerTimer(key);
                    this.symbols.delete(key);
                }
                return;
            }
        })
    }

    saveInfoAboutSymbol(data) {
        const { symbol, name, logo } = data;
        this.dbClient.saveInfoAboutSymbol(symbol, name, logo);
    }

    getCurrentSettings() {
        const currentSettings = {};
        this.symbols.forEach((value, key) => { currentSettings[key] = value });
        return currentSettings;
    }

    addTimerIfNeed(time) {
        if (!(this.timers.has(time))) {
            const t = this;
            const timer = setInterval(() => {
                t.getPricesBySymbols(t.symbols.get(time));
            }, time * 1000);
            this.timers.set(time, timer);
        }
    }

    getPriceBySymbol(symbol) {
        this.service.getPrice(symbol)
            .then(price => {
                this.dbClient.savePrice(symbol, price.data);
            })
    }

    getPricesBySymbols(symbols) {
        symbols.forEach(symbol => this.getPriceBySymbol(symbol));
    }

    removerTimer(time) {
        const timer = this.timers.get(time);
        if (timer) {
            clearInterval(timer);
            this.timers.delete(time);
        } else {
            throw new Error('timer not found: ' + time);
        }
    }

    isCorrectTime(time) {
        return typeof time === 'number' && time >= 5 && time <= 3600 && time % 5 === 0;
    }
}

module.exports = Parser;