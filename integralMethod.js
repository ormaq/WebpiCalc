importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');
let intervalId;
let offset = 0;

function calculatePiUsingIntegral() {
    let sum = new Big(0); // Use Big.js for accumulating the sum
    const n = 10000 + offset; // Number of subdivisions
    const a = -2, b = 2;
    const h = (b - a) / n; // Use native JavaScript numbers for h


    for (let i = 0; i <= n; i++) {
        let x = a + i * h;
        let fx = x ** 3 * Math.cos(x / 2) + 0.5;
        let sqrtPart = Math.sqrt(4 - x ** 2);
        let term = new Big(fx * sqrtPart);

        // Apply the trapezoidal rule
        if (i === 0 || i === n) {
            sum = sum.plus(term);
        } else {
            sum = sum.plus(term.times(2));
        }
    }

    // Adjust the sum for each segment, using Big.js
    sum = sum.times(h / 2);
    offset += 10000; // Update offset for next segment


    // divide by 2 to get the average
    const returnvalue = sum;

    self.postMessage({ throws: 1, piEstimation: returnvalue.toFixed(100), method: "IntegralMethod" });

}

self.addEventListener("message", (event) => {
    if (event.data.command === "start") {
        if (!intervalId) {
            intervalId = setInterval(calculatePiUsingIntegral, 1000);
        }
    } else if (event.data.command === "stop") {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
});
