import { Employee, Department, DepartmentMetadata, JobOpening, Candidate, TrainingProgram } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
    {
        id: 'EMP-001',
        fullName: 'Ana Silva',
        nif: '234567890',
        email: 'ana.silva@empresa.pt',
        phone: '+351 912 345 678',
        address: 'Rua das Flores, 123, Lisboa',
        birthDate: '1985-05-15',
        department: Department.IT,
        role: 'Senior Frontend Developer',
        admissionDate: '2020-03-01',
        avatarUrl: 'https://picsum.photos/200/200?random=1',
        financials: {
            baseSalaryGross: 3500,
            netSalary: 2450,
            deductions: 1050,
            benefits: [
                { id: 'b1', type: 'Seguro Saúde', value: 150 },
                { id: 'b2', type: 'Subsídio Alimentação', value: 180 }
            ],
            history: [
                { date: '2023-01-01', amount: 3500, reason: 'Aumento Anual' },
                { date: '2022-01-01', amount: 3200, reason: 'Promoção' },
                { date: '2020-03-01', amount: 2800, reason: 'Contratação' }
            ]
        },
        vacations: {
            totalDays: 22,
            usedDays: 10,
            history: [
                { id: 'v1', startDate: '2024-08-01', endDate: '2024-08-15', daysUsed: 10, status: 'Approved' }
            ]
        },
        trainings: [
            { id: 't1', title: 'React Advanced Patterns', date: '2023-11-20', status: 'Completed', provider: 'Udemy' },
            { id: 't2', title: 'Cloud Architecture AWS', date: '2024-09-15', status: 'Enrolled', provider: 'AWS' }
        ],
        evaluations: [
            { id: 'e1', date: '2023-12-15', score: 4.8, type: 'Manager', reviewer: 'Carlos Sousa', comments: 'Excelente desempenho técnico e liderança.' },
            { id: 'e2', date: '2023-12-10', score: 4.5, type: 'Self', reviewer: 'Ana Silva', comments: 'Cumpri todos os objetivos.' }
        ],
        jobHistory: [
            { company: 'Tech Solutions Lda', role: 'Junior Dev', startDate: '2015-01-01', endDate: '2019-12-31', isInternal: false },
            { company: 'Empresa Atual', role: 'Frontend Developer', startDate: '2020-03-01', endDate: '2022-01-01', isInternal: true },
            { company: 'Empresa Atual', role: 'Senior Frontend Developer', startDate: '2022-01-01', isInternal: true }
        ],
        dependents: [
            { id: 'd1', name: 'João Silva', relationship: 'Filho', birthDate: '2015-06-20' }
        ],
        absences: [
            { id: 'a1', date: '2024-02-14', reason: 'Consulta Médica', justified: true }
        ]
    },
    {
        id: 'EMP-002',
        fullName: 'Bruno Costa',
        nif: '123456789',
        email: 'bruno.costa@empresa.pt',
        phone: '+351 933 444 555',
        address: 'Av. da República, 45, Porto',
        birthDate: '1990-10-10',
        department: Department.MARKETING,
        role: 'Marketing Manager',
        admissionDate: '2021-06-15',
        avatarUrl: 'https://picsum.photos/200/200?random=2',
        financials: {
            baseSalaryGross: 2800,
            netSalary: 1960,
            deductions: 840,
            benefits: [
                { id: 'b3', type: 'Carro da Empresa', value: 400 }
            ],
            history: [
                { date: '2021-06-15', amount: 2500, reason: 'Contratação' },
                { date: '2023-06-15', amount: 2800, reason: 'Aumento Mérito' }
            ]
        },
        vacations: {
            totalDays: 22,
            usedDays: 5,
            history: [
                { id: 'v2', startDate: '2024-05-20', endDate: '2024-05-25', daysUsed: 5, status: 'Approved' }
            ]
        },
        trainings: [
            { id: 't3', title: 'Digital Marketing Trends 2024', date: '2024-01-10', status: 'Completed' }
        ],
        evaluations: [
            { id: 'e3', date: '2023-12-20', score: 4.2, type: 'Manager', reviewer: 'Marta Lima', comments: 'Bons resultados nas campanhas de Q4.' }
        ],
        jobHistory: [
            { company: 'Creative Agency', role: 'Copywriter', startDate: '2012-01-01', endDate: '2021-05-01', isInternal: false }
        ],
        dependents: [],
        absences: []
    },
    {
        id: 'EMP-003',
        fullName: 'Carla Dias',
        nif: '555666777',
        email: 'carla.dias@empresa.pt',
        phone: '+351 966 777 888',
        address: 'Rua Principal, 88, Coimbra',
        birthDate: '1995-02-28',
        department: Department.HR,
        role: 'HR Specialist',
        admissionDate: '2023-01-10',
        avatarUrl: 'https://picsum.photos/200/200?random=3',
        financials: {
            baseSalaryGross: 2100,
            netSalary: 1550,
            deductions: 550,
            benefits: [
                { id: 'b4', type: 'Seguro Saúde', value: 120 }
            ],
            history: [
                { date: '2023-01-10', amount: 2100, reason: 'Contratação' }
            ]
        },
        vacations: {
            totalDays: 22,
            usedDays: 0,
            history: []
        },
        trainings: [],
        evaluations: [],
        jobHistory: [],
        dependents: [],
        absences: [
            { id: 'a2', date: '2024-03-01', reason: 'Doença', justified: true },
            { id: 'a3', date: '2024-03-02', reason: 'Doença', justified: true }
        ]
    }
];

