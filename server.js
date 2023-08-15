const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const {google} = require('googleapis');
const credentials = require('./key.json');
const app = express();

const PORT = 3000;

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });

// Función para obtener los precios de las monedas
async function getCoinPrices() {
    try {
        const response = await axios.get('https://www.dracmametales.com/precio-de-la-plata');

        const $ = cheerio.load(response.data);
        const coinData = [];

        $('tr.product-container').each((index, element) => {
            const coinName = $(element).find('.nombre a').text().trim();
            const coinWeight = $(element).find('.peso').text().trim();
            const coinPrice = $(element).find('.venta-precio .PricesalesPrice').text().trim();

            coinData.push({
                name: coinName,
                weight: coinWeight,
                price: coinPrice
            });
        });

        console.log(coinData);
        // await insertPricesToGoogleSheet(coinData);
        
        return coinData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

async function insertPricesToGoogleSheet(prices){
    const spreadSheetId = '1bmxqGYllWcQdFlr_fDXM1zT_kAM3ZOSagBjsPEXO7Bk';

    const values = prices.map(price => [price.name, price.weight, price.price]);

    console.log(values);

    await sheets.spreadsheets.values.append({
        auth: auth,
        spreadsheetId: spreadSheetId,
        range: 'A2', // Rango de celdas donde se insertarán los datos
        valueInputOption: 'RAW',
        resource: {
            values: values
        }
    });
}

// Ruta para obtener los precios de las monedas
app.get('/getPrices', async (req, res) => {
    const prices = await getCoinPrices();
    if (prices) {
        res.json(prices);
    } else {
        res.status(500).json({ error: 'Error fetching prices' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
