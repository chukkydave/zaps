$(document).ready(() => {
	$('#addBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			addStaff();
		}
	});
	$('#cancel').on('click', () => {
		$('.classChecker').val('');
	});
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
				// onClose: redirect('dashboard.html'),
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
