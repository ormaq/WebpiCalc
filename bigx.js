importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;
let x = new Big(3);
let piEstimation = new Big(0);

function estimatePi() {
    for (let i = 0; i < 10000; i++) {
        const degreeToRadian = Math.PI / 180;
        const sinValue = new Big(Math.sin((180 / x) * degreeToRadian));
        piEstimation = x.times(sinValue);
        x = x.plus(1);
    }

    self.postMessage({ throws: 10000, piEstimation: piEstimation.toFixed(100), method: 'bigx' });
}

self.addEventListener('message', (event) => {
    const { command } = event.data;

    if (command === 'start') {
        if (estimating) return;
        estimating = true;

        intervalId = setInterval(() => { estimatePi(); }, 100);
    } else if (command === 'stop') {
        if (!estimating) return;

        estimating = false;
        clearInterval(intervalId);
    }
});
