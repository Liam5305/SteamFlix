// src/services/storeApis.js

export const getUserLocale = () => {
  const browserLocale = navigator.language || 'en-GB';
  const currency = new Intl.NumberFormat(browserLocale, { 
    style: 'currency', 
    currency: browserLocale.includes('GB') ? 'GBP' : 'USD'
  });
  
  return {
    locale: browserLocale,
    currencyCode: currency.resolvedOptions().currency,
    format: (price) => {
      return currency.format(price);
    }
  };
};

export const STORE_INFO = {
  1: { name: 'Steam', icon: 'https://www.cheapshark.com/img/stores/icons/0.png' },
  2: { name: 'GamersGate', icon: 'https://www.cheapshark.com/img/stores/icons/1.png' },
  3: { name: 'GreenManGaming', icon: 'https://www.cheapshark.com/img/stores/icons/2.png' },
  4: { name: 'Amazon', icon: 'https://www.cheapshark.com/img/stores/icons/3.png' },
  5: { name: 'GameStop', icon: 'https://www.cheapshark.com/img/stores/icons/4.png' },
  7: { name: 'GOG', icon: 'https://www.cheapshark.com/img/stores/icons/6.png' },
  8: { name: 'Origin', icon: 'https://www.cheapshark.com/img/stores/icons/7.png' },
  11: { name: 'Humble Store', icon: 'https://www.cheapshark.com/img/stores/icons/11.png' },
  13: { name: 'Epic Games Store', icon: 'https://www.cheapshark.com/img/stores/icons/13.png' },
  15: { name: 'Fanatical', icon: 'https://www.cheapshark.com/img/stores/icons/15.png' },
};

export const fetchCheapSharkPrices = async (gameTitle) => {
  const { currencyCode, format } = getUserLocale();
  
  try {
    const response = await fetch(`https://www.cheapshark.com/api/1.0/games?title=${encodeURIComponent(gameTitle)}&limit=1`);
    const data = await response.json();
    
    if (currencyCode !== 'USD') {
      const exchangeResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
      const exchangeData = await exchangeResponse.json();
      const rate = exchangeData.rates[currencyCode];

      return data.map(item => ({
        ...item,
        price: format(parseFloat(item.price) * rate),
        retailPrice: format(parseFloat(item.retailPrice) * rate)
      }));
    }

    return data;
  } catch (error) {
    console.error('CheapShark API Error:', error);
    return null;
  }
};

export const getAllStorePrices = async (gameTitle, steamAppId) => {
  const { format } = getUserLocale();
  
  try {
    const [cheapSharkData, steamData] = await Promise.all([
      fetchCheapSharkPrices(gameTitle),
      steamAppId ? fetchSteamPrice(steamAppId) : null
    ]);

    const storePrices = [];

    if (cheapSharkData && cheapSharkData.length > 0) {
      const gameDeals = await fetch(`https://www.cheapshark.com/api/1.0/games?id=${cheapSharkData[0].gameID}`).then(res => res.json());
      
      if (gameDeals.deals) {
        gameDeals.deals.forEach(deal => {
          const store = STORE_INFO[deal.storeID];
          if (store) {
            const price = parseFloat(deal.price);
            const retailPrice = parseFloat(deal.retailPrice);
            
            storePrices.push({
              storeName: store.name,
              storeIcon: store.icon,
              price: price, // Send raw number, let PriceDisplay handle formatting
              retailPrice: retailPrice, // Send raw number, let PriceDisplay handle formatting
              savings: Math.round(deal.savings),
              url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
              isOnSale: deal.savings > 0
            });
          }
        });
      }
    }

    // Add additional store data
    storePrices.push({
      storeName: 'Xbox Game Pass',
      storeIcon: '/api/placeholder/32/32',
      price: 'Included with subscription',
      isSubscription: true,
      url: 'https://www.xbox.com/xbox-game-pass',
    });

    return storePrices;
  } catch (error) {
    console.error('Error fetching store prices:', error);
    return [];
  }
};

export const fetchSteamPrice = async (steamAppId) => {
  try {
    const response = await fetch(`https://store.steampowered.com/api/appdetails?appids=${steamAppId}&cc=uk&filters=price_overview`);
    const data = await response.json();
    return data[steamAppId].data;
  } catch (error) {
    console.error('Steam API Error:', error);
    return null;
  }
};