// Sample API invocation retrieves all "Device" objects
async function disassociateDevices(api, groupId) {
  try {
    let deviceArray = await api.call("Get", {
      typeName: "Device",
    });
    deviceArray = deviceArray.filter((device) => {
      return device.groups.find(({ id }) => id === groupId[0]);
    });
    console.log(deviceArray);
    await Promise.all(
      deviceArray.map(async (device) => {
        device.groups = device.groups.filter((ngroup) => {
          return ngroup === groupId[0];
        });
        console.log(device);
        return api.call("Set", {
          typeName: "Device",
          entity: device,
        });
      })
    );
    console.log("Done Breaking associations");
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociateDevices;
//change function by creating a new file, copy and paste and call different name in order
//to set device to a new group
