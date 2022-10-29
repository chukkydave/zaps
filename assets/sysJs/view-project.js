$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addProposal();
		}
	});
	viewProject();
	$('#cancel').on('click', () => {
		$('.classChecker').val('');
	});

	$(document).on('click', '.infoe', function() {
		var id = $(this).attr('id').replace(/info_/, '');
		$('#payPO').attr('data', id);
		window.location = `/employee_info.html?${id}`;
		// makePayment(id);
	});

	$(document).on('click', '#approveProject', function() {
		var id = window.location.search.split('?')[1];

		if (confirm('Are you sure you want to approve this Project')) {
			approveProject(id);
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
	viewProjectStat();
	viewProjectReport();
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

function addProposal() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let companyName = $('#companyName').val();
	let email = $('#email').val();
	let companyPhone = $('#companyPhone').val();
	let address = $('#address').val();
	let proposalBrief = $('#proposalBrief').val();
	let totalBudget = $('#totalBudget').val();

	axios
		.post(
			`${apiPath}inviteProposals`,
			{
				companyName: companyName,
				email: email,
				phoneNumber: companyPhone,
				address: address,
				projectBrief: proposalBrief,
				totalBudget: totalBudget,
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
				text: `Proposal creation successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listProposals(),
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

function listProposals() {
	$('#listProposal').hide();
	$('#listProposalLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));
	let page = 1;
	let limit = 100;

	axios
		.get(`${apiPath}getProposals`, {
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
					if (item.approved) {
						status = `<td><i class="fa fa-check " style="color: green"></i></td>`;
						action = `<td><div class="dropdown">
			                    <button aria-expanded="false" aria-haspopup="true"
			                        class="btn ripple btn-default" data-toggle="dropdown"
			                        id="dropdownMenuButton" type="button">Action <i
			                            class="fas fa-caret-down ml-1"></i></button>
			                    <div class="dropdown-menu tx-13">
			                        <a class="dropdown-item pointer view" id="view_${item._id}" style="color: blue;">View</a>
			                        <!--<a class="dropdown-item pointer delete" style="color: red;" id="delete_${item._id}">Delete</a>-->
			                    </div>
			                </div></td>`;
					} else {
						status = `<td><i class="fa fa-exclamation-triangle " style="color: orange"></i></td>`;
						action = `<td><div class="dropdown">
			                    <button aria-expanded="false" aria-haspopup="true"
			                        class="btn ripple btn-default" data-toggle="dropdown"
			                        id="dropdownMenuButton" type="button">Action <i
			                            class="fas fa-caret-down ml-1"></i></button>
			                    <div class="dropdown-menu tx-13">
			                        <a class="dropdown-item pointer view" id="view_${item._id}" style="color: blue;">View/Approve</a>
			                        <a class="dropdown-item pointer approve" id="approve_${item._id}" style="color: blue;">Approve</a>
			                        <a class="dropdown-item pointer delete" style="color: red;" id="delete_${item._id}">Delete</a>
			                    </div>
			                </div></td>`;
					}

					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${k++}</td>`;
					res += `<td>${item.companyName}</td>`;
					res += `<td>${item.email}</td>`;
					res += `<td>${item.phoneNumber}</td>`;
					res += `<td>${item.totalBudget}</td>`;
					res += `<td>${creation}</td>`;
					res += `${status}`;
					res += `<td><a target="_blank" href="${item.attachment}">${item.attachment}</a></td>`;
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

			$('#listProposal').html(res);
			$('#listProposalLoader').hide();
			$('#listProposal').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listProposalLoader').hide();
			$('#listProposal').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listProposal').show();
		})
		.then(function() {
			// always executed
		});
}

// function approveProject(id) {
// 	$(`#row_${id}`).hide();
// 	$(`#deleteSpinner_${id}`).show();

// 	// alert(token);

// 	axios
// 		.post(`${apiPath}approveProject/${id}`, {
// 			headers: {
// 				Authorization: token,
// 			},
// 		})
// 		.then((res) => {
// 			if (
// 				res.data.status === 201 ||
// 				res.data.status === 200 ||
// 				res.data.status === '201' ||
// 				res.data.status === '200'
// 			) {
// 				Swal.fire({
// 					title: 'Success',
// 					text: `Project Approval Successful`,
// 					icon: 'success',
// 					confirmButtonText: 'Okay',
// 					onClose: listLeaves(),
// 				});
// 			} else {
// 				$(`#row_${id}`).show();
// 				$(`#deleteSpinner_${id}`).hide();
// 				Swal.fire({
// 					title: 'Error!',
// 					text: `Error Approving Project`,
// 					icon: 'error',
// 					confirmButtonText: 'Close',
// 				});
// 			}
// 		})
// 		.catch((error) => {
// 			$(`#row_${id}`).show();
// 			$(`#deleteSpinner_${id}`).hide();
// 			Swal.fire({
// 				title: 'Error!',
// 				text: `Error Approving Project`,
// 				icon: 'error',
// 				confirmButtonText: 'Close',
// 			});
// 		})
// 		.then((res) => {});
// }

function approveProject(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${apiPath}approveProject/${id}`,
		headers: {
			Authorization: token,
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(res) {
			$(`#row_${id}`).show();
			$(`#deleteSpinner_${id}`).hide();
			Swal.fire({
				title: 'Error!',
				text: `Error Approving Project`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		},
		success: function(res) {
			if (
				res.status === 201 ||
				res.status === 200 ||
				res.status === '201' ||
				res.status === '200'
			) {
				Swal.fire({
					title: 'Success',
					text: `Project Approval Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					// onClose: listLeaves(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Approving Project`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			}
		},
	});
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

function viewProject() {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));

	let idt = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}viewProject/${idt}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;

			if (data.length !== 0) {
				let dat = data[0];
				// 				approved: true
				// attachment: "test"
				// availableBudget: 5000
				// contractBrief: "Build Factory"
				// contractorAddress: "Lagos"
				// contractorEmail: "teejohn247@gmail.com"
				// contractorName: "Cocacola"
				// contractorphoneNumber: "08161582774"
				// createdBy: "chukkydave@gmail.com"
				// creationDate: "2022-07-07T14:32:14.398Z"
				// endDate: null
				// projectName: "HTL"
				// startDate: null
				// totalBudget: 1000000
				// __v: 0
				// _id: "62c6ee77a8e7cc93cbbbc0e7"
				$('#project_namel').html(dat.projectName);
				$('#pNme').html(dat.projectName + ' project');
				$('#pName').html(dat.projectName + ' project');
				$('#contractor_namel').html(dat.contractorName);
				$('#contractor_emaill').html(dat.contractorEmail);
				$('#contractor_phonel').html(dat.contractorphoneNumber);
				$('#contractor_addressl').html(dat.contractorAddress);
				$('#statusl').html(

						dat.approved ? 'Approved' :
						'not approved',
				);
				$('#contract_briefl').html(dat.contractBrief);
				$('#start_datel').html(dat.startDate);
				$('#end_datel').html(dat.endDate);
				$('#total_budgetl').html(dat.totalBudget);
				$('#available_budegetl').html(dat.availableBudget);
				$('#attachmentl').attr('src', dat.attachment);
				// data.map((itm, ind) => {
				// 	res += `<option value="${itm._id}">${itm.firstName} ${itm.lastName}</option>`;
				// });
			} else {
				// res += '<option>No record found</option>';
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

function viewProjectStat() {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();

	let idt = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}projectStats/${idt}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
		})
		.catch(function(error) {})
		.then(function() {
			// always executed
		});
}
function viewProjectReport() {
	$('#listEmployee').hide();
	$('#listEmployeeLoader').show();

	let idt = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}projectReport/${idt}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
		})
		.catch(function(error) {})
		.then(function() {
			// always executed
		});
}
