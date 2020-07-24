// Sample API invocation retrieves all "Device" objects
async function disassociateDevices(api, groupId, device) {
  try {
    console.log(device);
    device.groups = [{ id: groupId }];
    await api.call("Set", {
      typeName: "Device",
      entity: device,
    });
    return device.id;
  } catch (err) {
    console.log(err);
  }
}
export default disassociateDevices;
//change function by creating a new file, copy and paste and call different name in order
//to set device to a new group
