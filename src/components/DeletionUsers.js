import React from "react";
import { useApi } from "./ApiProvider";
import { useGroups } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateUsers from "../utils/disassociateUsers";
import { recursivelyFindChildren } from "./DeletionList";

const DeletionUsers = (props) => {
  const { users, setUsers } = props;
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete] = useDeletedGroups();

  if (users.length === 0) return null;

  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Users Found In Group</h3>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <div
              style={{
                paddingLeft: 10,
                color: "#1070a9",
                fontSize: 18,
                display: "block",
                textAlign: "center",
              }}
            >
              User: <strong>{user.name}</strong> in{" "}
              <strong>{groupDeleting && groupDeleting.name}</strong> <br></br>
              move to group: &ensp;
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
                    setUsers((u) => {
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
