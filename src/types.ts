export interface GitFile {
  name: string;
  content: string;
  status: "untracked" | "modified" | "staged" | "committed";
  lastAction?: string;
}

export interface CommitNode {
  sha: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  parentSha?: string;
  files: { name: string; status: string }[];
}

export interface TerminalLine {
  text: string;
  type: "command" | "output" | "error" | "success" | "info";
}

export interface Lesson {
  id: string;
  title: string;
  shortTitle: string;
  intro: string;
  concept: string;
  interactiveGoal: string;
  targetCommand?: string; // e.g. "git add" or "git commit"
  completed: boolean;
  contentMarkdown: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isMock?: boolean;
}
