
class EmployeesTable {

  

    constructor() {
        this.initDTtable();
        this.bindListners();
    }

    initDTtable() {

            $('#employeeTable').DataTable({
                ajax: {
                    url: '/employee/get',
                    headers: { 'X-AT-SessionToken': localStorage.sessionToken }, 
                    dataSrc: 'data',
                    type: 'GET',
                },
                columns: [
                    { data: 'id', title: "Employee ID" },
                    {data:'image', title: "Image",
                        render: (data, type, full) => {
                            return `<img src="${data}" alt="Employee Image" width="100" height="100"/>`
                        }
                    },
                    { data: 'name', title: "Name" },
                    { data: 'email', title: "Email" },
                    { data: 'mobile', title: "Mobile No" },
                    { data: 'designation', title: "Designation" },
                    { data: 'gender', title: "Gender" },
                    { data: 'course', title: "Course" },
                    { data: 'createdate', title: "Create Date",
                        render: (data) => {
                            return moment(data).format('DD-MM-YYYY hh:mm A');
                        }
                     },
                    {
                        data: null, 
                        title: "Actions",
                        render: function (data, type, full) {
                            let buttons = '';
                            buttons +='<button class="btn btn-primary btn-sm update">Edit</button>';
                            buttons += ' <a data-id="' + full.id + '" class="delete btn btn-danger btn-sm" >Delete</a>'
                            return buttons;
                    }
                    }
                ]
            });
    }

    async addUser(e) {
        e.preventDefault();
        
        const saveButton = document.getElementById('saveAddUser');
        saveButton.innerHTML = 'Saving...'; 
        saveButton.disabled = true;
        
        const formData = new FormData(e.target);

        const response = await fetch('/employee/add', {
            method: 'POST',
            body: formData,
            headers: {
                'X-AT-SessionToken': localStorage.sessionToken
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json(); 

        if (responseData.success === true) {
            // Handle successful response
            $('#employeeTable').DataTable().ajax.reload();
            $('#addUserModal').modal('hide');   
            document.getElementById('addUserForm').reset();
            saveButton.innerHTML = 'Save'; 
            saveButton.disabled = false; 
        } else {
            alert(responseData.error || 'Error saving data');
            $('#saveAddUser').prop('disabled', false);
        }   
    }
        
    displayUpdateTransaction() {
        const clickedRow = $(this).closest('tr');
        const rowData = $('#employeeTable').DataTable().row(clickedRow).data();
        console.log(rowData.name);
        $('#editUserForm #updateName').val(rowData.name);
        $('#editUserForm #updateEmail').val(rowData.email);
        $('#editUserForm #updateMobile').val(rowData.mobile);
        $('#editUserForm #updateDesignation').val(rowData.designation);
        $('#editUserForm #updateGender').val(rowData.gender)
        $(`#editUserForm input[name="course"][value="${rowData.course}"]`).prop('checked', true);
        $('#editUserForm #id').val(rowData.id)
        $('#editUserModal').modal('show');
    }

    updateTransaction(e) {
        e.preventDefault();
        const saveButton = document.getElementById('saveEditUser');
        saveButton.innerHTML = 'Saving...'; 
        saveButton.disabled = true;
        $.ajax({
            type: 'PUT',
            url: '/employee/update/' + $('#editUserForm #id').val(),
            data: $('#editUserForm').serialize(),
            headers: { 'X-AT-SessionToken': localStorage.sessionToken }
        }).done(function (response) {
            if (response.success === true) {
                $('#employeeTable').DataTable().ajax.reload();
                $('#editUserModal').modal('hide');   
                saveButton.innerHTML = 'Save'; 
                saveButton.disabled = false;
            } else {
                alert(response.error || 'Error saving data');
                saveButton.innerHTML = 'Save'; 
                saveButton.disabled = false;
            };
        });
    }

    deleteTransaction() {
        const clickedRow = $(this).closest('tr');
        const rowData = $('#employeeTable').DataTable().row(clickedRow).data();
        var answer = window.confirm("are you sure to delete?");
        if (answer) {
            $.ajax({
                type: 'DELETE',
                url: '/employee/delete/' + rowData.id,
                headers: { 'X-AT-SessionToken': localStorage.sessionToken }
            }).done(function (response) {
                if (response.success === true) {
                    alert('Deleted')
                    $('#employeeTable').DataTable().ajax.reload();
                } else {
                    alert(response.error || 'Error saving data');
                };
            });
        }
        else {
            //some code
        }
    }

    bindListners() {
        document.querySelector('#addUserForm').addEventListener('submit', this.addUser);
        document.querySelector('#editUserForm').addEventListener('submit', this.updateTransaction);
        $('#employeeTable tbody').on('click', '.update', this.displayUpdateTransaction);
        $('#employeeTable tbody').on('click', '.delete', this.deleteTransaction);
    }
}

EmployeesTable = new EmployeesTable();