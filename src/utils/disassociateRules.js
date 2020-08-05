// Sample API invocation retrieves all "Rule" objects
async function disassociateRules(api, groupId, rule) {
  try {
    rule.groups = [{ id: groupId }];
    await api.call("Set", {
      typeName: "Rule",
      entity: rule,
    });
    return rule.id;
  } catch (err) {
    throw Error(err)
  }
}
export default disassociateRules;
//change function by creating a new file, copy and paste and call different name in order
//to set rule to a new group
