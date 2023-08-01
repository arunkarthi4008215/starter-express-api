// api url
const base_url = "https://different-glasses-eel.cyclic.app"
// const base_url = "http://localhost:3000"

const api_url =  base_url + "/api/v1/productapi/getProductCount";
const api_url1 =  base_url + "/api/v1/tenant/gettenantList";
const api_url2 =  base_url + "/api/v1/productapi/getSearchProductList";
const api_url3 =  base_url + "/api/v1/productSearch/getAutoSearchProductList";
const api_url4 =  base_url + "/api/v1/productSearch/getActionToCartList";
getActionCartList(api_url4)
// Defining async function
async function getapi(url) {
	
	// Storing response
	const response = await fetch(url);
	
	// Storing data in form of JSON
	var data = await response.json();
	if (response) {
		hideloader();
	}
	show(data);
}
// Defining get TenantLsit
async function getTenantList(url) {
	
	// Storing response
	const response = await fetch(url);
	
	// Storing data in form of JSON
	var data = await response.json();
	if (response) {
		hideloader();
	}
	customer(data);
}

async function getSearchList(url) {
	// Storing response
	const response = await fetch(url);
	document.getElementById("dataloader").style.display = 'block';
	// Storing data in form of JSON
	var data = await response.json();
	if (response) {
        document.getElementById("dataloader").style.display = 'none';
        document.getElementById("product-search").style.display = 'block';
	}
    searchResultData(data)
}

async function getAutoComplete(url) {
	// Storing response
	const response = await fetch(url);
	document.getElementById("autodataloader").style.display = 'block';
	// Storing data in form of JSON
	var data = await response.json();
	if (response) {
        document.getElementById("autodataloader").style.display = 'none';
	}
    getAutoCompleteResultData(data)
}

// Action To Cart Start
async function getActionCartList(url) {
	// Storing response
	const response = await fetch(url);
	// Storing data in form of JSON
	var data = await response.json();
    getActionCartListData(data.tenantData)
}

function reloadActionToCart(){
    getActionCartList(api_url4)
}
// Calling that async function
// getapi(api_url);
// getTenantList(api_url1);
getSearchList(api_url2);

// Function to hide the loader
function hideloader() {
	document.getElementById('loading').style.display = 'none';
}
// Function to define innerHTML for HTML table
function show(data) {
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Total Products</th>
            <th>Approved Products</th>
            <th>Pending Products</th>
            <th>Rejected Products</th>
            <th>Product With Image</th>
            <th>Product Without IMage</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data.tenantData) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.Name}</strong></td>
                <td>${r.Total_Products}</td>
                <td>${r.Approved_Products}</td>
                <td>${r.Pending_Products}</td>
                <td>${r.Rejected_Products}</td>
                <td>${r.Product_With_Image}</td>
                <td>${r.Product_Without_Image}</td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	console.log(tab);
	document.getElementById("employees").innerHTML = tab;
}

function getActionCartListData(data) {
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>Buyer Name</th>
            <th>Product Name</th>
            <th>Product Quantiy</th>
            <th>Status</th>
            <th>Added At</th>
            <th>Removed At</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.tenant_id}</strong></td>
                <td><strong>${r.product_id}</strong></td>
                <td>${r.quantity}</td>
                <td>${r.status}</td>
                <td>${r.created_at}</td>
                <td>${r.modified_at}</td>
                <td>
                <span class="text-success">${r.status.toUpperCase()}</span>
                </td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	// console.log(tab);
	document.getElementById("action-cart").innerHTML = tab;
}

function customer(data) {
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>Brand</th>
            <th>Enity</th>
            <th>Account ID</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Type</th>
            <th>GST</th>
            <th>Status</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.brand}</strong></td>
                <td><strong>${r.name}</strong></td>
                <td>${r.account}</td>
                <td>${r.email}</td>
                <td>${r.mobile}</td>
                <td>${r.type}</td>
                <td>${r.taxid}</td>
                <td>
                <span class="text-success">${r.status.toUpperCase()}</span>
                </td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	// console.log(tab);
	document.getElementById("customers").innerHTML = tab;
}



function temp(data) {
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>Brand</th>
            <th>Mobile</th>
            <th>Registration Date</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.brand}</strong></td>
                <td>${r.mobile}</td>
                <td>${r.created_at}</td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	// console.log(tab);
	document.getElementById("temp").innerHTML = tab;
}

