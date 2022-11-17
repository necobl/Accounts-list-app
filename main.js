let allLink = document.querySelectorAll('.nav-link');
let accountsView = document.querySelector('#accounts_view');
let addAccountView = document.querySelector('#add_account_view');
let views = document.querySelectorAll('.view');
let accountsMode = 0;
let idAccount = 0;
let nameInput = document.querySelector('[placeholder="name"]');
let lastnameInput = document.querySelector('[placeholder="lastname"]');
let emailInput = document.querySelector('[placeholder="email"]');
let phoneInput = document.querySelector('[placeholder="phone"]');
let saveBtn = document.querySelector('#save');
let accountsHeading = document.querySelector('.accounts-heading');
let selectedID = 0;
const btnAddAccount = document.querySelector('#nav_add_account_view');
const btnConfrimDelete = document.querySelector('.delete-confirmed');
const modalConfirmDelete = new bootstrap.Modal(document.querySelector('.confirm-delete'));
const modalSucces = new bootstrap.Modal(document.querySelector('.success-modal'));
const modalError = new bootstrap.Modal(document.querySelector('.error-modal'));

btnAddAccount.addEventListener('click', function (e) {
    accountsHeading.innerText = "Add accounts"
    e.preventDefault();
    accountsMode = 1;
    nameInput.value = "";
    lastnameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    nameInput.classList.remove("is-invalid");
    lastnameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");
    phoneInput.classList.remove("is-invalid");
    showView("#add_account_view")

})

saveBtn.addEventListener('click', function () {


    let nameValue = nameInput.value.trim();
    let lastnameValue = lastnameInput.value.trim();
    let emailValue = emailInput.value.trim();
    let phoneValue = phoneInput.value.trim();
    let formValid = true;
    const validateEmail = (emailValue) => {
        return String(emailValue)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePhoneNumber = (phoneValue) => {
        return String(phoneValue)
            .match(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,4}$/im
            );
    }

    if (!nameValue.length) {
        nameInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!lastnameValue.length) {
        lastnameInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!validateEmail(emailValue)) {
        emailInput.classList.add("is-invalid");
        formValid = false;
    }
    if (!validatePhoneNumber(phoneValue)) {
        phoneInput.classList.add("is-invalid");
        formValid = false;
    }

    if (formValid) {
        if (accountsMode === 1) {


            const newAccount = {
                name: nameValue,
                lastname: lastnameValue,
                email: emailValue,
                phone: phoneValue
            }

            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/users", true);
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhttp.send(JSON.stringify(newAccount));
            xhttp.onload = function () {
                if (xhttp.status === 201) {
                    createAccountsTable();
                    modalSucces.show();
                    setTimeout(function () { modalSucces.hide(); }, 2000);
                    showView("#accounts_view");

                }
                if (xhttp.status === 400 || this.status == 500) {
                    modalError.show();
                    setTimeout(function () { modalSucces.hide(); }, 2000);
                    showView("#accounts_view");
                }
            }
        }
        else if (accountsMode === 2) {

            const editedAccount = {
                id: selectedID,
                name: nameValue,
                lastname: lastnameValue,
                email: emailValue,
                phone: phoneValue
            }

            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    createAccountsTable();
                    modalSucces.show();
                    setTimeout(function () { modalSucces.hide(); }, 2000);
                    showView("#accounts_view");
                }
                if (xhttp.status === 400 || this.status == 500) {
                    modalError.show();
                    setTimeout(function () { modalSucces.hide(); }, 2000);
                    showView("#accounts_view");
                }

            }
            xhttp.open("PUT", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/users/" + selectedID, true);
            xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
            xhttp.send(JSON.stringify(editedAccount));
        }

    }

});

createAccountsTable();

for (let i = 0; i < allLink.length; i++) {
    allLink[i].addEventListener('click', showView);

}
function showView(e) {

    views.forEach(e => e.style.display = "none")
    if (e instanceof Event) {
        e.preventDefault();
        let id = `#${this.getAttribute("href")}`;
        document.querySelector(id).style.display = "block";
    } else {
        document.querySelector(e).style.display = "block";
    }

}

