import React, { Component } from "react";
import { TextArea, Form, Icon, Checkbox } from "semantic-ui-react";

export default class Task extends Component {
  state = {
    editing: false,
    name: "",
    isChecked: false
  };

  componentDidMount() {
    const { task } = this.props;
    if (task) {
      this.setState({ isChecked: task.isdone });
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
      this.props.deleteTask(task);
      return;
    }

    this.props.editTask({ id: task.id, name });
    this.setState({ editing: false, name: "" });
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
    this.setState({ isChecked: !this.state.isChecked });
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
        <div style={{ display: "flex", alignItems: "center" }}>
          {task && task.name ? (
            <Checkbox
              style={{ marginRight: 8 }}
              checked={isChecked}
              onClick={this.handleCheck}
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
                onClick={() => this.props.deleteTask(task)}
              />
            </div>
            <p>{task && task.name}</p>
          </div>
        </div>
      );
    }

    return <div>{element}</div>;
  }
}
