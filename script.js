let current1RM;
let setNumber = 1;
let successCount = 0;
let failureCount = 0;
let restAttempts = 0;
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];

const setPercentages = [0.7, 0.75, 0.8, 0.85];
const setReps = [8, 6, 4, 3];
const plateWeights = [45, 25, 10, 5, 2.5];

const maxInput = document.getElementById('max');
const decreaseBtn = document.getElementById('decrease-btn');
const increaseBtn = document.getElementById('increase-btn');
const setInfoText = document.getElementById('setInfo');

// Add event listeners to the spinner buttons
decreaseBtn.addEventListener('click', () => {
  current1RM = parseFloat(maxInput.value);
  if (!isNaN(current1RM) && current1RM > 0) {
    maxInput.value = Math.max(45, current1RM - 2.5); // Decrease by 2.5 lbs but not below 45
  }
});

increaseBtn.addEventListener('click', () => {
  current1RM = parseFloat(maxInput.value);
  if (!isNaN(current1RM) && current1RM > 0) {
    maxInput.value = current1RM + 2.5; // Increase by 2.5 lbs
  }
});

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
  const adjustedWeight = adjustToClosestPlateWeight(targetWeight);
  const reps = setReps[setNumber - 1];
  const weightWithPlates = calculatePlates(adjustedWeight);

  setInfoText.innerText = `Set ${setNumber}: ${adjustedWeight} lbs (${weightWithPlates}) for ${reps} reps`;
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
      const adjustedWeight = adjustToClosestPlateWeight(reducedWeight);  // Adjust the reduced weight

      // Display the new weight in the failure message dynamically
      setInfoText.innerText = `Failed! Lowering weight by 10%. Try ${adjustedWeight} lbs now.`;

      current1RM = adjustedWeight;  // Update the 1RM with the adjusted weight
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

function resetProgress() {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem('progressData');
    progressData = [];
    alert("Progress has been reset.");
  }
}
