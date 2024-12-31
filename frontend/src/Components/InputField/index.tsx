import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import cc from "classcat";

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
          className={cc([
            "w-full outline-none rounded-md border py-2 px-3  bg-neutral-800 placeholder-gray-600 border-gray-600",
            nativeAttrs.className,
          ])}
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
