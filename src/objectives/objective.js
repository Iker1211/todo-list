class Objective {
    constructor(title, description, dueDate, priority, checklist, quest) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
        this.quest = quest;
    }
}

const create_objective = (data) => {
    return new Objective(
       data.title,
       data.description,
       data.dueDate,
       data.priority,
       data.checklist,
       data.quest, 
    )
};

export default Objective;
export { create_objective };