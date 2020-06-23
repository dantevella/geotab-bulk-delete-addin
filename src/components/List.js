import React from "react";
import handleDelete from "../utils/removeMulticalls";

const List = (props) => {
  const { groups, api } = props;
  if (!groups || groups.length === 0) return <p>No groups, sorry</p>;
  return (
    <ul>
      <h2 className="list-head">Available Groups to Delete</h2>
      {groups.map((group) => {
        return (
          <button type="button" key={group.id} onClick={()=>handleDelete(api, [group.id], groups)}className="delete-buttons">
            Delete
            <span className="repo-text">{" " + group.name} </span>
            <span className="repo-description">{group.description}</span>
          </button>
        );
      })}
    </ul>
  );
};
export default List;
