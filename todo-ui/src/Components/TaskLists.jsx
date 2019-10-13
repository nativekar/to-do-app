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

  fetchTaskLists = () => {
    const that = this;
    axios
      .get("http://localhost:8000")
      .then(function(response) {
        that.formatResponse(response.data);
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
  };

  getBooleanValue(value) {
    return value && value.toUpperCase() === "TRUE";
  }

  formatResponse(response) {
    let taskLists = [];
    if (response) {
      let taskMap = {};
      const that = this;
      _.forEach(response, element => {
        element.isdone = that.getBooleanValue(element.isdone);
        element.isnew = that.getBooleanValue(element.isnew);

        if (taskMap[element.tasklistid]) {
          const index = _.findIndex(taskLists, { id: element.tasklistid });
          if (index > -1) {
            taskLists[index].tasks.push(element);
          }
        } else {
          taskMap[element.tasklistid] = element;
          taskLists.push({
            id: element.tasklistid,
            name: element.todolistname,
            tasks: element.id ? [element] : []
          });
        }
      });
    }
    console.log(taskLists);
    this.setState({ taskLists });
  }

  render() {
    const { taskLists } = this.state;

    return (
      <div className="lists">
        {taskLists &&
          taskLists.map(list => {
            const listProps = {
              list,
              refreshDetails: this.fetchTaskLists
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
