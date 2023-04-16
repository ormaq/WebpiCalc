importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;

var pitotal = 0;
var totalruns = 0;

function estimatePi() {
  // generate a random number between -1 and 1
  for (let i = 0; i < 50; i++) {

    var random = Math.random() * 2 - 1;
    var arc1 = Math.abs(arcsinTaylor(random)) ;
    var arc2 = Math.abs(arcsinTaylor(Math.sqrt(1 - (random * random))));
    pitotal += (arc1 + arc2)*2;
    totalruns += 1;
    
  
  }
  var piEstimation = pitotal / totalruns;

  self.postMessage({ throws: 1, piEstimation: piEstimation, method: 'arcsin' });
}
function factorial(n) {
  if (n === 0 || n === 1) return new Big(1);
  let result = new Big(1);
  for (let i = 2; i <= n; i++) {
    result = result.times(i);
  }
  return result;
}

function binomialCoefficient(n, k) {
  return factorial(n).div(factorial(k).times(factorial(n - k)));
}

function arcsinTaylor(x) {
  let sum = new Big(0);
  const bigX = new Big(x);
  // random number 10 - 50
  const n = Math.floor(Math.random() * 30) + 10;
  for (let i = 0; i <= n; i++) {
    const term = binomialCoefficient(2 * i, i)
      .times(bigX.pow(2 * i + 1))
      .div(Big(4).pow(i).times(2 * i + 1));
    sum = sum.plus(term);
  }
  return sum;
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
