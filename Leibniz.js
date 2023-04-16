importScripts('https://cdnjs.cloudflare.com/ajax/libs/big.js/6.1.1/big.min.js');

let estimating = false;
let intervalId;
let iteration = 0;
let loops = 1;
let piEstimation = new Big(0);

function estimatePiLeibniz() {
  for (; iteration < 40000 * loops; iteration++) {
    const term = new Big(-1).pow(iteration).div(2 * iteration + 1);
    piEstimation = piEstimation.plus(term);
  }
  loops++;

  const pi = piEstimation.times(4);
  self.postMessage({ throws: 40000, piEstimation: pi.toFixed(100), method: 'Leibniz' });
}


self.addEventListener('message', (event) => {
  const { command } = event.data;

  if (command === 'start') {
    if (estimating) return;
    estimating = true;

    intervalId = setInterval(() => { estimatePiLeibniz(); }, 100);
  } else if (command === 'stop') {
    if (!estimating) return;

    estimating = false;
    clearInterval(intervalId);
  }
});
