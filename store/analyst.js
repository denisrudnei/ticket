/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
export const state = () => ({
  analysts: [],
  searchedAnalysts: [],
  searchName: '',
  searchAddress: '',
});

export const getters = {
  getAnalysts: (state) => state.analysts,
  getSearchedAnalysts: (state) => state.analysts.filter((a) => (
    a.name.toLowerCase().includes(state.searchName.toLowerCase())
        && (state.searchAddress !== ''
          ? a.address === state.searchAddress.id
          : true)
  )),
  getSearchText: (state) => state.searchName,
  getSearchAddress: (state) => state.searchAddress,
};

export const mutations = {
  insert(state, analyst) {
    state.analysts.push(analyst);
  },
  setSearchName: (state, name) => {
    state.searchName = name;
  },
  setSearchAddress: (state, address) => {
    state.searchAddress = address;
  },
  setAnalysts: (state, analysts) => {
    state.analysts = analysts;
  },
  updateStatus(state, info) {
    const analyst = state.analysts.find((a) => a.id === info.id);
    if (analyst) {
      analyst.status = info.status;
      state.analysts = [
        analyst,
        ...state.analysts.filter((a) => a.id !== info.id),
      ];
    }
  },
};
