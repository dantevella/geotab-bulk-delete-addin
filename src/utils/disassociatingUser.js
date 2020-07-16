async function disassociatingUser(api, groupId, user) {
  try {
    console.log(user);
    user.companyGroups = [{ id: groupId }];
    await api.call("Set", {
      typeName: "User",
      entity: user,
    });
    return user.id;
  } catch (err) {
    console.log(err);
  }
}
export default disassociatingUser;
