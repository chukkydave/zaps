$(document).ready(() => {
	listProcurements();
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

	$(document).on('click', '#payPO', function() {
		if (isEmptyInput('.payCheck')) {
			makePayment();
		}
	});
	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/del_/, '');

		if (confirm('Are you sure you want to delete record')) {
			deleteProcurement(id);
		} else {
			return false;
		}
	});
});

function listProcurements() {
	$('#purchase').hide();
	$('#purchaseLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let id = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}getProcurementProject`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				data.map((item, indx) => {
					let poStat;
					let payStat;
					if (item.poStatus === 'inprogress') {
						poStat =
							'<span class="badge badge-warning" style="color:white;">inprogress</span>';
					} else {
						poStat = `<span class="badge badge-success" style="color:white;">${item.poStatus}</span>`;
					}

					if (item.paymentStatus === 'unpaid') {
						payStat =
							'<span class="badge badge-danger" style="color:white;">unpaid</span>';
					} else {
						payStat = `<span class="badge badge-success" style="color:white;">${item.paymentStatus}</span>`;
					}
					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${item.code}</td>`;
					res += `<td>${moment(item.creationDate, 'YYYY-MM-DD').format('LL')}</td>`;
					res += `<td>${
						item.vendorName ? item.vendorName :
						''}</td>`;
					res += `<td>${payStat}</td>`;
					res += `<td>${poStat}</td>`;
					res += `<td>${
						item.priority ===
						'critical' ? '<span class="badge badge-danger" style="color:white;">critical</span>' :
						'<span class="badge badge-warning" style="color:white;">uncritical</span>'}</td>`;
					res += `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <a class="dropdown-item viewDetails" id="view_${item._id}">Details</a>
                                    ${
										datam.adminRole ? `<a class="dropdown-item makePayment" id="pay_${item._id}" data-target="#modaldemo7" data-toggle="modal">Make Payment</a><a class="dropdown-item delete" style="color:red;" id="del_${item._id}">Delete</a>` :
										''}
										
                                </div>
                            </div></td>`;
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
		.get(`${apiPath}viewProcproject/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				let dat = data[0];
				let exp = moment(dat.expectedDeliveryDate, 'YYYY-MM-DD').format('LL');
				$('#vendorView').html(dat.vendorName);
				$('#expDelDate').html(exp);
				$('#poName').html(dat.code);
				// $('#').val()
				dat.products.map((item, indx) => {
					res += `<tr id="row_${item._id}">`;
					res += `<td>${indx + 1}</td>`;
					res += `<td>${item.productName}</td>`;
					res += `<td >${item.productDescription}</td>`;
					res += `<td >${item.quatity}</td>`;
					res += `<td >₦${numberWithCommas(item.unitCost)}</td>`;
					res += `<td >₦${numberWithCommas(item.totalCost)}</td>`;
					res += `</tr>`;
				});

				res += `<tr>
                            <td class="valign-middle" colspan="2" rowspan="4">
                                <div class="invoice-notes">
                                    <label
                                        class="main-content-label tx-13">Notes</label>
                                    <p>Sed ut perspiciatis unde omnis iste natus error
                                        sit
                                        voluptatem accusantium doloremque laudantium,
                                        totam rem
                                        aperiam, eaque ipsa quae ab illo inventore
                                        veritatis et
                                        quasi architecto beatae vitae dicta sunt
                                        explicabo.</p>
                                </div><!-- invoice-notes -->
                            </td>
                            <!-- <td class="tx-right">Total</td>
                            <td class="tx-right" colspan="2">$5,750.00</td> -->
                        </tr>`;

				res += `<tr>`;
				res += `<td class="tx-right">Amount Paid</td>`;
				res += `<td class="tx-right" colspan="2">₦${numberWithCommas(dat.amountPaid)}</td>`;
				res += `</tr>`;
				res += `<tr>`;
				res += `<td class="tx-right">Balance to Pay</td>`;
				res += `<td class="tx-right" colspan="2">-₦${numberWithCommas(
					dat.balanceToPay,
				)}</td>`;
				res += `</tr>`;
				res += `<tr>`;
				res += `<td class="tx-right tx-uppercase tx-bold tx-inverse">Grand Total</td>`;
				res += `<td class="tx-right" colspan="2"><h4 class="tx-primary tx-bold">₦${numberWithCommas(
					dat.grandTotal,
				)}</h4></td>`;
				res += `</tr>`;
			} else {
				res += '<tr colspan="6"><td>No record found</td></tr>';
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

function makePayment() {
	let id = $('#payPO').attr('data');
	$('#payPO').hide();
	$('#payPOLoader').show();

	let amountPaid = $('#amountPaid').val();

	axios
		.post(
			`${apiPath}projectPayVendor/${id}`,
			{
				amountPaid: amountPaid,
				projectId: window.location.search.split('?')[1],
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#payPOLoader').hide();
			$('#payPO').show();
			$('#modaldemo7').modal('hide');

			Swal.fire({
				title: 'Success',
				text: `Purchase Order Payment successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listProcurements(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#payPOLoader').hide();
			$('#payPO').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

function deleteProcurement(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}delProjecProc/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then((res) => {
			if (
				res.data.status === 201 ||
				res.data.status === 200 ||
				res.data.status === '201' ||
				res.data.status === '200'
			) {
				Swal.fire({
					title: 'Success',
					text: `Procurement Deleted Successfully`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listProposals(),
				});
			} else {
				console.log('nope');
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting Procurement`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			console.log('no');

			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Deleting Procurement`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}
