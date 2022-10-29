$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addProject();
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
		var id = $(this).attr('id').replace(/approve_/, '');

		if (confirm('Are you sure you want to approve this record')) {
			approveProposal(id);
		} else {
			return false;
		}
	});

	$(document).on('click', '.delete', function() {
		var id = $(this).attr('id').replace(/delete_/, '');

		if (confirm('Are you sure you want to delete this record')) {
			deleteProject(id);
		} else {
			return false;
		}
	});

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

function addProject() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let projectName = $('#projectName').val();
	let contractorName = $('#contractorName').val();
	let contractorEmail = $('#contractorEmail').val();
	let contractorphoneNumber = $('#contractorphoneNumber').val();
	let contractorAddress = $('#contractorAddress').val();
	let supervisorEmail = $('#supervisorEmail').val();
	let contractBrief = $('#contractBrief').val();
	let startDate = $('#startDate').val();
	let endDate = $('#endDate').val();
	let availableBudget = $('#availableBudget').val();
	let totalBudget = $('#totalBudget').val();

	axios
		.post(
			`${apiPath}createProject`,
			{
				projectName: projectName,
				contractorName: contractorName,
				contractorEmail: contractorEmail,
				contractorphoneNumber: contractorphoneNumber,
				contractorAddress: contractorAddress,
				supervisorEmail: supervisorEmail,
				contractBrief: contractBrief,
				startDate: startDate,
				endDate: endDate,
				totalBudget: totalBudget,
				availableBudget: availableBudget,
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
				text: `Project creation successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listProjects(),
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

function listProjects() {
	$('#listProject').hide();
	$('#listProjectLoader').show();

	axios
		.get(`${apiPath}accountStatistics`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			let {
				TotalAmountSalary,
				TotalAmountSalaryTax,
				TotalAmountSpentProcurement,
			} = response.data;

			if (TotalAmountSalary) {
				$('#listProject').append(`<div class="col-lg-4 col-xl-4 col-md-4 col-12">
						<div class="card bg-primary-gradient text-white ">
							<div class="card-body">
								<div class="row">
									<div class="col-6">
										<div class="icon1 mt-2 text-center">
											<i class="fe fe-users tx-40"></i>
										</div>
									</div>
									<div class="col-6">
										<div class="mt-0 text-center">
											<span class="text-white">Total Salary</span>
											<h2 class="text-white mb-0">₦${kFormatter(TotalAmountSalary)}</h2>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`);
			}
			if (TotalAmountSalaryTax) {
				$('#listProject').append(`<div class="col-lg-4 col-xl-4 col-md-4 col-12">
						<div class="card bg-success-gradient text-white">
							<div class="card-body">
								<div class="row">
									<div class="col-6">
										<div class="icon1 mt-2 text-center">
											<i class="fe fe-bar-chart-2 tx-40"></i>
										</div>
									</div>
									<div class="col-6">
										<div class="mt-0 text-center">
											<span class="text-white">Total Salary Tax</span>
											<h2 class="text-white mb-0">₦${kFormatter(TotalAmountSalaryTax)}</h2>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`);
			}
			if (TotalAmountSpentProcurement) {
				$('#listProject').append(`<div class="col-lg-4 col-xl-4 col-md-4 col-12">
						<div class="card bg-warning-gradient text-white">
							<div class="card-body">
								<div class="row">
									<div class="col-6">
										<div class="icon1 mt-2 text-center">
											<i class="fe fe-pie-chart tx-40"></i>
										</div>
									</div>
									<div class="col-6">
										<div class="mt-0 text-center">
											<span class="text-white">Total Procurement</span>
											<h2 class="text-white mb-0">₦${kFormatter(TotalAmountSpentProcurement)}</h2>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>`);
			}

			// $('#listProject').html(res);
			$('#listProjectLoader').hide();
			$('#listProject').show();
		})
		.catch(function(error) {
			console.log(error);
			$('#listProjectLoader').hide();
			$('#listProject').append(`<tr colspan="5"><td>${error.response.statusText}</td></tr>`);
			$('#listProject').show();
		})
		.then(function() {
			// always executed
		});
}

function formatToCurrency(amount) {
	if (amount === 0 || amount === 0.0) {
		return amount;
	} else {
		return '₦' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	}
}

function kFormatter(num) {
	// let num = parseFloat(nums);
	console.log(num);
	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
	}
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
	}
	return num;
	console.log(num);
}

function approveProposal(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}approveProposal/${id}`, {
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
					text: `Proposal Approval Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listLeaves(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Approving Proposal`,
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

function deleteProject(id) {
	$(`#row_${id}`).hide();
	$(`#deleteSpinner_${id}`).show();

	axios
		.delete(`${apiPath}delProject/${id}`, {
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
					text: `Project Delete Successful`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listLeaves(),
				});
			} else {
				$(`#row_${id}`).show();
				$(`#deleteSpinner_${id}`).hide();
				Swal.fire({
					title: 'Error!',
					text: `Error Deleting projectmmmm`,
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
				text: `Error deleting projectm`,
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
