$(document).ready(() => {
	$(document).on('click', '.viewDetails', function() {
		var id = $(this).attr('id').replace(/view_/, '');

		getPODetais(id);

		// if (confirm('Are you sure you want to delete this record')) {
		// 	delete_lecture(id, mId);
		// } else {
		// 	return false;
		// }
	});
	$(document).on('click', '.makePayment', function() {
		var id = $(this).attr('id').replace(/pay_/, '');
		$('#payPO').attr('data', id);
		// makePayment(id);
	});

	$(document).on('click', '#updateProfile', function() {
		// if (isEmptyInput('.payCheck')) {
		updateProfile();
		// }
	});
	getEmployeeInfo();
	listQC();
	listWorkExp();
	listSalary();
	$('#edit').on('click', () => {
		$('#viewSection').fadeOut('slow');
		$('#editSection').fadeIn('slow');
	});
	$('#cancelEdit').on('click', () => {
		$('#editSection').fadeOut('slow');
		$('#viewSection').fadeIn('slow');
	});
	$('#sProfilepic').on('click', () => {
		$('#eProfilepic').trigger('click');
	});

	$('#add_QC_btn').on('click', () => {
		if (isEmptyInput('.add_qc_fields')) {
			addQC();
		}
	});

	$('#add_workExp_btn').on('click', () => {
		if (isEmptyInput('.add_workExp_fields')) {
			addWorkExp();
		}
	});
	$('#add_salary_btn').on('click', () => {
		if (isEmptyInput('.add_salary_fields')) {
			addSalary();
		}
	});
});

let myFile;

