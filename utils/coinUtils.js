const axios = require('axios');
const cheerio = require('cheerio');

async function getCoinPrices(comerce, type) {
    try {
        const coinData = [];

        if (comerce === 'Dracma') {
            if (type === 'plata') {
                const response = await axios.get('https://www.dracmametales.com/precio-de-la-plata',);

                const $ = cheerio.load(response.data);

                $('tr.product-container').each((index, element) => {
                    const coinName = $(element).find('.nombre a').text().trim();
                    const coinWeight = $(element).find('.peso').text().trim();
                    const coinPrice = $(element).find('.venta-precio').text().trim().substring(18).trim();

                    coinData.push({
                        name: coinName,
                        weight: coinWeight,
                        price: coinPrice
                    });
                });
            }else if(type === 'oro'){
                const response = await axios.get('https://www.dracmametales.com/precio-del-oro',);

                const $ = cheerio.load(response.data);

                $('tr.product-container').each((index, element) => {
                    const coinName = $(element).find('.nombre a').text().trim();
                    const coinWeight = $(element).find('.peso').text().trim();
                    const coinPrice = $(element).find('.venta-precio').text().trim().substring(18).trim();

                    coinData.push({
                        name: coinName,
                        weight: coinWeight,
                        price: coinPrice
                    });
                });
            }
        }else if(comerce === 'Numismatica'){
            //etc
        }

        console.log(coinData);

        return coinData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

module.exports = {
    getCoinPrices
};  