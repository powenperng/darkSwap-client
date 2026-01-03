const PRECISION = 1e8;

export function checkPrice(amountBase: bigint, amountQuote: bigint, decimalBase: number, decimalQuote: number, price: number, toleranceBps = 10n) {
    const priceWithDecimal = BigInt((price * PRECISION).toFixed(0));
    const amountQuoteNew = amountBase * priceWithDecimal * BigInt(10 ** decimalQuote) / BigInt(10 ** decimalBase) / BigInt(PRECISION);
    console.log(amountQuote, amountQuoteNew);
    const deviationBps = _calculateDeviationBps(amountQuoteNew, amountQuote);
    return deviationBps <= toleranceBps;
}

function _calculateDeviationBps(actual: bigint, expected: bigint) {
    const diff = actual > expected ? actual - expected : expected - actual;
    return (diff * 10000n) / expected;
}

//write a main method to test the checkPrice function
function main() {
    const amountBase = BigInt(50000000);
    const amountQuote = BigInt(49977509);
    const decimalBase = 6;
    const decimalQuote = 6;
    const price = 1.00045002;
    const toleranceBps = 10n;
    const result = checkPrice(amountBase, amountQuote, decimalBase, decimalQuote, price, toleranceBps);
    console.log(result);
}

main();
