// Manejo del formulario para añadir/editar cliente
document.getElementById('customerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const customerId = document.getElementById('customerId').value;
    const customerName = document.getElementById('customerName').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerAddress = document.getElementById('customerAddress').value;

    if (customerId) {
        // Editar cliente
        const row = document.querySelector(`tr[data-id="${customerId}"]`);
        row.children[1].innerText = customerName;
        row.children[2].innerText = customerEmail;
        row.children[3].innerText = customerPhone;
        row.children[4].innerText = customerAddress;
    } else {
        // Añadir cliente
        const newCustomerId = Date.now();
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newCustomerId);
        newRow.innerHTML = `
            <td>${newCustomerId}</td>
            <td>${customerName}</td>
            <td>${customerEmail}</td>
            <td>${customerPhone}</td>
            <td>${customerAddress}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="openEdit(${newCustomerId})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCustomer(${newCustomerId})">Eliminar</button>
            </td>
        `;
        document.getElementById('customerTableBody').appendChild(newRow);
    }

    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
});

// Función para abrir el formulario de edición
function openEdit(customerId) {
    const row = document.querySelector(`tr[data-id="${customerId}"]`);
    const customerName = row.children[1].innerText;
    const customerEmail = row.children[2].innerText;
    const customerPhone = row.children[3].innerText;
    const customerAddress = row.children[4].innerText;

    document.getElementById('customerId').value = customerId;
    document.getElementById('customerName').value = customerName;
    document.getElementById('customerEmail').value = customerEmail;
    document.getElementById('customerPhone').value = customerPhone;
    document.getElementById('customerAddress').value = customerAddress;
}

// Función para eliminar cliente
function deleteCustomer(customerId) {
    const row = document.querySelector(`tr[data-id="${customerId}"]`);
    row.remove();
}
