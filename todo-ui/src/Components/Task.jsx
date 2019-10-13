import React, { Component } from "react";
import { TextArea, Form, Icon, Checkbox } from "semantic-ui-react";
import styled from "styled-components";
import axios from "axios";

const ListHolder = styled.div`
  display: flex;
  align-items: center;
`;

export default class Task extends Component {
  state = {
    editing: false,
    name: "",
    isChecked: false
  };

  componentDidMount() {
    const { task } = this.props;
    if (task && !task.newTask) {
      this.setState({ isChecked: task.isdone, name: task.name });
    }
  }

  onNameChange = (event, { value }) => {
    this.setState({ name: value });
  };

  onKeyPress = (event, task) => {
    if (event.which === 13) {
      this.handleSave(task);
    }
  };

  handleSave(task) {
    const name = this.state.name.trim();
    if (name.length === 0) {
      // this.props.deleteTask(task);
      return;
    }
    if (task.newTask) this.saveTodo();
    else this.updateTodo();

    this.setState({ editing: false, name: "" });
  }

  saveTodo() {
    const that = this;
    axios
      .post("http://localhost:8000/saveTodo", {
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

  updateTodo() {
    const that = this;
    axios
      .post("http://localhost:8000/updateTodo", {
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

  deleteTodo() {
    const that = this;
    axios
      .post("http://localhost:8000/deleteTodo", {
        id: this.props.task.id
      })
      .then(function(response) {
        that.props.refreshDetails();
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
  }

  handleDoubleClick() {
    this.setState({
      editing: true,
      name: this.props.task.name
    });
  }

  onDragStart = (ev, task) => {
    ev.dataTransfer.setData("task", JSON.stringify(task));
  };

  handleCheck = () => {
    this.setState({ isChecked: !this.state.isChecked }, () => {
      this.updateTodo();
    });
  };

  render() {
    const { editing, name, isChecked } = this.state;
    const { task } = this.props;
    let element;
    if (editing || (task && task.newTask)) {
      element = (
        <Form>
          <TextArea
            ref={input => {
              input && input.ref.current.focus();
            }}
            onChange={this.onNameChange}
            onKeyPress={e => this.onKeyPress(e, task)}
            value={name}
            onBlur={() => this.handleSave(task)}
          />
        </Form>
      );
    } else {
      element = (
        <ListHolder>
          {task && task.name ? (
            <Checkbox
              style={{ marginRight: 8 }}
              checked={isChecked}
              onClick={this.handleCheck}
              tabindex="0"
            />
          ) : (
            ""
          )}
          <div
            className="task"
            draggable
            onDragStart={ev => this.onDragStart(ev, task)}
            onDoubleClick={this.handleDoubleClick.bind(this)}
          >
            <div className="del-icon">
              <Icon
                name="close"
                color="red"
                onClick={() => this.deleteTodo()}
              />
            </div>
            <p>{task && task.name}</p>
          </div>
        </ListHolder>
      );
    }

    return <div>{element}</div>;
  }
}
