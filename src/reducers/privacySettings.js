import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case "PRIVACY_SETTINGS_STATE":
      return _.merge(state, action.payload);
  }

  return state;
};
