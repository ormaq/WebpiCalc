importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimatingChudnovsky = false;
let intervalIdChudnovsky;


let k1 = new Big(545140134);
let k2 = new Big(13591409);
let k3 = new Big(640320);
let k4 = new Big(100100025);
let k5 = new Big(327843840);
let k6 = new Big(53360);
let sqrtK3 = k3.sqrt();

function factorial(n) {
  let result = new Big(1);
  for (let i = 1; i <= n; i++) {
    result = result.times(i);
  }
  return result;
}

function calculateS() {
  let sum = new Big(0);
  for (let i = 0; i <= 50; i++) {
    let num = (new Big(-1).pow(i)).times(factorial(6 * i)).times(k2.add(i * k1));
    let den = (factorial(i).pow(3)).times(factorial(3 * i)).times((new Big(8).times(k4).times(k5)).pow(i));
    sum = sum.plus(num.div(den));
  }
  return sum;
}


function estimatePiChudnovsky() {
  let S = calculateS();
  let pi = (k6.times(sqrtK3)).div(S);
  let piEstimation = pi.toFixed(100);

  self.postMessage({ throws: 1, piEstimation: piEstimation, method: 'kmod' });
}

self.addEventListener("message", (event) => {
  const { command } = event.data;
  if (command === "start") {
    if (estimatingChudnovsky) return;
    estimatingChudnovsky = true;

    estimatePiChudnovsky();

  } else if (command === "stop") {
    if (!estimatingChudnovsky) return;

    estimatingChudnovsky = false;
    clearInterval(intervalIdChudnovsky);
  }
});
