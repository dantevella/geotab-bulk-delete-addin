// Sample API invocation retrieves all "Driver" objects
async function disassociateDrivers(api, groupId) {
  try {
    let driverArray = await api.call("Get", {
      typeName: "Driver",
    });
    driverArray = driverArray.filter((driver) => {
      return driver.groups.find(({ id }) => id === groupId[0]);
    });
    console.log(driverArray);
    await Promise.all(
      driverArray.map(async (driver) => {
        driver.groups = driver.groups.filter((ngroup) => {
          return ngroup === groupId[0];
        });
        console.log(driver);
        return api.call("Set", {
          typeName: "Driver",
          entity: driver,
        });
      })
    );
    console.log("Done Breaking associations");
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociateDrivers;
//change function by creating a new file, copy and paste and call different name in order
//to set driver to a new group
