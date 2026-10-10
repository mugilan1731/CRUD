const form = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const nameInput = document.getElementById("studentName");
const emailInput = document.getElementById("studentEmail");
const courseInput = document.getElementById("studentCourse");

const tableBody = document.getElementById("studentTableBody");
const emptyMessage = document.getElementById("emptyMessage");
const recordCount = document.getElementById("recordCount");
const formTitle = document.getElementById("formTitle");
const saveButton = document.getElementById("saveButton");
const cancelButton = document.getElementById("cancelButton");
const message = document.getElementById("message");

let students = JSON.parse(localStorage.getItem("magnusStudents")) || [];

function saveToStorage() {
    localStorage.setItem("magnusStudents", JSON.stringify(students));
}

function showMessage(text) {
    message.textContent = text;
}

function renderStudents() {
    tableBody.replaceChildren();

    students.forEach(function(student) {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = student.id;

        const nameCell = document.createElement("td");
        nameCell.textContent = student.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = student.email;

        const courseCell = document.createElement("td");
        courseCell.textContent = student.course;

        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit";
        editButton.dataset.action = "edit";
        editButton.dataset.id = student.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = student.id;

        actionCell.append(editButton, deleteButton);
        row.append(idCell, nameCell, emailCell, courseCell, actionCell);
        tableBody.appendChild(row);
    });

    recordCount.textContent = "Total: " + students.length;
    emptyMessage.hidden = students.length > 0;
}

function resetForm() {
    form.reset();
    studentIdInput.value = "";
    formTitle.textContent = "Add Student";
    saveButton.textContent = "Add Student";
    cancelButton.hidden = true;
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const course = courseInput.value.trim();
    const editingId = studentIdInput.value;

    if (!name || !email || !course) {
        showMessage("Please fill in all fields.");
        return;
    }

    if (editingId) {
        // UPDATE
        const student = students.find(function(item) {
            return String(item.id) === editingId;
        });

        if (student) {
            student.name = name;
            student.email = email;
            student.course = course;
            showMessage("Student updated successfully.");
        }
    } else {
        // CREATE
        const newStudent = {
            id: Date.now(),
            name: name,
            email: email,
            course: course
        };

        students.push(newStudent);
        showMessage("Student added successfully.");
    }

    saveToStorage();
    renderStudents();
    resetForm();
});

tableBody.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") {
        // READ one record for editing
        const student = students.find(function(item) {
            return String(item.id) === id;
        });

        if (!student) {
            return;
        }

        studentIdInput.value = student.id;
        nameInput.value = student.name;
        emailInput.value = student.email;
        courseInput.value = student.course;

        formTitle.textContent = "Update Student";
        saveButton.textContent = "Save Changes";
        cancelButton.hidden = false;
        showMessage("Edit the details and click Save Changes.");
        form.scrollIntoView({ behavior: "smooth" });
    }

    if (action === "delete") {
        // DELETE
        const confirmed = confirm("Are you sure you want to delete this student?");

        if (!confirmed) {
            return;
        }

        students = students.filter(function(item) {
            return String(item.id) !== id;
        });

        saveToStorage();
        renderStudents();
        showMessage("Student deleted successfully.");

        if (studentIdInput.value === id) {
            resetForm();
        }
    }
});

cancelButton.addEventListener("click", function() {
    resetForm();
    showMessage("Edit cancelled.");
});

// READ all records on page load
renderStudents();