const getElement = (id) => {
    return document.getElementById(id)
}
const setText = (id, text) => {
    document.getElementById(id).innerText = text
}

function setComponentValues_comp(angle, length, radius, width, mass) {
    comp_angle_input.value = angle;
    comp_length_input.value = length;
    comp_radius_input.value = radius;
    comp_width_input.value = width;
    comp_mass_input.value = mass;
}

function showInputs_comp() {
    comp_angle_input.hidden = false;
    comp_length_input.hidden = false;
    comp_radius_input.hidden = false;
    comp_width_input.hidden = false;
    pendulumTypeSelect.hidden = false;
    comp_mass_input.hidden = false;
    comp_oscillations_input.hidden = false
}

const canvas = getElement("cnv");
const context = canvas.getContext("2d");

const lengthInput = getElement("length");
const angleInput = getElement("angle");
const lockButton = getElement("lock");
const playButton = getElement("playButton");
const oscillationInput = getElement("oscillations");
const resetButton = getElement("resetButton");
const pauseButton = getElement("pauseButton");
const timeTakenBlock = getElement("timetaken");
const timePeriodBlock = getElement("timeperiod");
const resultInertiaBlock = getElement("resultInertia");

let animationFrameId;
let isAnimating = false;
let startTime = 0;
let elapsedTime = 0;
let previousTime = 0;

const originX = canvas.width / 2;
const originY = 10;
// Pendulum properties
let initialAngle = 0.261799;
let maxOscillations = 3;
let oscillationCounting = 0;

let pendulum = {
    length: 2,
    angle: 0.261799, // 15 degree
    mass:0.1,
    gravity: 9.81,
};

let omega = Math.sqrt(pendulum.gravity / (pendulum.length / 100));
let timePeriod = 10;
let timeperiodSet = [];

lengthInput.addEventListener("input", () => {
    pendulum.length = parseFloat(lengthInput.value);
    drawPendulum();
});
const updateLengthValue = (value) => {
    lengthInput.value = value;
    // getElement("lengthValue").innerText = value;
    setText("lengthValue", value)
};


angleInput.addEventListener("input", () => {

    if (angleInput.value>=0 && angleInput.value < 15){
        angleInput.value = 15
    }
    else if (angleInput.value<=0 && angleInput.value > -15){
        angleInput.value = -15
    }


    pendulum.angle = (parseFloat(angleInput.value) * Math.PI) / 180;
    initialAngle = (parseFloat(angleInput.value) * Math.PI) / 180;
    drawPendulum();
});

const updateAngleValue = (value) => {
    if (angleInput.value>=0 && angleInput.value < 15){
        angleInput.value = 15
    }
    else if (angleInput.value<=0 && angleInput.value > -15){
        angleInput.value = -15
    }
    else angleInput.value = value
    getElement("angleValue").innerText = angleInput.value;
    setText("angleValue", angleInput.value)
};

oscillationInput.addEventListener("input", () => {
  
    maxOscillations = oscillationInput.value;
});


getElement("mass").addEventListener("input", () => {
    pendulum.mass = parseFloat(getElement("mass").value);
    drawPendulum();
})



const updateMassValue = (value) => {
    getElement("mass").value = value;
    getElement("massValue").innerText = value;
    setText("massValue", value)
}

