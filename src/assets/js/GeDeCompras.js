// Manejo del formulario para añadir/editar compra
document.getElementById('purchaseForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const purchaseId = document.getElementById('purchaseId').value;
    const productName = document.getElementById('productName').value;
    const supplierName = document.getElementById('supplierName').value;
    const supplierPrice = document.getElementById('supplierPrice').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const unitPrice = document.getElementById('unitPrice').value;
    const invoiceNumber = document.getElementById('invoiceNumber').value;
    const totalPrice = document.getElementById('totalPrice').value;
    const barcode = document.getElementById('barcode').value;

    if (purchaseId) {
        // Editar compra
        const row = document.querySelector(`tr[data-id="${purchaseId}"]`);
        row.children[1].innerText = productName;
        row.children[2].innerText = supplierName;
        row.children[3].innerText = supplierPrice;
        row.children[4].innerText = productQuantity;
        row.children[5].innerText = unitPrice;
        row.children[6].innerText = invoiceNumber;
        row.children[7].innerText = totalPrice;
        row.children[8].innerText = barcode;
    } else {
        // Añadir compra
        const newPurchaseId = Date.now();
        const newRow = document.createElement('tr');
        newRow.setAttribute('data-id', newPurchaseId);
        newRow.innerHTML = `
            <td>${newPurchaseId}</td>
            <td>${productName}</td>
            <td>${supplierName}</td>
            <td>${supplierPrice}</td>
            <td>${productQuantity}</td>
            <td>${unitPrice}</td>
            <td>${invoiceNumber}</td>
            <td>${totalPrice}</td>
            <td>${barcode}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="openEdit(${newPurchaseId})">Editar</button>
                <button class="btn btn-sm btn-danger" onclick="deletePurchase(${newPurchaseId})">Eliminar</button>
            </td>
        `;
        document.getElementById('purchaseTableBody').appendChild(newRow);
    }

    document.getElementById('purchaseForm').reset();
    document.getElementById('purchaseId').value = '';
});

// Función para abrir el formulario de edición
function openEdit(purchaseId) {
    const row = document.querySelector(`tr[data-id="${purchaseId}"]`);
    const productName = row.children[1].innerText;
    const supplierName = row.children[2].innerText;
    const supplierPrice = row.children[3].innerText;
    const productQuantity = row.children[4].innerText;
    const unitPrice = row.children[5].innerText;
    const invoiceNumber = row.children[6].innerText;
    const totalPrice = row.children[7].innerText;
    const barcode = row.children[8].innerText;

    document.getElementById('purchaseId').value = purchaseId;
    document.getElementById('productName').value = productName;
    document.getElementById('supplierName').value = supplierName;
    document.getElementById('supplierPrice').value = supplierPrice;
    document.getElementById('productQuantity').value = productQuantity;
    document.getElementById('unitPrice').value = unitPrice;
    document.getElementById('invoiceNumber').value = invoiceNumber;
    document.getElementById('totalPrice').value = totalPrice;
    document.getElementById('barcode').value = barcode;
}

// Función para eliminar compra
function deletePurchase(purchaseId) {
    const row = document.querySelector(`tr[data-id="${purchaseId}"]`);
    row.remove();
}
