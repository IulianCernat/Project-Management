import { createContext, useState, useContext } from "react";

export const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export function ProjectProvider({ children, ...otherProps }) {
	const [currentUserRole, setCurrentUserRole] = useState(otherProps.currentUserRole);
	const [projectId, setProjectId] = useState(otherProps.projectId);
	const [trelloBoardId, setTrelloBoardId] = useState(otherProps.trelloBoardId);
	return (
		<ProjectContext.Provider
			value={{
				currentUserRole,
				setCurrentUserRole,
				projectId,
				setProjectId,
				trelloBoardId,
				setTrelloBoardId,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
}