function createAccountsTable() {

    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);

            class Pagination {
                constructor() {

                    let prevButton = document.getElementById('button_prev');
                    let nextButton = document.getElementById('button_next');

                    let current_page = 1;
                    let records_per_page = 30;
                    this.init = function () {
                        changePage(1);
                        pageNumbers();
                        selectedPage();
                        clickPage();
                        addEventListeners();
                    };

                    let addEventListeners = function () {
                        prevButton.addEventListener('click', prevPage);
                        nextButton.addEventListener('click', nextPage);
                    };

                    let selectedPage = function () {
                        let page_number = document.getElementById('page_number').getElementsByClassName('clickPageNumber');
                        for (let i = 0; i < page_number.length; i++) {
                            if (i == current_page - 1) {
                                page_number[i].classList.add("active");
                            }
                            else {
                                page_number[i].classList.remove("active");;
                            }
                        }
                    };

                    let showPageNumberOf = function () {
                        var showingItems = document.getElementById("showing_items");
                        var items_per_page = records_per_page - 1;
                        var firstNumberInfo = records_per_page * current_page;
                        var firstNumberInfoTotal = firstNumberInfo - items_per_page;
                        current_page == 1 ? showingItems.innerText = "Showing " + current_page + " to " + records_per_page * current_page + " of " + obj.length + " entries" : showingItems.innerText = "Showing " + firstNumberInfoTotal + " - " + records_per_page * current_page + " of " + obj.length + " entries";
                    };

                    let changePage = function (page) {
                        const listingTable = document.getElementById('accounts_table_body');

                        if (page < 1) {
                            page = 1;
                        }
                        if (page > (numPages() - 1)) {
                            page = numPages();
                        }

                        listingTable.innerHTML = "";

                        for (var i = (page - 1) * records_per_page; i < (page * records_per_page) && i < obj.length; i++) {
                            let numAccounts = i + 1;
                            listingTable.innerHTML += "<tr>" +
                                "<td>" + numAccounts + "</td>" +
                                "<td>" + obj[i].name + "</td>" +
                                "<td>" + obj[i].lastname + "</td>" +
                                "<td>" + obj[i].email + "</td>" +
                                "<td>" + obj[i].phone + "</td >" +
                                "<td><button onclick='editAccount(this)' data-id=" + obj[i].id + " class='btn btn-sm btn-warning edit-btn'>Edit</button></td>" +
                                "<td><button onclick='deviceDeleteBtnClickHandler(this)' data-id=" + obj[i].id + " class='btn btn-sm btn-danger delete-btn'>Delete</button></td>" +
                                "</tr>";

                        }
                        showPageNumberOf();
                        selectedPage();
                    };

                    let prevPage = function () {
                        if (current_page > 1) {
                            current_page--;
                            changePage(current_page);
                        }
                    };

                    let nextPage = function () {
                        if (current_page < numPages()) {
                            current_page++;
                            changePage(current_page);
                        }
                    };

                    let clickPage = function () {
                        document.addEventListener('click', function (e) {
                            if (e.target.nodeName == "BUTTON" && e.target.classList.contains("clickPageNumber")) {
                                current_page = e.target.textContent;
                                changePage(current_page);
                                window.scrollTo(0, 0);

                            }
                        });
                    };
                    let numPages = function () {
                        return Math.ceil(obj.length / records_per_page);
                    };

                    let pageNumbers = function () {
                        let pageNumber = document.getElementById('page_number');
                        pageNumber.innerHTML = "";

                        for (let i = 1; i < numPages() + 1; i++) {
                            pageNumber.innerHTML += "<button type='button' class='btn btn-outline-primary clickPageNumber'>" + i + "</button>";
                        }
                    };



                }
            }



            let pagination = new Pagination();
            pagination.init();
        }
    }
    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/users", true);
    xhttp.send();
}



function editAccount(e) {
    accountsHeading.innerText = "Edit accounts"
    accountsMode = 2;
    selectedID = e.getAttribute('data-id');
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let obj = JSON.parse(this.responseText);
            console.log(obj);
            nameInput.value = obj.name;
            lastnameInput.value = obj.lastname;
            emailInput.value = obj.email;
            phoneInput.value = obj.phone;
            nameInput.classList.remove("is-invalid");
            lastnameInput.classList.remove("is-invalid");
            emailInput.classList.remove("is-invalid");
            phoneInput.classList.remove("is-invalid");
            showView("#add_account_view");
        }
    }
    xhttp.open("GET", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/users/" + selectedID, true);
    xhttp.send();
}
// Delete account
btnConfrimDelete.addEventListener('click', deleteAccount)


function deviceDeleteBtnClickHandler(e) {
    selectedID = e.getAttribute('data-id');
    modalConfirmDelete.show()
};

function deleteAccount() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            createAccountsTable();
            modalConfirmDelete.hide()
            modalSucces.show();
            setTimeout(function () { modalSucces.hide(); }, 2000);
        }
        if (xhttp.status === 400 || this.status == 500) {
            modalError.show();
            setTimeout(function () { modalSucces.hide(); }, 2000);
        }
    }
    xhttp.open("DELETE", "https://6183bc8b91d76c00172d1af0.mockapi.io/products/users/" + selectedID, true);
    xhttp.send();
}