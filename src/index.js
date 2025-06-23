// import { formatDistance, subDays } from "date-fns";

 import "./assets/css/reset.css";
 import "./assets/css/styles.css";

 import trash from "./assets/images/trash.svg" 

import { formatDistance, formatDistanceToNow, subDays, format, roundToNearestHours } from "date-fns";

import Note from "./notes/notes.js";
import Objective from "./objectives/objective.js";
import Quest from "./quests/quest.js";

import { create_note } from "./notes/notes.js";
import { create_objective } from "./objectives/objective.js";
import { create_quest } from "./quests/quest.js";

const quests = JSON.parse(localStorage.getItem("quests")) || [];
const objectives = JSON.parse(localStorage.getItem("objectives")) || [];
const notes = JSON.parse(localStorage.getItem("notes")) || [];

// DOM elements cambiar según si es quest, objective o note
const ul = document.getElementById("quest-list");
const modals = Array.from(document.querySelectorAll(".modal"));
const open_dialog = document.querySelectorAll(".open-dialog");
const close_modal_btns = Array.from(document.querySelectorAll(".close-modal"));

const emoji = document.getElementById("emoji");

const name = document.getElementById("name");
const description = document.getElementById("description");

const notes_anchor = document.getElementById("notes-anchor");
const notes_form = document.getElementById("note-form");
const notes_control = document.querySelector(".notes-controls");
const notes_panel = document.getElementById("notes-panel");
const notes_grid = document.querySelector(".notes-grid");

document.addEventListener("click", (event) => {
    // Verifica si el clic ocurrió en un elemento con la clase "post-it"
    if (event.target.classList.contains("post-it")) {
        const postIt = event.target;
        const postItId = postIt.id;
        console.log(postItId);

        // Obtén las coordenadas del clic
        const rect = postIt.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        // Define el área aproximada del pseudo-elemento ::after
        const pseudoElementSize = 20; // Tamaño aproximado del pseudo-elemento
        const pseudoElementX = rect.width - pseudoElementSize; // Posición X del pseudo-elemento
        const pseudoElementY = 0; // Posición Y del pseudo-elemento

        // Verifica si el clic ocurrió dentro del área del pseudo-elemento
        if (clickX >= pseudoElementX && clickY <= pseudoElementSize) {
            delete_note(postItId);
            // Aquí puedes manejar la lógica para eliminar el post-it
            // postIt.remove();
        }
    }
});

const obj_container = document.getElementById("objectives-container");

const note_form = document.getElementById("note-form");
const title = document.getElementById("title");
const body = document.getElementById("body");

const quest_name = document.getElementById("quest-name");
const quest_description = document.getElementById("quest-description");

const delete_quest_btn = document.getElementById("delete-quest");

const dom_loader = (function () {
    function inizialited() {
        document.addEventListener("DOMContentLoaded", () => {
            console.log("DOM is fully loaded and parsed");
        });
    }

    return {
        initialized: inizialited,
    };
})();

// DOM is fully loaded
dom_loader.initialized();

close_modal_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
        modals.forEach((modal) => {
            modal.style.display = "none";
            modal.close();
        });
    });
});

// apenas se cargue el DOM, cargar la última quest de la lista

function make_list() {
    // Limpia el contenido actual de la lista
    ul.innerHTML = "";

    // Renderiza todas las quests
    quests.forEach((quest) => {
        const li = document.createElement("li");
        li.classList.add("quest-name");
        const a = document.createElement("a");

        li.textContent = quest.name;
        li.classList.add("quest-name");
        a.classList.add("quest-link");
        a.href = "#";

        a.appendChild(li);
        ul.appendChild(a);
    });

    // Actualiza los listeners después de regenerar la lista
    update_listeners();
}

function update_listeners() {
    const list_of_quests = document.querySelectorAll(".quest-name");

    list_of_quests.forEach((li, index) => {
        li.addEventListener("click", () => {
            display_quest(quests[index]);
        });

        li.addEventListener("click", () => {
            list_of_quests.forEach((el) => el.classList.remove("selected"));
            li.classList.add("selected");
        });
    });
}

make_list(); // ?

function display_notes() {

    notes_grid.innerHTML = "";

        notes.forEach((note) => {
            const post_it = document.createElement("div");
            const post_title = document.createElement("h3");
            const post_body = document.createElement("p");
    
            console.log(typeof post_it);

            post_title.textContent = note.title;
            post_body.textContent = note.body;
            post_it.classList.add("post-it");
            post_it.id = note.title;
            post_it.appendChild(post_title);
            post_it.appendChild(post_body);
            notes_grid.appendChild(post_it);

        });
}

