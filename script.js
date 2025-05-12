var count = 0;
var students = [];
var global_id;

const ctx = document.getElementById('gpaChart').getContext('2d');
const canvas = ctx.canvas;
canvas.style.width = '100%';
canvas.style.height = '100%';
const dpr = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * dpr;
canvas.height = canvas.clientHeight * dpr;
ctx.scale(dpr, dpr);

const gpaChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Array.from({ length: 11 }, (_, i) => i.toString()),
        datasets: [{
            label: 'Number of Students',
            data: Array(11).fill(0),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: { beginAtZero: true }
        }
    }
});

function updateChartData(gpa) {
    if (gpa >= 0 && gpa <= 10) {
        gpaChart.data.datasets[0].data[gpa]++;
        gpaChart.update();
    }
}

function addStudent() {
    const nameValue = document.getElementById('name').value;
    const emailValue = document.getElementById('email').value;
    const semesterValue = document.getElementById('semester').value;
    const gradeValue = document.getElementById('grade').value;
    const degreeValue = document.getElementById('degree').value;

    if (document.querySelector("#submit").innerText == "Edit Student") {
        let index;
        for (let i = 0; i < students.length; i++) {
            if (students[i]['ID'] == global_id) {
                index = i;
                break;
            }
        }
        let studentobj = students[index];
        studentobj['name'] = nameValue;
        studentobj['email'] = emailValue;
        studentobj['grade'] = gradeValue;
        studentobj['semester'] = semesterValue;
        studentobj['degree'] = degreeValue;
        students[index] = studentobj;
        showTable();
        document.querySelector("#submit").innerHTML = "Add Student";
        clearForm();
        return;
    }

    if (!nameValue || !emailValue || !semesterValue || !gradeValue || !degreeValue) {
        alert("All fields are required!");
        return;
    }

    count++;
    students.push({
        ID: count,
        name: nameValue,
        email: emailValue,
        semester: semesterValue,
        grade: gradeValue,
        degree: degreeValue
    });

    clearForm();
    showTable();
    updateChartData(gradeValue);
}

function clearForm() {
    document.getElementById('name').value = "";
    document.getElementById('email').value = "";
    document.getElementById('semester').value = "";
    document.getElementById('grade').value = "";
    document.getElementById('degree').value = "";
}

function showTable() {
    const table = document.getElementById('tbody');
    table.innerHTML = '';
    students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.ID}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.semester}</td>
            <td>${student.grade}</td>
            <td><div class='degree'><div>${student.degree}</div>
                <div class="icons">
                    <a onClick="edit(${student.ID})" class='fa'>&#xf044;</a>
                    <a onClick="del(${student.ID})" class='fa'>&#xf1f8;</a>
                </div></div>
            </td>`;
        table.appendChild(row);
    });
}

function search() {
    let filter = document.getElementById("search").value.toUpperCase();
    let tr = document.getElementById("tbody").getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        let name = tr[i].getElementsByTagName("td")[1];
        let email = tr[i].getElementsByTagName("td")[2];
        let semester = tr[i].getElementsByTagName("td")[3];
        let degree = tr[i].getElementsByTagName("td")[5];

        if (
            (name && name.innerText.toUpperCase().includes(filter)) ||
            (degree && degree.innerText.toUpperCase().includes(filter)) ||
            (semester && semester.innerText.toUpperCase().includes(filter))
        ) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function edit(id) {
    let student = students.find(s => s.ID === id);
    if (student) {
        document.getElementById("name").value = student.name;
        document.getElementById("email").value = student.email;
        document.getElementById("grade").value = student.grade;
        document.getElementById("semester").value = student.semester;
        document.getElementById("degree").value = student.degree;
        document.getElementById("submit").innerText = "Edit Student";
        global_id = id;
    }
}

function del(id) {
    students = students.filter(student => student.ID !== id);
    showTable();
}

function exportTableToExcel() {
    let table = document.getElementById("table");
    let wb = XLSX.utils.table_to_book(table, { sheet: "Students" });
    XLSX.writeFile(wb, "students.xlsx");
}
