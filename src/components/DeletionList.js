import React from "react";
import DeletionUsers from "./DeletionUsers";
import DeletionZones from "./DeletionZones";
import DeletionDevices from "./DeletionDevices";
import DeletionRules from "./DeletionRules";
import { useState } from "react";
import { useApi } from "./ApiProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";
import removeMulticalls from "../utils/removeMulticalls";
import { useGroups } from "./GroupsProvider";

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
export function searchDownBranch(
  entityResults,
  childrenGroups,
  searchAttribute = "groups"
) {
  const foundEntities = entityResults.reduce(
    (accValue, entity) => {
      let containsAssociatedEntity = false;
      let containsOutsideEntity = false;

      let groupIds = entity[searchAttribute].map(({ id }) => id);

      groupIds.forEach((groupId) => {
        if (childrenGroups.indexOf(groupId) === -1) {
          containsOutsideEntity = true;
        }

        if (childrenGroups.indexOf(groupId) > -1) {
          containsAssociatedEntity = true;
        }
      });

      if (containsOutsideEntity && containsAssociatedEntity) {
        accValue.entitiesToRemove.push(entity);
      } else if (containsAssociatedEntity) {
        accValue.entityArray.push(entity);
      }

      return accValue;
    },
    { entityArray: [], entitiesToRemove: [] }
  );

  const { entityArray, entitiesToRemove } = foundEntities;

  console.log("entities to remove: ", { entitiesToRemove });
  // Entities to remove should be broken... here or somewhere else
  if (entitiesToRemove.length > 0) {
    const newUsers = entitiesToRemove.map((entity) => {
      entity[searchAttribute] = entity[searchAttribute].filter(
        ({ id }) => childrenGroups.indexOf(id) === -1
      );
      if (entity.driverGroups) {
        entity.driverGroups = entity.driverGroups.filter(
          ({ id }) => childrenGroups.indexOf(id) === -1
        );
      }
      return entity;
    });
  }
  return { entityArray, entitiesToRemove };
}
/**
 * @param {Object} api - the api object
 * @param {Array} childrenGroups - children groups
 * @param {String} typeName - what type of entity to fetch (i.e. Device, Zone, User, Rule)
 * @param {Function} setter - the setState for the entity type
 * @param {String} getter - an optional get attribute for the searchDownBranch function
 */
const initialDataFetch = async (
  api,
  childrenGroups,
  typeName,
  setter,
  getter
) => {
  try {
    const results = await api.call("Get", {
      typeName,
    });
    const { entityArray, entitiesToRemove } = searchDownBranch(
      results,
      childrenGroups,
      getter
    );
    await Promise.all(
      entitiesToRemove.map((entity) => {
        return api.call("Set", { typeName, entity });
      })
    );
    //fix this up to top comment
    setter(entityArray);
  } catch (err) {
    console.log(err);
  }
};

const DeletionList = (props) => {
  // States users, zones, devices, rules
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [zones, setZones] = useState([]);
  const [users, setUsers] = useState([]);
  const [rules, setRules] = useState([]);
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();
  const groups = useGroups();
  const api = useApi();
  // data fetching
  const childrenGroups = recursivelyFindChildren(groups, { id: groupToDelete });
  React.useEffect(() => {
    async function fetchAllData() {
      await initialDataFetch(api, childrenGroups, "Device", setDevices);
      await initialDataFetch(api, childrenGroups, "Zone", setZones);
      await initialDataFetch(api, childrenGroups, "Rule", setRules);
      await initialDataFetch(
        api,
        childrenGroups,
        "User",
        setUsers,
        "companyGroups"
      );
      setLoading(false);
    }
    fetchAllData();
  }, [groupToDelete]);
  console.log(rules);

  const canDelete =
    loading === false &&
    users.length === 0 &&
    zones.length === 0 &&
    rules.length === 0 &&
    devices.length === 0;

  return (
    <>
      {!canDelete && (
        <h3 className="list-head">
          This group is assosciated with entities within the database. Please
          move these entities into a different group.
        </h3>
      )}
      {canDelete && (
        <>
          <h3 className="list-head">
            This group has no associated entities, you may click on delete in
            order to delete the group, or you can click on cancel to cancel the
            request to delete this group.
          </h3>
          <div style={{ alignSelf: "center", display: "flex" }}>
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
          </div>
        </>
      )}
      {/* Pass values & setters as props to each list */}
      <DeletionUsers users={users} setUsers={setUsers} />
      <DeletionZones zones={zones} setZones={setZones} />
      <DeletionDevices devices={devices} setDevices={setDevices} />
      <DeletionRules rules={rules} setRules={setRules} />
    </>
  );
};
// update group list after delete
export default DeletionList;
