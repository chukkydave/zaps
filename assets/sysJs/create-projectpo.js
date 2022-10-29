$(document).ready(function() {
	$('.select2').select2({
		placeholder: 'Choose one',
		searchInputPlaceholder: 'Search',
	});

	$('.select2-no-search').select2({
		minimumResultsForSearch: Infinity,
		placeholder: 'Choose one',
	});
    

	getVendor();

	$('#addVendor').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			createVendor();
		}
	});

	$('#unitCost').keyup(() => {
		// alert('me');
		calculateTotal();
	});

	$('#quantity').keyup(() => {
		// alert('me');
		calculateTotal();
	});

	$(document).on('click', '#addItem', function() {
		if (isEmptyInput('.pop')) {
			addItem();
		}
	});
	$(document).on('click', '#saveItem', function() {
		if (isEmptyInput('.pop')) {
			editTag();
		}
	});
	$(document).on('click', '#createPO', function() {
		if (isEmptyInput('.check-me')) {
			createPO();
		}
	});

	$(document).on('click', '.tagClick', function() {
		let id = $(this).attr('id').replace(/tag_/, '');
		viewTag(id);
	});

	$(document).on('click', '.tagDel', function() {
		let id = $(this).attr('id').replace(/tagDel_/, '');
		removeTag(id);
	});
});

let itemArr = [];

