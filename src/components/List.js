import React from "react";
import handleDelete from "../utils/removeMulticalls";
import breakUsers from "../utils/disassociateUsers";

function recursiveGetChildren(
  groups,
  child,
  elements,
  level,
  setAppState,
  api
) {
  level++;
  const { id } = child;
  const currentChild = groups.find((group) => group.id === id);
  console.log(currentChild);
  if (currentChild){
    elements.push(
      <React.Fragment key ={currentChild.id}>
      <div
        style={{ paddingLeft: 10 * level, color: "white", fontSize: 22 }}
        >
        {currentChild.name}
      </div>
      <button
        type="button"
        onClick={async () => {

          await breakUsers(api, [currentChild.id]);   
          // users broken        
          const deletedGroups = await handleDelete(
            api,
            [currentChild.id],
            groups
            );
            console.log({ deletedGroups });
            setAppState({
              loading: false,
              groups: groups.filter(
                (group) => deletedGroups.indexOf(group.id) === -1
                ),
              });
            }}
            className="delete-buttons"
            >
        Delete
      </button>
    </React.Fragment>
  );
  currentChild.children.map((nextChild) => {
    return recursiveGetChildren(
      groups,
      nextChild,
      elements,
      level,
      setAppState,
      api
      );
    });
  }
}

const List = (props) => {
  const { groups, api, isLoading, setAppState } = props;

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
        recursiveGetChildren(groups, child, elements, level, setAppState, api);
        return elements;
      })}
    </div>
  );
};
export default List;
