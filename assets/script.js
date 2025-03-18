document.addEventListener("DOMContentLoaded", function () {
  console.log("Welcome to CRUD Plugin of Employees");

  // Add Form Validation
  const frmAddEmployee = document.getElementById("frm_add_employee");
  if (frmAddEmployee) {
      frmAddEmployee.addEventListener("submit", function (event) {
          event.preventDefault();

          const formdata = new FormData(this);

// wce_object.ajax_url contains the URL (usually admin-ajax.php in WordPress) to which the request is sent. 
// This URL handles AJAX requests in WordPress.
          fetch(wce_object.ajax_url, {
              method: "POST",
              body: formdata,
          })
              .then((response) => response.json())
              .then((data) => {
                  if (data.status) {
                      alert(data.message);
                      setTimeout(() => {
                          location.reload();
                      }, 1500);
                  }
              });
      });
  }

  // Render Employees
  loadEmployeeData();

  // Delete Function
  document.addEventListener("click", function (event) {
      if (event.target.classList.contains("btn_delete_employee")) {
          const employeeId = event.target.getAttribute("data-id");

          if (confirm("Are you sure want to delete")) {
              fetch(`${wce_object.ajax_url}?action=wce_delete_employee&empId=${employeeId}`, {
                  method: "GET",
              })
                  .then((response) => response.json())
                  .then((data) => {
                      if (data) {
                          alert(data.message);
                          setTimeout(() => {
                              location.reload();
                          }, 500);
                      }
                  });
          }
      }
  });

  // Open Add Employee Form
  const btnOpenAddEmployeeForm = document.getElementById("btn_open_add_employee_form");
  if (btnOpenAddEmployeeForm) {
      btnOpenAddEmployeeForm.addEventListener("click", function () {
          document.querySelector(".add_employee_form").classList.toggle("hide_element");
          this.classList.add("hide_element");
      });
  }

  // Close Add Employee Form
  const btnCloseAddEmployeeForm = document.getElementById("btn_close_add_employee_form");
  if (btnCloseAddEmployeeForm) {
      btnCloseAddEmployeeForm.addEventListener("click", function () {
          document.querySelector(".add_employee_form").classList.toggle("hide_element");
          btnOpenAddEmployeeForm.classList.remove("hide_element");
      });
  }

  // Open Edit Layout
  document.addEventListener("click", function (event) {
      if (event.target.classList.contains("btn_edit_employee")) {
          document.querySelector(".edit_employee_form").classList.remove("hide_element");
          btnOpenAddEmployeeForm.classList.add("hide_element");

          const employeeId = event.target.getAttribute("data-id");

          fetch(`${wce_object.ajax_url}?action=wce_get_employee_data&empId=${employeeId}`, {
              method: "GET",
          })
              .then((response) => response.json())
              .then((data) => {
                  document.getElementById("employee_name").value = data?.data?.name || "";
                  document.getElementById("employee_email").value = data?.data?.email || "";
                  document.getElementById("employee_designation").value = data?.data?.designation || "";
                  document.getElementById("employee_id").value = data?.data?.id || "";
                  document.getElementById("employee_profile_icon").setAttribute("src", data?.data?.profile_image || "");

              });
      }
  });
 
  // Close Edit Layout
  const btnCloseEditEmployeeForm = document.getElementById("btn_close_edit_employee_form");
  if (btnCloseEditEmployeeForm) {
      btnCloseEditEmployeeForm.addEventListener("click", function () {
          document.querySelector(".edit_employee_form").classList.toggle("hide_element");
          btnOpenAddEmployeeForm.classList.remove("hide_element");
      });
  }

  // Submit Edit Form
  const frmEditEmployee = document.getElementById("frm_edit_employee");
  if (frmEditEmployee) {
      frmEditEmployee.addEventListener("submit", function (event) {
          event.preventDefault();

          const formdata = new FormData(this);

          fetch(wce_object.ajax_url, {
              method: "POST",
              body: formdata,
          })
              .then((response) => response.json())
              .then((data) => {
                  if (data) {
                      alert(data.message);
                      setTimeout(() => {
                          location.reload();
                      }, 1500);
                  }
              });
      });
  }
});

// Load All Employees From DB Table
function loadEmployeeData() {
  fetch(`${wce_object.ajax_url}?action=wce_load_employees_data`, {
      method: "GET",
  })
      .then((response) => response.json())
      .then((data) => {
          let employeesDataHTML = "";

          data.employees.forEach((employee) => {
              const employeeProfileImage = employee.profile_image
                  ? `<img src="${employee.profile_image}" height="80px" width="80px"/>`
                  : "--";

              employeesDataHTML += `
                  <tr>
                      <td>${employee.id}</td>
                      <td>${employee.name}</td>
                      <td>${employee.email}</td>
                      <td>${employee.designation}</td>
                      <td>${employeeProfileImage}</td>
                      <td>
                          <button data-id="${employee.id}" class="btn_edit_employee">Edit</button>
                          <button data-id="${employee.id}" class="btn_delete_employee">Delete</button>
                      </td>
                  </tr>
              `;
          });

          document.getElementById("employees_data_tbody").innerHTML = employeesDataHTML;
      });
}
