export interface SalaryHistory {
    date: string;
    amount: number;
    reason: string;
}

export interface Benefit {
    id: string;
    type: string;
    value: number;
}

export interface VacationRecord {
    id: string;
    startDate: string;
    endDate: string;
    daysUsed: number;
    status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Training {
    id: string;
    title: string;
    date: string;
    status: 'Completed' | 'Enrolled' | 'Available';
    provider?: string;
}

export interface Evaluation {
    id: string;
    date: string;
    score: number; // 0-10 or 0-5
    reviewer: string;
    comments: string;
    selfEvaluation?: string; // New field
    documentUrl?: string; // New field
    type: 'Manager' | 'Self' | 'Peer';
}

export interface JobHistory {
    company: string;
    role: string;
    startDate: string;
    endDate?: string;
    isInternal: boolean;
}

export interface Dependent {
    id: string;
    name: string;
    relationship: string;
    birthDate: string;
}

export interface Absence {
    id: string;
    date: string;
    reason: string;
    justified: boolean;
}

export interface Employee {
    id: string;
    fullName: string;
    nif: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    department: string;
    role: string;
    admissionDate: string;
    avatarUrl?: string;
    
    financials: {
        baseSalaryGross: number;
        netSalary: number;
        deductions: number;
        benefits: Benefit[];
        history: SalaryHistory[];
    };

    vacations: {
        totalDays: number;
        usedDays: number;
        history: VacationRecord[];
    };

    trainings: Training[];
    evaluations: Evaluation[];
    jobHistory: JobHistory[];
    dependents: Dependent[];
    absences: Absence[];
}

export enum Department {
    IT = 'Tecnologia da Informação',
    HR = 'Recursos Humanos',
    FINANCE = 'Financeiro',
    SALES = 'Vendas',
    MARKETING = 'Marketing',
    OPERATIONS = 'Operações'
}

export interface DepartmentMetadata {
    id: Department;
    managerId: string | null;
    description: string;
}

// --- Recruitment Types ---

export type JobStatus = 'Open' | 'Closed' | 'Suspended';

export interface JobOpening {
    id: string;
    title: string;
    department: Department;
    openDate: string;
    status: JobStatus;
    description: string;
    requirements: string[];
}

export type CandidateStatus = 'Submitted' | 'Screening' | 'Interview' | 'Rejected' | 'Hired';

export interface Candidate {
    id: string;
    jobId: string;
    name: string;
    email: string;
    phone: string;
    status: CandidateStatus;
    appliedDate: string;
    recruiterId?: string; // ID of the employee responsible
    cvUrl?: string;
    coverLetter?: string;
}

// --- Training Module Types ---

export type TrainingProgramStatus = 'Planned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface TrainingProgram {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    status: TrainingProgramStatus;
    provider: string;
    enrolledEmployeeIds: string[];
}
