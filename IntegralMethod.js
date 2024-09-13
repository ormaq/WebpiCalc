// IntegralMethod.js

importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');
let intervalId;

let n = 1000; // Initial number of subdivisions

function calculatePiUsingIntegral() {
    n += 1000; // Increase subdivisions for better accuracy
    const a = 0, b = 1;
    const h = (b - a) / n;
    let sum = new Big(0);

    for (let i = 0; i <= n; i++) {
        const x = a + i * h;
        const fx = new Big(1).div(new Big(1).plus(new Big(x).pow(2)));
        const coefficient = (i === 0 || i === n) ? new Big(1) : new Big(2);
        sum = sum.plus(fx.times(coefficient));
    }

    sum = sum.times(h / 2);
    const piEstimation = sum.times(4); // Multiply by 4 to get Pi

    self.postMessage({
        throws: n,
        piEstimation: piEstimation.toFixed(100),
        method: "IntegralMethod"
    });
}

self.addEventListener("message", (event) => {
    if (event.data.command === "start") {
        if (!intervalId) {
            n = 1000; // Reset subdivisions
            intervalId = setInterval(calculatePiUsingIntegral, 1000);
        }
    } else if (event.data.command === "stop") {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});
