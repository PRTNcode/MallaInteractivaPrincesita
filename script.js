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

const checkSound = new Audio('check.mp3');
const uncheckSound = new Audio('uncheck.mp3');

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
                subject.classList.remove("approved");
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

function updateSemesterCompletion() {
    document.querySelectorAll('.semester').forEach(semester => {
        const subjects = semester.querySelectorAll('.subject');
        const approvedSubjects = semester.querySelectorAll('.subject.approved');
        const allSubjectsCount = subjects.length;
        const approvedCount = approvedSubjects.length;

        if (approvedCount === allSubjectsCount && allSubjectsCount > 0) {
            semester.classList.add('completed');
        } else {
            semester.classList.remove('completed');
        }
    });
}

function updateProgressBar() {
    const totalSubjects = document.querySelectorAll('.subject').length;
    const approvedSubjects = document.querySelectorAll('.subject.approved').length;
    const progressPercentage = (approvedSubjects / totalSubjects) * 100;

    const progressFill = document.querySelector('.progress-fill');
    progressFill.style.width = `${progressPercentage}%`;
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");
    if (container) container.scrollLeft = 0;

    document.querySelectorAll(".subject").forEach(subject => {
        subject.addEventListener("click", function () {
            if (subject.classList.contains("locked")) return;

            subject.classList.toggle("approved");

            if (subject.classList.contains("approved")) {
                checkSound.currentTime = 0;
                checkSound.play();
            } else {
                uncheckSound.currentTime = 0;
                uncheckSound.play();
            }

            saveProgress();
            updatePrerequisites();
            updateSemesterCompletion();
            updateProgressBar();
        });
    });

    loadProgress();
    updatePrerequisites();
    updateSemesterCompletion();
    updateProgressBar();
});
