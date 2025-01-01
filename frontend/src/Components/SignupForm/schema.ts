import { z } from "zod";

export const signupFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is requried" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .nonempty({ message: "Password is requried" }),
  username: z.string().min(1, { message: "Username is required" }),
});
