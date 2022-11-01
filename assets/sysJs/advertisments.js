$(document).ready(() => {
    listAds();
    $(document).on('click', '.viewDetails', function () {
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
    $(document).on('click', '.makePayment', function () {
        var id = $(this).attr('id').replace(/pay_/, '');
        $('#payPO').attr('data', id);
        // makePayment(id);
    });

    $(document).on('click', '#addBtn', function () {
        if (isEmptyInput('.classChecker')) {
            addAds();
        }
    });

    $(document).on('click', '.delete', function () {
        var id = $(this).attr('id').replace(/delete_/, '');

        if (confirm('Are you sure you want to delete this record')) {
            deleteCat(id);
        } else {
            return false;
        }
    });
});

function listAds() {
    $('#purchase').hide();
    $('#purchaseLoader').show();
    // $('#departmentLoader').show();
    let datam = JSON.parse(localStorage.getItem('procData'));
    let id = window.location.search.split('?')[1];

    axios
        .get(`${apiPath}ads`, {
            headers: {
                Authorization: token,
            },
        })
        .then(function (response) {
            const { data } = response.data;
            let res = '';



            if (data.length !== 0) {


                data.map((item, indx) => {
                    res += `<tr id="row_${item._id}">`;
                    // res += `<th><input type="checkbox" name="" id="check_${item._id}"></th>`;

                    res += `<td><img width="100" height="50" src="${item.backgroundImage}" alt=""/></td>`;
                    res += `<td>${item.adTitle}</td>`;
                    res += `<td>${item.adOffer}</td>`;
                    res += `<td>${item.adDescription}</td>`;
                    res += `<td><div class="dropdown">
                                <button aria-expanded="false" aria-haspopup="true"
                                    class="btn ripple btn-default" data-toggle="dropdown"
                                    id="dropdownMenuButton" type="button">Action <i
                                        class="fas fa-caret-down ml-1"></i></button>
                                <div class="dropdown-menu tx-13">
                                    <a class="dropdown-item viewDetails" id="view_${item._id}">Details</a>
                                    <a class="dropdown-item makePayment" id="pay_${item._id}" data-target="#modaldemo7" data-toggle="modal">Edit</a>
                                    <a class="dropdown-item delete" style="color: red;" id="delete_${item._id}">Delete</a>
                                </div>
                            </div></td>`;
                    res += `</tr>`;
                    res += `<tr style="display: none;" colspan="4" id="deleteSpinner_${item._id}"><td><div class="spinner-grow text-secondary" role="status">
                                <span class="sr-only">Loading...</span>
                            </div></td</tr>`
                });
            } else {
                res += '<tr colspan="4"><td>No record found</td></tr>';
            }

            $('#purchase').append(res);
            $('#purchaseLoader').hide();
            $('#purchase').show();
        })
        .catch(function (error) {
            console.log(error);
            $('#purchaseLoader').hide();
            $('#purchase').append(`<tr colspan="4"><td>${error.response.statusText}</td></tr>`);
            $('#purchase').show();
        })
        .then(function () {
            // always executed
        });
}

function deleteCat(id) {
    $(`#row_${id}`).hide();
    $(`#deleteSpinner_${id}`).show();

    axios
        .delete(`${apiPath}deleteCat/${id}`, {
            // meetingId and lecture_id
            headers: {
                Authorization: token,
            },

        })
        .then((res) => {
            if (res.data.status === 201 || res.data.status === 200) {
                console.log(`#row_${id}`);
                $(`#row_${id}`).remove();
            } else {
                $(`#row_${id}`).show();
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
            $(`#row_${id}`).show();
            $(`#deleteSpinner_${id}`).hide();
            Swal.fire({
                title: 'Error!',
                text: `Error Deleting Record`,
                icon: 'error',
                confirmButtonText: 'Close',
            });
        })
        .then((res) => { });
}

function getPODetais(id) {
    axios
        .get(`${apiPath}logisticDetails/${id}`, {
            headers: {
                Authorization: token,
            },
        })
        .then(function (response) {
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
        .catch(function (error) {
            console.log(error);
            $('#viewPurchaseLoader').hide();
            $('#viewPurchase').append(`<tr colspan="9"><td>${error.response.statusText}</td></tr>`);
            $('#modaldemo3').modal('show');
        })
        .then(function () {
            // always executed
        });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}


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

function addAds() {
    $('#addBtn').hide();
    $('#addLoader').show();

    let adTitle = $('#adTitle').val();
    let adOffer = $('#adOffer').val();
    let adDescription = $('#adDescription').val();

    axios
        .post(
            `${apiPath}createCategory`,
            {

                adTitle: adTitle,
                adOffer: adOffer,
                adDescription: adDescription,
                backgroundImage: myFile
            },
            {
                headers: {
                    Authorization: token,
                },
            },
        )
        .then(function (response) {

            $('#addLoader').hide();
            $('#addBtn').show();

            Swal.fire({
                title: 'Success',
                text: `Ads record creation successful`,
                icon: 'success',
                confirmButtonText: 'Okay',
                onClose: listAds(),
            });
            $('.classChecker').val('');
        })
        .catch(function (error) {
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

