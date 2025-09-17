import z from "zod";

export const validatePhone = (phone: string): string | null => {
  if (!phone.trim()) return "Phone number is required";
  if (!/^[0-9+\-\s()]+$/.test(phone))
    return "Please enter a valid phone number";
  if (phone.replace(/[^0-9]/g, "").length < 10)
    return "Phone number must be at least 10 digits";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address";
  return null;
};

export const validateName = (name: string): string | null => {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address.trim()) return "Address is required";
  if (address.trim().length < 10)
    return "Please provide a more detailed address";
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) return "Description is required";
  if (description.trim().length < 20)
    return "Description must be at least 20 characters";
  return null;
};

export const validateDateOfBirth = (dateOfBirth: string): string | null => {
  if (!dateOfBirth) return "Date of birth is required";

  const date = new Date(dateOfBirth);
  const today = new Date();

  if (isNaN(date.getTime())) return "Please enter a valid date";
  if (date > today) return "Date of birth cannot be in the future";

  const age = today.getFullYear() - date.getFullYear();
  if (age < 17) return "You must be at least 17 years old";
  if (age > 100) return "Please enter a valid date of birth";

  return null;
};

export const validateSkill = (skill: string): string | null => {
  if (!skill.trim()) return "Skill is required";
  if (skill.trim().length < 2) return "Skill must be at least 2 characters";
  return null;
}
export const validateSkillDetail = (skillDetail: string): string | null => {
  if (!skillDetail.trim()) return "Skill is required";
  if (skillDetail.trim().length < 20) return "Description must be at least 20 characters";
  return null;
}
