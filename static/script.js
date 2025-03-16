const apiBase = "https://health-risk-calc-front-bfhdcednd2ayhbeh.centralus-01.azurewebsites.net/"; 

//Ping API, used to wake up the server. 
async function wakeUpServer() {
    try {
        const response = await fetch(`${apiBase}/ping`);
        const data = await response.json();
        console.log('Server wake-up response:', data.message);
    } catch (err) {
        console.error('Failed to wake up server:', err);
    }
}

document.getElementById('enter-btn').addEventListener('click', async function() {
    const weight = document.getElementById('weight').value;
    const feet = document.getElementById('feet').value;
    const inches = document.getElementById('inches').value;
    const age = document.getElementById('age').value;
    const bloodPressure = document.getElementById('blood-pressure').value;
    const familyHistoryCheckboxes = Array.from(document.querySelectorAll('input[name="family-history"]:checked')) .map(cb => cb.value);

    if (!weight || isNaN(weight) || weight < 0) {
        alert('Please enter a valid weight in lbs (non-negative number).');
        return false;
    }

    if (!feet || !inches) {
        alert('Please select both feet and inches for height.');
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


    // (UNTESTED) Calls sendHealthData(). 
    try {
        await sendHealthData({weight, feet, inches, age, bloodPressure, familyHistoryCheckboxes});
    } catch (error) {
        console.error('Failed to send health data:', error);
    }


    // If all fields are valid, showing the summary section
    document.getElementById('summary').style.display = 'block';
    return true;
});

// (UNTESTED) Takes the values from the client, and uses an API to send the results over to the backend
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
        summaryDiv.innerHTML = `
            <h2>Summary</h2>
            <p><strong>BMI:</strong> ${data.BMI} (${data.BMICategory})</p>
            <p><strong>Final Score:</strong> ${data.finalScore}</p>
            <p><strong>Risk Category:</strong> ${data.riskCategory}</p>
        `;
        summaryDiv.style.display = 'block';
    } else {
        alert(data.message);
    }
}