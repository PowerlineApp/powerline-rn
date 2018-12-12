const initialState = {
    data: [],
}

const payloadStack: Array<Object> = [];

export default function conciergeServices(state = initialState, action:Action){
    switch(action.type) {
    	case 'LOADED_CONCIERGE_SERVICES':
		    return {
		        ...state,
		        data: action.data
		    };
		case 'SET_SERVICE':
      		return {
      			...state,
      			service: action.payload
      		};
    }

    return state;
}
