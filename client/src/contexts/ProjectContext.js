import { createContext, useState, useContext, useEffect } from "react";

export const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export function ProjectProvider({ children, ...otherProps }) {
	const [currentUserRole, setCurrentUserRole] = useState(
		otherProps.currentUserRole
	);
	const [projectId, setProjectId] = useState(otherProps.projectId);

	return (
		<ProjectContext.Provider
			value={{
				currentUserRole,
				setCurrentUserRole,
				projectId,
				setProjectId,
			}}
		>
			{children}
		</ProjectContext.Provider>
	);
}
