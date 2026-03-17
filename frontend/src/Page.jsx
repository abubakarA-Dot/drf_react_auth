import {  Row, Col, Container } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Page = ({ title, children }) => {
  return (
    <Container className="p-4">
      <h3 className="mb-4">{title}</h3>
      <div className="border p-3 rounded">
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Page;
