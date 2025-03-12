const apiBase = 0; //insert backend link here in place of the 0

async function wakeUpServer() {
    try {
        const response = await fetch(`${apiBase}/ping`);
        const data = await response.json();
        console.log('Server wake-up response:', data.message);
    } catch (err) {
        console.error('Failed to wake up server:', err);
    }
}

document.getElementById('enter-btn').addEventListener('click', function() {
    const weight = document.getElementById('weight').value;
    const feet = document.getElementById('feet').value;
    const inches = document.getElementById('inches').value;
    const age = document.getElementById('age').value;
    const bloodPressure = document.getElementById('blood-pressure').value;
    const familyHistoryCheckboxes = document.querySelectorAll('input[name="family-history"]:checked');

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


    // If all fields are valid, showing the summary section
    document.getElementById('summary').style.display = 'block';
    return true;
});