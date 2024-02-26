import { Router } from "express";
import { login, registration } from "./agent.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./agent.validation";

const router: Router = Router();

router.post(
  "/signup",
  // validateRequest(UserValidation.createUserZodSchema),
  registration
);
router.post("/signin", login);


export const agentsRoutes = router;
