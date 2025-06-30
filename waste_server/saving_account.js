function saveUser(event) {
  event.preventDefault();

  const fullname = document.getElementById("fullname").value;
  const username = document.getElementById("username").value;
  const account_id = document.getElementById("account_id").value;
  const password = document.getElementById("password").value;

  if (!fullname || !username || !account_id || !password) {
    alert("Please fill out all fields.");
    return;
  }

  fetch("save_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, username, account_id, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      addUserToTable(fullname, username, account_id);
      document.getElementById("user-form").reset();
    } else {
      alert("Error: " + data.message);
    }
  })
  .catch(err => alert("Error: " + err));
}

function addUserToTable(fullname, username, account_id) {
  const tbody = document.getElementById("user-table-body");
  const row = document.createElement("tr");
  row.classList.add("hover:bg-gray-50", "transition");

  row.innerHTML = `
    <td class="px-6 py-4">${fullname}</td>
    <td class="px-6 py-4">${username}</td>
    <td class="px-6 py-4">${account_id}</td>
    <td class="px-6 py-4 text-center space-x-2">
      <button class="text-blue-600 hover:underline font-medium">Update</button>
      <button class="text-red-600 hover:underline font-medium">Delete</button>
    </td>
  `;
  tbody.appendChild(row);
}

document.addEventListener("DOMContentLoaded", loadUsers);

function loadUsers() {
  fetch("fetch_users.php")
    .then(res => res.json())
    .then(users => {
      const tbody = document.getElementById("user-table-body");
      tbody.innerHTML = "";
      users.forEach(user => {
        addUserToTable(user.fullname, user.username, user.account_id, user.user_id, user.password);
      });
    });
}

function addUserToTable(fullname, username, account_id, user_id, password = '') {
  const tbody = document.getElementById("user-table-body");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td class="px-6 py-4">${fullname}</td>
    <td class="px-6 py-4">${username}</td>
    <td class="px-6 py-4">${account_id}</td>
    <td class="px-6 py-4 text-center space-x-2">
      <button onclick="openUpdateModal(${user_id}, '${fullname}', '${username}', '${account_id}', '${password}')" class="text-blue-600 hover:underline font-medium">Update</button>
      <button onclick="deleteUser(${user_id})" class="text-red-600 hover:underline font-medium">Delete</button>
    </td>
  `;
  tbody.appendChild(row);
}

function openUpdateModal(id, fullname, username, account_id, password) {
  document.getElementById("update-user-id").value = id;
  document.getElementById("update-fullname").value = fullname;
  document.getElementById("update-username").value = username;
  document.getElementById("update-account-id").value = account_id;
  document.getElementById("update-password").value = password;
  document.getElementById("updateModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("updateModal").classList.add("hidden");
}

document.getElementById("update-user-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("update-user-id").value;
  const fullname = document.getElementById("update-fullname").value;
  const username = document.getElementById("update-username").value;
  const account_id = document.getElementById("update-account-id").value;
  const password = document.getElementById("update-password").value;

  fetch("update_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, fullname, username, account_id, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      closeModal();
      loadUsers();
    } else {
      alert("Update failed");
    }
  });
});

function deleteUser(id) {
  if (!confirm("Delete this account?")) return;

  fetch("delete_user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      loadUsers();
    } else {
      alert("Delete failed");
    }
  });
}
