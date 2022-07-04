import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
} from "react";

type Props =
  | {
      $type: "wrong_answer" | "correct_answer";
    } & DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >;

const InputField = forwardRef<any, any>(
  ({ $type, ...nativeAttrs }: Props, ref) => {
    return (
      <div>
        <input
          data-testid={`input-${nativeAttrs.name || nativeAttrs.id}`}
          {...(nativeAttrs as any)}
          className={
            "w-full outline-none rounded-md border py-2 px-3 text-md bg-neutral-800 placeholder-gray-600 border-gray-600`"
          }
          ref={ref}
        />
      </div>
    );
  }
);

export const FormFieldWrapper = ({ children }: { children: any }) => (
  <div className="relative">{children}</div>
);

export default InputField;
