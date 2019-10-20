import actionTypes from "../actions/actionTypes";

const initialState = {
  todoList: []
};

const todoListReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FILL_LIST:
      return {
        ...state,
        todoList: action.todoList
      };
      case actionTypes.REMOVE_ITEM_FROM_LIST:
      return {
        ...state,
        todoList: action.todoList
      };
    default:
      return state;
  }
};

export default todoListReducer;
