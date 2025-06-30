function downloadReportPDF() {
  const from = document.getElementById("fromDate").value || "N/A";
  const to = document.getElementById("toDate").value || "N/A";
  const category = document.getElementById("category").value;

  const tableBody = document.querySelector("#reportTableBody");
  const rows = tableBody.querySelectorAll("tr");

  if (!category || rows.length === 0 || tableBody.textContent.includes("Please select")) {
    alert("Please select category and make sure data is available.");
    return;
  }

  let rowsHTML = "";
  let totalCount = 0;

  rows.forEach(row => {
    const cols = row.querySelectorAll("td");
    if (cols.length === 3) {
      const categoryText = cols[0].innerText;
      const totalText = cols[1].innerText;
      const dateText = cols[2].innerText;

      rowsHTML += `
        <tr>
          <td>${categoryText}</td>
          <td>${totalText}</td>
          <td>${dateText}</td>
        </tr>
      `;

      totalCount += parseInt(totalText) || 0;
    }
  });

  const content = document.createElement("div");
  content.className = "p-4";

  content.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="rs/logo.png" style="height: 60px;" />
      <h2 style="margin: 0; font-size: 22px;">Eco Materials Management System</h2>
      <p style="margin: 0; font-size: 14px;">123 Eco Avenue, Green District, Earth City</p>
      <p style="margin: 0; font-size: 13px;">Email: contact@ecoearth.com | Phone: +123-456-7890</p>
      <hr style="margin: 16px 0;">
    </div>

    <div style="margin-bottom: 10px;">
      <strong>Category:</strong> ${category.toUpperCase()}<br>
      <strong>Date Range:</strong> ${from} to ${to}
    </div>

    <table border="1" cellpadding="8" cellspacing="0" width="100%" style="border-collapse: collapse; font-size: 13px;">
      <thead style="background-color: #f3f4f6;">
        <tr>
          <th>Category</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHTML}
      </tbody>
    </table>

    <div style="margin-top: 12px; font-weight: bold; font-size: 14px;">
      Grand Total: ${totalCount}
    </div>
  `;

  html2pdf().from(content).set({
    margin: 0.5,
    filename: `report_${category}_${from}_to_${to}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).save();
}