function searchResultData(data) {
    document.getElementById("product-search").style.display = 'block';
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>User Name</th>
            <th>Search Term</th>
            <th>Searched Product</th>
            <th>Searched Date</th>
            <th>Searched Time</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data.tenantData) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.tenant_id}</strong></td>
                <td>${r.search_term}</td>
                <td>${r.search_product}</td>
                <td>${r.searched_date}</td>
                <td>${r.searched_time}</td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	// console.log(tab);
	document.getElementById("product-search").innerHTML = tab;
    getAutoComplete(api_url3);
}

function reload(){
    getSearchList(api_url2);
}



// ************************** Autocomplete Downlaod *****************
function getAutoCompleteResultData(data) {
	let tab =
		`<table class="table table-bordered">
        <tr>
            <th>S.No</th>
            <th>User Name</th>
            <th>Search Term</th>
            <th>Searched Date</th>
            <th>Searched Time</th>
        </tr> `;
	
	// Loop to access all rows
    let i = 1
	for (let r of data.tenantData) {
		tab += `
		<tr>    <td>${i}</td>
                <td><strong>${r.tenant_id}</strong></td>
                <td>${r.search_term}</td>
                <td>${r.searched_date}</td>
                <td>${r.searched_time}</td>
            </tr>`;
            i +=1
	}
	`</table>`
	// Setting innerHTML as tab variable
	// console.log(tab);
	document.getElementById("product-autocomplete").innerHTML = tab;
}

function reloadautocomplete(){
    getAutoComplete(api_url3);
}
// ************************** Excle Downlaod *****************
// ************************** Excle Downlaod *****************

async function generateExcel() {
    const api_url2 = base_url + "/api/v1/productapi/getSearchProductList"
    // Storing response
    const response = await fetch(api_url2);

    // Storing data in form of JSON
    var data = await response.json();
    const headingColumnNames = [
        "User Name",
        "Searched Product",
        "Search Term",
        "Searched Date",
        "Search Time",
    ]
    filename = 'product_search_report.xlsx';
    var ws = XLSX.utils.json_to_sheet(data.tenantData);
    XLSX.utils.sheet_add_aoa(ws, [headingColumnNames], { origin: "A1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "search");
    XLSX.writeFile(wb, filename);
}

async function generateautoCompleteExcel() {
    // const url = base_url + "/api/v1/productapi/getSearchProductList"
    // Storing response
    const response = await fetch(api_url3);

    // Storing data in form of JSON
    var data = await response.json();
    const headingColumnNames = [
        "User Name",
        "Search Term",
        "Searched Date",
        "Search Time",
    ]
    filename = 'product_search_report.xlsx';
    var ws = XLSX.utils.json_to_sheet(data.tenantData);
    XLSX.utils.sheet_add_aoa(ws, [headingColumnNames], { origin: "A1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "search");
    XLSX.writeFile(wb, filename);
}

async function generateTenantList() {
    const api_url2 = base_url + "/api/v1/tenant/gettenantList"
    // Storing response
    const response = await fetch(api_url2);

    // Storing data in form of JSON
    var data = await response.json();
    const headingColumnNames = [
        "Brand",
        "Entity",
        "Account ID",
        "Email",
        "Mobile",
        "Type",
        "GST",
        "Status",
    ]
    filename = 'customerList.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(ws, [headingColumnNames], { origin: "A1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "search");
    XLSX.writeFile(wb, filename);
}


async function generateSkuProductList() {
    const url = base_url + "/api/v1/productapi/getSkuProductList"
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();
    const headingColumnNames = [
        "Category",
        "Subcategory",
        "Product Code",
        "Product Name",
        "Product Variant Name",
        "Uom",
        "Gst Percentage",
        "Unit Price",
        "Description",
        "Seller Name"
    ]
    filename = 'product_sku_list.xlsx';
    var ws = XLSX.utils.json_to_sheet(data.data);
    XLSX.utils.sheet_add_aoa(ws, [headingColumnNames], { origin: "A1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "search");
    XLSX.writeFile(wb, filename);
}

async function generateTenantList() {
    const api_url2 = base_url + "/api/v1/tenant/gettenantList"
    // Storing response
    const response = await fetch(api_url2);

    // Storing data in form of JSON
    var data = await response.json();
    const headingColumnNames = [
        "Brand",
        "Entity",
        "Account ID",
        "Email",
        "Mobile",
        "Type",
        "GST",
        "Status",
    ]
    filename = 'customerList.xlsx';
    var ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(ws, [headingColumnNames], { origin: "A1" });
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "search");
    XLSX.writeFile(wb, filename);
}