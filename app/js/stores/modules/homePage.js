const home = {
    state: {
        homeData: null,
        facilityData: null
    },
    mutations: {
        setHomeData(state, data) {
            state.homeData = data;
        },
        setFacilityData(state, data) {
            state.facilityData = data;
        }
    }
};
export default home;
