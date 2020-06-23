import React from "react";
import handleDelete from "../utils/removeMulticalls";

const List = (props) => {
  //handleDelete(api, [id to delete], groups)
  const { groups, api } = props;
  if (!groups || groups.length === 0) return <p>No groups, sorry</p>;
  return (
    <ul>
      <h2 className="list-head">Available Groups to Delete</h2>
      {groups.map((groups) => {
        return (
          <button type="button" key={groups.id} className="delete-buttons">
            Delete
            <span className="repo-text">{" " + groups.name} </span>
            <span className="repo-description">{groups.description}</span>
          </button>
        );
      })}
    </ul>
  );
};
export default List;