display_notes();

// let delete_obj_btns = document.querySelectorAll(".delete-obj");
let quest_objectives = document.getElementById("objectives-list");

function delete_objective(title) { //This will be passed to the listener

    const objIndex = objectives.findIndex((objective) => objective.title === title);
    if (objIndex !== -1) {
        objectives.splice(objIndex, 1);
        updateObjsLocalStorage();
    }

    quests.forEach((quest) => {
        if (quest.name === quest_name.textContent ) {

            const questObjIndex = quest.objectives.findIndex((obj) => obj.title === title);
            if (questObjIndex !== -1) {
                quest.objectives.splice(questObjIndex, 1);
            }

            display_quest(quest);


        }
    })
}

quest_objectives.addEventListener("click", (event) => {
    if (event.target.closest(".delete-obj")) {

        let obj_title = event.target.closest(".delete-obj").parentNode.children[1].innerText

        delete_objective(obj_title)

        // Aquí puedes llamar a tu función de borrado
    }
});

// console.log("this is typeof ",  delete_obj_btns, typeof delete_obj_btns)
// make it an array

let refresh_quest_options = function() {
    const select_quest = document.getElementById("select-quest");
    select_quest.innerHTML = "";
    quests.forEach((quest) => {
        let option = document.createElement("option");
        option.textContent = quest.name;
        select_quest.appendChild(option);
    })
}

quests.forEach((quest) => {
    refresh_quest_options();
    display_quest(quest);
})

let formated_date = function (obj) {
    let dateObject = new Date(obj.dueDate)
    const result = formatDistanceToNow( dateObject )
    return "expires in" + " " + result
}

function display_objectives(quest) {

    let dataCounter = 0; //???
    quest_objectives.innerHTML = "";

    quest.objectives.forEach((objective) => {

        let checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox")

        // creating the delete obj btn
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-obj");
        let deleteImage = document.createElement("img");
        deleteImage.src = trash;
        deleteImage.width = "20";
        deleteImage.height = "20";

        deleteButton.appendChild(deleteImage);

        // creating the obj item itself
        let item = document.createElement("li");

        let title = document.createElement("p");
        title.innerHTML = objective.title;
        title.style.textDecoration = "line-through"; // ?

        let priority = document.createElement("p");
        priority.innerHTML = objective.priority;

        let dueDate = document.createElement("p");
        dueDate.innerHTML = formated_date(objective)
        item.appendChild(checkbox);
        item.appendChild(title);
        item.appendChild(priority);
        item.appendChild(dueDate);
        item.appendChild(deleteButton);
        item.classList.add("objective");
        item.dataset.index = dataCounter++;

        console.log(deleteButton.parentElement);
        
        quest_objectives.appendChild(item);
        console.log(formated_date(objective))
    })
};

function display_quest(quest) {
    obj_container.style.display = "grid";
    notes_panel.style.display = "none";
    notes_control.style.display = "none";
    quest_name.textContent = quest.name;
    quest_description.textContent = quest.description;
    display_objectives(quest);
}

function delete_quest(quest_title) {
    const questIndex = quests.findIndex((quest) => quest.name === quest_title);

    if (questIndex !== -1) {
        quests.splice(questIndex, 1);

        updateQuestLocalStorage();
        refresh_quest_options();
        make_list();

        // Si hay quests restantes, muestra la anterior o la primera
        if (quests.length > 0) {
            const nextIndex = questIndex > 0 ? questIndex - 1 : 0; // Selecciona la anterior o la primera
            const nextQuest = quests[nextIndex];
            display_quest(nextQuest);

            // Marca la quest seleccionada en la lista
            const list_of_quests = document.querySelectorAll(".quest-name");
            list_of_quests[nextIndex].classList.add("selected");
        } else {
            // Si no hay quests restantes, oculta el panel de detalles
            obj_container.style.display = "none";
            notes_panel.style.display = "none";
        }

    } else {
        console.log(`Quest "${quest_title}" no encontrada.`);
    }
}

delete_quest_btn.addEventListener("click", () => {
    const selectedLi = document.querySelector(".quest-name.selected");
    if (selectedLi) {
        const questTitle = selectedLi.textContent;
        delete_quest(questTitle);
    } else {
        console.log("No hay ninguna quest seleccionada.");
    }
});

function updateQuestLocalStorage() {
    localStorage.setItem("quests", JSON.stringify(quests));
}

const quest_form = document.getElementById("quest-form");

