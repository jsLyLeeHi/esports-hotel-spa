const keepAlive = {
    state: {
        keepAlive: [],
        isNote: sessionStorage.isNote === undefined ? false : JSON.parse(sessionStorage.getItem('isNote'))
    },
    mutations: {
        setKeepAlive: (state, keepAlive) => {
            state.keepAlive = keepAlive;
            console.log(keepAlive);
        },
        setNote: (state, Note) => {
            state.isNote = Note;
            sessionStorage.setItem('isNote', Note);
        }
    },
    getters: {
        keepAlive: state => state.keepAlive
    }
};
export default keepAlive;
