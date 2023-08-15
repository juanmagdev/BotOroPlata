const express = require('express');
const { getCoinPrices } = require('./utils/coinUtils');

const app = express();

const PORT = 3000;

// Dracma Store
app.get('/getPrices/Dracma/:type', async (req, res) => {
    const type = req.params.type.toLowerCase();
    if(type === 'plata' || type === 'oro'){
        const prices = await getCoinPrices('Dracma', type);
        if (prices) {
            res.json(prices);
        } else {
            res.status(500).json({ error: 'Error fetching prices' });
        }
    }else{
        res.status(404).json({ error: 'Type not found' });
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
