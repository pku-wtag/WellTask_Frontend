import React from "react";
import { FieldWrapper } from "./FieldWrapper";

export interface CheckboxProps {
  id: string;
  name: string;
  label?: React.ReactNode;
  hint?: string;
}

export function Checkbox({ id, name, label, hint }: CheckboxProps) {
  return (
    <FieldWrapper id={id} name={name} label={undefined} hint={hint}>
      {(input) => (
        <div className="flex items-center gap-2">
          <input
            id={id}
            type="checkbox"
            checked={!!input.value}
            className="w-4 h-4"
          />
          {label && <span>{label}</span>}
        </div>
      )}
    </FieldWrapper>
  );
}