function listProcurements() {
	$('#purchase').hide();
	$('#purchaseLoader').show();
	// $('#departmentLoader').show();
	let datam = JSON.parse(localStorage.getItem('procData'));

	axios
		.get(`${apiPath}procurements`, {
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
										datam.adminRole ? `<a class="dropdown-item makePayment" id="pay_${item._id}" data-target="#modaldemo7" data-toggle="modal">Make Payment</a>` :
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

function getEmployeeInfo() {
	let id = window.location.search.split('?')[1];
	$('#vProfile').hide();
	axios
		.get(`${apiPath}getUser/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			const { data } = response.data;
			let res = '';

			if (data.length !== 0) {
				let dat = data[0];
				$('#vName').html(`${dat.firstName} ${dat.lastName}`);
				$('#vPosition').html(dat.position);
				$('#vEmail').html(dat.email);
				$('#vProfilepic').attr('src', dat.profilePic);
				$('#vPhone').html(dat.phoneNumber);
				$('#vAddress').html(dat.address);
				$('#vGender').html(dat.gender);

				$('#efirstName').val(dat.firstName);
				$('#elastName').val(dat.lastName);
				$('#eEmail').val(dat.email);
				$('#emiddleName').val(dat.middleName);
				$('#ePhone').val(dat.phoneNumber);
				$('#eAddress').val(dat.address);
				$('#eMaritalstatus').val(dat.maritalStatus);
				$('#eReligion').val(dat.religion);
				$('#eDOB').val(dat.dateOfBirth);
				$('#eGender').val(dat.gender);
				$('#ePosition').val(dat.position);
				$('#eDepartment').val(dat.department);
				$('#eBankname').val(dat.bankName);
				$('#eAcctname').val(dat.acctName);
				$('#eSortcode').val(dat.sortCode);
				$('#eGuarantorname').val(dat.guarantorFullName);
				$('#eGuarantoraddress').html(dat.guarantorAddress);
				$('#eGuarantorgender').val(dat.guarantorGender);
				$('#evProfilepic').attr('src', dat.profilePic);
				// $('#').val();
			} else {
				$('#vProfile').html('No record found');
			}

			$('#vProfile').show();
			$('#vProfileLoader').hide();
		})
		.catch(function(error) {
			console.log(error);
			$('#vProfileLoader').hide();
			$('#vProfile').html('Error loading result');
			$('#vProfile').show();
		})
		.then(function() {
			// always executed
		});
}

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$('#evProfilepic').attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
		// console.log(reader.readAsDataURL(input.files[0]));
		Main();
	}
}

const toBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

async function Main() {
	const file = document.querySelector('#eProfilepic').files[0];
	myFile = await toBase64(file);
}

function updateProfile() {
	let id = window.location.search.split('?')[1];
	$('#updateProfile').hide();
	$('#updateProfileLoader').show();

	let firstName = $('#efirstName').val();
	let lastName = $('#elastName').val();
	let email = $('#eEmail').val();
	let middleName = $('#emiddleName').val();
	let phone = $('#ePhone').val();
	let address = $('#eAddress').val();
	let maritalStatus = $('#eMaritalstatus').val();
	let religion = $('#eReligion').val();
	let dob = $('#eDOB').val();
	let gender = $('#eGender').val();
	let position = $('#ePosition').val();
	let department = $('#eDepartment').val();
	let bankname = $('#eBankname').val();
	let acctname = $('#eAcctname').val();
	let sortcode = $('#eSortcode').val();
	let guarantorname = $('#eGuarantorname').val();
	let guarantoraddress = $('#eGuarantoraddress').val();
	let guarantorgender = $('#eGuarantorgender').val();
	let profilePic = myFile;
	axios
		.post(
			`${apiPath}updateStaff/${id}`,
			{
				firstName: firstName,
				middleName: middleName,
				maritalStatus: maritalStatus,
				lastName: lastName,
				religion: religion,
				dateOfBirth: dob,
				// email: email,
				phoneNumber: phone,
				gender: gender,
				address: address,
				position: position,
				department: department,
				profilePic: profilePic,
				bankName: bankname,
				acctName: acctname,
				sortCode: sortcode,
				guarantorFullName: guarantorname,
				guarantorAddress: guarantoraddress,
				guarantorGender: guarantorgender,
			},
			{
				headers: {
					Authorization: token,
				},
			},
		)
		.then(function(response) {
			// const {} = response.data.data;

			$('#updateProfileLoader').hide();
			$('#updateProfile').show();

			Swal.fire({
				title: 'Success',
				text: `Profile Update successful`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: getEmployeeInfo(),
			});
		})
		.catch(function(error) {
			console.log(error.response);
			$('#updateProfileLoader').hide();
			$('#updateProfile').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.response.data.error}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		});
}

//QC starts
function addQC() {
	let id = window.location.search.split('?')[1];

	$('#add_QC_btn').hide();
	$('#add_QC_loader').show();

	let institution = $('#QC_institute_name').val();
	let degree = $('#QC_degree').val();
	let year_concluded = $('#QC_year_concluded').val();

	let data = {
		institution: institution,
		degree: degree,
		yearConcluded: year_concluded,
	};
	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${apiPath}updateQualification/${id}`,
		data: data,
		headers: {
			Authorization: token,
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(res) {
			console.log(res);
			$('#add_QC_loader').hide();
			$('#add_QC_btn').show();
			Swal.fire({
				title: 'Error!',
				text: `${res.statusText}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		},
		success: function(response) {
			if (response.status == 200 || response.status == 201) {
				$('#add_QC_loader').hide();
				$('#add_QC_btn').show();
				$('#QC_institute_name').val('');
				$('#QC_degree').val('');
				$('#QC_year_concluded').val('');
				$('#QC_display').toggle();
				Swal.fire({
					title: 'Success',
					text: `Success`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listQC(),
				});
			}
		},
	});
}

function listQC() {
	let id = window.location.search.split('?')[1];

	$('#list_QC_table').hide();
	$('#list_QC_loader').show();
	axios
		.get(`${apiPath}getUser/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			let qc_list;
			const { qualifications } = response.data.data[0];
			if (qualifications.length > 0) {
				$(qualifications).map((i, v) => {
					qc_list += `<tr class="even pointer" id="qc_row${v._id}">`;

					qc_list += `<td>${v.institution}</td>`;
					qc_list += `<td>${v.degree}</td>`;
					qc_list += `<td>${v.yearConcluded}</td>`;
					// let role_list = $('#does_user_have_roles').html();

					// if (role_list.indexOf('-83-') >= 0 || role_list.indexOf('-58-') >= 0) {
					// 	qc_list += `<td>
					// 	<div class="dropdown">
					// 		<button
					// 			class="btn btn-secondary dropdown-toggle"
					// 			type="button"
					// 			id="dropdownMenuButton1"
					// 			data-toggle="dropdown"
					// 			aria-expanded="false">
					// 			Actions
					// 		</button>
					// 		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					// 			<li onClick="viewQC(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-pencil" /> Edit
					// 				</a>
					// 			</li>
					// 			<li onClick="deleteQC(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-trash" /> Delete
					// 				</a>
					// 			</li>
					// 		</ul>
					// 	</div></td>`;
					// }

					qc_list += `</tr>`;
					qc_list += `<tr id="qc_loader${v._id}" style="display:none;"><td colspan="4"><i class="fa fa-spinner fa-spin fa-fw"></i></tr>`;
				});

				$('#list_QC_body').html(qc_list);
				$('#list_QC_loader').hide();
				$('#list_QC_table').show();
			} else {
				$('#list_QC_body').html(`<tr><td colspan="4">No record</td></tr>`);
				$('#list_QC_loader').hide();
				$('#list_QC_table').show();
			}
		})
		.catch(function(error) {
			console.log(error);

			$('#list_QC_loader').hide();
			$('#list_QC_table').show();
			$('#list_QC_body').html(`<tr><td colspan="4" style="color:red;">Error</td></tr>`);

			// $('#edit_QC_error').html(error);
		})
		.then(function() {
			// always executed
		});
}

function viewQC(id) {
	$('#edit_QC_error').html('');
	$('#edit_QC_modal').modal('show');
	$('#edit_QC_btn').hide();
	$('#edit_QC_loader').show();

	let company_id = localStorage.getItem('company_id');
	let employee_id = window.location.search.split('=')[1];
	axios
		.get(`${api_path}hrm/single_cv_eduhistory`, {
			params: {
				empl_edu_id: id,
				employee_id: employee_id,
			},
			headers: {
				Authorization: localStorage.getItem('token'),
			},
		})
		.then(function(response) {
			$('#edit_QC_loader').hide();
			$('#edit_QC_btn').show();

			let { school_name, year_concluded, qualification } = response.data.data;
			$('#edit_QC_institute_name').val(school_name);
			$('#edit_QC_degree').val(qualification);
			$('#edit_QC_year_concluded').val(year_concluded);
			$('#edit_QC_btn').attr('data-id', id);
		})
		.catch(function(error) {
			console.log(error);

			$('#edit_QC_loader').hide();
			$('#edit_QC_btn').show();

			$('#edit_QC_error').html(error);
		})
		.then(function() {
			// always executed
		});
}

function editQC() {
	let id = $('#edit_QC_btn').attr('data-id');
	let company_id = localStorage.getItem('company_id');
	let employee_id = window.location.search.split('=')[1];
	$('#edit_QC_btn').hide();
	$('#edit_QC_loader').show();

	let institution = $('#edit_QC_institute_name').val();
	let degree = $('#edit_QC_degree').val();
	let year_concluded = $('#edit_QC_year_concluded').val();

	let data = {
		empl_edu_id: id,
		school_name: institution,
		qualification: degree,
		year_concluded: year_concluded,
		type: 'edit',
		// company_id: company_id,
		employee_id: employee_id,
	};

	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${api_path}hrm/update_cv_eduhistory`,
		data: data,
		headers: {
			Authorization: localStorage.getItem('token'),
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(res) {
			console.log(res);
			$('#edit_QC_loader').hide();
			$('#edit_QC_btn').show();
			$('#edit_QC_error').html(res.statusText);
			// alert('error');
		},
		success: function(response) {
			if (response.status == 200 || response.status == 201) {
				$('#edit_QC_loader').hide();
				$('#edit_QC_btn').show();

				Swal.fire({
					title: 'Success',
					text: `Success`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listQC(),
				});
			} else {
				$('#edit_QC_loader').hide();
				$('#edit_QC_btn').show();
				$('#edit_QC_error').html(response.statusText);
			}
		},
	});
}

function deleteQC(id) {
	let ans = confirm('Are you sure you want to delete this record?');
	if (ans) {
		$(`#qc_row${id}`).hide();
		$(`#qc_loader${id}`).show();
		let company_id = localStorage.getItem('company_id');
		let employee_id = window.location.search.split('=')[1];

		let data = {
			empl_edu_id: id,
			employee_id: employee_id,
		};

		$.ajax({
			type: 'Delete',
			dataType: 'json',
			url: `${api_path}hrm/delete_cv_eduhistory`,
			data: data,
			headers: {
				Authorization: localStorage.getItem('token'),
			},

			error: function(res) {
				console.log(res);
				$(`#qc_loader${id}`).hide();
				$(`#qc_row${id}`).show();

				Swal.fire({
					title: 'Error!',
					text: `${res.statusText}`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			},
			success: function(response) {
				if (response.status == 200 || response.status == 201) {
					$(`#qc_row${id}`).remove();
					$(`#qc_loader${id}`).remove();
					Swal.fire({
						title: 'Success',
						text: `Success`,
						icon: 'success',
						confirmButtonText: 'Okay',
					});
				}
			},
		});
	}
}
//QC ends

//work experience start
function addWorkExp() {
	let id = window.location.search.split('?')[1];

	$('#add_workExp_btn').hide();
	$('#add_workExp_loader').show();

	let prevCom = $('#workExp_prevCom').val();
	let designation = $('#workExp_designation').val();
	let jobTitle = $('#workExp_jobTitle').val();
	let start = $('#workExp_start').val();
	let end = $('#workExp_end').val();

	let data = {
		previousCompany: prevCom,
		jobTitle: jobTitle,
		jobStart: start,
		jobEnd: end,
		jobDesignation: designation,
	};
	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${apiPath}updateExperience/${id}`,
		data: data,
		headers: {
			Authorization: token,
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(error) {
			console.log(error);
			$('#add_workExp_loader').hide();
			$('#add_workExp_btn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.statusText}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		},
		success: function(response) {
			if (response.status == 200 || response.status == 201) {
				$('#add_workExp_loader').hide();
				$('#add_workExp_btn').show();

				$('#workExp_prevCom').val('');
				$('#workExp_jobTitle').val('');
				$('#workExp_start').val('');
				$('#workExp_end').val('');
				$('#work-exp_display').toggle();

				Swal.fire({
					title: 'Success',
					text: `Success`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listWorkExp(),
				});
			}
		},
	});
}

function listWorkExp() {
	$('#list_workExp_table').hide();
	$('#list_workExp_loader').show();

	let id = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}getUser/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			let workExp_list;
			const { workExperience } = response.data.data[0];

			if (workExperience.length > 0) {
				$(workExperience).map((i, v) => {
					let start = moment(v.jobStart, 'YYYY-MM-DD HH:mm:ss').format('LL');
					let end = moment(v.jobEnd, 'YYYY-MM-DD HH:mm:ss').format('LL');
					workExp_list += `<tr class="even pointer" id="workExp_row${v._id}">`;
					workExp_list += `<td>${v.previousCompany}</td>`;
					workExp_list += `<td>${v.jobTitle}</td>`;
					workExp_list += `<td>${start}</td>`;
					workExp_list += `<td>${end}</td>`;
					// let role_list = $('#does_user_have_roles').html();

					// if (role_list.indexOf('-83-') >= 0 || role_list.indexOf('-58-') >= 0) {
					// 	workExp_list += `<td>
					// 	<div class="dropdown">
					// 		<button
					// 			class="btn btn-secondary dropdown-toggle"
					// 			type="button"
					// 			id="dropdownMenuButton1"
					// 			data-toggle="dropdown"
					// 			aria-expanded="false">
					// 			Actions
					// 		</button>
					// 		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					// 			<li onClick="viewWorkExp(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-pencil" /> Edit
					// 				</a>
					// 			</li>
					// 			<li onClick="deleteWorkExp(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-trash" /> Delete
					// 				</a>
					// 			</li>
					// 		</ul>
					// 	</div></td>`;
					// }

					workExp_list += `</tr>`;
					workExp_list += `<tr id="workExp_loader${v._id}" style="display:none;"><td colspan="4"><i class="fa fa-spinner fa-spin fa-fw"></i></tr>`;
				});

				$('#list_workExp_body').html(workExp_list);
				$('#list_workExp_loader').hide();
				$('#list_workExp_table').show();
			} else {
				$('#list_workExp_body').html(`<tr><td colspan="5">No record</td></tr>`);
				$('#list_workExp_loader').hide();
				$('#list_workExp_table').show();
			}
		})
		.catch(function(error) {
			console.log(error);

			$('#list_workExp_loader').hide();
			$('#list_workExp_table').show();
			$('#list_workExp_body').html(`<tr><td colspan="5" style="color:red;">Error</td></tr>`);

			// $('#edit_QC_error').html(error);
		})
		.then(function() {
			// always executed
		});
}

function viewWorkExp(id) {
	$('#edit_workExp_error').html('');
	$('#edit_workExp_modal').modal('show');
	$('#edit_workExp_btn').hide();
	$('#edit_workExp_loader').show();

	let company_id = localStorage.getItem('company_id');
	let employee_id = window.location.search.split('=')[1];
	axios
		.get(`${api_path}hrm/single_cv_workhistory`, {
			params: {
				wrkhisid: id,
				employee_id: employee_id,
			},
			headers: {
				Authorization: localStorage.getItem('token'),
			},
		})
		.then(function(response) {
			$('#edit_workExp_loader').hide();
			$('#edit_workExp_btn').show();

			let { company_name, position, from_year, to_year } = response.data.data;
			$('#edit_workExp_prevCom').val(company_name);
			$('#edit_workExp_jobTitle').val(position);
			$('#edit_workExp_start').val(from_year);
			$('#edit_workExp_end').val(to_year);
			$('#edit_workExp_btn').attr('data-id', id);
		})
		.catch(function(error) {
			console.log(error);

			$('#edit_workExp_loader').hide();
			$('#edit_workExp_btn').show();

			$('#edit_workExp_error').html(error);
		})
		.then(function() {
			// always executed
		});
}

function editWorkExp() {
	let id = $('#edit_workExp_btn').attr('data-id');
	let company_id = localStorage.getItem('company_id');
	let employee_id = window.location.search.split('=')[1];
	$('#edit_workExp_btn').hide();
	$('#edit_workExp_loader').show();

	let prevCom = $('#edit_workExp_prevCom').val();
	let jobTitle = $('#edit_workExp_jobTitle').val();
	let start = $('#edit_workExp_start').val();
	let end = $('#edit_workExp_end').val();

	let data = {
		company_name: prevCom,
		position: jobTitle,
		// company_id: company_id,
		employee_id: employee_id,
		from_year: start,
		to_year: end,
		description: '..',
		type: 'edit',
		wrkhisid: id,
	};
	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${api_path}hrm/update_cv_workhistory`,
		data: data,
		headers: {
			Authorization: localStorage.getItem('token'),
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(res) {
			console.log(res);
			$('#edit_workExp_loader').hide();
			$('#edit_workExp_btn').show();
			Swal.fire({
				title: 'Error!',
				text: `${res.statusText}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		},
		success: function(response) {
			if (response.status == 200 || response.status == 201) {
				$('#edit_workExp_loader').hide();
				$('#edit_workExp_btn').show();

				$('#edit_workExp_modal').modal('hide');

				Swal.fire({
					title: 'Success',
					text: `Success`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listWorkExp(),
				});
			}
		},
	});
}

