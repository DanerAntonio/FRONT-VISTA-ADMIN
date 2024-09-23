let sales = [
    { id: 23123, clientName: 'Paola Cetre', date: '23/04/2024', totalAmount: 70000, status: 'Entregado', products: [
        { barCode: '001', productName: 'Producto A', quantity: 2, price: 25000 },
        { barCode: '002', productName: 'Producto B', quantity: 1, price: 20000 }
    ]}
];

let currentSale = null;
let products = [];
let dataTable;

document.addEventListener('DOMContentLoaded', () => {
    const createSaleButton = document.getElementById('createSaleButton');
    const createClientButton = document.getElementById('createClientButton');
    const saleFormModal = document.getElementById('saleFormModal');
    const cancelSaleButton = document.getElementById('cancelSaleButton');
    const saleForm = document.getElementById('saleForm');
    const addProductButton = document.getElementById('addProductButton');
    const downloadExcelButton = document.getElementById('downloadExcelButton');
    const searchButton = document.getElementById('searchButton');

    createSaleButton.addEventListener('click', () => saleFormModal.style.display = 'block');
    createClientButton.addEventListener('click', () => {
        Swal.fire({
            title: '¿Desea crear un nuevo cliente?',
            text: 'Será redirigido al módulo de clientes.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, crear',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/modulo-clientes.html';
            }
        });
    });
    cancelSaleButton.addEventListener('click', () => saleFormModal.style.display = 'none');
    saleForm.addEventListener('submit', handleSaleSubmit);
    addProductButton.addEventListener('click', addProduct);
    downloadExcelButton.addEventListener('click', downloadExcel);
    searchButton.addEventListener('click', searchSales);

    initializeDataTable();
});

function initializeDataTable() {
    dataTable = $('#salesTable').DataTable({
        data: sales,
        columns: [
            { data: 'id' },
            { data: 'clientName' },
            { data: 'date' },
            { data: 'totalAmount' },
            { data: 'status' },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button onclick="viewSaleDetails(${row.id})" class="btn-action">Ver detalle</button>
                        <button onclick="printReceipt(${row.id})" class="btn-action">Imprimir</button>
                        <button onclick="goToReturn(${row.id})" class="btn-action">Ir a devolución</button>
                        <button onclick="cancelSale(${row.id})" class="btn-action">Anular</button>
                    `;
                }
            }
        ]
    });
}

function updateSalesTable() {
    dataTable.clear().rows.add(sales).draw();
}

function handleSaleSubmit(event) {
    event.preventDefault();
    const clientName = document.getElementById('clientName').value;
    const totalAmount = calculateTotalAmount();

    const newSale = {
        id: Date.now(),
        clientName,
        date: new Date().toLocaleDateString(),
        totalAmount,
        status: 'Pendiente',
        products // Add the products list to the new sale
    };

    sales.push(newSale);
    updateSalesTable();
    document.getElementById('saleFormModal').style.display = 'none';
    document.getElementById('saleForm').reset();
    products = [];
    updateProductList();

    Swal.fire({
        icon: 'success',
        title: 'Venta registrada',
        text: 'La venta se ha registrado correctamente.'
    });
}

function addProduct() {
    const barCode = document.getElementById('barCode').value;
    const productName = document.getElementById('productName').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    if (productName && quantity && price) {
        products.push({ barCode, productName, quantity, price });
        updateProductList();
        calculateTotalAmount();
        
        // Clear input fields
        document.getElementById('barCode').value = '';
        document.getElementById('productName').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';

        Swal.fire({
            icon: 'success',
            title: 'Producto agregado',
            text: 'El producto se ha agregado a la venta.'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos del producto.'
        });
    }
}

function updateProductList() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <span>${product.productName} - Cantidad: ${product.quantity} - Precio: ${product.price}</span>
            <button onclick="removeProduct(${index})" class="btn-remove">Eliminar</button>
        `;
        productList.appendChild(productDiv);
    });
}

function removeProduct(index) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar este producto de la venta?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            products.splice(index, 1);
            updateProductList();
            calculateTotalAmount();
            Swal.fire(
                'Eliminado',
                'El producto ha sido eliminado de la venta.',
                'success'
            );
        }
    });
}

