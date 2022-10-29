$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addLeave();
		}
	});
	$('#cancel').on('click', () => {
		$('.classChecker').val('');
	});

	$(document).on('click', '.infoe', function() {
		var id = $(this).attr('id').replace(/info_/, '');
		$('#payPO').attr('data', id);
		window.location = `/employee_info.html?${id}`;
		// makePayment(id);
	});

	$(document).on('click', '.approve', function() {
		var id = $(this).attr('id').replace(/app_/, '');

		if (confirm('Are you sure you want to approve this leave record')) {
			approveLeave(id);
		} else {
			return false;
		}
	});

	$(document).on('click', '.decline', function() {
		var id = $(this).attr('id').replace(/dec_/, '');

		if (confirm('Are you sure you want to decline this leave record')) {
			declineLeave(id);
		} else {
			return false;
		}
	});

	listLeaves();
	listEmployees();
	$('#listEmployee').select2();
});

function addLeave() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let leaveType = $('#leaveType').val();
	let leaveStart = $('#startDate').val();
	let leaveEndDate = $('#endDate').val();
	let daysUsed = $('#daysUsed').val();
	let resumption = $('#resumption').val();
	let employee = $('#listEmployee').val();

	var date1 = new Date(leaveStart);
	var date2 = new Date(leaveEndDate);

	// To calculate the time difference of two dates
	var Difference_In_Time = date2.getTime() - date1.getTime();

	// To calculate the no. of days between two dates
	var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

	console.log(Difference_In_Days);

	axios
		.post(
			`${apiPath}applyLeave/${employee}`,
			{
				leaveType: leaveType,
				leaveStart: leaveStart,
				leaveEndDate: leaveEndDate,
				daysUsed: daysUsed,
				resumption: resumption,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			$('#addLoader').hide();
			$('#addBtn').show();

			Swal.fire({
				title: 'Success',
				text: `leave Application successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listLeaves(),
			});
			$('.classChecker').val('');
			$('#collapseExample').removeClass('show');
			// fetchStaffRecord();
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

function redirect(where) {
	setTimeout(() => {
		window.location = `/${where}`;
	}, 2000);
}
{
	/* <img alt="" src="assets/img/faces/6.jpg"> */
}

function listLeaves() {
	$('#listLeave').hide();
	$('#listLeaveLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}fetchLeaves`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				if (page == 1 || page == '') {
					var k = 1;
				} else {
					var k = page * limit - limit + 1;
				}
				data.map((item, indx) => {
					let creation = moment(item.creationDate, 'YYYY-MM-DD').format('LL');
					let leaveStart = moment(item.leaveStart, 'YYYY-MM-DD').format('LL');
					let resumption = moment(item.resumption, 'YYYY-MM-DD').format('LL');
					let status;
					let action;
					if (datam.adminRole) {
						if (item.approved === true) {
							action = `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                    
                                </div>
                            </div></td>`;
						} else if (item.approved === false) {
							action = `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <!--<a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>-->
                                    <a class="dropdown-item pointer approve" id="app_${item._id}" style="color: green;">Approve</a>
                                    <a class="dropdown-item pointer decline" id="dec_${item._id}" style="color: orange;">Decline</a>
                                    <!--<a class="dropdown-item pointer" style="color: red;">Delete</a>-->
                                </div>
                            </div></td>`;
						} else {
							action = `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <!--<a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>-->
                                    <a class="dropdown-item pointer approve" id="app_${item._id}" style="color: green;">Approve</a>
                                    <a class="dropdown-item pointer decline" id="dec_${item._id}" style="color: orange;">Decline</a>
                                    <!--<a class="dropdown-item pointer" style="color: red;">Delete</a>-->
                                </div>
                            </div></td>`;
						}
					} else {
						if (item.approved === true) {
							action += `<td><div class="dropdown">
                                        <button aria-expanded="false" aria-haspopup="true"
                                            class="btn ripple btn-default" data-toggle="dropdown"
                                            id="dropdownMenuButton" type="button">Action <i
                                                class="fas fa-caret-down ml-1"></i></button>
                                        <div class="dropdown-menu tx-13">
                                            <a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                           
                                        </div>
                                    </div></td>`;
						} else if (item.approved === false) {
							action += `<td><div class="dropdown">
                                        <button aria-expanded="false" aria-haspopup="true"
                                            class="btn ripple btn-default" data-toggle="dropdown"
                                            id="dropdownMenuButton" type="button">Action <i
                                                class="fas fa-caret-down ml-1"></i></button>
                                        <div class="dropdown-menu tx-13">
                                            <a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                            
                                            <a class="dropdown-item pointer dele" id="del_${item._id}" style="color: red;">Delete</a>
                                        </div>
                                    </div></td>`;
						} else {
							action += `<td><div class="dropdown">
                                        <button aria-expanded="false" aria-haspopup="true"
                                            class="btn ripple btn-default" data-toggle="dropdown"
                                            id="dropdownMenuButton" type="button">Action <i
                                                class="fas fa-caret-down ml-1"></i></button>
                                        <div class="dropdown-menu tx-13">
                                            <a class="dropdown-item pointer infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                            
                                            <a class="dropdown-item pointer dele" id="del_${item._id}" style="color: red;">Delete</a>
                                        </div>
                                    </div></td>`;
						}
					}
					if (item.approved) {
						status = '<i class="fa fa-check fa-1x" style="color:green"></i>';
					} else {
						status = '<i class="fa fa-times fa-1x" style="color:red;"></i>';
					}
					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${k++}</td>`;
					res += `<td>${item.fullName}<br> on ${creation}</td>`;
					res += `<td>${item.leaveType}</td>`;
					res += `<td>${leaveStart}</td>`;
					res += `<td>${resumption}</td>`;
					res += `<td>${item.daysUsed}</td>`;
					res += `<td>${status}</td>`;
					res += `${action}`;

					res += `</tr>`;
					res += `<tr colspan="8" id="deleteSpinner_${item._id}" style="display: none;"><td><div class="spinner-grow text-secondary" role="status"
                                    >
                                    <span class="sr-only">Loading...</span>
                                </div></td></tr>`;
				});
			} else {
				res += '<tr colspan="8"><td>No record found</td></tr>';
			}

			$('#listLeave').html(res);
			$('#listLeaveLoader').hide();
			$('#listLeave').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listLeaveLoader').hide();
			$('#listLeave').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listLeave').show();
		})
		.then(function() {
			// always executed
		});
}

function approveLeave(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.post(
			`${apiPath}approveLeave/${id}`,
			{
				not: 'not',
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then((res) => {
			if (
				res.data.status === 201 ||
				res.data.status === 200 ||
				res.data.status === '201' ||
				res.data.status === '200'
			) {
				Swal.fire({
					title: 'Success',
					text: `Leave Approval Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listLeaves(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Approving Leave`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Approving Leave`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function declineLeave(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.post(
			`${apiPath}declineLeave/${id}`,
			{
				not: 'not',
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then((res) => {
			if (
				res.data.status === 201 ||
				res.data.status === 200 ||
				res.data.status === '201' ||
				res.data.status === '200'
			) {
				Swal.fire({
					title: 'Success',
					text: `Leave Decline Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listLeaves(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Declining Leave`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		})
		.catch((error) => {
			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Declining Leave`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		})
		.then((res) => {});
}

function listEmployees() {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}fetchStaffs`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option>--Select Employee--</option>';

			if (data.length !== 0) {
				data.map((itm, ind) => {
					res += `<option value="${itm._id}">${itm.firstName} ${itm.lastName}</option>`;
				});
			} else {
				res += '<option>No record found</option>';
			}

			$('#listEmployee').html(res);
			$('#listEmployeeLoader').hide();
			$('#listEmployee').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listEmployeeLoader').hide();
			$('#listEmployee').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listEmployee').show();
		})
		.then(function() {
			// always executed
		});
}
