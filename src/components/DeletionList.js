import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociatingUser from "../utils/disassociatingUser";
import removeMulticalls from "../utils/removeMulticalls";

export function recursivelyFindChildren(groups, child) {
  // Returned Value
  const groupArray = [];
  // Group Id
  const { id } = child;
  // Current Group
  const currentGroup = groups.find((group) => group.id === id);
  if (currentGroup) {
    groupArray.push(currentGroup.id);
    if (currentGroup.children) {
      const returnedChildren = currentGroup.children.map((nextGroup) =>
        recursivelyFindChildren(groups, nextGroup)
      );
      returnedChildren.forEach((child) =>
        child.map((children) => groupArray.push(children))
      );
    }
  }
  return groupArray;
}

export function searchDownBranch(entityResults, childrenGroups) {
  const entityArray = entityResults.filter((entity) => {
    return entity.companyGroups.find(({ id }) =>
      childrenGroups.find((groupId) => groupId === id)
    );
  });
  return entityArray;
}
const DeletionList = (props) => {
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
        const userArray = searchDownBranch(userResults, childrenGroups);
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
        This group has user dependencies, please select either an existing group
        or the group named "Null Group" to move the user association into.
      </h3>
      {updatePrompt()}
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div style={{ paddingLeft: 10, color: "#008", fontSize: 18 }}>
              <div>
                User: <strong>{user.name}</strong> was in{" "}
                <strong>{groupDeleting && groupDeleting.name}</strong> and will
                be moved to:
              </div>
            </div>
            <select
              style={{
                paddingLeft: 10,
                color: "white",
                fontSize: 18,
                backgroundColor: "#008",
              }}
              name="groups"
              id="groups"
              key={user.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociatingUser(
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
        );
      })}
    </div>
  );
};
// update group list after delete
export default DeletionList;
