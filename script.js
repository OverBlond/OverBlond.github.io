let current1RM;
let setNumber = 1;
let successCount = 0;
let failureCount = 0;
let restAttempts = 0;
let currentWeight;  // This will hold the current working weight

const setPercentages = [0.7, 0.75, 0.8, 0.85];
const setReps = [8, 6, 4, 3];
const plateWeights = [45, 25, 10, 5, 2.5];

function startWorkout() {
  current1RM = parseFloat(document.getElementById('max').value);

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

  // Calculate target weight based on percentage of 1RM for the current set
  const targetWeight = Math.round(current1RM * setPercentages[setNumber - 1]);
  
  // Set current working weight based on adjusted target weight
  currentWeight = adjustToClosestPlateWeight(targetWeight);
  
  const reps = setReps[setNumber - 1];
  const weightWithPlates = calculatePlates(currentWeight);

  // Display current set information
  document.getElementById('setInfo').innerText = `Set ${setNumber}: ${currentWeight} lbs (${weightWithPlates}) for ${reps} reps`;
  setNumber++;
}

function adjustToClosestPlateWeight(weight) {
  const barWeight = 45;
  let remainingWeight = weight - barWeight;
  let adjustedWeight = barWeight;
  
  if (remainingWeight < 0) return barWeight;

  // Adjust the weight using available plates
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
    document.getElementById('feedback').innerText = "Great job! You're progressing.";
    nextSet();
  } else {
    failureCount++;
    restAttempts++;
    document.getElementById('feedback').innerText = "You failed, trying with reduced weight and lower reps.";

    // Adjust weight and reps after failure
    if (restAttempts < 2) {
      // Decrease weight by 10% and round correctly
      const reducedWeight = Math.round(currentWeight * 0.9);
      currentWeight = adjustToClosestPlateWeight(reducedWeight);  // Update the current weight
      const newReps = Math.max(setReps[setNumber - 2] - 1, 1);  // Reduce reps by 1, but not below 1
      document.getElementById('setInfo').innerText = `Try again: ${currentWeight} lbs for ${newReps} reps.`;
      restAttempts = 0;
    } else {
      // If after two failures, adjust the weight by 10% and reduce reps
      const reducedWeight = Math.round(currentWeight * 0.9);
      currentWeight = adjustToClosestPlateWeight(reducedWeight);  // Update the current weight
      const newReps = Math.max(setReps[setNumber - 2] - 1, 1);  // Reduce reps by 1, but not below 1
      document.getElementById('setInfo').innerText = `Lower weight: ${currentWeight} lbs for ${newReps} reps.`;
      restAttempts = 0;
    }
  }
}

function adjustNextWorkout() {
  if (successCount >= 3) {
    current1RM += 7.5;
    document.getElementById('feedback').innerText = `Great job! Your 1RM has increased to ${current1RM} lbs.`;
  } else if (failureCount >= 2) {
    current1RM -= 2.5;
    document.getElementById('feedback').innerText = `Your 1RM has been adjusted to ${current1RM} lbs.`;
  } else {
    current1RM += 5;
    document.getElementById('feedback').innerText = `Your 1RM is now ${current1RM} lbs.`;
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
