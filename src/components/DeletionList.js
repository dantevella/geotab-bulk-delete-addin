import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociatingUser from "../utils/disassociatingUser";
import removeMulticalls from "../utils/removeMulticalls";

const DeletionList = (props) => {
  const [users, setUser] = useState([]);
  const api = useApi();
  const groups = useGroups();
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
        userArray.push(
          ...userArray.filter((user) => {
            return user.companyGroups.find(
              ({ id }) =>
                id === recursivelyFindChildren(groups, { id: groupToDelete }, user, userArray)
            );
          })
        );
        setUser(userArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateUsers();
  }, [groupToDelete]);

  function recursivelyFindChildren(groups, child, entity, entityArray) {
    const { id } = child;
    const currentChild = groups.find((group) => group.id === id);
    if (currentChild) {
      const moveEntity = entity;
      const moveList = entityArray
      currentChild.children.map((nextChild) => {
        return recursivelyFindChildren(groups, nextChild);
      });
    }
  }

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
                  console.log(dissassociate);
                  setUser((u) => {
                    return u.filter((nuser) => {
                      if (nuser.id === dissassociate) {
                        return false;
                      }
                      return true;
                    });
                  });
                }
                console.log("This is new array: ");
              }}
            >
              {groups.map((group) => {
                return (
                  <option
                    key={group.id}
                    value={group.id}
                    label={group.name}
                  ></option>
                );
              })}
            </select>
          </div>
        );
      })}
    </div>
  );
};
// update group list after delete
export default DeletionList;