function add_quest() {
    function create_new_quest() {
        const formData = {
            name: name.value,
            description: description.value,
            emoji: emoji.value,
        };

        const questExists = quests.some((quest) => quest.name === formData.name);
        if (questExists) {
            alert("amigo sigue caminando");

            modals[1].style.display = "none";
            modals[1].close();

            return null;
        }

        let new_quest = create_quest(formData);
        quests.push(new_quest);
        return new_quest;
    }

    quest_form.addEventListener("submit", (event) => {
        event.preventDefault();

        let last_quest = create_new_quest();
        if (!last_quest) {
            return;
        }

        updateQuestLocalStorage();
        make_list();
        display_quest(last_quest);
        refresh_quest_options();
    });
}

  function delete_note(selected_note) {
    notes.forEach((note, index) => {
        if (note.title === selected_note) {
            notes.splice(index, 1);
            updateNotesLocalStorage();
        }
    })
    display_notes();
  }

function updateNotesLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

notes_anchor.addEventListener("click", (event) => {
    obj_container.style.display = "none";
    notes_control.style.display = "flex";
    notes_panel.style.display = "block";
    notes_grid.style.display = "grid";
});

console.log(document.querySelectorAll("#notes-panel > *")); // Verifica los elementos hijos

function add_note() {

    function create_new_note() {
        const formData = {
            title: title.value,
            body: body.value,
        };

        const noteExists = notes.some((note) => note.title === formData.title);
        if (noteExists) {
            alert("amigo sigue caminando");

            modals[2].style.display = "none";
            modals[2].close();

            return null;
        }

        let new_note = create_note(formData);
        notes.push(new_note);
        return new_note;
    }
                        
    notes_form.addEventListener("submit", (event) => {
        event.preventDefault();

        let last_note = create_new_note();

        if (!last_note) {
            return;
        }

        updateNotesLocalStorage();
        display_notes();
        console.log(last_note);
    });
};

// Now how the i organize the code

// Open and close modals
Array.from(open_dialog).forEach((btn) => {
    btn.addEventListener("click", (event) => {
        switch (btn.id) {
            case "new-objective":
                modals[0].style.display = "block";
                modals[0].showModal();
                break;
            case "new-quest":
                modals[1].style.display = "block";
                modals[1].showModal();
                emoji.blur();
                break;
            case "new-note":
                modals[2].style.display = "block";
                modals[2].showModal();
                break;
        }
    });
});

let obj_title_input = document.getElementById("obj-title");
 
function link_objective_to_quest() {

}

const select_quest = document.getElementById("select-quest");
const obj_title = document.getElementById("obj-title");
const obj_description = document.getElementById("obj-description");
const obj_due_date = document.getElementById("duedate");
const priority = document.getElementById("priority");

obj_due_date.value = format(new Date(), "yyyy-MM-dd"); // Set default due date to today

let objs_form = document.getElementById("objective-form");

function check_obj() { //

}

function updateObjsLocalStorage() {
    localStorage.setItem("objectives", JSON.stringify(objectives));
}



function check_objective(objective) { // good

    objective.checklist++

        console.log(objective.checklist)

    if (objective.checklist % 2 === 0) {
        console.log("no está hecho aún")
    } else {
        console.log("ya está hecho")
    }
}

function add_objective() {

    function create_new_objective() {
        const formData = {
            title: obj_title.value,
            description: obj_description.value,
            dueDate: obj_due_date.value,
            priority: priority.value,
            checklist: 0,
            quest: select_quest.value,
        };

        const objExists = objectives.some((obj) => obj.title === formData.title);

        let new_obj = create_objective(formData);
        objectives.push(new_obj);
        return new_obj;
    }

    function montage_to_quest(obj) {
        quests.forEach((q) => {
            if (q.name === obj.quest) {
                q.objectives.push(obj);
            } else {
                console.log("tas mal mija");
            }
        })     
    }
                        
    objs_form.addEventListener("submit", (event) => {
        event.preventDefault();

        let last_obj = create_new_objective();
        formated_date(last_obj);

        if (!last_obj) {
            return;
        }

        updateObjsLocalStorage();
        montage_to_quest(last_obj);

        quests.forEach((quest) => {
            if (quest.name === last_obj.quest) {
                display_quest(quest)
            } 
        })

        console.log("esta es la array objectives antes de borrar un obj", objectives);

        console.log("lets see", last_obj.checklist)

        for (let i = 0; i < 5; i++) { //?
            check_objective(last_obj);
        }
    });
};

add_note();
add_objective();
add_quest();

/* 
So now the pending tasks are:
1. check objectives & delete them // use the two functions. 
    // Sólo falta unir en el delete y hacer el listener y unir en el check
2. Refactorizar
7. @media queries
*/
