async function loadDashboardData() {
  try {
    const response = await fetch('fetch_dashboard_data.php');
    const data = await response.json();

    document.getElementById("total-users").textContent = data.total_users;
    document.getElementById("glass-total").textContent = data.totals.glass || 0;
    document.getElementById("plastic-total").textContent = data.totals.plastic || 0;
    document.getElementById("paper-total").textContent = data.totals.paper || 0;

    const ctx = document.getElementById('materialLineChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.chart.labels,
        datasets: [
          {
            label: 'Glass',
            data: data.chart.glass,
            borderColor: '#34D399',
            backgroundColor: 'transparent',
            tension: 0.4
          },
          {
            label: 'Plastic',
            data: data.chart.plastic,
            borderColor: '#FBBF24',
            backgroundColor: 'transparent',
            tension: 0.4
          },
          {
            label: 'Paper',
            data: data.chart.paper,
            borderColor: '#818CF8',
            backgroundColor: 'transparent',
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

  } catch (error) {
    console.error('Failed to load dashboard data:', error);
  }
}

loadDashboardData();