import { createContext, useState, useContext } from "react";

export const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export function ProjectProvider({ children }) {
	const [projectName, setProjectName] = useState(null);
	const [currentUserRole, setCurrentUserRole] = useState(null);
	const [projectId, setProjectId] = useState(null);
	return (
		<ProjectContext.Provider
			value={{
				projectName,
				setProjectName,
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
