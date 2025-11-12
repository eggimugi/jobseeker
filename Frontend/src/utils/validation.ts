import { z } from "zod";
const genderEnum = ["Male", "Female"] as const;
const roleEnum = ["HRD", "Society"] as const;

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number")
  .refine(
    (phone) => phone.replace(/[^0-9]/g, "").length >= 12,
    "Phone number must be at least 12 digits"
  );

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .trim()
  .regex(/^\S+$/, "Please input a valid password")
  .min(8, "Password must be at least 8 characters");

export const confirmPasswordSchema = z
  .string()
  .min(1, "Please confirm your password");

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .min(2, "Name must be at least 2 characters");

export const addressSchema = z
  .string()
  .trim()
  .min(1, "Address is required")
  .min(10, "Please provide a more detailed address");

export const descriptionSchema = z
  .string()
  .trim()
  .min(1, "Description is required")
  .min(20, "Description must be at least 20 characters");

export const dateOfBirthSchema = z
  .string()
  .min(1, "Date of birth is required")
  .refine(
    (date) => !isNaN(new Date(date).getTime()),
    "Please enter a valid date"
  )
  .refine(
    (date) => new Date(date) <= new Date(),
    "Date of birth cannot be in the future"
  )
  .refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 17;
  }, "You must be at least 17 years old")
  .refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age <= 100;
  }, "Please enter a valid date of birth");

export const skillSchema = z
  .string()
  .trim()
  .min(1, "Skill is required")
  .min(2, "Skill must be at least 2 characters");

export const skillDetailSchema = z
  .string()
  .trim()
  .min(1, "Skill is required")
  .min(20, "Description must be at least 20 characters");

export const positionNameSchema = z
  .string()
  .trim()
  .min(1, "Position name is required")
  .min(2, "Position name must be at least 2 characters");

export const capacitySchema = z
  .string()
  .trim()
  .min(1, "Capacity is required")
  .refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Capacity must be a positive number"
  );

export const submissionDateSchema = z
  .string()
  .min(1, "Date is required")
  .refine(
    (date) => !isNaN(new Date(date).getTime()),
    "Please enter a valid date"
  );

export const genderSchema = z.enum(genderEnum, {
  message: "Gender is required",
});

export const roleSchema = z
  .enum(roleEnum)
  .or(z.literal(""))
  .refine((val) => val !== "", {
    message: "Role is required",
  });

export const websiteSchema = z
  .string()
  .trim()
  .min(1, "Website is required")
  .url("Please enter a valid URL");

export const foundedYearSchema = z.coerce
  .number()
  .min(1900, "Please enter a valid year")
  .max(new Date().getFullYear(), "Please enter a valid year");

export const industrySchema = z
  .string()
  .trim()
  .min(1, "Industry is required")
  .min(2, "Industry must be at least 2 characters");

export const companySizeSchema = z
  .string()
  .trim()
  .min(1, "Company size is required")
  .min(1, "Company size must be at least 1 character");

export const logoSchema = z
  .any()
  .refine((file) => file instanceof File || file === null, {
    message: "Logo must be a file or null",
  })
  .refine(
    (file) => {
      if (file instanceof File) {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        return validTypes.includes(file.type);
      }
      return true; // Allow null
    },
    {
      message: "Logo must be a JPEG, PNG, or GIF image",
    }
  );
