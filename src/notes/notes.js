class Note {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }
}

const create_note = (data) => {
    return new Note(
        data.title,
        data.body,
    );
};

export default Note;
export { create_note };