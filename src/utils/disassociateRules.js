// Sample API invocation retrieves all "Rule" objects
async function disassociateRules(api, groupId) {
  try {
    let ruleArray = await api.call("Get", {
      typeName: "Rule",
    });
    ruleArray = ruleArray.filter((rule) => {
      return rule.groups.find(({ id }) => id === groupId[0]);
    });
    console.log(ruleArray);
    await Promise.all(
      ruleArray.map(async (rule) => {
        rule.groups = rule.groups.filter((ngroup) => {
          return ngroup === groupId[0];
        });
        console.log(rule);
        return api.call("Set", {
          typeName: "Rule",
          entity: rule,
        });
      })
    );
    console.log("Done Breaking associations");
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociateRules;
//change function by creating a new file, copy and paste and call different name in order
//to set rule to a new group
