export const generateTaskDescription = async (title: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return generateLocalDescription(title);
};

export const generateLocalDescription = (taskName: string): string => {
  const name = taskName.toLowerCase().trim();

  if (name.includes("meeting") || name.includes("call")) {
    return `Attend and participate in ${taskName}. Prepare agenda and take notes.`;
  } else if (name.includes("report") || name.includes("document")) {
    return `Create comprehensive ${taskName} with detailed analysis and findings.`;
  } else if (name.includes("review") || name.includes("check")) {
    return `Thoroughly review and evaluate ${taskName} for quality and completeness.`;
  } else if (name.includes("email") || name.includes("message")) {
    return `Draft and send professional ${taskName} with clear communication.`;
  } else if (name.includes("fix") || name.includes("bug")) {
    return `Identify, analyze, and resolve ${taskName} with proper testing.`;
  } else if (name.includes("test") || name.includes("testing")) {
    return `Execute comprehensive ${taskName} to ensure functionality and quality.`;
  } else if (name.includes("design") || name.includes("create")) {
    return `Design and develop ${taskName} following best practices and requirements.`;
  } else if (name.includes("plan") || name.includes("planning")) {
    return `Create detailed ${taskName} with timeline, resources, and milestones.`;
  } else if (name.includes("research")) {
    return `Conduct thorough research on ${taskName} and compile findings.`;
  } else if (name.includes("code") || name.includes("develop")) {
    return `Develop and implement ${taskName} with clean, maintainable code.`;
  } else {
    const templates = [
      `Complete ${taskName} with attention to detail and quality standards.`,
      `Execute ${taskName} following established procedures and guidelines.`,
      `Work on ${taskName} ensuring timely delivery and proper documentation.`,
      `Implement ${taskName} with focus on efficiency and effectiveness.`,
      `Handle ${taskName} professionally with clear communication and follow-up.`
    ];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  
};