function getVendor() {
	$('#vendor').hide();
	$('#vendorLoader').show();

	axios
		.get(`${apiPath}getVendors`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>-- Select Vendor --</option>';
			data.map((item, indx) => {
				res += `<option value="${item._id}">${item.name}</option>`;
			});
			$('#vendor').html(res);
			$('#vendorLoader').hide();
			$('#vendor').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#vendorLoader').hide();
			$('#vendor').show();
			$('#vendor').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function createVendor() {
	$('#addVendor').hide();
	$('#addVendorLoader').show();

	let vname = $('#vname').val();
	let vphone = $('#vphone').val();
	let vaddress = $('#vaddress').val();
	let vcomment = $('#vcomment').val();
	let vemail = $('#vemail').val();

	axios
		.post(
			`${apiPath}createVendor`,
			{
				name: vname,
				phoneNumber: vphone,
				address: vaddress,
				comment: vcomment,
				email: vemail,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#addVendorLoader').hide();
			$('#addVendor').show();

			$('#modaldemo1').modal('hide');

			Swal.fire({
				title: 'Success',
				text: `Vendor Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: getVendor(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#addVendorLoader').hide();
			$('#addVendor').show();
			$('#modaldemo1').modal('hide');
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function addItem() {
	let productName = $('#productName').val();
	let quantity = $('#quantity').val();
	let unitCost = $('#unitCost').val();
	let productDescription = $('#productDescription').val();
	let total = $('#totalAmount').attr('data');
	// let weight = $('#weight').val();
	// let kg = $('#kg').val();

	let tag = '';

	itemArr.push({
		productName: productName,
		productDescription: productDescription,
		totalCost: total,
		quatity: quantity,
		unitCost: unitCost,
	});
	if (itemArr.length > 0) {
		itemArr.map((v, i) => {
			tag += `<div class="tag tag-default"><span class="tagClick" id="tag_${i}" dataname="${v.productName}" datadesc="${v.productDescription}" dataquan="${v.quatity}" dataunit="${v.unitCost}" datatotal="${v.totalCost}">
                    ${v.productName}</span>
                    <span id="tagDel_${i} style="background-color: pink;" class="tag-addon tagDel"><i
                            class="fe fe-x"></i>
                </span></div>`;
		});
	} else {
		tag += `<p class="text-danger">No item added yet</p>`;
	}

	$('#tagss').html(tag);
	$('.pop').val('');
	$('#totalAmount').html('0');
	$('#totalAmount').attr('data', 0);
	// $('#addItem').show();
	// $('#saveItem').hide();
}

function calculateTotal() {
	let quan = parseFloat($('#quantity').val());
	let cost = parseFloat($('#unitCost').val());

	let total = quan * cost;
	$('#totalAmount').html(numberWithCommas(total));
	$('#totalAmount').attr('data', total);
}

function viewTag(id) {
	let name = $(`#tag_${id}`).attr('dataname');
	let desc = $(`#tag_${id}`).attr('datadesc');
	let quan = $(`#tag_${id}`).attr('dataquan');
	let unit = $(`#tag_${id}`).attr('dataunit');
	let total = $(`#tag_${id}`).attr('datatotal');
	$('#productName').val(name);
	$('#productDescription').val(desc);
	$('#quantity').val(quan);
	$('#unitCost').val(unit);
	$('#totalAmount').html(total);
	$('#totalAmount').attr('data', total);

	$('#addItem').hide();
	$('#saveItem').show();
	$('#saveItem').attr('data', id);
}

function editTag() {
	let id = $('#saveItem').attr('data');

	let productName = $('#productName').val();
	let quantity = $('#quantity').val();
	let unitCost = $('#unitCost').val();
	let productDescription = $('#productDescription').val();
	let total = $('#totalAmount').attr('data');
	// let weight = $('#weight').val();
	// let kg = $('#kg').val();

	let tag = '';

	itemArr[id] = {
		productName: productName,
		productDescription: productDescription,
		totalCost: total,
		quatity: quantity,
		unitCost: unitCost,
	};

	if (itemArr.length > 0) {
		itemArr.map((v, i) => {
			tag += `<div class="tag tag-default"><span class="tagClick" id="tag_${i}" dataname="${v.productName}" datadesc="${v.productDescription}" dataquan="${v.quatity}" dataunit="${v.unitCost}" datatotal="${v.totalCost}">
                    ${v.productName}</span>
                    <span id="tagDel_${i} style="background-color: pink;" class="tag-addon tagDel"><i
                            class="fe fe-x"></i>
                </span></div>`;
		});
	} else {
		tag += `<p class="text-danger">No item added yet</p>`;
	}

	$('#tagss').html(tag);
	$('.pop').val('');
	$('#totalAmount').html('0');
	$('#totalAmount').attr('data', 0);
	$('#saveItem').hide();
	$('#addItem').show();
}

function removeTag(id) {
	$('.pop').val('');
	$('#totalAmount').html(0);
	$('#saveItem').hide();
	$('#addItem').show();

	itemArr.splice(id, 1); // 2nd parameter means remove one item only

	let tag = '';

	if (itemArr.length > 0) {
		itemArr.map((v, i) => {
			tag += `<div class="tag tag-default"><span class="tagClick" id="tag_${i}" dataname="${v.productName}" datadesc="${v.productDescription}" dataquan="${v.quatity}" dataunit="${v.unitCost}" datatotal="${v.totalCost}">
                    ${v.productName}</span>
                    <span id="tagDel_${i} style="background-color: pink;" class="tag-addon tagDel"><i
                            class="fe fe-x"></i>
                </span></div>`;
		});
	} else {
		tag += `<p class="text-danger">No item added yet</p>`;
	}

	$('#tagss').html(tag);
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createPO() {
	if (itemArr.length <= 0) {
		Swal.fire({
			title: 'Error!',
			text: `No Order Item has been added kindly add an item`,
			icon: 'error',
			confirmButtonText: 'Close',
		});
		return;
	}
	$('#createPO').hide();
	$('#createPOLoader').show();

	let arry = [];
	itemArr.map((v) => {
		arry.push(parseFloat(v.totalCost));
	});
	let sum = 0;

	for (let i = 0; i < arry.length; i++) {
		sum += arry[i];
	}

	let critical = 'non-critical';

	if ($('#critical').is(':checked')) {
		critical = 'critical';
	}
	let poCode = $('#poCode').val();
	let vendor = $('#vendor').val();
	let expDate = $('#expDate').val();
    let idt = window.location.search.split('?')[1];


	axios
		.post(
			`${apiPath}projectProcurement`,
			{
				code: poCode,
				vendorId: vendor,
				grandTotal: sum,
				priority: critical,
				expectedDeliveryDate: expDate,
				products: itemArr,
                projectId:idt
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#createPOLoader').hide();
			$('#createPO').show();

			Swal.fire({
				title: 'Success',
				text: `Purchase Order Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect(`project-procurements.html?${idt}`),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#createPOLoader').hide();
			$('#createPO').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}
