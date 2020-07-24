// Sample API invocation retrieves all "Driver" objects
async function disassociateDrivers(api, groupId, driver) {
  try {
    console.log(driver);
    driver.groups = [{ id: groupId }];
    await api.call("Set", {
      typeName: "Driver",
      entity: driver,
    });
    return driver.id;
  } catch (err) {
    console.log(err);
  }
}
export default disassociateDrivers;
//change function by creating a new file, copy and paste and call different name in order
//to set driver to a new group
