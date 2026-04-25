export interface GradingBreakdown {
  exams: number;
  projects: number;
  homework: number;
  participation: number;
}

export interface Resource {
  title: string;
  type: string;
  url: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  syllabusAvailable: boolean;
  recordingPolicy: "Asynchronous Friendly" | "In-Person Only";
  textbookCost: number;
  clarityScore: number;
  verifiedCount: number;
  gradingBreakdown: GradingBreakdown;
  resources: Resource[];
}

export const mockCourses: Course[] = [
  {
    id: "1",
    code: "CS-UY 2124",
    name: "Object Oriented Programming",
    professor: "Prof. Douglas Troeger",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 0,
    clarityScore: 4,
    verifiedCount: 87,
    gradingBreakdown: { exams: 50, projects: 30, homework: 15, participation: 5 },
    resources: [
      { title: "Lecture Slides — Week 3: Inheritance", type: "PDF", url: "#" },
      { title: "Study Guide: Polymorphism & Interfaces", type: "PDF", url: "#" },
      { title: "Past Midterm Practice Set (2023)", type: "PDF", url: "#" },
      { title: "C++ Cheat Sheet — STL Containers", type: "PDF", url: "#" },
    ],
  },
  {
    id: "2",
    code: "MATH-UA 120",
    name: "Discrete Mathematics",
    professor: "Prof. Yuri Tschinkel",
    syllabusAvailable: true,
    recordingPolicy: "In-Person Only",
    textbookCost: 89,
    clarityScore: 3,
    verifiedCount: 62,
    gradingBreakdown: { exams: 60, projects: 0, homework: 30, participation: 10 },
    resources: [
      { title: "Problem Set 5 — Graph Theory Solutions", type: "PDF", url: "#" },
      { title: "Proof Writing Workshop Notes", type: "PDF", url: "#" },
      { title: "Logic Gates Visual Reference", type: "Image", url: "#" },
    ],
  },
  {
    id: "3",
    code: "CS-UY 3083",
    name: "Introduction to Databases",
    professor: "Prof. Anasse Bari",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 45,
    clarityScore: 5,
    verifiedCount: 104,
    gradingBreakdown: { exams: 40, projects: 40, homework: 15, participation: 5 },
    resources: [
      { title: "ER Diagram Template (Blank)", type: "PDF", url: "#" },
      { title: "SQL Query Cheat Sheet", type: "PDF", url: "#" },
      { title: "Final Project: Schema Design Example", type: "PDF", url: "#" },
      { title: "Normalization Rules Summary", type: "PDF", url: "#" },
    ],
  },
  {
    id: "4",
    code: "ECON-UA 1",
    name: "Introduction to Microeconomics",
    professor: "Prof. Lawrence White",
    syllabusAvailable: true,
    recordingPolicy: "In-Person Only",
    textbookCost: 120,
    clarityScore: 4,
    verifiedCount: 231,
    gradingBreakdown: { exams: 70, projects: 0, homework: 20, participation: 10 },
    resources: [
      { title: "Supply & Demand Diagram Pack", type: "PDF", url: "#" },
      { title: "Midterm Vocabulary Flashcards", type: "PDF", url: "#" },
      { title: "Problem Set Answer Walkthrough — Week 4", type: "PDF", url: "#" },
    ],
  },
  {
    id: "5",
    code: "CS-UY 4613",
    name: "Compiler Design",
    professor: "Prof. Mohamed Zahran",
    syllabusAvailable: false,
    recordingPolicy: "In-Person Only",
    textbookCost: 75,
    clarityScore: 3,
    verifiedCount: 28,
    gradingBreakdown: { exams: 45, projects: 45, homework: 10, participation: 0 },
    resources: [
      { title: "Lexical Analysis Notes", type: "PDF", url: "#" },
      { title: "CFG to PDA Conversion Guide", type: "PDF", url: "#" },
    ],
  },
  {
    id: "6",
    code: "PSYCH-UA 1",
    name: "Introduction to Psychology",
    professor: "Prof. Marjorie Rhodes",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 0,
    clarityScore: 5,
    verifiedCount: 318,
    gradingBreakdown: { exams: 55, projects: 15, homework: 20, participation: 10 },
    resources: [
      { title: "Chapter 4 Reading Summary — Memory", type: "PDF", url: "#" },
      { title: "DSM-5 Disorder Overview Sheet", type: "PDF", url: "#" },
      { title: "Experiment Design Template", type: "PDF", url: "#" },
      { title: "Final Exam Term List", type: "PDF", url: "#" },
    ],
  },
  {
    id: "7",
    code: "CS-UY 1114",
    name: "Introduction to Programming & Problem Solving",
    professor: "Prof. Michael Overton",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 0,
    clarityScore: 5,
    verifiedCount: 412,
    gradingBreakdown: { exams: 40, projects: 35, homework: 20, participation: 5 },
    resources: [
      { title: "Python Basics Cheat Sheet", type: "PDF", url: "#" },
      { title: "Lab 3 Starter Code Walkthrough", type: "PDF", url: "#" },
      { title: "Recursion Visual Explainer", type: "PDF", url: "#" },
    ],
  },
  {
    id: "8",
    code: "BIOL-UA 11",
    name: "Principles of Biology I",
    professor: "Prof. Gloria Coruzzi",
    syllabusAvailable: true,
    recordingPolicy: "In-Person Only",
    textbookCost: 210,
    clarityScore: 3,
    verifiedCount: 145,
    gradingBreakdown: { exams: 65, projects: 10, homework: 15, participation: 10 },
    resources: [
      { title: "Cell Division Diagram Annotations", type: "Image", url: "#" },
      { title: "Genetics Punnett Square Practice", type: "PDF", url: "#" },
      { title: "Lab Report Format Template", type: "PDF", url: "#" },
    ],
  },
  {
    id: "9",
    code: "PHIL-UA 1",
    name: "Introduction to Philosophy",
    professor: "Prof. Don Garrett",
    syllabusAvailable: false,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 55,
    clarityScore: 4,
    verifiedCount: 73,
    gradingBreakdown: { exams: 30, projects: 20, homework: 30, participation: 20 },
    resources: [
      { title: "Plato's Republic — Reading Guide", type: "PDF", url: "#" },
      { title: "Argument Mapping Worksheet", type: "PDF", url: "#" },
      { title: "Ethics Discussion Prompt Set", type: "PDF", url: "#" },
    ],
  },
  {
    id: "10",
    code: "CS-UY 3113",
    name: "Operating Systems",
    professor: "Prof. Justin Cappos",
    syllabusAvailable: true,
    recordingPolicy: "In-Person Only",
    textbookCost: 0,
    clarityScore: 4,
    verifiedCount: 56,
    gradingBreakdown: { exams: 35, projects: 50, homework: 15, participation: 0 },
    resources: [
      { title: "Process Scheduling Algorithm Summary", type: "PDF", url: "#" },
      { title: "Virtual Memory Concept Map", type: "PDF", url: "#" },
      { title: "Project 1 Setup Guide", type: "PDF", url: "#" },
      { title: "Semaphore & Mutex Examples", type: "PDF", url: "#" },
    ],
  },
  {
    id: "11",
    code: "MATH-UA 140",
    name: "Linear Algebra",
    professor: "Prof. Percy Deift",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 95,
    clarityScore: 3,
    verifiedCount: 91,
    gradingBreakdown: { exams: 60, projects: 0, homework: 35, participation: 5 },
    resources: [
      { title: "Matrix Operations Reference Card", type: "PDF", url: "#" },
      { title: "Eigenvalue Decomposition Notes", type: "PDF", url: "#" },
      { title: "Practice Midterm + Solutions (2024)", type: "PDF", url: "#" },
    ],
  },
  {
    id: "12",
    code: "COMM-UA 710",
    name: "Media & Society",
    professor: "Prof. Todd Gitlin",
    syllabusAvailable: true,
    recordingPolicy: "Asynchronous Friendly",
    textbookCost: 40,
    clarityScore: 5,
    verifiedCount: 187,
    gradingBreakdown: { exams: 25, projects: 35, homework: 25, participation: 15 },
    resources: [
      { title: "Weekly Reading Annotation Guide", type: "PDF", url: "#" },
      { title: "Framing Theory Summary", type: "PDF", url: "#" },
      { title: "Research Paper Outline Template", type: "PDF", url: "#" },
      { title: "Media Analysis Essay Rubric", type: "PDF", url: "#" },
    ],
  },
];
