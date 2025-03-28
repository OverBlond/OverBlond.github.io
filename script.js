/* Global styles */
body {
  font-family: 'Arial', sans-serif;
  background-color: #121212; /* Dark background */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  flex-direction: column;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #9b59b6; /* Purple color */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Card styling */
.card {
  background-color: #1e1e1e; /* Dark card background */
  padding: 20px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
  width: 300px;
}

/* Input field for number */
input[type="number"] {
  padding: 10px;
  font-size: 1.2rem;
  width: 100px;
  text-align: center;
  background-color: #333;
  border: none;
  border-radius: 5px;
  color: white;
  outline: none;
  margin: 0 10px;
}

/* Remove default increment/decrement buttons in number input */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"]:focus {
  border: 2px solid #9b59b6; /* Purple border on focus */
}

/* Spinner button styling */
.spinner-btn {
  background-color: #9b59b6; /* Purple button */
  color: white;
  font-size: 1.5rem;
  padding: 8px 15px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
}

.spinner-btn:hover {
  background-color: #8e44ad; /* Darker purple when hovering */
}

/* Button styling */
button {
  background-color: #9b59b6; /* Purple background */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #8e44ad; /* Darker purple when hovering */
}

button:disabled {
  background-color: #555;
}

/* Aligning the spinner buttons */
.number-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

/* Style for workout section buttons */
button + button {
  margin-top: 10px;
}

/* Styling the buttons to be full width inside cards */
.card button {
  width: 100%;
  margin-top: 10px;
}
