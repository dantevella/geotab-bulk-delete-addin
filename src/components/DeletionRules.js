import React, { useState, useEffect } from "react";
import { useApi } from "./ApiProvider";
import { useGroups, GroupsProvider } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateRules from "../utils/disassociateRules";
import { recursivelyFindChildren } from "./DeletionList";
import { searchDownBranch } from "./DeletionList";

const DeletionRules = (props) => {
  const [rules, setRule] = useState([]);
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  useEffect(() => {
    async function disassociateRules() {
      try {
        const ruleResults = await api.call("Get", {
          typeName: "Rule",
        });
        //make into functional component
        console.log(ruleResults);
        const {entityArray: ruleArray, entitiesToRemove}= searchDownBranch(
          ruleResults,
          childrenGroups,
        );
        await Promise.all(entitiesToRemove.map((entity)=>{
          return api.call("Set",{
            typeName: "Rule",
            entity,
          })
        }))
        //fix this up to top comment
        setRule(ruleArray);
      } catch (err) {
        console.log(err);
      }
    }
    disassociateRules();
  }, [groupToDelete]);

  // grab group id from context
  //get rules for groups
  // set the rules into state

  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Rules Found In Group</h3>
      {rules.map((rule) => {
        return (
          <div key={rule.id}>
                        <div style={{ paddingLeft: 10, color: "#1070a9", fontSize: 18, display: "block", textAlign: "center"}}>
                Rule: <strong>{rule.name}</strong> in{" "}
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
              key={rule.id}
              onChange={async (e) => {
                const newGroup = e.target.value;
                if (newGroup) {
                  const dissassociate = await disassociateRules(
                    api,
                    newGroup,
                    rule
                  );
                  setRule((u) => {
                    return u.filter((nrule) => {
                      if (nrule.id === dissassociate) {
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
export default DeletionRules;
