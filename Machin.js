let estimatingMachin = false;
let intervalIdMachin;

let digits = 100000;
function sign(z) {
    for (let n = 0; n < digits; n++) {
        z[n] *= -1;
        let i = n;
        while (z[i] < 0 && i) {
            z[i] += 10;
            z[i - 1]--;
            i--;
        }
    }
}
function div(z, x) {
    let y = [];
    let r = 0;
    for (let n = 0; n <= digits; n++) {
        y[n] = z[n] || 0;
        r += y[n];
        y[n] = q = Math.floor(r / x);
        r = (r - q * x) * 10;
    }
    return y;
}

let pi = [];
let k = 1;
let A = div([16], 5);
let B = div([-4], 239);
let iteration = 0;

function estimatePiMachin() {
    let a = div(A, k);
    let b = div(B, k);
    for (n = digits; n--;) {
        pi[n] |= 0;
        pi[n] += a[n] + b[n];
        while (pi[n] >= 10) {
            pi[n] -= 10;
            pi[n - 1]++;
        }
    }

    sign(A);
    A = div(A, 5 * 5);
    sign(B);
    B = div(B, 239 * 239);
    k += 2;

    var newpi = pi.join("").slice(1, -9).substring(0, 100);
    let decimalPi = 3 + "." + newpi;
    iteration++;

    self.postMessage({ throws: iteration, piEstimation: decimalPi, method: "Machin", });
}

self.addEventListener("message", (event) => {
    const { command } = event.data;
    if (command === "start") {

        if (estimatingMachin) return;
        estimatingMachin = true;
        intervalIdMachin = setInterval(() => {
            estimatePiMachin();
        }, 100);
    } else if (command === "stop") {
        if (!estimatingMachin) return;

        estimatingMachin = false;
        clearInterval(intervalIdMachin);
    }
});
