const apiBase = "https://health-risk-calc-front-bfhdcednd2ayhbeh.centralus-01.azurewebsites.net/"; 

//Ping API, used to wake up the server. 
async function wakeUpServer() {
    try {
        const response = await fetch(`${apiBase}/ping`);
        const data = await response.json();
        console.log('Server wake-up response:', data.status);
    } catch (err) {
        console.error('Failed to wake up server:', err);
        throw err; 
    }
}
document.addEventListener('DOMContentLoaded', () => {
    wakeUpServer();
});
function clearFormFields() {
    document.getElementById('weight').value = '';
    document.getElementById('feet').value = '';
    document.getElementById('inches').value = '';
    document.getElementById('age').value = '';
    document.getElementById('blood-pressure').value = '';
    document.querySelectorAll('input[name="family-history"]:checked').forEach(checkbox => checkbox.checked = false);
}
document.getElementById('enter-btn').addEventListener('click', async function() {
    const weightInput = document.getElementById('weight').value;
    const feetInput = document.getElementById('feet').value;
    const inchesInput = document.getElementById('inches').value;
    const age = document.getElementById('age').value;
    const bloodPressure = document.getElementById('blood-pressure').value;
    const familyHistoryCheckboxes = Array.from(document.querySelectorAll('input[name="family-history"]:checked')) .map(cb => cb.value);

    const weight = parseFloat(weightInput);
    const feet = parseFloat(feetInput, 10);
    const inches = parseFloat(inchesInput, 10);

    if (!weight || isNaN(weight) || weight < 0) {
        alert('Please enter a valid weight in lbs (non-negative number).');
        return false;
    }
    if (isNaN(feet) || feet < 0) {
        alert('Please select a valid value for feet.');
        return false;
    }

    if (isNaN(inches) || inches < 0 || inches > 11) {
        alert('Please select a valid value for inches (0-11).');
        return false;
    }
    if (!age) {
        alert('Please select an age.');
        return false;
    }

    if (!bloodPressure) {
        alert('Please select a blood pressure category.');
        return false;
    }
    // Calls sendHealthData(). 
    try {
        await sendHealthData({weight, feet, inches, age, bloodPressure, familyHistoryCheckboxes});
    } catch (error) {
        console.error('Failed to send health data:', error);
        alert('An error occurred while sending data. Please try again.');
    }


    // If all fields are valid, showing the summary section
    document.getElementById('summary').style.display = 'block';
    clearFormFields();
    return true;
    
});

// Takes the values from the client, and uses an API to send the results over to the backend
async function sendHealthData(data) {
    const response = await fetch(`${apiBase}/calculate-risk`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    const result = await response.json();
    displayResults(result);
}

function displayResults(data) {
    if (data.status === 'success') {
        const summaryDiv = document.getElementById('summary');

        const weight = document.getElementById('weight').value;
        const feet = document.getElementById('feet').value;
        const inches = document.getElementById('inches').value;
        const age = document.getElementById('age').value;
        const bloodPressure = document.getElementById('blood-pressure').value;
        const familyHistoryCheckboxes = Array.from(document.querySelectorAll('input[name="family-history"]:checked')).map(cb => cb.value);

        const familyHistory = familyHistoryCheckboxes.length > 0 ? familyHistoryCheckboxes.join(', ') : 'No family history selected';

        let riskColor = 'green'; // (low risk)
        if (data.riskCategory === 'moderate risk') {
            riskColor = 'darkgoldenrod'; 
        } else if (data.riskCategory === 'high risk') {
            riskColor = 'orange'; 
        } else if (data.riskCategory === 'uninsurable') {
            riskColor = 'red'; 
        }


        summaryDiv.innerHTML = `
            <h2>Summary</h2>
            <p><strong>Weight:</strong> ${weight} lbs</p>
            <p><strong>Age:</strong> ${age}</p>
            <p><strong>Height:</strong> ${feet} ft ${inches} in</p>
            <p><strong>Blood Pressure Category:</strong> ${bloodPressure}</p>
            <p><strong>Family History:</strong> ${familyHistory}</p>
            <p><strong>BMI:</strong> ${data.BMI} (${data.BMICategory})</p>
            <p><strong>Final Score:</strong> ${data.finalScore}</p>
            <p><strong>Risk Category:</strong> <span style="color: ${riskColor};">${data.riskCategory}</span></p>
        `;
        summaryDiv.style.display = 'block';
    } else {
        alert(data.message);
    }
}