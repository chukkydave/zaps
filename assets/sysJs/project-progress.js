$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addProjectReport();
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

	listProposals();
	listProjects();
});
let myFile;
const fileInput = document.getElementById('attachment');
fileInput.onchange = () => {
	Main();
};

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

async function Main() {
	const file = document.querySelector('#attachment').files[0];
	myFile = await toBase64(file);
}

function addProjectReport() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let taskDonereport = $('#taskDonereport').val();
	let proPercent = $('#proPercent').val();
	let project = $('#project').val();

	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	let yyyy = today.getFullYear();

	today = dd + '-' + mm + '-' + yyyy;

	axios
		.post(
			`${apiPath}projectProgress`,
			{
				projectId: project,
				ProgressPercentage: proPercent,
				reportDate: today,
				TaskDoneReport: taskDonereport,
				attachment: myFile,
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
				text: `Report creation successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				// onClose: listProposals(),
			});
			$('.classChecker').val('');

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

function listProposals() {
	$('#listLeave').hide();
	$('#listLeaveLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}callForProposals`, {
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

					let status;
					let action;
					action = `<td><div class="dropdown">
			                    <button aria-expanded="false" aria-haspopup="true"
			                        class="btn ripple btn-default" data-toggle="dropdown"
			                        id="dropdownMenuButton" type="button">Action <i
			                            class="fas fa-caret-down ml-1"></i></button>
			                    <div class="dropdown-menu tx-13">
			                        <a class="dropdown-item pointer edit" id="edit_${item._id}" style="color: blue;">Edit</a>
			                        <a class="dropdown-item pointer delete" style="color: red;" id="delete_${item._id}">Delete</a>
			                    </div>
			                </div></td>`;

					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${k++}</td>`;
					res += `<td>${item.projectBrief}</td>`;
					res += `<td>${item.totalBudget}</td>`;
					res += `<td>${creation}</td>`;
					if (item.attachment) {
						res += `<td><a target="_blank" href="${item.attachment}">${item.attachment}</a></td>`;
					} else {
						res += `<td><a> ... </a></td>`;
					}
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
		.delete(`${apiPath}approveLeave/${id}`, {
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
		.delete(`${apiPath}declineLeave/${id}`, {
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

function listProjects() {
	$('#project').hide();
	$('#vendorLoader').show();

	axios
		.get(`${apiPath}getProjects`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '<option value="">-- Select Project --</option>';
			data.map((item, indx) => {
				res += `<option value="${item._id}">${item.projectName}</option>`;
			});
			$('#project').html(res);
			$('#projectLoader').hide();
			$('#project').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#projectLoader').hide();
			$('#project').show();
			$('#project').html('<option style="color:red;">Error loading result</option>');
		})
		.then(function() {
			// always executed
		});
}
