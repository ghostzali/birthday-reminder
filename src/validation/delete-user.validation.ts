import { check } from "express-validator";

export const deleteUserValidation = () => [
  check("userId").isInt().withMessage("Invalid user ID"),
];
