// ===============================
// 🦋 PROYECTO MARIPOSA
// Gym + registro por fecha
// ===============================

const workouts = {
    lunes: {
        name: "Glúteo + Femoral",
        exercises: [
            ["Hip Thrust", 4, 12],
            ["Peso muerto rumano", 3, 12],
            ["Curl femoral", 3, 15],
            ["Patada de glúteo", 3, 15],
            ["Abducción", 3, 20]
        ]
    },

    martes: {
        name: "Espalda + Bíceps + Abdomen",
        exercises: [
            ["Jalón al pecho", 4, 12],
            ["Remo sentado", 3, 12],
            ["Remo unilateral", 3, 10],
            ["Face Pull", 3, 15],
            ["Curl de bíceps", 3, 12],
            ["Curl martillo", 3, 12]
        ]
    },

    miercoles: {
        name: "Cuádriceps + Glúteo",
        exercises: [
            ["Sentadilla", 4, 12],
            ["Prensa", 4, 12],
            ["Extensión de cuádriceps", 3, 15],
            ["Zancadas", 3, 12],
            ["Abducción", 3, 20]
        ]
    },

    jueves: {
        name: "Hombros + Tríceps",
        exercises: [
            ["Press militar", 4, 10],
            ["Elevaciones laterales", 4, 15],
            ["Elevaciones frontales", 3, 12],
            ["Pájaros", 3, 15],
            ["Tríceps en polea", 3, 15],
            ["Extensión de tríceps", 3, 12]
        ]
    },

    viernes: {
        name: "Glúteo completo",
        exercises: [
            ["Hip Thrust", 5, 10],
            ["Sentadilla búlgara", 3, 10],
            ["Peso muerto sumo", 3, 12],
            ["Pull Through", 3, 15],
            ["Extensión de espalda", 3, 15]
        ]
    }
};


// Orden de los días

const days = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes"
];


// Día que estamos viendo actualmente

let currentDayIndex = 0;


// ===============================
// FECHA
// ===============================

function getToday() {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ===============================
// DÍA ACTUAL
// ===============================

function getCurrentDay() {

    const today = new Date().getDay();

    // domingo = 0
    // lunes = 1

    if (today >= 1 && today <= 5) {
        return days[today - 1];
    }

    // Si es sábado o domingo
    return "lunes";
}


// ===============================
// CAMBIAR DÍA
// ===============================

function changeDay(direction) {

    currentDayIndex += direction;

    if (currentDayIndex < 0) {
        currentDayIndex = days.length - 1;
    }

    if (currentDayIndex >= days.length) {
        currentDayIndex = 0;
    }

    renderWorkout();
}


// ===============================
// MOSTRAR RUTINA
// ===============================

function renderWorkout() {

    const day = days[currentDayIndex];
    const title = document.getElementById("workoutTitle");
    const list = document.getElementById("workoutList");
    const gymDay = document.getElementById("gymDay");
    const gymFocus = document.getElementById("gymFocus");
    const workout = workouts[day];
    
    const dayNames = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes"
};

if (gymDay) {
    gymDay.textContent = dayNames[day];
}

if (gymFocus) {
    gymFocus.textContent = workout.name;
}

        if (!workout || !list) return;


    // Título

    if (title) {
        title.textContent = workout.name;
    }


    // Lista de ejercicios

    list.innerHTML = "";


    workout.exercises.forEach((exercise, index) => {

        const name = exercise[0];
        const sets = exercise[1];
        const reps = exercise[2];


        const savedData = getExerciseData(
            getToday(),
            day,
            index
        );


        const exerciseElement =
            document.createElement("div");


        exerciseElement.className =
            "exercise";


        exerciseElement.innerHTML = `

            <div class="exercise-info">

                <strong>
                    ${name}
                </strong>

                <span>
                    ${sets} x ${reps}
                </span>

            </div>


            <div class="exercise-inputs">

                <input
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="kg"
                    value="${savedData.weight || ""}"
                    onchange="saveExerciseData(
                        ${index},
                        'weight',
                        this.value
                    )"
                >

                <input
                    type="number"
                    min="0"
                    placeholder="reps"
                    value="${savedData.reps || ""}"
                    onchange="saveExerciseData(
                        ${index},
                        'reps',
                        this.value
                    )"
                >

            </div>

        `;


        list.appendChild(exerciseElement);

    });


    updateDayIndicator();

    checkTodayWorkout();

}


// ===============================
// INDICADOR DEL DÍA
// ===============================

function updateDayIndicator() {

    const dayNames = [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes"
    ];


    const indicator =
        document.getElementById("dayIndicator");


    if (indicator) {

        indicator.textContent =
            dayNames[currentDayIndex];

    }

}


// ===============================
// DATOS DE EJERCICIOS
// ===============================

function getExerciseHistory() {

    return JSON.parse(
        localStorage.getItem(
            "mariposaExerciseHistory"
        )
    ) || {};

}


// ===============================
// OBTENER DATOS
// ===============================

function getExerciseData(
    date,
    day,
    exerciseIndex
) {

    const history =
        getExerciseHistory();


    if (
        history[date] &&
        history[date][day] &&
        history[date][day][exerciseIndex]
    ) {

        return history[date][day][exerciseIndex];

    }


    return {
        weight: "",
        reps: ""
    };

}


// ===============================
// GUARDAR KG / REPS
// ===============================

