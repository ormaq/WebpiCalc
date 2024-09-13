// Euler.js

importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;

let n = 1;
let sum = new Big(0);

function sqrtBig(x) {
    // Newton-Raphson method
    let guess = new Big(1);
    const two = new Big(2);
    for (let i = 0; i < 20; i++) {
        guess = x.div(guess).plus(guess).div(two);
    }
    return guess;
}

function estimatePiEuler() {
    const iterationsPerLoop = 1000; // Adjust as needed
    for (let count = 0; count < iterationsPerLoop; n++, count++) {
        const term = new Big(1).div(new Big(n).pow(2));
        sum = sum.plus(term);
    }

    const piEstimation = sqrtBig(sum.times(6));

    self.postMessage({
        throws: n - 1,
        piEstimation: piEstimation.toFixed(100),
        method: "Euler"
    });
}

self.addEventListener("message", (event) => {
    const { command } = event.data;
    if (command === "start") {
        if (estimating) return;
        estimating = true;
        n = 1;
        sum = new Big(0);
        intervalId = setInterval(() => {
            estimatePiEuler();
        }, 100);
    } else if (command === "stop") {
        if (!estimating) return;
        estimating = false;
        clearInterval(intervalId);
    }
});