export const SALARY_RANGES = [
    { label: 'Todos', value: 'all' },
    { label: '< 2000€', value: 'low' },
    { label: '2000€ - 3000€', value: 'mid' },
    { label: '> 3000€', value: 'high' }
];

export const MOCK_DEPARTMENTS_METADATA: DepartmentMetadata[] = [
    {
        id: Department.IT,
        managerId: 'EMP-001',
        description: 'Desenvolvimento e manutenção de sistemas, infraestrutura tecnológica e inovação digital.'
    },
    {
        id: Department.MARKETING,
        managerId: 'EMP-002',
        description: 'Gestão da marca, planeamento de campanhas, redes sociais e comunicação corporativa.'
    },
    {
        id: Department.HR,
        managerId: 'EMP-003',
        description: 'Recrutamento e seleção, gestão de talentos, processamento salarial e cultura organizacional.'
    },
    {
        id: Department.FINANCE,
        managerId: null,
        description: 'Contabilidade, tesouraria, controlo de custos e planeamento financeiro estratégico.'
    },
    {
        id: Department.SALES,
        managerId: null,
        description: 'Vendas diretas, gestão de contas, expansão de mercado e relacionamento com clientes.'
    },
    {
        id: Department.OPERATIONS,
        managerId: null,
        description: 'Logística, gestão de cadeia de suprimentos e otimização de processos operacionais.'
    }
];

export const MOCK_JOBS: JobOpening[] = [
    {
        id: 'JOB-001',
        title: 'Backend Developer (Node.js)',
        department: Department.IT,
        openDate: '2024-03-01',
        status: 'Open',
        description: 'Procuramos um desenvolvedor backend experiente em Node.js e PostgreSQL para integrar a nossa equipa de infraestrutura.',
        requirements: ['3+ anos de experiência', 'Node.js', 'PostgreSQL', 'Docker']
    },
    {
        id: 'JOB-002',
        title: 'Sales Representative',
        department: Department.SALES,
        openDate: '2024-02-15',
        status: 'Open',
        description: 'Responsável por expandir a nossa carteira de clientes no setor empresarial.',
        requirements: ['Experiência em vendas B2B', 'Boa comunicação', 'Carta de condução']
    },
    {
        id: 'JOB-003',
        title: 'Social Media Manager',
        department: Department.MARKETING,
        openDate: '2024-01-20',
        status: 'Closed',
        description: 'Gestão de redes sociais corporativas.',
        requirements: ['Marketing Digital', 'Copywriting']
    }
];

export const MOCK_CANDIDATES: Candidate[] = [
    {
        id: 'CAND-001',
        jobId: 'JOB-001',
        name: 'Miguel Torres',
        email: 'miguel.torres@email.com',
        phone: '+351 911 222 333',
        status: 'Screening',
        appliedDate: '2024-03-05',
        recruiterId: 'EMP-003',
        cvUrl: '#'
    },
    {
        id: 'CAND-002',
        jobId: 'JOB-001',
        name: 'Sofia Martins',
        email: 'sofia.martins@email.com',
        phone: '+351 922 333 444',
        status: 'Submitted',
        appliedDate: '2024-03-10',
        recruiterId: undefined,
        cvUrl: '#'
    },
    {
        id: 'CAND-003',
        jobId: 'JOB-002',
        name: 'Pedro Nunes',
        email: 'pedro.nunes@email.com',
        phone: '+351 933 444 555',
        status: 'Interview',
        appliedDate: '2024-02-20',
        recruiterId: 'EMP-003',
        cvUrl: '#'
    }
];

export const MOCK_TRAINING_PROGRAMS: TrainingProgram[] = [
    {
        id: 'TRN-001',
        title: 'Liderança e Gestão de Equipas',
        description: 'Programa intensivo para desenvolvimento de competências de liderança, gestão de conflitos e motivação de equipas.',
        startDate: '2024-04-01',
        endDate: '2024-04-05',
        status: 'Planned',
        provider: 'Lisbon Leadership Academy',
        enrolledEmployeeIds: ['EMP-001', 'EMP-002']
    },
    {
        id: 'TRN-002',
        title: 'Segurança no Trabalho (HST)',
        description: 'Formação obrigatória sobre normas de higiene e segurança no trabalho.',
        startDate: '2024-03-10',
        endDate: '2024-03-12',
        status: 'Completed',
        provider: 'SafetyFirst Lda',
        enrolledEmployeeIds: ['EMP-003', 'EMP-002']
    },
    {
        id: 'TRN-003',
        title: 'React.js Avançado',
        description: 'Workshop técnico focado em performance e padrões avançados de React.',
        startDate: '2024-05-15',
        endDate: '2024-05-16',
        status: 'Planned',
        provider: 'TechTraining Hub',
        enrolledEmployeeIds: ['EMP-001']
    },
    {
        id: 'TRN-004',
        title: 'Inglês para Negócios - Nível B2',
        description: 'Curso semestral de inglês focado em contexto empresarial.',
        startDate: '2024-02-01',
        endDate: '2024-07-31',
        status: 'In Progress',
        provider: 'Language School',
        enrolledEmployeeIds: ['EMP-003']
    }
];
