import ruleModel from '../models/rule.js';

const getAllRulesByOutputID = async (outputID) => {
  try {
    const rules = await ruleModel.Rule.find({
      outputID: outputID
    })
    return rules;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getAllRulesByOutputID: getAllRulesByOutputID
}