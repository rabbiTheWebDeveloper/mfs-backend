import { Router } from "express";
import { login, registration, userUpdate } from "./agent.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./agent.validation";

const router: Router = Router();

router.post(
  "/signup",
  // validateRequest(UserValidation.createUserZodSchema),
  registration
);
router.post("/signin", login);
// router.post("/user-update/:id",userUpdate);

export const agentsRoutes = router;
