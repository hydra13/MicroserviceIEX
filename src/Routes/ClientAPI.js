const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    if (req.dbClient) {
        const filter = req.query.filter;

        const afterDateTime = isNaN(+req.query.adt) ? undefined : +req.query.adt;
        const beforeDateTime = isNaN(+req.query.bdt) ? undefined : +req.query.bdt;
        console.log(afterDateTime);
        console.log(beforeDateTime);
        if (filter) {
            // TODO: требуется сделать по нормальному
            const symbols = filter.split(',');
            const result = []
            const requests = symbols.map(async symbol => {
                const info = await req.dbClient.getInfoAboutSymbol(symbol);
                const prices = await req.dbClient.getPrices(symbol, afterDateTime, beforeDateTime);
                result.push({ symbol: symbol, name: info.name, logo: info.logo, prices: prices.map(priceRec => priceRec.price) })
            });
            Promise.all(requests).then(() => {
                res.send(result);
            })
        } else {
            res.status(400).send('Wrong request');
        }
    } else {
        res.status(500).send('Server error');
    }
});

router.all('/*', (req, res) => {
    res.status(404).send('Page not found');
});

module.exports = router;
