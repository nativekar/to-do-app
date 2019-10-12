import React, { Component } from "react";
import AddListButton from "./AddListButton";
import List from "./List";
import axios from "axios";
import _ from "lodash";

class TaskLists extends Component {
  state = {
    taskLists: []
  };

  componentDidMount() {
   this.fetchTaskLists();
  }

  formatResponse(response) {
    let taskLists = [];
    if (response) {
      let taskMap = {};
      _.forEach(response, element => {
        if (taskMap[element.tasklistid]) {
          const index = _.findIndex(taskLists, { id: element.tasklistid });
          if (index > -1) {
            taskLists[index].todos.push(element);
          }
        } else {
          taskMap[element.tasklistid] = element;
          taskLists.push({
            id: element.tasklistid,
            name: element.todolistname,
            tasks: [element]
          });
        }
      });
    }
    this.setState({ taskLists });
  }

  fetchTaskLists = () => {
    const that = this;
    axios
      .get("http://localhost:8000")
      .then(function(response) {
        that.formatResponse(response.data);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  };

  render() {
    const { taskLists } = this.state;

    return (
      <div className="lists">
        {taskLists &&
          taskLists.map(list => {
            const listProps = {
              list
            };
            return <List key={list.id} {...listProps} />;
          })}
        <div style={{ paddingLeft: 5 }}>
          <AddListButton refreshDetails={this.fetchTaskLists} />
        </div>
      </div>
    );
  }
}

export default TaskLists;
