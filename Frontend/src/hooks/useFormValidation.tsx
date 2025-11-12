import { useState } from "react";
import { z } from "zod";

type ValidationSchema<T extends Record<string, z.ZodTypeAny>> = T;
type ValidationErrors<T extends Record<string, z.ZodTypeAny>> = Partial<
  Record<keyof T, string>
>;
type FormData<T extends Record<string, z.ZodTypeAny>> = {
  [K in keyof T]: z.infer<T[K]>;
};

interface UseFormValidationOptions<T extends Record<string, z.ZodTypeAny>> {
  schemas: ValidationSchema<T>;
  initialValues: FormData<T>;
  onSubmit?: (data: FormData<T>) => void | Promise<void>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export function useFormValidation<T extends Record<string, z.ZodTypeAny>>({
  schemas,
  initialValues,
  onSubmit,
  validateOnChange = true,
  validateOnBlur = true,
}: UseFormValidationOptions<T>) {
  const [formData, setFormData] = useState<FormData<T>>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // Validasi single field
  const validateField = (name: keyof T, value: unknown) => {
    const schema = schemas[name];
    if (!schema) return;

    const result = schema.safeParse(value);
    const error = result.success ? null : result.error.issues[0]?.message;

    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    return error;
  };

  // Validasi semua field
  const validateAllFields = () => {
    const newErrors: ValidationErrors<T> = {};
    let isValid = true;

    Object.keys(schemas).forEach((key) => {
      const fieldName = key as keyof T;
      const value = formData[fieldName];
      const result = schemas[fieldName].safeParse(value);

      if (!result.success) {
        newErrors[fieldName] = result.error.issues[0]?.message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);

    return isValid;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof T;

    setFormData((prev) => ({
      ...prev,
      [name]: value as FormData<T>[keyof T],
    }));

    // Validasi on change jika enabled dan field sudah pernah di-touch
    if (validateOnChange && (touched[fieldName] || value.trim() !== "")) {
      validateField(fieldName, value);
    }
  };

  // Handle blur
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof T;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));

    if (validateOnBlur) {
      validateField(fieldName, value);
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form...");

    // Mark all fields as touched
    const allTouched = Object.keys(schemas).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Record<keyof T, boolean>);
    setTouched(allTouched);

    // Validasi semua field
    const isValid = validateAllFields();
    console.log("Validation result:", isValid);

    if (isValid && onSubmit) {
      await onSubmit(formData);
      console.log("Submitted successfully!");
    }
  };

  // Reset form
  const resetForm = (values?: Partial<FormData<T>>) => {
    setFormData(values ? { ...initialValues, ...values } : initialValues);
    setErrors({});
    setTouched({});
  };

  // Set single field value
  const setFieldValue = <K extends keyof T>(
    name: K,
    value: FormData<T>[K] | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value as FormData<T>[K],
    }));
  };

  // Set single field error
  const setFieldError = (name: keyof T, error: string | null) => {
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  // Clear all errors
  const clearErrors = () => {
    setErrors({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateAllFields,
    resetForm,
    setFieldValue,
    setFieldError,
    clearErrors,
  };
}
