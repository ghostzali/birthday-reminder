import { check } from "express-validator";

export const createUserValidation = () => [
  check("firstName").notEmpty().withMessage("First name is required"),
  check("lastName").notEmpty().withMessage("Last name is required"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("dob").isISO8601().toDate().withMessage("Invalid date of birth"),
  check("city").notEmpty().withMessage("City is required"),
];
