import Page from "../Page";
import {
  Card, CardBody, CardTitle, CardText, Row, Col
} from 'reactstrap';
import { FaUsers, FaCog, FaFileAlt } from 'react-icons/fa';


const Settings = () => {
    const cards = [
        { icon: <FaUsers size={30} />, url: "/users", title: "Users", text: "Manage users, view details, and perform administrative tasks." },
        { icon: <FaCog size={30} />, url: "/preferences", title: "Preferences", text: "Set system preferences and customize your environment." },
        { icon: <FaFileAlt size={30} />, url: "/logs", title: "Logs", text: "View system logs and audit trails." },
    ];

    return (
        <>
        <Page title="Settings">
            <Row className="g-4">
                {cards.map((card, idx) => (
                    <Col key={idx} md={6} lg={3}>
                        <Card
                            className="h-100 cursor-pointer shadow-sm border hover-shadow"
                            onClick={() => (window.location.href = card.url)}
                            style={{ borderRadius: '20px' }}
                        >
                            <CardBody className="d-flex flex-column align-items-start">
                                <div className="mb-3 text-primary">{card.icon}</div>
                                <CardTitle tag="h5">{card.title}</CardTitle>
                                <CardText>{card.text}</CardText>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Page>
        </>
    );
};

export default Settings;