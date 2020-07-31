import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateZones from "../utils/disassociateZones";
import { recursivelyFindChildren } from "./DeletionList";
import { searchDownBranch } from "./DeletionList";

const DeletionZones = (props) => {
  const [zones, setZone] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  useEffect(() => {
    async function disassociateZones() {
      try {
        const zoneResults = await api.call("Get", {
          typeName: "Zone",
        });
        //make into functional component
        console.log(zoneResults);
        const {entityArray: zoneArray, entitiesToRemove}= searchDownBranch(
          zoneResults,
          childrenGroups,
        );
        await Promise.all(entitiesToRemove.map((entity)=>{
          return api.call("Set",{
            typeName: "Zone",
            entity,
          })
        }))
        //fix this up to top comment
        setZone(zoneArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateZones();
  }, [groupToDelete]);

  // grab group id from context
  //get zones for groups
  // set the zones into state

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Zones Found In Group</h3>
      {zones.map((zone) => {
        return (
          <div key={zone.id}>
                        <div style={{ paddingLeft: 10, color: "#1070a9", fontSize: 18, display: "block", textAlign: "center"}}>
                Zone: <strong>{zone.name}</strong> in{" "}
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
              key={zone.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociateZones(
                    api,
                    newGroup,
                    zone
                  );
                  setZone((u) => {
                    return u.filter((nzone) => {
                      if (nzone.id === dissassociate) {
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
export default DeletionZones;
