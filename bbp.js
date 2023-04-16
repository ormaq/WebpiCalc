importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimatingBBP = false;
let intervalIdBBP;

let digits = 100;
let sum = new Big(0);
let loops = 0;
let k = 0;

function calculateTerm(k) {
  let term1 = new Big(4).div(new Big(8).times(k).plus(1));
  let term2 = new Big(2).div(new Big(8).times(k).plus(4));
  let term3 = new Big(1).div(new Big(8).times(k).plus(5));
  let term4 = new Big(1).div(new Big(8).times(k).plus(6));

  return new Big(16).pow(-k).times(term1.minus(term2).minus(term3).minus(term4));
}

function estimatePiBBP() {
  loops++;
  for (; k < digits * loops; k++) {
    sum = sum.plus(calculateTerm(k));
  }
  var piEstimation = sum.toFixed(digits);

  self.postMessage({ throws: 1, piEstimation: piEstimation, method: 'bbp' });

}

self.addEventListener("message", (event) => {
  const { command } = event.data;
  if (command === "start") {
    if (estimatingBBP) return;
    estimatingBBP = true;
    intervalIdBBP = setInterval(() => {
      estimatePiBBP();
    }, 100);
  } else if (command === "stop") {
    if (!estimatingBBP) return;

    estimatingBBP = false;
    clearInterval(intervalIdBBP);
  }
});
