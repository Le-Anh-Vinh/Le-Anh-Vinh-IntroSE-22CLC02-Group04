import express from "express";
import { login, signup } from "../controllers/authController.js";

const router = express.Router();

router.get('/', login);
router.post('/signup', signup);

export default router;