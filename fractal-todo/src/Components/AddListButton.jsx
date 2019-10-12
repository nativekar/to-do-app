import React, { Component } from "react";
import { Button, Input, Icon } from "semantic-ui-react";
import axios from "axios";
import styled from "styled-components";

const Namespace = styled.div`
  padding-top: 10px;
`;

export default class AddListButton extends Component {
  state = {
    newList: false,
    name: ""
  };

  onAddList = () => {
    this.setState({ newList: true });
  };

  onNameChange = (event, { value }) => {
    this.setState({ name: value });
  };

  onKeyPress = event => {
    if (event.which === 13) {
      this.handleSave();
    }
  };

  handleSave = () => {
    const name = this.state.name.trim();
    if (name.length === 0) return;
    const that = this;
    axios
      .post("http://localhost:8000/saveTodoList", {
        name
      })
      .then(function(response) {
        that.props.refreshDetails();
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
    this.setState({ newList: false, name: "" });
  };

  shownameSuggestions = () => {
    const nameSuggestion = [];
    axios
      .get("http://localhost:8000/nameSuggestions")
      .then(function(response) {
        nameSuggestion.push(response.data);
      })
      .catch(function(error) {
        console.log(`Error ${error} encountered`);
      });
  };
  }
  onClose = () => {
    this.setState({ newList: false, name: "" });
  };

  render() {
    const { newList, name } = this.state;
    let element;
    if (newList) {
      element = (
        <div className="new-list">
          <div>
            <Input
              ref={input => {
                input && input.inputRef.current.focus();
              }}
              onChange={this.onNameChange}
              onKeyPress={this.onKeyPress}
            />
          </div>
          <Namespace>
            <Button
              color="black"
              content="Add"
              disabled={!(name && name.length > 0)}
              onClick={() => this.handleSave()}
            />
            <Icon
              className="close-icon"
              name="close"
              size="large"
              onClick={() => this.onClose()}
              style={{ paddingLeft: 10 }}
            />
          </Namespace>
        </div>
      );
    } else {
      element = (
        <div>
          <Button
            secondary
            icon="plus"
            labelPosition="left"
            content="Add Todo List"
            onClick={this.onAddList}
          />
        </div>
      );
    }

    return <div>{element}</div>;
  }
}
