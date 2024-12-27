// Predict future sales based on simple linear growth (example algorithm)
function predictSales(salesData, forecastLength) {
    const growthRate = (salesData[salesData.length - 1] - salesData[salesData.length - 2]); // Calculate growth rate from last two points
    const forecast = [];
    for (let i = 1; i <= forecastLength; i++) {
        forecast.push(salesData[salesData.length - 1] + growthRate * i);
    }
    return forecast;
}

// Update the interactive chart using Plotly.js
function updateInteractiveChart(actualLabels, salesData, forecastData, forecastStartMonth) {
    // Generate forecast labels dynamically
    const forecastLabels = Array.from({ length: forecastData.length }, (_, i) => `Forecast ${i + 1}`);

    // Combine actual and forecast labels
    const combinedLabels = [...actualLabels, ...forecastLabels];

    // Actual sales trace
    const actualTrace = {
        x: actualLabels,
        y: salesData,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Actual Sales',
        line: { color: 'rgba(75, 192, 192, 1)', width: 2 },
        marker: { size: 8 },
    };

    // Forecast sales trace
    const forecastTrace = {
        x: forecastLabels,
        y: forecastData,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Forecast Sales',
        line: { color: 'rgba(255, 99, 132, 1)', dash: 'dot', width: 2 },
        marker: { size: 8 },
    };

    const layout = {
        title: 'Sales Forecast (Interactive)',
        xaxis: { title: 'Month' },
        yaxis: { title: 'Sales' },
        margin: { l: 50, r: 50, t: 50, b: 50 },
        hovermode: 'closest',
    };

    // Combine traces and plot
    Plotly.newPlot('interactive-forecast-chart', [actualTrace, forecastTrace], layout);
}

// Display actual sales in the table
function displayActualSales(productName, months, salesData) {
    const tableBody = document.getElementById('forecast-table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    months.forEach((month, i) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${productName}</td>
            <td>${salesData[i].toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('output-section').style.display = 'block';
}

// Generate forecast and update UI
function generateForecast() {
    const productName = document.getElementById('product-name').value;
    const months = document.getElementById('month-data').value.split(',').map(m => m.trim());
    const salesData = document.getElementById('sales-data').value.split(',').map(Number);
    const forecastLength = parseInt(document.getElementById('forecast-length').value, 10);

    if (months.length !== salesData.length) {
        alert('Error: Number of months must match the number of sales data points.');
        return;
    }

    // Ensure predictSales function is defined
    if (typeof predictSales !== 'function') {
        alert('Error: predictSales function is not defined.');
        return;
    }

    const forecastData = predictSales(salesData, forecastLength);
    updateInteractiveChart(months, salesData, forecastData, months[months.length - 1]);

    displayActualSales(productName, months, salesData);
}
