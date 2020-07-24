import React from "react";
import { useApi } from "./ApiProvider";
import { useGroups } from "./GroupsProvider";
import { useIsLoading } from "./IsLoadingProvider";
import { useSetAppState } from "./SetAppStateProvider";
import { useDeletedGroups } from "./DeletedGroupsProvider";

function recursiveGetChildren(
  groups,
  child,
  elements,
  level,
  setGroupToDelete
) {
  level++;
  const { id } = child;
  const currentChild = groups.find((group) => group.id === id);
  console.log(currentChild);
  if (currentChild) {
    elements.push(
      <React.Fragment key={currentChild.id}>
        <div style={{ paddingLeft: 20 * level, color: "#1070a9", fontSize: 16, fontWeight: 600 }}>
          {currentChild.name}
        <button style={{marginLeft: 10}}
          type="button"
          onClick={() => {
            setGroupToDelete(currentChild.id);
          }}
          className="delete-buttons"
        >
          Delete
        </button></div>
      </React.Fragment>
    );
    currentChild.children.map((nextChild) => {
      return recursiveGetChildren(
        groups,
        nextChild,
        elements,
        level,
        setGroupToDelete
      );
    });
  }
}

const List = (props) => {
  const api = useApi();
  const groups = useGroups();
  const isLoading = useIsLoading();
  const setAppState = useSetAppState();
  const [groupToDelete, setGroupToDelete] = useDeletedGroups();

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", fontSize: "30px" }}>
        Hold on, fetching data may take some time :)
      </p>
    );
  }

  if (!groups || groups.length === 0) return <p>No groups, sorry</p>;
  const topLevelGroup = groups.find((group) => group.id === "GroupCompanyId");
  return (
    <div>
      <h2 className="list-head">Available Groups to Delete</h2>
      {topLevelGroup.children.map((child) => {
        const elements = [];
        const level = 0;
        recursiveGetChildren(groups, child, elements, level, setGroupToDelete);
        return elements;
      })}
    </div>
  );
};
export default List;
