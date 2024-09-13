// Ramanujan.js

importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;

let k = 0;
let sum = new Big(0);
const factor = new Big(2).times(new Big(2).sqrt()).div(new Big(9801));

function factorial(n) {
    let result = new Big(1);
    for (let i = 1; i <= n; i++) {
        result = result.times(i);
    }
    return result;
}

function estimatePiRamanujan() {
    const iterationsPerLoop = 1; // Adjust as needed
    for (let count = 0; count < iterationsPerLoop; k++, count++) {
        const numerator = factorial(4 * k)
            .times(new Big(1103 + 26390 * k));
        const denominator = factorial(k).pow(4)
            .times(new Big(396).pow(4 * k));
        const term = numerator.div(denominator);

        sum = sum.plus(term);
    }

    const piInverse = factor.times(sum);
    const piEstimation = new Big(1).div(piInverse);

    self.postMessage({
        throws: k,
        piEstimation: piEstimation.toFixed(100),
        method: "Ramanujan"
    });
}

self.addEventListener("message", (event) => {
    const { command } = event.data;
    if (command === "start") {
        if (estimating) return;
        estimating = true;
        k = 0;
        sum = new Big(0);
        intervalId = setInterval(() => {
            estimatePiRamanujan();
        }, 1000);
    } else if (command === "stop") {
        if (!estimating) return;
        estimating = false;
        clearInterval(intervalId);
    }
});
