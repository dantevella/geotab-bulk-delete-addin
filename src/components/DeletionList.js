import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociatingUser from "../utils/disassociatingUser"
import disassociateUsers from "../utils/disassociateUsers";

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

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">
        This group has user dependencies, please select either an existing group
        or the group named "Null Group" to move the user association into.
      </h3>
      {users.map((user) => {
        return (
          <div key= {user.id}>
            <div style={{ paddingLeft: 10, color: "#008", fontSize: 18 }}>
              <div>
                User: <strong>{user.name}</strong> was in{" "}
                <strong>{groupDeleting.name}</strong> and will be moved to:
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
              onChange={async(e)=>{
                const newGroup=e.target.value
                if(newGroup){
                  //call a function to change user group
                  const dissassociate = await disassociatingUser(api, newGroup, user)
                  //value returned from disassociatingUser
                  //set new value into state
                  console.log(dissassociate)
                  setUser((u)=>{
                      return u.filter(nuser=> {
                        if(nuser.id===dissassociate){
                          return false
                        }
                        return true;
                      })
                  })
                  // setUser([dissassociate])
                }
                console.log("This is new array: " )
              }}
            >
              {groups.map((group) => {
                return <option key ={group.id} value={group.id} label={group.name} ></option>;
              })}
              
            </select>
          </div>
        );
      })}
    </div>
  );
};
export default DeletionList;
