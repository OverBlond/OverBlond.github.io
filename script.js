let current1RM;
let setNumber = 1;
let successCount = 0;
let failureCount = 0;
let restAttempts = 0;
let progressData = JSON.parse(localStorage.getItem('progressData')) || [];

// Set percentages and reps for failure focus
const setPercentages = [0.7, 0.75, 0.8, 0.85];
const setReps = [8, 6, 4, 3];

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

  const weight = Math.round(current1RM * setPercentages[setNumber - 1]);
  const reps = setReps[setNumber - 1];

  document.getElementById('setInfo').innerText = 
    `Set ${setNumber}: ${weight} lbs for ${reps} reps`;

  setNumber++;
}

function completeSet(result) {
  const currentWeight = Math.round(current1RM * setPercentages[setNumber - 2]);
  
  if (result === 'success') {
    successCount++;
    failureCount = 0;
    restAttempts = 0;
    nextSet();
  } else if (result === 'failure') {
    failureCount++;
    restAttempts++;

    if (restAttempts < 2) {
      alert("Rest for 2-3 minutes and try again with the same weight.");
    } else {
      const reducedWeight = Math.round(currentWeight * 0.9);
      alert(`Lowering weight by 10%. Try ${reducedWeight} lbs now.`);
      setPercentages[setNumber - 2] *= 0.9;
      restAttempts = 0;
    }
  }
}

function adjustNextWorkout() {
  if (successCount >= 3) {
    current1RM += 7.5; // Bigger increase for strength
    alert(`Great job! Your 1RM has increased to ${current1RM} lbs.`);
  } else if (failureCount >= 2) {
    current1RM -= 2.5; // Slight decrease
    alert(`You hit failure. Adjusting your 1RM to ${current1RM} lbs.`);
  } else {
    current1RM += 5; // Moderate increase
    alert(`Solid work. Your 1RM is now ${current1RM} lbs.`);
  }

  progressData.push(current1RM);
  localStorage.setItem('progressData', JSON.stringify(progressData));
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
