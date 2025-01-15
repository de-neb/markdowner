import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";

import {
  postCollaborator,
  getCollaborators,
  getCollaboratorRoles,
  updateCollaboratorRole,
  removeCollaborator,
} from "../client/collaboration";
import Dropdown from "./Dropdown";
import { collaborationActions } from "../store/slices/collaboration";
import { Collaboration } from "../client/type";

export default function ModalDetails({
  slot,
  onValueChange,
}: {
  slot: string | null;
  onValueChange: (value: string) => void;
}) {
  const dispatch = useDispatch();

  const [selectedRole, setSelectedRole] = useState("");

  const modal = useSelector((state: RootState) => state.modal);
  const documentId = useSelector(
    (state: RootState) => state.document.viewingDocument.id
  ) as string;
  const collaborators = useSelector(
    (state: RootState) => state.collaboration.collaborators
  ) as Collaboration[];
  const collaboratorRoles = useSelector(
    (state: RootState) => state.collaboration.collaboratorRoles
  );

  const collaboratorRoleNames = collaboratorRoles?.map((role) => role.name);

  const renameInputRef = useRef<HTMLInputElement>(null);
  const shareDocumentInputRef = useRef<HTMLInputElement>(null);

  const handleOnInput = () => {
    if (renameInputRef.current) {
      onValueChange(renameInputRef.current.value);
    }
  };

  const handleDropdownClick = () => {};

  const addCollaborator = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Enter" &&
      shareDocumentInputRef.current?.checkValidity()
    ) {
      await postCollaborator(
        shareDocumentInputRef.current.value,
        documentId as string
      );

      await getCollaborators(documentId);

      shareDocumentInputRef.current.value = "";
    } else {
      shareDocumentInputRef.current?.reportValidity();
    }
  };

  const handleUpdateCollaboratorRole = (id: string, role: string) => {
    setSelectedRole(role);
    dispatch(
      collaborationActions.updateCollaboratorRole({
        id,
        role,
      })
    );
  };

  const removeCollaboration = async (id: string) => {
    await removeCollaborator(id);
    await getCollaborators(documentId);
  };

  useEffect(() => {
    const loadCollaborators = async () => {
      await getCollaborators(documentId);
      await getCollaboratorRoles();
    };

    loadCollaborators();
  }, [documentId]);

  useEffect(() => {
    const updateRoles = async () => {
      await updateCollaboratorRole(collaborators);
    };

    if (modal.isConfirmed) {
      updateRoles();
    }
  }, [modal, collaborators]);

  switch (slot) {
    case "RenameInput":
      return (
        <input
          type="text"
          className="input input-bordered input-primary input-sm w-full mt-4"
          ref={renameInputRef}
          onBlur={handleOnInput}
        />
      );

    case "ShareDocument":
      return (
        <div className="flex flex-col gap-3">
          <label className="input input-bordered input-primary input-md flex justify-between items-center">
            <input
              required
              type="email"
              placeholder="Type email address and press enter to add..."
              className="w-full invalid:border-red-500"
              ref={shareDocumentInputRef}
              onKeyDown={addCollaborator}
            />
            <kbd className="kbd kbd-sm">Enter</kbd>
          </label>
          <h2 className="font-semibold text-md">People with access</h2>
          <ul className="flex flex-col gap-2">
            {collaborators?.map((collaborator) => (
              <li
                className="flex justify-between items-center hover:bg-slate-200"
                key={collaborator.id}
              >
                <span>{collaborator.user_email}</span>
                {collaborator.is_owner && (
                  <span className="text-slate-300 p-2">Owner</span>
                )}
                {!collaborator.is_owner && (
                  <Dropdown
                    dropdownClass="dropdown-top dropdown-end"
                    activatorClass="btn-sm rounded-md"
                    title={collaborator.role}
                    menuItemClick={handleDropdownClick}
                    activatorClick={() => setSelectedRole(collaborator.role)}
                  >
                    {collaboratorRoleNames?.map((role) => (
                      <li
                        className="p-0 cursor-pointer hover:bg-slate-200"
                        key={role}
                        onClick={() =>
                          handleUpdateCollaboratorRole(collaborator.id, role)
                        }
                      >
                        <div>
                          {selectedRole === role ? (
                            <i className="fa-solid fa-check pl-1"></i>
                          ) : (
                            <i className="px-2"></i>
                          )}
                          {role}
                        </div>
                      </li>
                    ))}
                    <div className="divider h-2 my-1"></div>
                    {/* <li>
                      <span>Transfer Ownership</span>
                    </li> */}
                    <li onClick={() => removeCollaboration(collaborator.id)}>
                      <span>Remove Access</span>
                    </li>
                  </Dropdown>
                )}
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}
