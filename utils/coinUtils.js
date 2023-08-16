const axios = require('axios');
const cheerio = require('cheerio');

async function getCoinPrices(comerce, type) {
    try {
        const coinData = [];
        const coinsToInclude = ['Britannia', 'Canguro', 'Arca', 'Krugerrand', 'Maple', 'Filarmónica', 
                                'Eagle', 'Panda', 'Libertad', 'Lunar', 'Koala', 'Kookaburra', 'Malta']; 
        const groupedCoinData = {};

        if (comerce === 'Dracma') {
            if (type === 'plata') {
                const response = await axios.get('https://www.dracmametales.com/precio-de-la-plata',);

                const $ = cheerio.load(response.data);

                $('tr.product-container').each((index, element) => {
                    const coinName = $(element).find('.nombre a').text().trim();
                    const coinWeight = $(element).find('.peso').text().trim();
                    const coinPrice = $(element).find('.venta-precio').text().trim().substring(18).trim();

                    if(containsPopularCoinsSpanish(coinName, coinsToInclude)){
                        coinData.push({
                            name: coinName,
                            weight: coinWeight,
                            price: coinPrice
                        });
                    }

                });
            }else if(type === 'oro'){
                const response = await axios.get('https://www.dracmametales.com/precio-del-oro',);
                

                const $ = cheerio.load(response.data);

                $('tr.product-container').each((index, element) => {
                    const coinName = $(element).find('.nombre a').text().trim();
                    const coinWeight = $(element).find('.peso').text().trim();
                    const coinPrice = $(element).find('.venta-precio').text().trim().substring(18).trim();

                    if(containsPopularCoinsSpanish(coinName, coinsToInclude)){
                        coinData.push({
                            name: coinName,
                            weight: coinWeight,
                            price: coinPrice
                        });
                    }

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

function containsPopularCoinsSpanish(coinName, keywords) {
    for (const keyword of keywords) {
        if (coinName.includes(keyword)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    getCoinPrices
};  