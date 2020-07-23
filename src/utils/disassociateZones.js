// Sample API invocation retrieves all "Device" objects
async function disassociateZones(api, groupId) {
  try {
    let zoneArray = await api.call("Get", {
      typeName: "Zone",
    });
    zoneArray = zoneArray.filter((zone) => {
      return zone.groups.find(({ id }) => id === groupId[0]);
    });
    console.log(zoneArray);
    await Promise.all(
      zoneArray.map(async (zone) => {
        zone.groups = zone.groups.filter((ngroup) => {
          return ngroup === groupId[0];
        });
        console.log(zone);
        return api.call("Set", {
          typeName: "Zone",
          entity: zone,
        });
      })
    );
    console.log("Done Breaking associations");
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociateZones;
//change function by creating a new file, copy and paste and call different name in order
//to set zone to a new group
