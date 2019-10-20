import actionTypes from "./actionTypes";

export const fillList = todoList => {
  return {
    type: actionTypes.FILL_LIST,
    todoList
  };
};

export const removeItemFromList = todoList => {
  return {
    type: actionTypes.REMOVE_ITEM_FROM_LIST,
    todoList
  };
};
