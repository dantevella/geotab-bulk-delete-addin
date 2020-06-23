// Returns group dictionary
// typeof {}
function initializeDictionary(groups) {
  const groupsDict = {};
  groups.forEach(function (group) {
    const parentId = group.id;
    group.children.forEach(function (child) {
      groupsDict[child.id] = parentId;
    });
  });

  console.log("Groups Dictionary:", groupsDict);
  return groupsDict;
}

function composeMulticall(groupsToRemove, groups) {
  const multicallArray = [];
  const groupsDict = initializeDictionary(groups);
  groupsToRemove.forEach(function (groupid) {
    let parentId = groupsDict[groupid];
    multicallArray.push([
      "Remove",
      {
        typeName: "Group",
        entity: {
          id: groupid,
          parent: {
            id: parentId,
          },
        },
      },
    ]);
  });

  console.log("List of multicalls", multicallArray);
  return multicallArray;
}

function performRemove(api, multicalls) {
  api.multiCall(
    multicalls,
    function (results) {
      if (results) {
        results.forEach(function (result) {
          if (result !== null) {
            console.log(result);
          }
        });
      }
    },
    function (e) {
      console.log(e);
    }
  );
}

/**
 * Pass array of ids of groups to remove
 * Pass array of all of your groups
 * @param {object} api
 * @param {array} groupsToRemove
 * @param {array} groups
 */
function handleRemove(api, groupsToRemove, groups) {
  performRemove(api, composeMulticall(groupsToRemove, groups));
}

export default handleRemove;
