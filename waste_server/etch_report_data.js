function fetchReportData() {
  const fromDate = document.getElementById("fromDate").value;
  const toDate = document.getElementById("toDate").value;
  const category = document.getElementById("category").value;

  if (!category || !fromDate || !toDate) {
    return;
  }

  fetch("fetch_report_data.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `fromDate=${fromDate}&toDate=${toDate}&category=${category}`
  })
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("reportTableBody");
      tbody.innerHTML = "";

      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center px-6 py-4 text-gray-500">No records found.</td></tr>`;
        return;
      }

      data.forEach(row => {
        const tr = document.createElement("tr");
        tr.className = "border-b hover:bg-gray-50 transition";
        tr.innerHTML = `
          <td class="px-6 py-4 capitalize">${row.category}</td>
          <td class="px-6 py-4">${row.total}</td>
          <td class="px-6 py-4">${row.date}</td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Failed to load report.");
    });
}

document.getElementById("category").addEventListener("change", fetchReportData);
document.getElementById("fromDate").addEventListener("change", fetchReportData);
document.getElementById("toDate").addEventListener("change", fetchReportData);