import React from "react";
import handleDelete from "../utils/removeMulticalls";

const List = (props) => {
  const { groups, api, isLoading, setAppState } = props;

  if (isLoading) {
    return (
      <p style={{ textAlign: 'center', fontSize: '30px' }}>
      Hold on, fetching data may take some time :)
    </p>
  );
}

  if (!groups || groups.length === 0) return <p>No groups, sorry</p>;
  return (
    <ul>
      <h2 className="list-head">Available Groups to Delete</h2>
      {groups.map((group) => {
        return (
          <button
            type="button"
            key={group.id}
            onClick={async () => {
              const deletedGroups = await handleDelete(api, [group.id], groups)
              console.log({deletedGroups})
              setAppState({
                loading: false,
                groups: groups.filter(group=> deletedGroups.indexOf(group.id)===-1),          
              });
            }}
            className="delete-buttons"
          >
            Delete
            <span className="repo-text">{" " + group.name} </span>
          </button>
        );
      })}
    </ul>
  );
};
export default List;
