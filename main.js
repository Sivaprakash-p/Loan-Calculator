
const loanAmountSlider = document.querySelector(".loan-amount-slider");
const interestRateSlider = document.querySelector(".interest-rate-slider");
const loanTenureSlider = document.querySelector(".loan-tenure-slider");

const loanAmountValue = document.querySelector(".loan-amount-value");
const interestRateValue = document.querySelector(".interest-rate-value");
const loanTenureValue = document.querySelector(".loan-tenure-value");

const emiOutput = document.querySelector(".emi-output");
const interestOutput = document.querySelector(".interest-output");
const totalOutput = document.querySelector(".total-output");

const calculateBtn = document.querySelector(".calculate-btn");
const chartTypeSelector = document.getElementById("chartType");

let myChart;

function updateLabels() {
  loanAmountValue.textContent = loanAmountSlider.value;
  interestRateValue.textContent = interestRateSlider.value;
  loanTenureValue.textContent = loanTenureSlider.value;
}

loanAmountSlider.addEventListener("input", updateLabels);
interestRateSlider.addEventListener("input", updateLabels);
loanTenureSlider.addEventListener("input", updateLabels);

function calculateEMI(P, r, n) {
  let monthlyRate = r / 12 / 100;
  return P * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1);
}

function displayChart(principal, interest) {
  const ctx = document.getElementById("myChart").getContext("2d");
  const selectedType = chartTypeSelector.value;

  const data = {
    labels: ["Principal", "Interest"],
    datasets: [{
      label: 'Loan Breakdown',
      data: [principal, interest],
      backgroundColor: ["#3b82f6", "#f97316"],
      borderColor: ["#2563eb", "#ea580c"],
      // fill: selectedType === 'line' ? false : true,
      tension: 0.4,
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'bottom' }
    },
    cutout: selectedType === "doughnut" ? "70%" : undefined,
    scales: selectedType === "bar" || selectedType === "line"
      ? {
          y: { beginAtZero: true },
          x: {}
        }
      : {}
  };

  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: selectedType,
    data: data,
    options: options
  });
}

function updateResults() {
  const P = parseFloat(loanAmountSlider.value);
  const r = parseFloat(interestRateSlider.value);
  const n = parseFloat(loanTenureSlider.value);

  const emi = calculateEMI(P, r, n);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - P;

  emiOutput.textContent = Math.round(emi).toLocaleString();
  interestOutput.textContent = Math.round(totalInterest).toLocaleString();
  totalOutput.textContent = Math.round(totalAmount).toLocaleString();

  displayChart(P, totalInterest);
}

function resetInputs() {
  loanAmountSlider.value = 10000;
  interestRateSlider.value = 10;
  loanTenureSlider.value = 60;
  updateLabels();
  emiOutput.textContent = "0";
  interestOutput.textContent = "0";
  totalOutput.textContent = "0";
  if (myChart) myChart.destroy();
}


window.onload = () => {
  resetInputs();
  calculateBtn.addEventListener("click", updateResults);
  chartTypeSelector.addEventListener("change", updateResults);
};
