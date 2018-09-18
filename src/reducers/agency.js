import _ from "lodash";

export default (state = {}, action) => {
  switch (action.type) {
    case "AGENCY_STATE":
      var data = _.merge({}, state, action.payload);
      return data;
  }

  return state;
};
