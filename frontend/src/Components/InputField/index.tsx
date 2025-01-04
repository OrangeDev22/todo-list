import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
} from "react";
import { twMerge } from "tailwind-merge";

type Props =
  | {
      isError: boolean;
      errorMessage: string;
    } & DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >;

const InputField = forwardRef<any, any>(
  ({ isError, errorMessage, ...nativeAttrs }: Props, ref) => {
    return (
      <div className="w-full">
        <input
          data-testid={`input-${nativeAttrs.name || nativeAttrs.id}`}
          className={twMerge(
            "w-full outline-none rounded-md border py-2 px-3 bg-neutral-800 placeholder-gray-600",
            !isError ? "border-gray-600" : "border-red-500",
            nativeAttrs.className
          )}
          {...nativeAttrs}
          ref={ref}
        />
        {isError && errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default InputField;
