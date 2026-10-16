// Project types offered in the project dialog. Create/update only store these values, so the dialog
// options and the server check can't drift apart (a duplicated option value once saved "Cross platform
// playable" as "terminal").
export const PROJECT_TYPES = [
	{ value: "web", label: "Web Playable" },
	{ value: "mobile", label: "Mobile App" },
	{ value: "desktop", label: "Desktop App" },
	{ value: "terminal", label: "Terminal App" },
	{ value: "cross-platform", label: "Cross platform playable" },
] as const

export const isProjectType = (value: string): boolean => PROJECT_TYPES.some(type => type.value === value)

// Label for display; values from before this list existed are shown as stored
export const projectTypeLabel = (value: string): string =>
	PROJECT_TYPES.find(type => type.value === value)?.label ?? value
