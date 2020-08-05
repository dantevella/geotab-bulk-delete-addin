import React from "react";
import { useApi } from "./ApiProvider";
import { useGroups } from "./GroupsProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import disassociateRules from "../utils/disassociateRules";
import { recursivelyFindChildren } from "./DeletionList";

const DeletionRules = (props) => {
  const { rules, setRules } = props;
  const [error, setError] = React.useState();
  const api = useApi();
  const groups = useGroups();
  const [groupToDelete] = useDeletedGroups();

  if (error) {
    return <div>{error}</div>;
  }

  if (rules.length === 0) return null;

  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  const groupDeleting = groups.find((group) => group.id === groupToDelete);
  return (
    <div>
      <h3 className="list-head">Rules Found In Group</h3>
      {rules.map((rule) => {
        return (
          <div key={rule.id}>
            <div
              style={{
                paddingLeft: 10,
                color: "#1070a9",
                fontSize: 18,
                display: "block",
                textAlign: "center",
              }}
            >
              Rule: <strong>{rule.name}</strong> in{" "}
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
                key={rule.id}
                onChange={async (e) => {
                  const newGroup = e.target.value;
                  if (newGroup) {
                    try {
                      const dissassociate = await disassociateRules(
                        api,
                        newGroup,
                        rule
                      );
                      setRules((u) => {
                        return u.filter((nrule) => {
                          if (nrule.id === dissassociate) {
                            return false;
                          }
                          return true;
                        });
                      });
                    } catch (err) {
                      setError(`
                      Error occurred preventing deletion: ${err.name}
                      ${err.message}

                      The system is unsure how to remove the following relationships:
                      ${JSON.stringify(Object.keys(err.data).filter(dataType => {
                        err.data[dataType].length !== 0
                      }).map(dataType => err.data[dataType]))}
                      `);
                    }
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
