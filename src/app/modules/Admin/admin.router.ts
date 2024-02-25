import { Router } from "express";
import { login, registration, userUpdate } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./admin.validation";

const router: Router = Router();

router.post(
  "/signup",
  // validateRequest(UserValidation.createUserZodSchema),
  registration
);
router.post("/signin", login);
// router.post("/user-update/:id",userUpdate);

export const adminRoutes = router;
