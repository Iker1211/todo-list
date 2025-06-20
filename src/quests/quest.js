class Quest {
    constructor(name, description, emoji, objectives = [] ) {
        this.name = name;
        this.description = description;
        this.emoji = emoji;
        this.objectives = objectives;
    }
}

const create_quest = (data) => {
    return new Quest(
      data.name,
      data.description,
      data.emoji,
      data.objectives || []
    );
  };

// delete_objective = {

// };

export default Quest;
export { create_quest };