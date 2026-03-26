import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
    Form, FormGroup, Label, Button, Row, Col,
    Nav, NavItem, NavLink, TabPane, TabContent
} from "reactstrap";
import classnames from "classnames";
import apiClient from "../apiClient";
import { useQuery } from "@tanstack/react-query";
import Page from "../Page";
import { FormInput } from "../FormInput";
import NotificationManager from "../common/NotificationManager";

const ROLES = [
    { id: "superuser",   label: "Superuser",   description: "Full access to everything." },
    { id: "manager", label: "Manager", description: "Manages the platform." },
    { id: "accountant",  label: "Accountant",  description: "Handles financial records and reports." },
    { id: "rider",  label: "Rider",  description: "Can accept or reject orders and deliver them." },
    { id: "customer_support",  label: "Customer support",  description: "Manages customer inquiries and support tickets." },
];

export const EditUser = () => {
    const [activeRole, setActiveRole] = useState("superuser");
    const [selectedRoles, setSelectedRoles] = useState([]);

    const userId = window.location.pathname.split("/").pop();
    const { data: user } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
    });

    const methods = useForm({
        defaultValues: { name: "", company: "", email: "", password: "" }
    });
    const { handleSubmit, reset } = methods;

    useEffect(() => {
        if (user) {
            reset(user);
            setSelectedRoles(user.roles || []);
        }
    }, [user, reset]);

    const toggleRole = (roleId) => {
        setSelectedRoles(prev =>
            prev.includes(roleId) ? prev.filter(r => r !== roleId) : [...prev, roleId]
        );
    };

    const onSubmit = async (data) => {
        try {
            await apiClient.put(`/users/${userId}/`, { ...data, roles: selectedRoles });
            NotificationManager.success("User updated successfully");
        } catch (error) {
            console.error("Error updating user:", error);
            NotificationManager.danger("Failed to update user. Please try again.");
        }
    };

    return (
        <Page title="Edit User">
            <FormProvider {...methods}>
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <FormInput id="name" name="name" type="text" />
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="company">Company</Label>
                                <FormInput id="company" name="company" type="text" />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="email">Email</Label>
                        <FormInput id="email" name="email" type="email" />
                    </FormGroup>

                    <FormGroup>
                        <Label>Roles</Label>
                        <Nav tabs>
                            {ROLES.map(role => (
                                <NavItem key={role.id}>
                                    <NavLink
                                        className={classnames({ active: activeRole === role.id })}
                                        onClick={() => setActiveRole(role.id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {role.label}
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>

                        <TabContent activeTab={activeRole} className="border border-top-0 rounded-bottom p-3">
                            {ROLES.map(role => (
                                <TabPane tabId={role.id} key={role.id}>
                                    <p className="text-muted">{role.description}</p>
                                    <FormGroup check>
                                        <Label check>
                                            <input
                                                type="checkbox"
                                                checked={selectedRoles.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="me-2"
                                            />
                                            Assign <strong>{role.label}</strong> role to this user
                                        </Label>
                                    </FormGroup>
                                </TabPane>
                            ))}
                        </TabContent>
                    </FormGroup>

                    <Button color="primary">Save Changes</Button>

                </Form>
            </FormProvider>
        </Page>
    );
};