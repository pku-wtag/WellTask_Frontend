import React from "react";
import { FieldWrapper } from "./FieldWrapper";

export type Option = { value: string; label: string };

export interface RadioProps {
  name: string;
  options: Option[];
  label?: React.ReactNode;
  hint?: string;
}

export function Radio({ name, options, label, hint }: RadioProps) {
  return (
    <FieldWrapper id={name} name={name} label={label} hint={hint}>
      {(input) => (
        <div className="flex flex-col gap-1">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name={input.name}
                value={opt.value}
                checked={input.value === opt.value}
                onChange={() => {}}
                className="w-4 h-4"
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
      )}
    </FieldWrapper>
  );
}
