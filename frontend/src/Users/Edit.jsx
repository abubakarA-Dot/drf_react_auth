import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
    Form, FormGroup, Label, Button, Row, Col,
    Nav, NavItem, NavLink, TabPane, TabContent, Badge
} from "reactstrap";
import classnames from "classnames";
import apiClient from "../apiClient";
import { useQuery } from "@tanstack/react-query";
import Page from "../Page";
import { FormInput } from "../FormInput";
import NotificationManager from "../common/NotificationManager";
import { ROLES } from "./common";


export const EditUser = () => {
    const [activeRole, setActiveRole] = useState("SU");
    const [rolePermissions, setRolePermissions] = useState({});

    const userId = window.location.pathname.split("/").pop();
    const { data: user } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
    });
console.log(user, "user data");

    const methods = useForm({
        defaultValues: { name: "", company: "", email: "", password: "" }
    });
    const { handleSubmit, reset } = methods;
    console.log(activeRole, "activeRole");

    useEffect(() => {
        if (user) {
            reset(user);
            // Expect user.role (string) and user.permissions (string[]) from API
            if (user.role) setActiveRole(user.role);
            if (user.permissions) {
                setRolePermissions(prev => ({
                    ...prev,
                    ...user.permissions,
                }));
            } else{
                setRolePermissions(prev => ({
                    ...prev,
                }));
            }
        }
    }, [user, reset]);

    const togglePermission = (roleId, permId) => {
        setRolePermissions(prev => {
            console.log(prev, "prev");
            
            const current = prev[roleId] || [];
            console.log(current, "Current permissions for role:", roleId);
            console.log(current.includes(permId), "current.includes(permId)");
            console.log(permId, "permId");
            // ROLES.map(roleId)?.permissions.forEach(p => console.log(p.id, "Available perm for role"));
            
            return {
                ...prev,
                permissions: {...current.includes(permId)},
            };
        });
    };

    const selectAllForRole = (roleId) => {
        const all = ROLES.find(r => r.id === roleId)?.permissions.map(p => p.id) || [];
        setRolePermissions(prev => ({ ...prev, [roleId]: all }));
    };

    const clearAllForRole = (roleId) => {
        setRolePermissions(prev => ({ ...prev, [roleId]: [] }));
    };

    console.log(rolePermissions, "rolePermissions");
    const onSubmit = async (data) => {
        console.log(data, "Data");
        console.log(activeRole, "activeRole");
        console.log(rolePermissions, "rolePermissions");
        
        const payload = {
            ...data,
            permissions: rolePermissions[activeRole] || {},
        };
        try {
            await apiClient.put(`/users/${userId}/`, payload);
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
                        <Label>
                            Role & Permissions
                            <span className="text-muted fw-normal ms-2" style={{ fontSize: "0.85rem" }}>
                                — select a tab to assign that role
                            </span>
                        </Label>

                        <Nav tabs>
                            {ROLES.map(role => {
                                const permCount = rolePermissions[role.id]?.length || 0;
                                return (
                                    <NavItem key={role.id}>
                                        <NavLink
                                            className={classnames({ active: activeRole === role.id }, "cursor-pointer")}
                                            onClick={() => setActiveRole(role.id)}
                                        >
                                            {role.label}
                                            {permCount > 0 && (
                                                <Badge
                                                    color={activeRole === role.id ? "primary" : "secondary"}
                                                    className="ms-2"
                                                    pill
                                                >
                                                    {permCount}
                                                </Badge>
                                            )}
                                        </NavLink>
                                    </NavItem>
                                );
                            })}
                        </Nav>

                        <TabContent activeTab={activeRole} className="border border-top-0 rounded-bottom p-3">
                            {ROLES.map(role => (
                                <TabPane tabId={role.id} key={role.id}>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <p className="text-muted mb-0">{role.description}</p>
                                        <div className="d-flex gap-2 ms-3 flex-shrink-0">
                                            <Button
                                                type="button"
                                                size="sm"
                                                color="outline-primary"
                                                onClick={() => selectAllForRole(role.id)}
                                            >
                                                Select all
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                color="outline-secondary"
                                                onClick={() => clearAllForRole(role.id)}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>

                                    <Row>
                                        {role.permissions.map(perm => (
                                            <Col md={6} key={perm.id} className="mb-2">
                                                <FormGroup check className="border rounded p-2">
                                                    <Label check className="w-100 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={(rolePermissions[role.id] || []).includes(perm.id)}
                                                            onChange={() => togglePermission(role.id, perm.id)}
                                                            className="me-2"
                                                        />
                                                        <strong>{perm.label}</strong>
                                                        <p className="text-muted mb-0 mt-1" style={{ fontSize: "0.8rem" }}>
                                                            {perm.description}
                                                        </p>
                                                    </Label>
                                                </FormGroup>
                                            </Col>
                                        ))}
                                    </Row>
                                </TabPane>
                            ))}
                        </TabContent>
                    </FormGroup>

                    <Button className="float-end" color="primary">Save Changes</Button>

                </Form>
            </FormProvider>
        </Page>
    );
};