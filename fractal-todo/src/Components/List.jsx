import React from "react";
import { Button } from "semantic-ui-react";
import Task from "./Task";

class List extends React.Component {
  state = {
    todos: []
  };

  onAddTask() {}

  onDragOver = ev => {
    ev.preventDefault();
  };

  onDrop = (ev, toListId) => {
    let task = ev.dataTransfer.getData("task");
    task = JSON.parse(task);
    console.log(task);
  };

  render() {
    const { list } = this.props;
    const tasks = list.tasks;
    return (
      <div className="task-list">
        <div className="list-head">
          <label>{list.name}</label>
        </div>
        <div
          className="list-content droppable"
          onDragOver={ev => this.onDragOver(ev)}
          onDrop={ev => this.onDrop(ev, list.id)}
        >
          {tasks &&
            tasks.map(task => {
              const taskProps = {
                task
                // editTask: value => actions.editTask(list.id, value),
                // deleteTask: task => actions.deleteTask(task)
              };

              return <Task key={task.id} {...taskProps} />;
            })}
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
