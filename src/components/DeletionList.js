import React from "react";
import DeletionUsers from "./DeletionUsers";
import DeletionZones from "./DeletionZones";
import DeletionDevices from "./DeletionDevices";
import DeletionDrivers from "./DeletionDrivers";
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
  const entityArray = entityResults.filter((entity) => {
    return entity[searchAttribute].find(({ id }) =>
      childrenGroups.find((groupId) => groupId === id)
    );
  });
  return entityArray;
}

const DeletionList = (props) => {
  return (
    <>
      <DeletionUsers /> <DeletionZones /> <DeletionDevices />{" "}
      <DeletionDrivers /> <DeletionRules />
    </>
  );
};
// update group list after delete
export default DeletionList;
