const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    if (req.parser) {
        const currentSettings = req.parser.getCurrentSettings();
        res.send(JSON.stringify(currentSettings));
    } else {
        res.status(500).send('Server error');
    }
});

router.post('/', (req, res) => {
    if (req.parser) {
        const { symbol, time } = req.body;
        if (symbol && time) {
            req.parser.addSymbol(symbol, time);
            res.status(200).send(JSON.stringify(req.body));
        } else {
            res.status(400).send('Wrong request');
        }
    } else {
        res.status(500).send('Server error');
    }
})

router.put('/', (req, res) => {
    if (req.parser) {
        const { symbol, time } = req.body;
        if (symbol && time) {
            req.parser.updateSymbol(symbol, time);
            res.status(200).send({ symbol, time });
        } else {
            res.status(400).send('Wrong request');
        }
    } else {
        res.status(500).send('Server error');
    }
})

router.delete('/:symbol', (req, res) => {
    if (req.parser) {
        req.parser.deleteSymbol(req.params.symbol);
        res.status(200).send(`${req.params.symbol} was deleted`);
    } else {
        res.status(500).send('Server error');
    }
})

router.all('/*', (req, res) => {
    res.status(404).send('Page not found');
});

module.exports = router;