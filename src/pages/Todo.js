import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Calendar,
  Col,
  Form,
  Input,
  Row,
  DatePicker,
  Drawer,
  Alert,
  Icon
} from "antd";
import moment from "moment";
import update from "immutability-helper";
import { fillList, removeItemFromList } from "../store/actions/todoListActions";

const { TextArea } = Input;

class Todo extends Component {
  state = {
    todo: {
      title: "",
      comments: "",
      todoDate: moment().utc()
    },
    todoList: [],
    todoDrawer: false
  };

  showDrawer = () => {
    this.setState({
      todoDrawer: true
    });
  };

  onClose = () => {
    this.setState({
      todoDrawer: false
    });
  };

  disabledDate = current => {
    // Can not select days before today
    return current && current < moment().subtract(1, "days");
  };

  onPanelChange = (value, mode) => {
    console.log(value, mode);
  };

  addTodoList = () => {
    const { title, comments, todoDate } = this.state.todo;
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        this.setState(
          update(this.state, {
            todoList: {
              $push: [
                {
                  title,
                  comments,
                  todoDate: moment(todoDate).format("DD-MM-YYYY")
                }
              ]
            }
          }),
          () => this.props.fillList(this.state.todoList)
        );
      }
      this.onClose();
    });
  };

  removeTodoList = (event, index) => {
    this.setState(
      update(this.state, {
        todoList: {
          $splice: [[index, 1]]
        }
      }),
      () => this.props.removeItemFromList(this.state.todoList)
    );
  };

  onInputChange = e => {
    this.setState(
      update(this.state, {
        todo: {
          [e.target.name]: { $set: e.target.value }
        }
      })
    );
  };

  onDateChange = date => {
    this.setState(
      update(this.state, {
        todo: {
          todoDate: { $set: date }
        }
      })
    );
  };

  render() {
    const { todoDrawer, todoList, todo } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { list } = this.props.todoList;
    return (
      <div className="todo-wrapper">
        <div className="header d-flex align-items-center">
          <img src="../logo.svg" className="img-fluid" alt="logo" />
          <h1 className="text-center">Redux Todo List</h1>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <Button
            onClick={this.showDrawer}
            className="general-fill-btn"
            type="primary"
            icon="plus"
            size="large"
          >
            Προσθήκη
          </Button>
        </div>
        <Row gutter={32}>
          <Col md={12}>
            <div className="content-card todo-list-container">
              <h4 className="card-header mb-0 mr-3">Η Λίστα μου</h4>
              <div className="todo-list-box">
                {todoList.length < 1 ? (
                  <Alert
                    message="Άδεια Λίστα"
                    description="Προσθέστε αντικέιμενα στη λίστα"
                    type="info"
                  />
                ) : (
                  <div>
                    {todoList.map((item, i) => {
                      return (
                        <div key={i} className="todo-content-card">
                          <Icon
                            onClick={e => this.removeTodoList(e, i)}
                            className="clear-todo-list"
                            theme="filled"
                            type="close-circle"
                          />
                          <div className="d-flex justify-content-between">
                            <h4>{item.title}</h4>
                            <div className="d-flex">{item.todoDate}</div>
                          </div>
                          <div>{item.comments}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="content-card">
              <div className="d-flex align-items-center">
                <h4 className="card-header mb-0 mr-3">
                  Προβολή στο ημερολόγιο
                </h4>
              </div>
              <Calendar onPanelChange={this.onPanelChange} />
            </div>
          </Col>
        </Row>
        <Drawer
          title="Προσθήκη στη Λίστα"
          width={600}
          placement="right"
          closable
          onClose={this.onClose}
          visible={todoDrawer}
        >
          <Form className="todo-list-form-container">
            <Form.Item label="Τίτλος">
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Εισάγετε τίτλο"
                  }
                ]
              })(
                <Input
                  onChange={this.onInputChange}
                  name="title"
                  className=""
                  size="large"
                  placeholder="Τίτλος"
                />
              )}
            </Form.Item>
            <Form.Item label="Σημειώσεις">
              <TextArea
                onChange={this.onInputChange}
                name="comments"
                className=""
                rows={4}
                placeholder="Σημειώσεις"
              />
            </Form.Item>
            <Form.Item label="Ημερομηνία">
              {getFieldDecorator("todoDate", {
                rules: [
                  {
                    required: true,
                    message: "Εισάγετε ημερομηνία"
                  }
                ]
              })(
                <DatePicker
                  onChange={this.onDateChange}
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="Επιλέξτε ημερομηνία"
                  format="DD-MM-YYYY"
                  disabledDate={this.disabledDate}
                  value={todo.todoDate}
                />
              )}
            </Form.Item>
            <Button
              onClick={() => this.addTodoList()}
              type="primary"
              icon="plus"
              size="large"
              className="general-fill-btn"
            >
              Προσθήκη
            </Button>
          </Form>
        </Drawer>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    todoList: state.todoList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fillList: list => dispatch(fillList(list)),
    removeItemFromList: list => dispatch(removeItemFromList(list))
  };
};
const WrappedTodoForm = Form.create({ name: "todo-form" })(Todo);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedTodoForm);