function deleteWorkExp(id) {
	let ans = confirm('Are you sure you want to delete this record?');
	if (ans) {
		$(`#workExp_row${id}`).hide();
		$(`#workExp_loader${id}`).show();
		let company_id = localStorage.getItem('company_id');
		let employee_id = window.location.search.split('=')[1];

		let data = {
			wrkhisid: id,
			employee_id: employee_id,
		};

		$.ajax({
			type: 'Delete',
			dataType: 'json',
			url: `${api_path}hrm/delete_cv_workhistory`,
			data: data,
			headers: {
				Authorization: localStorage.getItem('token'),
			},

			error: function(res) {
				console.log(res);
				$(`#workExp_loader${id}`).hide();
				$(`#workExp_row${id}`).show();

				Swal.fire({
					title: 'Error!',
					text: `${res.statusText}`,
					icon: 'error',
					confirmButtonText: 'Close',
				});
			},
			success: function(response) {
				if (response.status == 200 || response.status == 201) {
					$(`#workExp_row${id}`).remove();
					$(`#workExp_loader${id}`).remove();
					Swal.fire({
						title: 'Success',
						text: `Success`,
						icon: 'success',
						confirmButtonText: 'Okay',
					});
				}
			},
		});
	}
}
//work experience end

//work experience start
function addSalary() {
	let id = window.location.search.split('?')[1];

	$('#add_salary_btn').hide();
	$('#add_salary_loader').show();

	let amount = $('#salary_amt').val();
	let month = $('#salary_month').val();
	let deduct = $('#salary_deduct').val();
	let tax = $('#salary_tax').val();
	let tth = $('#salary_tth').val();
	let date = $('#salary_date').val();

	{
	}

	let data = {
		amount: amount,
		salaryMonth: month,
		deductables: deduct,
		tax: tax,
		totalTakeHome: tth,
		salaryDate: date,
	};
	$.ajax({
		type: 'Post',
		dataType: 'json',
		url: `${apiPath}paySalary/${id}`,
		data: data,
		headers: {
			Authorization: token,
		},
		// headers: {
		// 	Accept: 'application/json',
		// 	'Content-Type': 'application/json',
		// 	// Authorization: `Bearer ${authy}`,
		// },
		error: function(error) {
			console.log(error);
			$('#add_salary_loader').hide();
			$('#add_salary_btn').show();
			Swal.fire({
				title: 'Error!',
				text: `${error.statusText}`,
				icon: 'error',
				confirmButtonText: 'Close',
			});
		},
		success: function(response) {
			if (response.status == 200 || response.status == 201) {
				$('#add_salary_loader').hide();
				$('#add_salary_btn').show();

				$('.add_salary_fields').val('');

				$('#collapseExamplesalary').toggle();

				Swal.fire({
					title: 'Success',
					text: `Success`,
					icon: 'success',
					confirmButtonText: 'Okay',
					onClose: listSalary(),
				});
			}
		},
	});
}

