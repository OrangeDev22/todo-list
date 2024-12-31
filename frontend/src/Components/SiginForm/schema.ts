import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is requried" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .nonempty({ message: "pPassword is requried" }),
});
