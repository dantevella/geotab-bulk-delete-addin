import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useIsLoading } from "./IsLoadingProvider";
import { useSetAppState } from "./SetAppStateProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";

const DeletionList = (props) => {
  const [users, setUser] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const isLoading = useIsLoading();
  const setAppState = useSetAppState();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();

  useEffect(() => {
    console.log(groupToDelete);
    async function disassociateUsers() {
      try {
        let userArray = await api.call("Get", {
          typeName: "User",
        });
        userArray = userArray.filter((user) => {
          return user.companyGroups.find(({ id }) => id === groupToDelete);
        });
        setUser(userArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateUsers();
  }, [groupToDelete]);

  // grab group id from context
  //get users for groups
  // set the users into state

  const groupDeleting=groups.find(group => group.id===groupToDelete)
  return (
    <div>
      <h3 className="list-head">This group has user dependencies, please select either an existing group or the group named "Null Group" to move the user association into.</h3>
      {/* map through user array & create elements
      users.map
      return from map is react element
      */}
      {users.map((user) => {
        return (
          <div>
            <div
              style={{ paddingLeft: 10, color: "#008", fontSize: 22 }}
            >
            {"User's Group Name: " + groupDeleting.name}
            <div>
            {"User Name: " + user.name}
            </div>
            </div>
            <select style={{ paddingLeft: 10, color: "white", fontSize: 18, backgroundColor: "#008"}} name="groups" id="groups" key={user.id}>
              {groups.map((group) => {
                return <option value={group.name} label={group.name}></option>;
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
};
export default DeletionList;
