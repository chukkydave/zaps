$(document).ready(() => {
	$('#loginBtn').on('click', () => {
		if (isEmptyInput('.classChecker')) {
			login();
		}
	});
	const token = getCookie('procToken');

	if (token) {
		window.location = window.location.origin + '/dashboard.html';
	}
});

function login() {
	$('#loginBtn').hide();
	$('#loginLoader').show();

	let email = $('#email').val();
	let password = $('#password').val();

	axios
		.post(`${apiPath}login`, {
			email: email,
			password: password,
		})
		.then(function(response) {
			$('#loginLoader').hide();
			$('#loginBtn').show();

			const { email, name, profilePic, _id} = response.data.data;

			let date = new Date();
			date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
			const expires = 'expires=' + date.toUTCString();
			document.cookie = `procToken=${response.data.token};path=/;${expires}`;

			let obj = {
				_id: _id,
				name: name,
				email: email,
				profilePic: profilePic,
			};

			localStorage.setItem('procData', JSON.stringify(obj));

			Swal.fire({
				title: 'Success',
				text: `Logging In`,
				icon: 'success',
				confirmButtonText: 'Okay',
				onClose: redirect('dashboard.html'),
			});
			$('#loginLoader').hide();
			$('#loginBtn').hide();
		})
		.catch(function(error) {
			console.log(error.response);
			$('#loginLoader').hide();
			$('#loginBtn').show();
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

let username = 'Max Brown';

// Set a Cookie
function setCookie(cName, cValue, expDays) {
	let date = new Date();
	date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
	const expires = 'expires=' + date.toUTCString();
	document.cookie = cName + '=' + cValue + '; ' + expires + '; path=/';
}

// Apply setCookie
// setCookie('username', username, 30);

function getCookie(cName) {
	const name = cName + '=';
	const cDecoded = decodeURIComponent(document.cookie); //to be careful
	const cArr = cDecoded.split('; ');
	let res;
	cArr.forEach((val) => {
		if (val.indexOf(name) === 0) res = val.substring(name.length);
	});
	return res;
}