const checkBox = () => {
    
    if (lockButton.checked) {

      


        pendulum.length = parseFloat(lengthInput.value);
        pendulum.angle = (parseFloat(angleInput.value) * Math.PI) / 180;
        pendulum.mass = parseFloat(getElement("mass").value);
        omega = Math.sqrt(pendulum.gravity / (pendulum.length ));

        timePeriod = 2 * Math.PI * Math.sqrt(pendulum.length  / pendulum.gravity);
        timeperiodSet = [];
        for (var i = 1; i <= maxOscillations; i++) {
            timeperiodSet.push((timePeriod * i).toFixed(2));
        }

        angleInput.hidden = true;
        lengthInput.hidden = true;
        oscillationInput.hidden = true;
        getElement("mass").hidden = true;
        setText("countOscillationText", `Oscillation Count : ${maxOscillations}`);
        drawPendulum();

        console.log(pendulum)
       

        console.log(timeperiodSet);
        console.log(pendulum,maxOscillations)


         // Constants
         const g = 9.81; // Acceleration due to gravity (m/s^2)

    // Calculate velocity
    let velocity = Math.sqrt(2 * g * pendulum.length * (Math.cos(pendulum.angle) - Math.cos(initialAngle)));

    // Calculate Potential Energy (PE)
    let height = pendulum.length * (1 - Math.cos(pendulum.angle)); // Height relative to the lowest point

    
    getElement('height_theoretical').innerText = `Initial Height: ${height.toFixed(3)} m`
    getElement('theoretical_container').hidden = false;






    } else {
        angleInput.hidden = false;
        lengthInput.hidden = false;
        oscillationInput.hidden = false;
        getElement("mass").hidden = false

        setText("countOscillationText", `Oscillation Count :`);
        resetAnimation()
    }
};

const updateMomentOfInertia = () => {
    const momentOfInertia = Math.pow(pendulum.length / 100, 2);
    setText("momentOfInertiaValue", momentOfInertia.toFixed(2));
};

const giveAlert = () => {
    window.alert("Lock the values first")
}
// Update and draw the pendulum
function drawPendulum() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawProtractor();

    let x = canvas.width / 2 + (pendulum.length*40) * Math.sin(pendulum.angle);
    let y = (pendulum.length*40) * Math.cos(pendulum.angle);



    // Draw the pendulum
    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineTo(x, y);
    context.stroke();

    context.beginPath();
    context.arc(x, y, 8, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#FFBF00";
    context.fill();
    context.strokeStyle = "#000";
    context.stroke();
}

function drawProtractor() {
    context.strokeStyle = "#000000";
    context.lineWidth = 1;

    const startAngle = 0;
    const endAngle = Math.PI; // 180 degrees in radians
    const totalMarks = 180 / 5; // Marks every 5 degrees
    const bigMarkInterval = 2; // Big mark every 10 degrees (2 steps of 5 degrees)
    const mediumMarkInterval = 1; // Medium mark every 5 degrees (1 step)

    const bigMarkLength = 10;
    const mediumMarkLength = 6;
    const radius = 40;

    // Draw marks every 5 degrees
    for (let i = 0; i <= totalMarks; i++) {
        const angle2 = startAngle + (i * 5 * (endAngle - startAngle)) / 180; // Increment by 5 degrees
        let markLength;

        if (i % bigMarkInterval === 0) {
            markLength = bigMarkLength; // Big mark
        } else {
            markLength = mediumMarkLength; // Medium mark
        }

        const startX = originX + radius * Math.cos(angle2);
        const startY = originY + radius * Math.sin(angle2);
        const endX = originX + (radius + markLength) * Math.cos(angle2);
        const endY = originY + (radius + markLength) * Math.sin(angle2);

        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }
}


let i = 0;






var TEarray = []
var KEarray = []
var PEarray = []
var timeArray = []