function saveExerciseData(
    exerciseIndex,
    type,
    value
) {

    const date = getToday();

    const day = days[currentDayIndex];


    const history =
        getExerciseHistory();


    if (!history[date]) {
        history[date] = {};
    }


    if (!history[date][day]) {
        history[date][day] = {};
    }


    if (!history[date][day][exerciseIndex]) {

        history[date][day][exerciseIndex] = {
            weight: "",
            reps: ""
        };

    }


    history[date][day][exerciseIndex][type] =
        value;


    localStorage.setItem(
        "mariposaExerciseHistory",
        JSON.stringify(history)
    );

}


// ===============================
// ENTRENAMIENTO COMPLETADO
// ===============================

function completeWorkout() {

    const date = getToday();

    const day = days[currentDayIndex];


    const history =
        JSON.parse(
            localStorage.getItem(
                "mariposaWorkoutHistory"
            )
        ) || {};


    if (history[date]) {

        alert(
            "🦋 Ya registraste un entrenamiento hoy."
        );

        return;

    }


    history[date] = {

        date: date,

        day: day,

        workout: workouts[day].name,

        completed: true,

        time: new Date().toLocaleTimeString(
            "es-CO",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        )

    };


    localStorage.setItem(
        "mariposaWorkoutHistory",
        JSON.stringify(history)
    );


    updateWorkoutProgress();

    checkTodayWorkout();


    alert(
        "🦋 ¡Entrenamiento guardado!\n\n" +
        workouts[day].name
    );

}


// ===============================
// HISTORIAL DE ENTRENAMIENTOS
// ===============================

function getWorkoutHistory() {

    return JSON.parse(
        localStorage.getItem(
            "mariposaWorkoutHistory"
        )
    ) || {};

}


// ===============================
// PROGRESO
// ===============================

function updateWorkoutProgress() {

    const history =
        getWorkoutHistory();


    const count =
        Object.keys(history).length;


    const percentage =
        Math.min(
            Math.round((count / 60) * 100),
            100
        );


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (progressText) {

        progressText.textContent =
            `${count} / 60 días`;

    }


    const progressBar =
        document.querySelector(
            ".progress-fill"
        );


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }


    const percentageElement =
        document.getElementById(
            "progressPercentage"
        );


    if (percentageElement) {

        percentageElement.textContent =
            `${percentage}%`;

    }

}


// ===============================
// BOTÓN COMPLETAR
// ===============================

function checkTodayWorkout() {

    const history =
        getWorkoutHistory();


    const button =
        document.getElementById(
            "completeWorkoutButton"
        );


    if (!button) return;


    if (history[getToday()]) {

        button.textContent =
            "🦋 Entrenamiento completado";

        button.disabled = true;

        button.style.opacity = "0.6";

    }

    else {

        button.textContent =
            "✓ Completar entrenamiento";

        button.disabled = false;

        button.style.opacity = "1";

    }

}


// ===============================
// FECHA EN PANTALLA
// ===============================

function showDate() {

    const dateElement =
        document.getElementById("today");


    if (dateElement) {

        const date =
            new Date(
                getToday() + "T00:00:00"
            );


        dateElement.textContent =
            date.toLocaleDateString(
                "es-CO",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }

}


// ===============================
// NAVEGACIÓN
// ===============================

function goTo(section) {

    document
        .querySelectorAll("section")
        .forEach(sec => {

            sec.classList.remove("active");

        });


    const selected =
        document.getElementById(section);


    if (selected) {

        selected.classList.add("active");

    }

}


// ===============================
// MEDIDAS
// ===============================

function saveMeasurements() {

    const measurements = {

        weight:
            document.getElementById(
                "weight"
            )?.value || "",

        waist:
            document.getElementById(
                "waist"
            )?.value || "",

        abdomen:
            document.getElementById(
                "abdomen"
            )?.value || "",

        hip:
            document.getElementById(
                "hip"
            )?.value || "",

        glute:
            document.getElementById(
                "glute"
            )?.value || ""

    };


    localStorage.setItem(
        "mariposaMeasurements",
        JSON.stringify(measurements)
    );


    alert(
        "🦋 Tus medidas fueron guardadas."
    );

}


// ===============================
// CARGAR MEDIDAS
// ===============================

function loadMeasurements() {

    const measurements =
        JSON.parse(
            localStorage.getItem(
                "mariposaMeasurements"
            )
        );


    if (!measurements) return;


    const fields = [
        "weight",
        "waist",
        "abdomen",
        "hip",
        "glute"
    ];


    fields.forEach(field => {

        const input =
            document.getElementById(field);


        if (
            input &&
            measurements[field]
        ) {

            input.value =
                measurements[field];

        }

    });

}


// ===============================
// DIARIO
// ===============================

function saveMood(mood) {

    localStorage.setItem(
        "mariposaMood",
        mood
    );

}


function saveJournal() {

    const journal =
        document.getElementById(
            "journal"
        )?.value || "";


    localStorage.setItem(
        "mariposaJournal",
        journal
    );


    alert(
        "🦋 Reflexión guardada."
    );

}


function loadJournal() {

    const journal =
        localStorage.getItem(
            "mariposaJournal"
        );


    const textarea =
        document.getElementById(
            "journal"
        );


    if (
        journal &&
        textarea
    ) {

        textarea.value =
            journal;

    }

}


// ===============================
// INICIAR APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        showDate();

        updateWorkoutProgress();

        loadMeasurements();

        loadJournal();


        // Seleccionar automáticamente
        // el día actual

        const today =
            getCurrentDay();


        currentDayIndex =
            days.indexOf(today);


        if (currentDayIndex < 0) {
            currentDayIndex = 0;
        }


        renderWorkout();

    }
);