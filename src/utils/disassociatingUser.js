// Sample API invocation retrieves all "Device" objects

async function disassociatingUser(api, groupId, user) {
  try {
    console.log(user);
    user.companyGroups= [{id:groupId}]
    await api.call("Set", {
      typeName: "User",
      entity: user,
    });
    return user.id;
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociatingUser;
//change function by creating a new file, copy and paste and call different name in order
//to set user to a new group