// Function to draw a graph on the canvas
function drawEnergyGraph() {
    const canvas = document.getElementById('energyCanvas');
    if (!canvas.getContext) {
        console.error('Canvas is not supported in your browser.');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Graph dimensions and margins
    const margin = 40;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Vertical gridlines (x-axis)
    for (let x = margin; x <= width - margin; x += graphWidth / 10) {
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
    }

    // Horizontal gridlines (y-axis)
    for (let y = margin; y <= height - margin; y += graphHeight / 10) {
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();

    // Add axis labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    // X-axis label
    ctx.fillText('Time (s)', width / 2, height - 10);

    // Y-axis label
    ctx.save();
    ctx.translate(10, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energy (J)', 0, 0);
    ctx.restore();

    // Add tick marks and labels
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // X-axis ticks
    for (let x = margin; x <= width - margin; x += graphWidth / 10) {
        const label = ((x - margin) / graphWidth * 10).toFixed(0);
        ctx.beginPath();
        ctx.moveTo(x, height - margin - 5);
        ctx.lineTo(x, height - margin + 5);
        ctx.stroke();
        ctx.fillText(label, x, height - margin + 15);
    }

    // Y-axis ticks
    ctx.textAlign = 'right';
    for (let y = margin; y <= height - margin; y += graphHeight / 10) {
        const label = (((height - margin - y) / graphHeight) * 10).toFixed(0);
        ctx.beginPath();
        ctx.moveTo(margin - 5, y);
        ctx.lineTo(margin + 5, y);
        ctx.stroke();
        ctx.fillText(label, margin - 10, y);
    }
}

// Call the function to draw the graph
drawEnergyGraph();




function drawEnergyGraphWithValues(TEarray, KEarray, PEarray, timeArray) {
    const canvas = document.getElementById('energyCanvas');
    if (!canvas.getContext) {
        console.error('Canvas is not supported in your browser.');
        return;
    }

    const ctx = canvas.getContext('2d');

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;

    // Graph dimensions and margins
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Find the maximum energy and time values for scaling
    const maxEnergy = Math.max(...TEarray);
    const maxTime = Math.max(...timeArray);

    // Draw background grid
    ctx.strokeStyle = '#ced3d3'; // Light gray gridlines
    ctx.lineWidth = 1;

    // Vertical gridlines (x-axis)
    for (let x = margin; x <= width - margin; x += graphWidth / 10) {
        ctx.beginPath();
        ctx.moveTo(x, margin);
        ctx.lineTo(x, height - margin);
        ctx.stroke();
    }

    // Horizontal gridlines (y-axis)
    for (let y = margin; y <= height - margin; y += graphHeight / 10) {
        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#333'; // Dark axes
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();

    // Add title
    ctx.fillStyle = '#000'; // Black title
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Energy vs Time Graph', width / 2, margin / 2);

    // Add axis labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';

    // X-axis label
    ctx.fillText('Time (s)', width / 2, height - margin / 4);

    // Y-axis label
    ctx.save();
    ctx.translate(margin / 4, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energy (J)', 0, 0);
    ctx.restore();

    // Add tick marks and labels
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // X-axis ticks

    let dummy = 1
    let dummyNan = 0;
    for (let x = margin; x <= width - margin; x += graphWidth / 10) {
        var timeLabel = ((x - margin) / graphWidth * maxTime).toFixed(1);
        if (timeLabel=='-Infinity'){
            timeLabel = dummy;
            dummy +=1;
        }
        if (timeLabel=='NaN'){
            timeLabel = dummyNan;
        }

        ctx.beginPath();
        ctx.moveTo(x, height - margin - 5);
        ctx.lineTo(x, height - margin + 5);
        ctx.stroke();
        ctx.fillText(timeLabel, x, height - margin + 15);
    }

    // Y-axis ticks
    ctx.textAlign = 'right';
     dummy = 10;
    for (let y = margin; y <= height - margin; y += graphHeight / 10) {
        var energyLabel = ((maxEnergy * (height - margin - y)) / graphHeight).toFixed(2);
        if (energyLabel=='-Infinity'){
            energyLabel = dummy;
            dummy-=1;
        }
        if (energyLabel=='NaN'){
            energyLabel = dummyNan;
        }
        ctx.beginPath();
        ctx.moveTo(margin - 5, y);
        ctx.lineTo(margin + 5, y);
        ctx.stroke();
        ctx.fillText(energyLabel, margin - 10, y);
    }

    // Plot energy values
    const timeStep = graphWidth / maxTime;

    // Plot Total Energy
    ctx.strokeStyle = '#e74c3c'; // Red for Total Energy
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < TEarray.length; i++) {
        const x = margin + (timeArray[i] / maxTime) * graphWidth;
        const y = height - margin - (TEarray[i] / maxEnergy) * graphHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Plot Kinetic Energy
    ctx.strokeStyle = '#2ecc71'; // Green for Kinetic Energy
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < KEarray.length; i++) {
        const x = margin + (timeArray[i] / maxTime) * graphWidth;
        const y = height - margin - (KEarray[i] / maxEnergy) * graphHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();

    // Plot Potential Energy
    ctx.strokeStyle = '#3498db'; // Blue for Potential Energy
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < PEarray.length; i++) {
        const x = margin + (timeArray[i] / maxTime) * graphWidth;
        const y = height - margin - (PEarray[i] / maxEnergy) * graphHeight;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
}

document.getElementById('download-graph').addEventListener('click', function() {
    const canvas = document.getElementById('energyCanvas');
    
    // Convert the canvas to an image (PNG)
    const imageUrl = canvas.toDataURL('image/png');
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'energy_graph.png';  // Set the filename for the image
    
    // Trigger the download
    link.click();
});




function drawEnergyBars(totalEnergy, KE, PE) {
    // Create a virtual canvas for demonstration
    const canvas = document.getElementById('energyBarCanvas');
    const ctx = canvas.getContext('2d');


    const offset = 30
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up dimensions
    const width = canvas.width;
    const height = canvas.height;
    const chartWidth = width * 0.8;
    const chartHeight = height * 0.6;
    const chartTop = height * 0.3;
    const chartBottom = chartTop + chartHeight;

    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "black"
    ctx.fillText('Energy Bars', width / 2, 20);

       // Calculate bar widths and gaps
       const barCount = 3;
       const gapRatio = 0.2;
       const barWidth = chartWidth / (barCount * (1 + gapRatio));
       const gapWidth = barWidth * gapRatio;

    ctx.fillText('KE',45+offset,chartHeight+chartTop+15)
    ctx.fillText('PE',offset+45+barWidth+gapWidth,chartHeight+chartTop+15)
    ctx.fillText('TE',offset+45+2*(barWidth+gapWidth),chartHeight+chartTop+15)

   

    // Colors
    const colors = {
        KE: '#34c759',
        PE: '#5ac8fa',
        total: '#ff3b30',
        background: '#f2f2f7',
        text: '#1c1c1e',
    };

    // Draw chart background
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, chartTop, chartWidth, chartHeight);

 

   

    // Function to draw a bar
    const drawBar = (value, index, color, label) => {
        const maxValue = Math.max(totalEnergy, KE, PE);
        const barHeight = (value / maxValue) * chartHeight;
        const x = offset+(index * (barWidth + gapWidth) + gapWidth / 2);
        const y = chartBottom - barHeight;

        // Draw bar
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth, barHeight);
    };

    // Draw bars
    drawBar(KE, 0, colors.KE, 'KE');
    drawBar(PE, 1, colors.PE, 'PE');
    drawBar(totalEnergy, 2, colors.total, 'Total');

   

    // Log the result (since we can't display the canvas in this environment)
    console.log('Energy bars drawn successfully.');
    console.log('KE:', KE);
    console.log('PE:', PE);
    console.log('Total Energy:', totalEnergy);
}








drawEnergyGraphWithValues(TEarray, KEarray, PEarray,timeArray);
drawEnergyBars(0.07, 0.00, 0.07);






// Function to display the formulae modal
function showFormulaeModal() {
    const modal = document.getElementById('formulaeModal');
    const formulaeList = document.getElementById('formulaeList');
    
    // List of provided formulae
    const formulae = [
        "1. <strong>Total Mechanical Energy</strong> (TME)<br>" +
        "   <em>Formula:</em> TME = KE + PE<br>" +
        "   <em>Where:</em><br>" +
        "   - KE = Kinetic Energy<br>" +
        "   - PE = Potential Energy",
    
        "2. <strong>Kinetic Energy</strong> (KE)<br>" +
        "   <em>Formula:</em> KE = ½ × m × v²<br>" +
        "   <em>Where:</em><br>" +
        "   - m = Mass of the object (kg)<br>" +
        "   - v = Velocity of the object (m/s)",
    
        "3. <strong>Potential Energy</strong> (PE)<br>" +
        "   <em>Formula:</em> PE = m × g × h<br>" +
        "   <em>Where:</em><br>" +
        "   - m = Mass of the object (kg)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - h = Height above the reference point (m)",
    
        "4. <strong>Energy Conservation Principle</strong><br>" +
        "   <em>Formula:</em> KE<sub>initial</sub> + PE<sub>initial</sub> = KE<sub>final</sub> + PE<sub>final</sub>",
    
        "5. <strong>Angular Displacement Equation</strong> (θ)<br>" +
        "   <em>Formula:</em> θ(t) = θ₀ × cos(ω × t)<br>" +
        "   <em>Where:</em><br>" +
        "   - θ₀ = Initial angular displacement (rad)<br>" +
        "   - ω = Angular velocity (rad/s)<br>" +
        "   - t = Time (s)",
    
        "6. <strong>Angular Velocity</strong> (ω)<br>" +
        "   <em>Formula:</em> ω = √(g / L)<br>" +
        "   <em>Where:</em><br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - L = Length of the pendulum (m)",
    
        "7. <strong>Time Period of a Pendulum</strong> (T)<br>" +
        "   <em>Formula:</em> T = 2π × √(L / g)<br>" +
        "   <em>Where:</em><br>" +
        "   - L = Length of the pendulum (m)<br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)",
    
        "8. <strong>Vertical Displacement</strong> (h)<br>" +
        "   <em>Formula:</em> h = L × (1 - cos(θ))<br>" +
        "   <em>Where:</em><br>" +
        "   - L = Length of the pendulum (m)<br>" +
        "   - θ = Angular displacement (rad)",
    
        "9. <strong>Velocity of the Pendulum Bob</strong> (v)<br>" +
        "   <em>Formula:</em> v = √[2 × g × L × (cos(θ) - cos(θ₀))]<br>" +
        "   <em>Where:</em><br>" +
        "   - g = Acceleration due to gravity (9.81 m/s²)<br>" +
        "   - L = Length of the pendulum (m)<br>" +
        "   - θ = Current angular displacement (rad)<br>" +
        "   - θ₀ = Initial angular displacement (rad)"
      ];
      
  
    // Generate HTML for the formulae
    formulaeList.innerHTML = formulae.map(f => `<li>${f}</li>`).join('');
  
    // Show the modal
    modal.style.display = 'block';
  }
  
  // Close the formulae modal when the close button is clicked
  document.getElementById('closeFormulaeModal').onclick = function() {
    document.getElementById('formulaeModal').style.display = 'none';
  }
  
  // Close the modal if the user clicks outside of it
  window.onclick = function(event) {
    const formulaeModal = document.getElementById('formulaeModal');
    if (event.target === formulaeModal) {
      formulaeModal.style.display = 'none';
    }
  }
  




  let lastTimeUpdate = 0; // Keep track of the last update time
  let updateInterval = 0.5; // Update every 0.5 seconds
  let observations = []; // Array to store the data

function updatePendulum(time) {
    // Constants
    const g = 9.81; // Acceleration due to gravity (m/s^2)
    const omega = Math.sqrt(g / pendulum.length); // Angular frequency

    console.log(pendulum)
    
    // Calculate the angular displacement of the pendulum
    pendulum.angle = initialAngle * Math.cos(omega * time);

    // Calculate velocity
    let velocity = Math.sqrt(2 * g * pendulum.length * (Math.cos(pendulum.angle) - Math.cos(initialAngle)));

    // Calculate Potential Energy (PE)
    let height = pendulum.length * (1 - Math.cos(pendulum.angle)); // Height relative to the lowest point
    let PE = pendulum.mass * g * height;

    // Calculate Kinetic Energy (KE)
    const KE = 0.5 * pendulum.mass * velocity * velocity;
    let totalEnergy = KE + PE;

    // Update arrays for graphing
    TEarray.push(totalEnergy);
    KEarray.push(KE);
    PEarray.push(PE);
    timeArray.push(time);

    // Draw the energy graph and bars
    drawEnergyGraphWithValues(TEarray, KEarray, PEarray, timeArray);
    drawEnergyBars(totalEnergy, KE, PE);

    // Updating the values in the result display
    getElement('result1_value').innerText = `${KE.toFixed(2)} J`;
    getElement('result2_value').innerText = `${PE.toFixed(2)} J`;
    getElement('result3_value').innerText = `${(KE + PE).toFixed(2)} J`;

    // Log results in the console
    console.log(`Velocity: ${velocity.toFixed(2)} m/s`);
    console.log(`Kinetic Energy: ${KE.toFixed(2)} J`);
    console.log(`Potential Energy: ${PE.toFixed(2)} J`);
    console.log(`Total Energy: ${(KE + PE).toFixed(2)} J`);

    // Oscillation counting logic
    if (time >= timeperiodSet[i]) {
        oscillationCounting++;
        setText("oscillationCount", `Oscillation count: ${oscillationCounting}`);
        i++;
    }

    // Stop animation after reaching maximum oscillations
    if (oscillationCounting >= maxOscillations) {
        getElement('showObservationsBtn').hidden = false;
        getElement('download-graph').hidden =false
        stopAnimation();
    }

    // Update the array every 0.5 seconds
    if (time - lastTimeUpdate >= updateInterval) {
        saveObservation(time, velocity, height, g, omega, pendulum.angle, KE, PE);
        lastTimeUpdate = time; // Reset the update timer
    }
}

// Function to save the data into the observations array
function saveObservation(time, velocity, height, g, omega, angle, KE, PE) {
    const observation = {
        time: time.toFixed(2),
        velocity: velocity.toFixed(2),
        height: height.toFixed(2),
        g: g.toFixed(2),
        omega: omega.toFixed(2),
        angle: angle.toFixed(2),
        KE: KE.toFixed(3),  // Add KE to the observation
        PE: PE.toFixed(3)   // Add PE to the observation
    };

    // Push the observation to the array
    observations.push(observation);
}

// Show the modal with the data
document.getElementById("showObservationsBtn").addEventListener("click", function() {
    showObservations();
});

// Function to show the observations in a modal
function showObservations() {
    const modal = document.getElementById("resultsModal");
    const tableContainer = document.getElementById("resultsTableContainer");
    const inputDataList = document.getElementById("inputDataList");

    // Clear any existing data in the modal
    tableContainer.innerHTML = "";
    inputDataList.innerHTML = "";

    // Create table to display the data
    const table = document.createElement("table");
    table.setAttribute("border", "1");

    // Create table header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    headerRow.insertCell(0).textContent = "Time (s)";
    headerRow.insertCell(1).textContent = "Velocity (m/s)";
    headerRow.insertCell(2).textContent = "Height (m)";
    headerRow.insertCell(3).textContent = "Gravity (m/s²)";
    headerRow.insertCell(4).textContent = "Angular Frequency (rad/s)";
    headerRow.insertCell(5).textContent = "Angular Displacement (rad)";
    headerRow.insertCell(6).textContent = "Kinetic Energy (J)";  // Add header for KE
    headerRow.insertCell(7).textContent = "Potential Energy (J)"; // Add header for PE

    // Create table body and populate with data
    const body = table.createTBody();
    observations.forEach(observation => {
        const row = body.insertRow();
        row.insertCell(0).textContent = observation.time;
        row.insertCell(1).textContent = observation.velocity;
        row.insertCell(2).textContent = observation.height;
        row.insertCell(3).textContent = observation.g;
        row.insertCell(4).textContent = observation.omega;
        row.insertCell(5).textContent = observation.angle;
        row.insertCell(6).textContent = observation.KE;  // Add KE data
        row.insertCell(7).textContent = observation.PE;  // Add PE data
    });

    // Append the table to the modal
    tableContainer.appendChild(table);

    // Display the modal
    modal.style.display = "block";
}

// Close the modal when the user clicks the close button
document.getElementById("closeResultsModal").addEventListener("click", function() {
    document.getElementById("resultsModal").style.display = "none";
});

// Close the modal if the user clicks outside of the modal
window.addEventListener("click", function(event) {
    if (event.target === document.getElementById("resultsModal")) {
        document.getElementById("resultsModal").style.display = "none";
    }
});

// Function to download the data
function downloadResults() {
    const data = observations.map(observation => {
        return {
            Time: observation.time,
            Velocity: observation.velocity,
            Height: observation.height,
            Gravity: observation.g,
            Angular_Frequency: observation.omega,
            Angular_Displacement: observation.angle,
            Kinetic_Energy: observation.KE,
            Potential_Energy: observation.PE
        };
    });

    // Convert the data to CSV format
    const csvContent = "data:text/csv;charset=utf-8," +
        Object.keys(data[0]).join(",") + "\n" + 
        data.map(item => Object.values(item).join(",")).join("\n");

    // Create a download link and trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "pendulum_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

  
  
  



function updateTimer() {
    const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
    setText("stopwatch", `Time: ${currentTime.toFixed(2)}s`);
}

function animate(timestamp) {
    if (previousTime === 0) previousTime = timestamp;
    const deltaTime = (timestamp - previousTime) / 1000; // Time in seconds
    previousTime = timestamp;

    const currenttime = (performance.now() - startTime) / 1000;
    if (isAnimating) {
        updatePendulum(currenttime);
        drawPendulum();
        updateTimer();
        animationFrameId = requestAnimationFrame(animate);
    }
}

function startAnimation() {
    if (!lockButton.checked) {
        giveAlert()
        return
    }
    if (!isAnimating) {
        startTime = performance.now() - elapsedTime * 1000; // Continue from where it was left
        previousTime = 0; // Reset the previous time
        isAnimating = true;
        animationFrameId = requestAnimationFrame(animate);
    }
}

function stopAnimation() {
    // if (!lockButton.checked) {
    //     giveAlert()
    //     return
    // }
    if (isAnimating) {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId);
        const currentTime = (performance.now() - startTime) / 1000; // Time in seconds
        elapsedTime = currentTime; // Save elapsed time
    }
}

const resetAnimation = () => {
    stopAnimation();
    pendulum.angle = 0.261799; // Reset angle to initial position
    pendulum.length = 2;
    pendulum.mass = 0.1;
    maxOscillations = 3;



    angleInput.value = 15;
    lengthInput.value = 2;
    oscillationInput.value = 3;
    getElement('mass').value = 0.1;
    initialAngle = 0.261799


    setText("angleValue", angleInput.value);
    setText("lengthValue", lengthInput.value);
    setText("massValue", getElement('mass').value);
    setText("stopwatch", `Time: 0.00 s`);
    setText("countOscillationText", `Oscillation Count :`);
    setText("oscillationCount", `Oscillation count : 0`);
    getElement('height_theoretical').innerText = `Initial Height: ${0} m`

    


    getElement('result1_value').innerText = `${0} J`
    getElement('result2_value').innerText = `${0.07} J`
    getElement('result3_value').innerText = `${0.07} J`


    KEarray = [];
    PEarray = [];
    TEarray = [];
    timeArray = [];
    lastTimeUpdate = 0; 
    observations = []; 






    lockButton.checked = false;
    angleInput.hidden = false;
    lengthInput.hidden = false;
    oscillationInput.hidden = false;
    getElement("mass").hidden = false;
    getElement('showObservationsBtn').hidden = true;
    getElement('download-graph').hidden = true
    getElement('theoretical_container').hidden = true;

    elapsedTime = 0;
    i = 0
    oscillationCounting = 0
    previousTime = 0
    startTime = 0

    drawPendulum();
    drawEnergyBars(0.07, 0.00, 0.07);
    drawEnergyGraphWithValues(TEarray, KEarray, PEarray,timeArray);
};

playButton.addEventListener("click", startAnimation);
pauseButton.addEventListener("click", stopAnimation);
resetButton.addEventListener("click", resetAnimation);
// Initial drawing
drawPendulum();//Your JavaScript goes in here
