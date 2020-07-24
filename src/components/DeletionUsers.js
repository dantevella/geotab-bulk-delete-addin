import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateUsers from "../utils/disassociateUsers";
import removeMulticalls from "../utils/removeMulticalls";
import { recursivelyFindChildren } from "./DeletionList";
import { searchDownBranch } from "./DeletionList";

const DeletionUsers = (props) => {
  const [users, setUser] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  useEffect(() => {
    console.log(groupToDelete);
    async function disassociateUsers() {
      try {
        const userResults = await api.call("Get", {
          typeName: "User",
        });
        //make into functional component
        const userArray = searchDownBranch(
          userResults,
          childrenGroups,
          "companyGroups"
        );
        //fix this up to top comment
        setUser(userArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateUsers();
  }, [groupToDelete]);

  function updatePrompt() {
    if (users.length === 0) {
      return (
        <React.Fragment>
          <button
            type="button"
            onClick={async () => {
              await removeMulticalls(api, [groupToDelete], groups);
              setGroupToDelete(undefined);
            }}
            className="delete-buttons"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setGroupToDelete(undefined)}
            className="delete-buttons"
          >
            Cancel
          </button>
        </React.Fragment>
      );
    }
  }

  // grab group id from context
  //get users for groups
  // set the users into state

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">
        This group is assosciated with entities within the database.
        Please move these entities into a different group.
      </h3>
      <h3 className="list-head">Users Found In Group</h3>
      {updatePrompt()}
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div style={{ paddingLeft: 10, color: "#1070a9", fontSize: 18, display: "block", textAlign: "center"}}>
                User: <strong>{user.name}</strong> in{" "}
                <strong>{groupDeleting && groupDeleting.name}</strong> <br></br>move to group: &ensp;
            <select
              style={{
                paddingLeft: 10,
                color: "white",
                fontSize: 18,
                backgroundColor: "#1070a9",
              }}
              name="groups"
              id="groups"
              key={user.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociateUsers(
                    api,
                    newGroup,
                    user
                  );
                  setUser((u) => {
                    return u.filter((nuser) => {
                      if (nuser.id === dissassociate) {
                        return false;
                      }
                      return true;
                    });
                  });
                }
              }}
            >
              {groups.reduce((acc, group) => {
                // Group ID does not exist as child of current selection
                if (childrenGroups.indexOf(group.id) === -1) {
                  acc.push(
                    <option
                      key={group.id}
                      value={group.id}
                      label={group.name}
                    ></option>
                  );
                }
                return acc;
              }, [])}
            </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};
// update group list after delete
export default DeletionUsers;
