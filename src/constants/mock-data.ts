import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    department: "CS",
    description:
      "Foundational concepts in programming, algorithms, and problem-solving.",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: 2,
    code: "MATH220",
    name: "Linear Algebra",
    department: "Math",
    description:
      "Matrix operations, vector spaces, and applications in engineering and data science.",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
  {
    id: 3,
    code: "AI310",
    name: "Machine Learning Fundamentals",
    department: "AI & Development",
    description:
      "Core supervised and unsupervised learning methods with practical modeling workflows.",
    createdAt: "2026-02-15T00:00:00.000Z",
  },
];
