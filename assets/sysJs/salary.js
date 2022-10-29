$(document).ready(() => {
	listSalary();
	getResources();
	$(document).on('click', '.viewDetails', function() {
		var id = $(this).attr('id').replace(/view_/, '');

		getPODetais(id);

		// if (confirm('Are you sure you want to delete this record')) {
		// 	delete_lecture(id, mId);
		// } else {
		// 	return false;
		// }
	});
	let idt = window.location.search.split('?')[1];

	$('#create-projectpo').attr('href', `create-projectpo.html?${idt}`);
	$(document).on('click', '.makePayment', function() {
		var id = $(this).attr('id').replace(/pay_/, '');
		$('#payPO').attr('data', id);
		// makePayment(id);
	});

	$(document).on('click', '#addBtn', function() {
		if (isEmptyInput('.classChecker')) {
			createLogistics();
		}
	});

	$('#addResource').on('click', () => {
		if (isEmptyInput('.checky')) {
			createResource();
		}
	});
});

function listSalary() {
	$('#purchase').hide();
	$('#purchaseLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let id = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}getSalaryRecords`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				data.map((item, indx) => {
					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${item.salaryFor}</td>`;
					res += `<td>${item.salaryMonth}</td>`;
					res += `<td>${item.amount}</td>`;
					res += `<td>${item.tax}</td>`;
					res += `<td>${item.deductables}</td>`;
					res += `<td>${item.totalTakeHome}</td>`;
					// res += `<td><div class="dropdown">
					//             <button aria-expanded="false" aria-haspopup="true"
					//                 class="btn ripple btn-default" data-toggle="dropdown"
					//                 id="dropdownMenuButton" type="button">Action <i
					//                     class="fas fa-caret-down ml-1"></i></button>
					//             <div class="dropdown-menu tx-13">
					//                 <a class="dropdown-item viewDetails" id="view_${item._id}">Details</a>
					//                 ${
					// 					datam.adminRole ? `<a class="dropdown-item makePayment" id="pay_${item._id}" data-target="#modaldemo7" data-toggle="modal">Make Payment</a>` :
					// 					''}
					//             </div>
					//         </div></td>`;
					res += `</tr>`;
				});
			} else {
				res += '<tr colspan="9"><td>No record found</td></tr>';
			}

			$('#purchase').append(res);
			$('#purchaseLoader').hide();
			$('#purchase').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#purchaseLoader').hide();
			$('#purchase').append(`<tr colspan="9"><td>${error.response.statusText}</td></tr>`);
			$('#purchase').show();
		})
		.then(function() {
			// always executed
		});
}

function delete_lecture(id, mId) {
	$(`#block_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}api/v1/deleteCourse/${id}`, {
			// meetingId and lecture_id
			headers: {
				Authorization: token,
			},
			// data: {
			// 	meetingId: mId,
			// 	lecture_id: id,
			// },
		})
		.then((res) => {
			if (res.data.status === 201 || res.data.status === 200) {
				console.log(`#row_${id}`);
				$(`#row_${id}`).remove();
			} else {
				$(`#block_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting Record`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#block_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Deleting Record`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function getPODetais(id) {
	axios
		.get(`${apiPath}logisticDetails/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				let dat = data[0];
				let created = moment(dat.creationDate, 'YYYY-MM-DD HH:mm:ss').format('LL');

				$('#sResource').html(dat.resource);
				$('#sQuantity').html(dat.quantity_of_resources_used);
				$('#sSummary').html(dat.summary);
				$('#sDescription').html(dat.description);
				$('#sStartTime').html(dat.action_start_time);
				$('#sEndTime').html(dat.action_end_time);
				$('#sDateCreated').html(created);
			}

			$('#viewPurchase').html(res);
			$('#viewPurchaseLoader').hide();
			$('#modaldemo3').modal('show');
		})
		.catch(function(error) {
			console.log(error);
			$('#viewPurchaseLoader').hide();
			$('#viewPurchase').append(`<tr colspan="9"><td>${error.response.statusText}</td></tr>`);
			$('#modaldemo3').modal('show');
		})
		.then(function() {
			// always executed
		});
}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function createLogistics() {
	// let id = $('#payPO').attr('data');
	$('#addBtn').hide();
	$('#addLoader').show();

	let resource = $('#resource').val();
	let description = $('#description').val();
	let startTime = $('#startTime').val();
	let endTime = $('#endTime').val();
	let quantity = $('#quantity').val();
	let summary = $('#summary').val();

	// "resourceId": "62de9e6825768fb1a474f1c8",
	//         "description": "Run generator for the day",
	//         "action_start_time": "12:00",
	//         "action_end_time": "5:00",
	//         "quantity_of_resources_used": "10 litres",
	//         "summary": "Run generator for the day"

	axios
		.post(
			`${apiPath}createLogistic`,
			{
				resourceId: resource,
				description: description,
				action_start_time: startTime,
				action_end_time: endTime,
				quantity_of_resources_used: quantity,
				summary: summary,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#addLoader').hide();
			$('#addBtn').show();
			// $('#modaldemo7').modal('hide');

			Swal.fire({
				title: 'Success',
				text: `Logistics record creation successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listSalary(),
			});
			$('.classChecker').val('');
		})
		.catch(function(error) {
			console.log(error.response);
			$('#addLoader').hide();
			$('#addBtn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function getResources() {
	$('#resource').hide();
	$('#vendorLoader').show();

	axios
		.get(`${apiPath}accountStatistics`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option value="">-- Select Resource --</option>';
			data.map((item, indx) => {
				res += `<option value="${item._id}">${item.resource}</option>`;
			});
			$('#resource').html(res);
			$('#resourceLoader').hide();
			$('#resource').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#resourceLoader').hide();
			$('#resource').show();
			$('#resource').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}

function createResource() {
	$('#addResource').hide();
	$('#addResourceLoader').show();

	let resource = $('#vresource').val();
	let description = $('#vdescription').val();

	axios
		.post(
			`${apiPath}createResource`,
			{
				resource: resource,
				description: description,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#addResourceLoader').hide();
			$('#addResource').show();

			$('#modaldemo1').modal('hide');

			Swal.fire({
				title: 'Success',
				text: `Resource Created successfully`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: getResources(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#addResourceLoader').hide();
			$('#addResource').show();
			$('#modaldemo1').modal('hide');
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}
