import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Form, FormGroup, Label, Input, Button, Row, Col } from "reactstrap";
import apiClient from "../apiClient";
import { useQuery } from "@tanstack/react-query";
import Page from "../Page";
import { FormInput } from "../FormInput";
import NotificationManager from "../common/NotificationManager";

export const EditUser = () => {
    const userId = window.location.pathname.split("/").pop();
    const { data:user, refetch } = useQuery({
        queryKey: ["users", userId],
        queryFn: () => apiClient.get(`/users/${userId}`).then(res => res.data),
    });
    const methods = useForm({
        defaultValues: {
        name: user?.name || "",
        company: user?.company || "",
        email: user?.email || ""
        }
    });
    const { handleSubmit, reset } = methods;
    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

  const onSubmit = async (data) => {
    try {
        await apiClient.put(`/users/${userId}/`, data);
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
                        <FormInput
                            id="name"
                            name="name"
                            type="text"
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <Label for="company">Company</Label>
                        <FormInput
                            id="company"
                            name="company"
                            type="text"
                        />
                    </FormGroup>
                </Col>
            </Row>

            <FormGroup>
                <Label for="email">Email</Label>
                <FormInput
                    id="email"
                    name="email"
                    type="email"
                />
            </FormGroup>

            <Button color="primary">Submit</Button>

        </Form>
        </FormProvider>
    </Page>
  );
}