import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Header,
  Segment,
  Container,
  Button,
  Form,
  Message
} from "semantic-ui-react";
import { getDocumentById, putTranslation } from "../api/documents";
import documentInformationBar from "./DocumentInformationBar";

export class AddTranslationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document: [],
      content: "",
      submitErr: false,
      isSend: false
    };
  }

  componentDidMount() {
    let documentId = this.props.match.params.documentId;
    getDocumentById(documentId)
      .then(document => {
        this.setState({ document: document });
      })
      .catch(err => console.log(err));
  }

  handleChange = (e, { value, name }) => {
    this.setState({ [name]: value, isSend: false, submitErr: false });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { translation_id } = this.state.document[0];
    const { content } = this.state;
    putTranslation(translation_id, content)
      .then(res => {
        this.setState({ isSend: true, content: "" });
      })
      .catch(err => {
        this.setState({ submitErr: true });
      });
  };

  render() {
    const { content } = this.state;
    return (
      <Container>
        <Header as="h2">
          Submit translation for{" "}
          <i> {this.state.document[0] && this.state.document[0].name}</i>
        </Header>

        <Segment>
          <Form>
            <Form.Group>
              {this.state.document[0] &&
                documentInformationBar(this.state.document[0])}
            </Form.Group>

            {this.state.submitErr ? (
              <Message negative>
                <Message.Header>An error occurred</Message.Header>
                <p>Unable to save translation...</p>
              </Message>
            ) : null}
            {this.state.isSend ? (
              <Message positive>
                <Message.Header>
                  {" "}
                  Your translation is successfully submited.
                </Message.Header>
                <Link to={`/dashboard`}>
                  <p>Go to Dashboard</p>
                </Link>
              </Message>
            ) : null}

            <Form.TextArea
              rows={20}
              required
              placeholder="Please, enter the translation here..."
              name="content"
              value={content}
              onChange={this.handleChange}
            />

            <Form.Group>
              {content.length ? (
                <Form.Button color="blue" onClick={this.handleSubmit}>
                  Submit
                </Form.Button>
              ) : (
                <Button color="blue" disabled>
                  Submit
                </Button>
              )}

              <Button
                color="black"
                onClick={() => this.props.history.push("/dashboard")}
              >
                Cancel
              </Button>
            </Form.Group>
          </Form>
        </Segment>
      </Container>
    );
  }
}

export default AddTranslationForm;
