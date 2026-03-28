import { Router, type IRouter } from "express";
import healthRouter from "./health";
import twaRouter from "./twa/index";
import adminRouter from "./admin/index";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/twa", twaRouter);
router.use("/admin", adminRouter);

export default router;
