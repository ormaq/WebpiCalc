importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');
let estimating = false;
let intervalId;
let iteration = 0;
let loops = 1;
let piEstimation = new Big(3);
let longPi = new Big(0);

function estimatePiNilakantha() {
    for (; iteration < 4000 * loops; iteration++) {
        const sign = iteration % 2 === 0 ? 1 : -1;
        const term = new Big(4).div(new Big(2 * iteration + 2).times(2 * iteration + 3).times(2 * iteration + 4));
        piEstimation = piEstimation.plus(sign * term);
    }
    longPi = longPi.plus(piEstimation);
    const newpi = longPi.div(loops);
    loops++;
    self.postMessage({ throws: iteration, piEstimation: newpi.toFixed(100), method: "Nilakantha" });
}


self.addEventListener("message", (event) => {
    const { command } = event.data;

    if (command === "start") {
        if (estimating) return;
        estimating = true;

        intervalId = setInterval(() => {
            estimatePiNilakantha();
        }, 100);
    } else if (command === "stop") {
        if (!estimating) return;

        estimating = false;
        clearInterval(intervalId);
    }
});