function listSalary() {
	$('#list_salary_table').hide();
	$('#list_salary_loader').show();

	let id = window.location.search.split('?')[1];

	axios
		.get(`${apiPath}getUser/${id}`, {
			headers: {
				Authorization: token,
			},
		})
		.then(function(response) {
			let salary_list;
			const { salaryHistory } = response.data.data[0];

			if (salaryHistory.length > 0) {
				$(salaryHistory).map((i, v) => {
					salary_list += `<tr class="even pointer" id="salary_row${v._id}">`;
					salary_list += `<td>${v.amount}</td>`;
					salary_list += `<td>${v.deductables}</td>`;
					salary_list += `<td>${v.salaryMonth}</td>`;
					salary_list += `<td>${v.totalTakeHome}}</td>`;
					// let role_list = $('#does_user_have_roles').html();

					// if (role_list.indexOf('-83-') >= 0 || role_list.indexOf('-58-') >= 0) {
					// 	salary_list += `<td>
					// 	<div class="dropdown">
					// 		<button
					// 			class="btn btn-secondary dropdown-toggle"
					// 			type="button"
					// 			id="dropdownMenuButton1"
					// 			data-toggle="dropdown"
					// 			aria-expanded="false">
					// 			Actions
					// 		</button>
					// 		<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					// 			<li onClick="viewsalary(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-pencil" /> Edit
					// 				</a>
					// 			</li>
					// 			<li onClick="deletesalary(${v.id})">
					// 				<a class="dropdown-item">
					// 					<i class="fa fa-trash" /> Delete
					// 				</a>
					// 			</li>
					// 		</ul>
					// 	</div></td>`;
					// }

					salary_list += `</tr>`;
					salary_list += `<tr id="salary_loader${v._id}" style="display:none;"><td colspan="4"><i class="fa fa-spinner fa-spin fa-fw"></i></tr>`;
				});

				$('#list_salary_body').html(salary_list);
				$('#list_salary_loader').hide();
				$('#list_salary_table').show();
			} else {
				$('#list_salary_body').html(`<tr><td colspan="5">No record</td></tr>`);
				$('#list_salary_loader').hide();
				$('#list_salary_table').show();
			}
		})
		.catch(function(error) {
			console.log(error);

			$('#list_salary_loader').hide();
			$('#list_salary_table').show();
			$('#list_salary_body').html(`<tr><td colspan="5" style="color:red;">Error</td></tr>`);

			// $('#edit_QC_error').html(error);
		})
		.then(function() {
			// always executed
		});
}
