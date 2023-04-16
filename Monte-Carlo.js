importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');
let intervalId;
let pivalue = new Big(0);
let totalits = 0;

function calculatePi() {
    let circleThrows = 0;
    let i = 4000000;

    for (; i > 0; i--) {
        const x = Math.random();
        const y = Math.random();
        const distance = x * x + y * y;

        if (distance <= 1) {
            circleThrows++;
        }
    }

    const fourCircleThrows = new Big(4).times(circleThrows);
    pivalue = pivalue.plus(fourCircleThrows.div(4000000));
    totalits++;
    const pireturn = pivalue.div(totalits);
    self.postMessage({ throws: 4000000, piEstimation: pireturn.toFixed(100), method: "Monte-Carlo" });
}


self.addEventListener("message", (event) => {
    if (event.data.command === "start") {
        if (!intervalId) {
            intervalId = setInterval(calculatePi, 0);
        }
    } else if (event.data.command === "stop") {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});
