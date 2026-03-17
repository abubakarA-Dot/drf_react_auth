import { useFormContext } from "react-hook-form";
import { Input } from "reactstrap";
import { memo } from "react";

export const FormInput = memo(({ name, ...rest }) => {
  const { setValue, getValues } = useFormContext();

  return (
    <Input
      name={name}
      defaultValue={getValues(name)}
      onBlur={(e) => setValue(name, e.target.value)}
      {...rest}
    />
  );
});