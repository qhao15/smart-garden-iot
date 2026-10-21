import ruleController from '../controllers/ruleController.js';
import express from "express";

const ruleRouter = express.Router();
ruleRouter.post('/', ruleController.addRule);
ruleRouter.get('/all/:outputID', ruleController.getAllRulesByOutputID);
ruleRouter.put('/:ruleID', ruleController.updateRuleByID);
ruleRouter.get('/:ruleID', ruleController.getRuleByID);
ruleRouter.delete('/:ruleID', ruleController.deleteRuleByID);
export default ruleRouter;