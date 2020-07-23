// Sample API invocation retrieves all "Device" objects
async function disassociateUsers(api, groupId) {
  try {
    let userArray = await api.call("Get", {
      typeName: "User",
    });
    userArray = userArray.filter((user) => {
      return user.companyGroups.find(({ id }) => id === groupId[0]);
    });
    console.log(userArray);
    await Promise.all(
      userArray.map(async (user) => {
        user.companyGroups = user.companyGroups.filter((companyGroup) => {
          return companyGroup === groupId[0];
        });
        console.log(user);
        return api.call("Set", {
          typeName: "User",
          entity: user,
        });
      })
    );
    console.log("Done Breaking associations");
    // break
  } catch (err) {
    console.log(err);
  }
}
export default disassociateUsers;
//change function by creating a new file, copy and paste and call different name in order
//to set user to a new group
