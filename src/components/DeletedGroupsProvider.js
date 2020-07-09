import React from "react";

const DeletedGroupsContext = React.createContext()

function useDeletedGroups(){
    const context = React.useContext(DeletedGroupsContext)
    if(!context){
        throw new Error("useDeletedGroups must be used within DeletedGroupsProvider")
    }
    return context;
}

function DeletedGroupsProvider(props){
    const { deletedGroups, setDeletedGroups } = props
    const value = React.useMemo(() => [deletedGroups, setDeletedGroups] ||[], [deletedGroups]);
    return <DeletedGroupsContext.Provider value={value} {...props} />
}

export {DeletedGroupsProvider, useDeletedGroups};