let current1RM;
let setNumber = 1;
let successCount = 0;
let failureCount = 0;
let restAttempts = 0;
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];

const setPercentages = [0.7, 0.75, 0.8, 0.85];
const setReps = [8, 6, 4, 3];
const plateWeights = [45, 25, 10, 5, 2.5];

let currentWeight;

const maxInput = document.getElementById('max');
const decreaseBtn = document.getElementById('decrease-btn');
const increaseBtn = document.getElementById('increase-btn');
const setInfoText = document.getElementById('setInfo');

// Event listeners for the spinner buttons
decreaseBtn.addEventListener('click', () => {
  update1RM('decrease');
});

increaseBtn.addEventListener('click', () => {
  update1RM('increase');
});

function update1RM(action) {
  current1RM = parseFloat(maxInput.value);
  if (!isNaN(current1RM) && current1RM > 0) {
    const increment = 2.5;
    if (action === 'decrease') {
      maxInput.value = Math.max(45, current1RM - increment); // Decrease by 2.5 lbs, but not below 45
    } else if (action === 'increase') {
      maxInput.value = current1RM + increment; // Increase by 2.5 lbs
    }
  }
}

function startWorkout() {
  current1RM = parseFloat(maxInput.value);

  if (isNaN(current1RM) || current1RM <= 0) {
    alert("Please enter a valid 1RM.");
    return;
  }

  document.getElementById('start').style.display = 'none';
  document.getElementById('workout').style.display = 'block';
  nextSet();
}

function nextSet() {
  if (setNumber > setPercentages.length) {
    alert("Workout Complete! Adjustments will be made.");
    adjustNextWorkout();
    return;
  }

  const targetWeight = Math.round(current1RM * setPercentages[setNumber - 1]);
  currentWeight = adjustToClosestPlateWeight(targetWeight); // Adjust weight to closest achievable
  const reps = setReps[setNumber - 1];
  const weightWithPlates = calculatePlates(currentWeight);

  setInfoText.innerText = `Set ${setNumber}: ${currentWeight} lbs (${weightWithPlates}) for ${reps} reps`;
  setNumber++;
}

function adjustToClosestPlateWeight(weight) {
  const barWeight = 45;
  let remainingWeight = weight - barWeight;
  let adjustedWeight = barWeight;

  if (remainingWeight < 0) return barWeight;

  for (let plate of plateWeights) {
    while (remainingWeight >= plate * 2) {
      adjustedWeight += plate * 2;
      remainingWeight -= plate * 2;
    }
  }

  return adjustedWeight;
}

function calculatePlates(weight) {
  let remainingWeight = (weight - 45) / 2; // Subtract bar weight and split per side
  if (remainingWeight < 0) return "Bar only";

  const plates = [];

  for (let plate of plateWeights) {
    while (remainingWeight >= plate) {
      plates.push(`${plate} lbs`);
      remainingWeight -= plate;
    }
  }

  return plates.length ? plates.join(' + ') + ' (each side)' : "Bar only";
}

function completeSet(result) {
  if (result === 'success') {
    successCount++;
    failureCount = 0;
    restAttempts = 0;
    nextSet();
  } else {
    failureCount++;
    restAttempts++;

    if (restAttempts < 2) {
      setInfoText.innerText = `Failed! Rest and try again with the same weight.`;
    } else {
      const reducedWeight = Math.round(currentWeight * 0.9); // Reduce weight by 10%
      currentWeight = adjustToClosestPlateWeight(reducedWeight); // Adjust weight after reduction

      setInfoText.innerText = `Failed! Lowering weight by 10%. Try ${currentWeight} lbs now.`;

      restAttempts = 0; // Reset rest attempts after lowering weight
    }
  }
}

function adjustNextWorkout() {
  if (successCount >= 3) {
    current1RM += 7.5;
    alert(`Great job! Your 1RM has increased to ${current1RM} lbs.`);
  } else if (failureCount >= 2) {
    current1RM -= 2.5;
    alert(`Your 1RM has been adjusted to ${current1RM} lbs.`);
  } else {
    current1RM += 5;
    alert(`Your 1RM is now ${current1RM} lbs.`);
  }
  resetWorkout();
}

function resetWorkout() {
  setNumber = 1;
  successCount = 0;
  failureCount = 0;
  restAttempts = 0;
  document.getElementById('start').style.display = 'block';
  document.getElementById('workout').style.display = 'none';
}

function resetProgress() {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem('progressData');
    progressData = [];
    alert("Progress has been reset.");
  }
}
