import { Router } from "express";
import { signin, signup, profile } from "../controllers/auth.controllers";
import { TokenValidation } from "../libs/varifyTocken";

const router: Router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/profile", TokenValidation, profile);

export default router;
