import { Router } from "express";
import { signin, register, profile } from "../controllers/auth.controllers";

const router: Router = Router();

router.post("/signin", signin);
router.post("/register", register);
router.get("/profile", profile);

export default router;
