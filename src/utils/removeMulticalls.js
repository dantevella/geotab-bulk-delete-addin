// Returns group dictionary
// typeof {}
function initializeDictionary(groups) {
  const groupsDict = {};
  groups.forEach(function (parentGroup) {
    const parentId = parentGroup.id;

    function addChildrenToGroup(id, group) {
      group.children.forEach(function (child) {
        groupsDict[child.id] = id;
        if (child.children) {
          child.children.forEach((gChild) => {
            groupsDict[gChild.id] = id;
            addChildrenToGroup(id, gChild);
          });
        }
      });
    }

    addChildrenToGroup(parentId, parentGroup);
  });

  console.log("Groups Dictionary:", groupsDict);
  return groupsDict;
}
function composeMulticall(groupsToRemove, groups) {
  const multicallArray = [];
  const deleteArray = [];
  const groupsDict = initializeDictionary(groups);
  console.log(groupsToRemove);
  console.log(groups);
  groupsToRemove.forEach((groupToRemove) => {
    function deleteGroup(groupId) {
      console.log({ groupId });
      const parentId = groupsDict[groupId];
      Object.keys(groupsDict).forEach((id) => {
        const value = groupsDict[id];
        if (value === groupId) {
          deleteGroup(id);
        }
      });
      multicallArray.push([
        "Remove",
        {
          typeName: "Group",
          entity: {
            id: groupId,
            parent: {
              id: parentId,
            },
          },
        },
      ]);
      deleteArray.push(groupId);
    }
    deleteGroup(groupToRemove);
  });

  console.log("List of multicalls", multicallArray);
  return [multicallArray, deleteArray];
}

async function performRemove(api, [multicalls, deleteArray]) {
  console.log(multicalls, deleteArray);
  await api.multiCall(multicalls);
  return deleteArray;
}

/**
 * Pass array of ids of groups to remove
 * Pass array of all of your groups
 * @param {object} api
 * @param {array} groupsToRemove
 * @param {array} groups
 */
function handleRemove(api, groupsToRemove, groups) {
  console.log(groupsToRemove, groups)
  return performRemove(api, composeMulticall(groupsToRemove, groups));
}

export default handleRemove;
