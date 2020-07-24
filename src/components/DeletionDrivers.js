import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateDrivers from "../utils/disassociateDrivers";
import { recursivelyFindChildren } from "./DeletionList";
import { searchDownBranch } from "./DeletionList";

const DeletionDrivers = (props) => {
  const [drivers, setDriver] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  useEffect(() => {
    async function disassociateDrivers() {
      try {
        const driverResults = await api.call("Get", {
          typeName: "Driver",
        });
        //make into functional component
        console.log(driverResults);
        const driverArray = searchDownBranch(driverResults, childrenGroups);
        //fix this up to top comment
        setDriver(driverArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateDrivers();
  }, [groupToDelete]);

  // grab group id from context
  //get drivers for groups
  // set the drivers into state

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Drivers Found In Group</h3>
      {drivers.map((driver) => {
        return (
          <div key={driver.id}>
            <div style={{ paddingLeft: 10, color: "#1070a9", fontSize: 18 }}>
              <div>
                Driver: <strong>{driver.name}</strong> was in{" "}
                <strong>{groupDeleting && groupDeleting.name}</strong> and will
                be moved to:
              </div>
            </div>
            <select
              style={{
                paddingLeft: 10,
                color: "white",
                fontSize: 18,
                backgroundColor: "#1070a9",
              }}
              name="groups"
              id="groups"
              key={driver.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociateDrivers(
                    api,
                    newGroup,
                    driver
                  );
                  setDriver((u) => {
                    return u.filter((ndriver) => {
                      if (ndriver.id === dissassociate) {
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
export default DeletionDrivers;
