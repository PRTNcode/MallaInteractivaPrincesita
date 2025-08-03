const prerequisites = {
    "derecho-civil-1": ["intro-derecho-civil"],
    "derecho-economico-2": ["derecho-economico-1"],
    "historia-constitucional": ["derecho-politico"],
    "derecho-civil-2": ["derecho-civil-1"],
    "derecho-procesal-2": ["derecho-procesal-1"],
    "derecho-constitucional-1": ["historia-constitucional"],
    "derecho-civil-3": ["derecho-civil-2"],
    "derecho-procesal-3": ["derecho-procesal-2"],
    "derecho-penal-1": ["derecho-procesal-2"],
    "derecho-constitucional-2": ["derecho-constitucional-1"],
    "derecho-civil-4": ["derecho-civil-3"],
    "derecho-procesal-4": ["derecho-procesal-3"],
    "derecho-penal-2": ["derecho-penal-1"],
    "derecho-administrativo": ["derecho-constitucional-2"],
    "derecho-civil-5": ["derecho-civil-4"],
    "derecho-procesal-5": ["derecho-procesal-4"],
    "derecho-penal-3": ["derecho-penal-2"],
    "derecho-economico-3": ["derecho-economico-2"],
    "derecho-civil-6": ["derecho-civil-5"],
    "derecho-procesal-6": ["derecho-procesal-5"],
    "derecho-del-trabajo": ["derecho-civil-3", "derecho-procesal-3"],
    "derecho-tributario": ["derecho-economico-3"],
    "derecho-civil-7": ["derecho-civil-6"],
    "derecho-seguridad-social": ["derecho-del-trabajo"],
    "seminario-integrativo-1": ["derecho-administrativo", "derecho-civil-5"],
    "clinica-juridica-1": ["derecho-civil-6", "derecho-procesal-5"],
    "seminario-integrativo-2": ["seminario-integrativo-1"],
    "clinica-juridica-2": ["clinica-juridica-1"]
};

function updatePrerequisites() {
    document.querySelectorAll(".subject").forEach(subject => {
        const id = subject.dataset.id;
        if (prerequisites[id]) {
            const unlocked = prerequisites[id].every(reqId =>
                document.querySelector(`.subject[data-id='${reqId}']`)?.classList.contains("approved")
            );
            if (unlocked) {
                subject.classList.remove("locked");
            } else {
                subject.classList.add("locked");
                subject.classList.remove("approved"); // Evitar aprobado si está bloqueado
            }
        }
    });
}

function saveProgress() {
    const approvedSubjects = [];
    document.querySelectorAll(".subject.approved").forEach(subject => {
        approvedSubjects.push(subject.dataset.id);
    });
    localStorage.setItem("mallaProgress", JSON.stringify(approvedSubjects));
}

function loadProgress() {
    const approvedSubjects = JSON.parse(localStorage.getItem("mallaProgress")) || [];
    approvedSubjects.forEach(id => {
        const subject = document.querySelector(`.subject[data-id='${id}']`);
        if (subject) subject.classList.add("approved");
    });
}

// NUEVA función para mostrar confetti explosión
function showConfettiExplosion() {
    const confetti = document.createElement("img");
    confetti.src = "https://i.imgur.com/FouEWMr.gif";
    confetti.classList.add("confetti-explosion");
    document.body.appendChild(confetti);

    setTimeout(() => {
        confetti.remove();
    }, 3000);
}

function checkSemesterCompletion() {
    const cycles = document.querySelectorAll(".cycle");
    cycles.forEach(cycle => {
        const semesters = cycle.querySelectorAll(".semester");
        semesters.forEach(semester => {
            const subjects = semester.querySelectorAll(".subject:not(.locked)");
            if (subjects.length > 0 && [...subjects].every(subj => subj.classList.contains("approved"))) {
                // Si todas las asignaturas del semestre están aprobadas y no está bloqueado
                if (!semester.classList.contains("celebrated")) {
                    semester.classList.add("celebrated");
                    showConfettiExplosion();
                }
            } else {
                semester.classList.remove("celebrated");
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Forzar scroll inicial a la izquierda
    const container = document.querySelector(".container");
    if (container) container.scrollLeft = 0;

    document.querySelectorAll(".subject").forEach(subject => {
        subject.addEventListener("click", function () {
            if (subject.classList.contains("locked")) return;
            subject.classList.toggle("approved");
            saveProgress();
            updatePrerequisites();
            checkSemesterCompletion(); // Revisa y muestra confetti si aplica
        });
    });

    loadProgress();
    updatePrerequisites();
    checkSemesterCompletion(); // Al cargar, revisar si ya hay semestres completos
});
