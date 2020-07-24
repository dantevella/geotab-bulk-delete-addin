// Sample API invocation retrieves all "Device" objects
async function disassociateZones(api, groupId, zone) {
  try {
    console.log(zone);
    zone.groups = [{ id: groupId }];
    await api.call("Set", {
      typeName: "Zone",
      entity: zone,
    });
    return zone.id;
  } catch (err) {
    console.log(err);
  }
}
export default disassociateZones;
//change function by creating a new file, copy and paste and call different name in order
//to set zone to a new group
