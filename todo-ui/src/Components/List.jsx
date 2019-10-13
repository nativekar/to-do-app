import React from "react";
import { TextArea, Form, Button } from "semantic-ui-react";
import axios from "axios";
import Task from "./Task";

class List extends React.Component {
  state = {
    newTodo: false,
    newList: false,
    name: "",
    editing: false
  };

  onAddTask = () => {
    if (!this.state.newTodo) this.setState({ newTodo: true });
  };

  onNameChange = (event, { value }) => {
    this.setState({ name: value });
  };

  onKeyPress = (event, task) => {
    if (event.which === 13) {
      this.handleSave(task);
    }
  };

  saveTodoList() {
    const that = this;
    axios
      .post("http://localhost:8000/saveTodoList", {
        name: this.state.name,
        tasklistid: this.props.listId
      })
      .then(function(response) {
        that.props.refreshDetails();
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
  }

  updateTodoList() {
    const that = this;
    axios
      .post("http://localhost:8000/updateTodoList", {
        id: this.props.task.id,
        isdone: this.state.isChecked,
        name: this.state.name
      })
      .then(function(response) {
        that.props.refreshDetails();
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
  }

  handleDeleteList = () => {
    const that = this;
    axios
      .post("http://localhost:8000/deleteTodoList", {
        id: this.props.task.id
      })
      .then(function(response) {
        that.props.refreshDetails();
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
    this.setState({ newList: false, name: "" });
  };

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, toListId) => {
    let task = ev.dataTransfer.getData("task");
    task = JSON.parse(task);
    console.log(task);
  };

  refreshDetails() {
    this.setState({ newTodo: false });
    this.props.refreshDetails();
  }

  handleSave(task) {
    const name = this.state.name.trim();
    if (name.length === 0) {
      return;
    }
    if (task.newTask) this.saveTodoList();
    else this.updateTodoList();

    this.setState({ editing: false, name: "" });
  }

  render() {
    const { editing, name, newTodo } = this.state;
    const { list } = this.props;
    const tasks = list.tasks;

    const newTodoProps = {
      task: {
        newTask: true
      },
      listId: list.id,
      refreshDetails: () => this.refreshDetails()
    };

    return (
      <div className="task-list">
        {editing ? (
          <Form>
            <TextArea
              ref={input => {
                input && input.ref.current.focus();
              }}
              onChange={this.onNameChange}
              onKeyPress={e => this.onKeyPress(e, list)}
              value={name}
              onBlur={() => this.handleSave(list)}
            />
          </Form>
        ) : (
          <div className="list-head">
            <label>{list.name}</label>
          </div>
        )}
        <div
          className="list-content droppable"
          onDragOver={ev => this.onDragOver(ev)}
          onDrop={ev => this.onDrop(ev, list.id)}
        >
          {tasks &&
            tasks.map(task => {
              const taskProps = {
                task,
                listId: list.id,
                refreshDetails: () => this.refreshDetails()
              };

              return <Task key={task.id} {...taskProps} />;
            })}

          {newTodo ? <Task key={9999} {...newTodoProps} /> : ""}
        </div>
        <div className="list-foot">
          <Button
            icon="plus"
            content="Add Task"
            onClick={this.onAddTask.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default List;
