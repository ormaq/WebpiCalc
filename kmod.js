// kmod.js

importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;

let piInverse = new Big(0);
let k = 0;

const factorialCache = { '0': new Big(1), '1': new Big(1) };

function factorial(n) {
    if (factorialCache[n]) return factorialCache[n];
    let result = factorialCache[n - 1];
    result = result.times(n);
    factorialCache[n] = result;
    return result;
}

function estimatePiChudnovsky() {
    const iterationsPerLoop = 1; // Due to heavy computation
    for (let count = 0; count < iterationsPerLoop; count++, k++) {
        const kBig = new Big(k);
        const numerator = factorial(6 * k)
            .times(new Big(13591409).plus(new Big(545140134).times(kBig)));
        const denominator = factorial(3 * k)
            .times(factorial(k).pow(3))
            .times(new Big(-640320).pow(3 * k));
        const term = numerator.div(denominator);

        piInverse = piInverse.plus(term);
    }

    const C = new Big(426880).times(new Big(10005).sqrt());
    const piEstimation = C.div(piInverse);

    self.postMessage({
        throws: iterationsPerLoop,
        piEstimation: piEstimation.toFixed(100),
        method: "kmod"
    });
}

self.addEventListener("message", (event) => {
    const { command } = event.data;
    if (command === "start") {
        if (estimating) return;
        estimating = true;
        k = 0;
        piInverse = new Big(0);
        intervalId = setInterval(() => {
            estimatePiChudnovsky();
        }, 1000); // Longer interval due to heavy computation
    } else if (command === "stop") {
        if (!estimating) return;
        estimating = false;
        clearInterval(intervalId);
    }
});
