import express from "express";
import { login, register } from "../controllers/authController.js";
const router = express.Router();

router
  .post("/register", register)
  .post("/login", login)

export default router;
