import { useSelector } from "react-redux";
export const ProfitLossAmount = (unit, openingPrice, symbol, trade, coinReducer) => {
    let ProfitLoss = 0;
    if (coinReducer.coinData) {
        let previousPrice = coinReducer.coinData.find(
            (item) => item.symbol === symbol
        );
        if (previousPrice) {
            let investment = openingPrice * unit;
            let currentPrice = previousPrice.price * unit;
            ProfitLoss = currentPrice - investment;
        }

    }

    return ProfitLoss;
};

export const ProfitLossPercentage = (unit, openingPrice, symbol, trade, coinReducer) => {
    let ProfitLoss = 0;
    if (coinReducer.coinData) {
        let previousPrice = coinReducer.coinData.find(
            (item) => item.symbol === symbol
        );
        if (previousPrice) {
            let investment = openingPrice * unit;
            let currentPrice = previousPrice.price * unit;
            ProfitLoss = currentPrice - investment;
            ProfitLoss = (ProfitLoss / investment) * 100;
        }

    }

    return ProfitLoss;
};
export const ProfitLossAmountWithTrade = (trade, coinReducer) => {
    const fee = trade * (coinReducer.commissionFee / 100);
    trade = trade - fee;
    return trade;
}
export const AddCommissionFee = (trade, coinReducer) => {
 
    const fee = trade * (coinReducer.commissionFee / 100);
    trade = trade + fee;
    return trade;
}
// create a function retun the price of persontage 
export const PriceOfPercentage = (percentage, price) => {
    let priceOfPercentage = (percentage / 100) * price;
    return priceOfPercentage + price;
}