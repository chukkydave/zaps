$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addStaff();
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

	listEmployees();
});

function addStaff() {
	$('#addBtn').hide();
	$('#addLoader').show();

	let email = $('#email').val();
	let firstname = $('#firstname').val();
	let lastname = $('#lastname').val();

	axios
		.post(
			`${apiPath}register`,
			{
				email: email,
				firstName: firstname,
				lastName: lastname,
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
				text: `A confirmation email has been sent to the user`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: listEmployees(),
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
			let res = '';

			if (data.length !== 0) {
				if (page == 1 || page == '') {
					var k = 1;
				} else {
					var k = page * limit - limit + 1;
				}
				data.map((item, indx) => {
					res += `<tr id="row_${item._id}">`;
					// res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;
					res += `<td>${k++}</td>`;
					res += `<td><img style="height:37px; width:37px; border-radius:50%;" alt="" src="${item.profilePic}"></td>`;
					res += `<td>${item.firstName}</td>`;
					res += `<td>${item.lastName}</td>`;
					res += `<td>${item.email}</td>`;


						datam.adminRole ? (res += `<td><div class="dropdown">
                                                    <button aria-expanded="false" aria-haspopup="true"
                                                        class="btn ripple btn-default" data-toggle="dropdown"
                                                        id="dropdownMenuButton" type="button">Action <i
                                                            class="fas fa-caret-down ml-1"></i></button>
                                                    <div class="dropdown-menu tx-13">
                                                        <a class="dropdown-item infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                                        <!--<a class="dropdown-item" style="color: green;">Activate</a>-->
                                                        <a class="dropdown-item" style="color: orange;">Deactivate</a>
                                                        <a class="dropdown-item" style="color: red;">Delete</a>
                                                    </div>
                                                </div></td>`) :
						`<td><div class="dropdown">
                                                    <button aria-expanded="false" aria-haspopup="true"
                                                        class="btn ripple btn-default" data-toggle="dropdown"
                                                        id="dropdownMenuButton" type="button">Action <i
                                                            class="fas fa-caret-down ml-1"></i></button>
                                                    <div class="dropdown-menu tx-13">
                                                        <a class="dropdown-item infoe" id="info_${item._id}" style="color: blue;">Info</a>
                                                    </div>
                                                </div></td>`;

					res += `</tr>`;
				});
			} else {
				res += '<tr colspan="5"><td>No record found</td></tr>';
			}

			$('#listEmployee').append(res);
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