function calculateTotalAmount() {
    const total = products.reduce((sum, product) => sum + (product.quantity * product.price), 0);
    document.getElementById('totalPrice').value = total;
    return total;
}

function viewSaleDetails(id) {
    const sale = sales.find(s => s.id === id);
    if (sale) {
        const productsTable = sale.products.map(product => `
            <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${(product.quantity * product.price).toFixed(2)}</td>
            </tr>
        `).join('');

        Swal.fire({
            title: `Detalles de la venta ${id}`,
            html: `
                <table class="table-detail">
                    <caption>Detalles de la Venta</caption>
                    <tbody>
                        <tr><th>Cliente:</th><td>${sale.clientName}</td></tr>
                        <tr><th>Fecha:</th><td>${sale.date}</td></tr>
                        <tr><th>Monto Total:</th><td>${sale.totalAmount.toFixed(2)}</td></tr>
                        <tr><th>Estado:</th><td>${sale.status}</td></tr>
                    </tbody>
                </table>
                <h3>Productos</h3>
                <table class="table-detail">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsTable}
                    </tbody>
                </table>
            `,
            icon: 'info'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Venta no encontrada'
        });
    }
}

function printReceipt(id) {
    const sale = sales.find(s => s.id === id);
    if (sale) {
        const productsTable = sale.products.map(product => `
            <tr>
                <td>${product.productName}</td>
                <td>${product.quantity}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${(product.quantity * product.price).toFixed(2)}</td>
            </tr>
        `).join('');

        const receiptContent = `
            <html>
            <head>
                <style>
                    .table-detail {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    .table-detail th, .table-detail td {
                        border: 1px solid #ddd;
                        padding: 8px;
                    }
                    .table-detail th {
                        background-color: #f2f2f2;
                        text-align: left;
                    }
                    .table-detail caption {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <h2>Comprobante de Venta</h2>
                <table class="table-detail">
                    <caption>Detalles de la Venta</caption>
                    <tbody>
                        <tr><th>ID:</th><td>${sale.id}</td></tr>
                        <tr><th>Cliente:</th><td>${sale.clientName}</td></tr>
                        <tr><th>Fecha:</th><td>${sale.date}</td></tr>
                        <tr><th>Monto Total:</th><td>${sale.totalAmount.toFixed(2)}</td></tr>
                        <tr><th>Estado:</th><td>${sale.status}</td></tr>
                    </tbody>
                </table>
                <h3>Productos</h3>
                <table class="table-detail">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsTable}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.open();
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Venta no encontrada'
        });
    }
}

function goToReturn(id) {
    Swal.fire({
        title: '¿Desea proceder con la devolución?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, proceder',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/return-sale?id=${id}`;
        }
    });
}

function cancelSale(id) {
    Swal.fire({
        title: '¿Está seguro de que desea cancelar esta venta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const saleIndex = sales.findIndex(s => s.id === id);
            if (saleIndex !== -1) {
                sales[saleIndex].status = 'Cancelada';
                updateSalesTable();
                Swal.fire(
                    'Cancelada',
                    'La venta ha sido cancelada.',
                    'success'
                );
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Venta no encontrada'
                });
            }
        }
    });
}

function createClient() {
    Swal.fire({
        title: 'Crear Nuevo Cliente',
        input: 'text',
        inputLabel: 'Nombre del Cliente',
        inputPlaceholder: 'Ingrese el nombre del cliente',
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            Swal.fire('Cliente creado', `Cliente ${result.value} ha sido creado con éxito.`, 'success');
        }
    });
}

function searchSales() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredSales = sales.filter(sale => 
        sale.clientName.toLowerCase().includes(searchInput) ||
        sale.id.toString().includes(searchInput)
    );
    dataTable.clear().rows.add(filteredSales).draw();
}

function downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sales.map(sale => ({
        ID: sale.id,
        Cliente: sale.clientName,
        Fecha: sale.date,
        MontoTotal: sale.totalAmount,
        Estado: sale.status
    })));
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, 'ventas.xlsx');
}


