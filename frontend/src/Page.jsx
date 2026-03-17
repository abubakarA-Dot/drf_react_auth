import React from "react";
import {  Row, Col, Container } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Page = ({ title, children }) => {
  return (
    <Container className="p-4">
      <Row>
        <Col>
          <h1 className="mb-4">{title}</h1>
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default Page;
