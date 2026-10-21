import ruleModel from '../models/rule.js';
import outputDeviceModel from '../models/outputDevice.js';
import ruleSevice from '../services/ruleService.js';
const addRule = async (req, res) => {
  try {
    const newRule = new ruleModel.Rule(req.body);
    const saveRule = await newRule.save();

    res.status(200).json(saveRule);
  } catch (err) {
    res.status(500).json(err);
  }
}

const getAllRulesByOutputID = async (req, res) => {
  try {
    const outputID = req.params.outputID;
    const rules = await ruleSevice.getAllRulesByOutputID(outputID);
    res.status(200).json(rules);
  }catch(err){
    res.status(500).json(err);
  }
}

const updateRuleByID = async (req, res) => {
  try {
    const ruleID = req.params.ruleID;
    //find by ruleID
    const rule = await ruleModel.Rule.findById(ruleID);
    if(!rule){
      return res.status(404).json("Rule not found");
    }
    if(rule.type != req.body.type){
      return res.status(400).json("Cannot update rule");
    }
    //update device table
    await rule.updateOne({
      $set : req.body
    })
    res.status(200).json("Update rule successfully");
  } catch (err) {
    res.status(500).json(err);
  }
}

const getRuleByID = async (req, res) => {
  try {
    const ruleID = req.params.ruleID;
    const rule = await ruleModel.Rule.findById(ruleID);
    if(!rule){
      return res.status(404).json("Rule not found");
    }
    res.status(200).json(rule);
  } catch (err) {
    res.status(500).json(err);
  }
}

const deleteRuleByID = async (req, res) => {
  try {
    const ruleID = req.params.ruleID;
    const rule = await ruleModel.Rule.findByIdAndDelete(ruleID);
    if (!rule) {
      return res.status(404).json("Rule not found");
    }
    res.status(200).json(rule);
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  addRule: addRule,
  getAllRulesByOutputID: getAllRulesByOutputID,
  deleteRuleByID: deleteRuleByID,
  updateRuleByID: updateRuleByID,
  getRuleByID: getRuleByID
};