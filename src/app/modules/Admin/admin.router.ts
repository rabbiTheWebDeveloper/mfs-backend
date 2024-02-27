import { Router } from "express";
import { adminController, } from "./admin.controller";
import validateRequest from "../../middleware/validateRequest";
import { UserValidation } from "./admin.validation";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router: Router = Router();

router.post(
  "/signup",
  // validateRequest(UserValidation.createUserZodSchema),
  adminController.registration
);
router.post("/signin", adminController.login);
router.post("/user-update/:id",auth, adminController.userUpdateOnDB);
router.post("/agent-update/:id",auth, adminController.agentApprovedUpdateOnDB);
router.post("/cash-out-admin",auth, adminController.cashOutUserIntoDB);
router.post("/user-list",auth, adminController.userListInDB);
router.post("/agent-list",auth, adminController.agentListInDB);

export const adminRoutes = router;
