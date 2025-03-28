let current1RM;
let setNumber = 1;
let successCount = 0;
let failureCount = 0;
let restAttempts = 0;

const setPercentages = [0.7, 0.75, 0.8, 0.85];
const setReps = [8, 6, 4, 3];
const plateWeights = [45, 25, 10, 5, 2.5];

// Get references to the spinner buttons and the 1RM input
const increaseBtn = document.getElementById('increase-btn');
const decreaseBtn = document.getElementById('decrease-btn');
const maxRepInput = document.getElementById('max');

function startWorkout() {
  current1RM = parseFloat(maxRepInput.value);

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
  const adjustedWeight = adjustToClosestPlateWeight(targetWeight);
  const reps = setReps[setNumber - 1];
  const weightWithPlates = calculatePlates(adjustedWeight);

  document.getElementById('setInfo').innerText = `Set ${setNumber}: ${adjustedWeight} lbs (${weightWithPlates}) for ${reps} reps`;
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
      alert("Rest and try again with the same weight.");
    } else {
      const reducedWeight = Math.round(current1RM * setPercentages[setNumber - 2] * 0.9);
      alert(`Lowering weight by 10%. Try ${reducedWeight} lbs now.`);
      setPercentages[setNumber - 2] *= 0.9;
      restAttempts = 0;
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

// Increase and decrease the 1RM input by 5 pounds (plate weight increments)
increaseBtn.addEventListener('click', () => {
  let currentValue = parseFloat(maxRepInput.value) || 0; // Get the current value of 1RM input
  let new1RM = currentValue + 5;  // Increase by 5 lbs
  maxRepInput.value = new1RM;
  current1RM = new1RM;
});

decreaseBtn.addEventListener('click', () => {
  let currentValue = parseFloat(maxRepInput.value) || 0; // Get the current value of 1RM input
  let new1RM = currentValue - 5;  // Decrease by 5 lbs
  if (new1RM >= 45) {  // Prevent going below the barbell weight (45 lbs)
    maxRepInput.value = new1RM;
    current1RM = new1RM;
  }
});
