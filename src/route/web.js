import express from "express";
import homeController from "../controllers/homeController";
import authenticateToken from "../services/authMiddleware"


// Express 4 does not catch errors from async handlers; without this a
// failed DB query becomes an unhandled rejection and kills the server
const wrap = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

let router = express.Router();
let initWebRoutes = (app) => {
  router.get('/', authenticateToken, wrap(homeController.getHomePage));
  router.get('/dashBoard', wrap(homeController.getDashBoard));
  router.get('/dash-board', (req, res) => res.redirect('/dashBoard')); // old URL
  router.get('/api/devices', wrap(homeController.getDevices));
  router.post('/api/controlDevice', wrap(homeController.controlDevice));
  router.post('/api/createDevice', wrap(homeController.createDevice));
  router.post('/api/createScheduler', wrap(homeController.createScheduler));
  router.get('/api/getScheduler', wrap(homeController.getScheduler));
  router.post('/devices', wrap(homeController.postDevice));
  router.get('/nhietDo', wrap(homeController.getNhietDo));
  router.get('/doAmKhongKhi', wrap(homeController.getDoAmKhongKhi));
  router.get('/doAmDat', wrap(homeController.getDoAmDat));
  router.get('/anhSang', wrap(homeController.getAnhSang));
  router.get('/lapLich', wrap(homeController.getLapLich));
  router.get('/caiDatThoiGian', wrap(homeController.getCaiDatThoiGian));
  router.get('/chinhSuaThoiGian/:schedulerID', wrap(homeController.getChinhSuaThoiGian));
  router.get('/dangNhap', wrap(homeController.getDangNhap));
  return app.use("/", router)
}

module.exports = initWebRoutes;