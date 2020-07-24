import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateDevices from "../utils/disassociateDevices";
import { recursivelyFindChildren } from "./DeletionList";
import { searchDownBranch } from "./DeletionList";

const DeletionDevices = (props) => {
  const [devices, setDevice] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  useEffect(() => {
    async function disassociateDevices() {
      try {
        const deviceResults = await api.call("Get", {
          typeName: "Device",
        });
        //make into functional component
        console.log(deviceResults);
        const deviceArray = searchDownBranch(deviceResults, childrenGroups);
        //fix this up to top comment
        setDevice(deviceArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateDevices();
  }, [groupToDelete]);

  // grab group id from context
  //get devices for groups
  // set the devices into state

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Devices Found In Group</h3>
      {devices.map((device) => {
        return (
          <div key={device.id}>
            <div style={{ paddingLeft: 10, color: "#1070a9", fontSize: 18 }}>
              <div>
                Device: <strong>{device.name}</strong> was in{" "}
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
              key={device.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociateDevices(
                    api,
                    newGroup,
                    device
                  );
                  setDevice((u) => {
                    return u.filter((ndevice) => {
                      if (ndevice.id === dissassociate) {
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
export default DeletionDevices;
