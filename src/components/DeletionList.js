import React from "react";
import DeletionUsers from "./DeletionUsers";
import DeletionZones from "./DeletionZones";
import DeletionDevices from "./DeletionDevices";
import DeletionRules from "./DeletionRules";

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
  if ( entitiesToRemove.length>0 ) {
      const newUsers = entitiesToRemove.map(entity=>{
        entity[searchAttribute] = entity[searchAttribute].filter(({id}) => (
          childrenGroups.indexOf(id) === -1
        ));
        if (entity.driverGroups) {
          entity.driverGroups = entity.driverGroups.filter(({id}) => (
            childrenGroups.indexOf(id) === -1
          ));
        }
        return entity
      });
      console.log({newUsers})
  }
  return {entityArray, entitiesToRemove}
}

const DeletionList = (props) => {
  return (
    <>
      <DeletionUsers />
      <DeletionZones />
      <DeletionDevices />
      <DeletionRules />
    </>
  );
};
// update group list after delete
export default DeletionList;
