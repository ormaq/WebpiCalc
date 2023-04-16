importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimatingWallis = false;
let intervalIdWallis;

let digits = 100;
let product = new Big(1);
let i = 1;
let loops = 0;

function calculateProduct() {
    loops++;
    for (; i <= digits * loops; i++) {
        let term = new Big(2 * i).times(2 * i);
        let denominator = new Big(2 * i - 1).times(2 * i + 1);
        product = product.times(term.div(denominator));
    }

    return product;
}

function estimatePiWallis() {
    let piDividedByTwo = calculateProduct();
    let piEstimation = piDividedByTwo.times(2).toFixed(100);

    self.postMessage({ throws: 1, piEstimation, method: "wallis" });
}

self.addEventListener("message", (event) => {
    const { command } = event.data;
    if (command === "start") {
        if (estimatingWallis) return;
        estimatingWallis = true;
        intervalIdWallis = setInterval(() => {
            estimatePiWallis();
        }, 100);
    } else if (command === "stop") {
        if (!estimatingWallis) return;

        estimatingWallis = false;
        clearInterval(intervalIdWallis);
    }
});
