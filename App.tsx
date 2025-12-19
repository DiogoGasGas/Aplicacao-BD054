import React, { useState } from 'react';
import { MOCK_EMPLOYEES, MOCK_DEPARTMENTS_METADATA, MOCK_JOBS, MOCK_CANDIDATES, MOCK_TRAINING_PROGRAMS } from './constants';
import { Employee, DepartmentMetadata, Department, JobOpening, Candidate, CandidateStatus, TrainingProgram, Evaluation } from './types';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import DepartmentList from './components/DepartmentList';
import DepartmentDetail from './components/DepartmentDetail';
import RecruitmentList from './components/RecruitmentList';
import JobDetail from './components/JobDetail';
import TrainingList from './components/TrainingList';
import TrainingDetail from './components/TrainingDetail';
import EvaluationList from './components/EvaluationList';
import EvaluationForm from './components/EvaluationForm';
import EvaluationDetail from './components/EvaluationDetail';
import { LayoutDashboard, Users, Settings, LogOut, Building2, Briefcase, GraduationCap, Star } from 'lucide-react';

type ViewState = 
    | 'employees_list' 
    | 'employees_detail' 
    | 'departments_list' 
    | 'departments_detail'
    | 'recruitment_list'
    | 'recruitment_detail'
    | 'trainings_list'
    | 'trainings_detail'
    | 'evaluations_list'
    | 'evaluations_form'
    | 'evaluations_detail';

const App: React.FC = () => {
    // Data State
    const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
    const [deptMetadata, setDeptMetadata] = useState<DepartmentMetadata[]>(MOCK_DEPARTMENTS_METADATA);
    const [jobs, setJobs] = useState<JobOpening[]>(MOCK_JOBS);
    const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
    const [trainings, setTrainings] = useState<TrainingProgram[]>(MOCK_TRAINING_PROGRAMS);
    
    // View State
    const [view, setView] = useState<ViewState>('employees_list');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
    const [selectedTraining, setSelectedTraining] = useState<TrainingProgram | null>(null);
    const [selectedEvaluation, setSelectedEvaluation] = useState<{evaluation: Evaluation, employee: Employee} | null>(null);

    // --- Employee Handlers ---
    const handleSelectEmployee = (emp: Employee) => {
        setSelectedEmployee(emp);
        setView('employees_detail');
    };

    const handleBackToEmployeeList = () => {
        setSelectedEmployee(null);
        setView('employees_list');
    };

    const handleAddEmployee = () => {
        alert("Funcionalidade de Adicionar Colaborador: Abriria um Modal de Formulário aqui.");
    };

    const handleDeleteEmployee = (id: string) => {
        if(window.confirm('Tem a certeza que deseja remover este colaborador?')) {
            setEmployees(prev => prev.filter(e => e.id !== id));
            if(selectedEmployee?.id === id) handleBackToEmployeeList();
        }
    };

    // --- Department Handlers ---
    const handleSelectDepartment = (dept: Department) => {
        setSelectedDepartment(dept);
        setView('departments_detail');
    };

    const handleBackToDeptList = () => {
        setSelectedDepartment(null);
        setView('departments_list');
    };

    const handleUpdateManager = (deptId: Department, managerId: string) => {
        setDeptMetadata(prev => prev.map(m => 
            m.id === deptId ? { ...m, managerId: managerId } : m
        ));
    };

    // --- Recruitment Handlers ---
    const handleSelectJob = (job: JobOpening) => {
        setSelectedJob(job);
        setView('recruitment_detail');
    };

    const handleBackToRecruitment = () => {
        setSelectedJob(null);
        setView('recruitment_list');
    };

    const handleCreateJob = () => {
        alert("Modal para criar nova vaga.");
    };

    const handleAddCandidate = (jobId: string) => {
        alert("Modal para adicionar candidato manualmente.");
    };

    const handleCloseJob = (jobId: string) => {
        if(window.confirm("Deseja fechar esta vaga?")) {
            setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Closed' } : j));
            if(selectedJob?.id === jobId) {
                setSelectedJob(prev => prev ? { ...prev, status: 'Closed' } : null);
            }
        }
    };

    const handleUpdateCandidateStatus = (candidateId: string, status: CandidateStatus) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
    };

    const handleUpdateRecruiter = (candidateId: string, recruiterId: string) => {
        setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, recruiterId } : c));
    };

    // --- Training Handlers ---
    const handleSelectTraining = (training: TrainingProgram) => {
        setSelectedTraining(training);
        setView('trainings_detail');
    };

    const handleBackToTrainings = () => {
        setSelectedTraining(null);
        setView('trainings_list');
    };

    const handleCreateTraining = () => {
        alert("Modal para criar nova formação.");
    };

    const handleAddParticipant = (trainingId: string, employeeId: string) => {
        setTrainings(prev => prev.map(t => 
            t.id === trainingId && !t.enrolledEmployeeIds.includes(employeeId)
                ? { ...t, enrolledEmployeeIds: [...t.enrolledEmployeeIds, employeeId] } 
                : t
        ));
        if (selectedTraining && selectedTraining.id === trainingId) {
             setSelectedTraining(prev => prev ? { ...prev, enrolledEmployeeIds: [...prev.enrolledEmployeeIds, employeeId] } : null);
        }
    };

    const handleRemoveParticipant = (trainingId: string, employeeId: string) => {
        if(window.confirm("Remover participante desta formação?")) {
            setTrainings(prev => prev.map(t => 
                t.id === trainingId
                    ? { ...t, enrolledEmployeeIds: t.enrolledEmployeeIds.filter(id => id !== employeeId) } 
                    : t
            ));
            if (selectedTraining && selectedTraining.id === trainingId) {
                setSelectedTraining(prev => prev ? { ...prev, enrolledEmployeeIds: prev.enrolledEmployeeIds.filter(id => id !== employeeId) } : null);
            }
        }
    };

    // --- Evaluation Handlers ---
    const handleSelectEvaluation = (evaluation: Evaluation, employee: Employee) => {
        setSelectedEvaluation({ evaluation, employee });
        setView('evaluations_detail');
    };

    const handleBackToEvaluations = () => {
        setSelectedEvaluation(null);
        setView('evaluations_list');
    };

    const handleAddEvaluation = (data: any) => {
        const newEvaluation: Evaluation = {
            id: `EVAL-${Date.now()}`,
            date: data.date,
            score: data.score,
            reviewer: data.reviewer,
            comments: data.comments,
            type: data.type,
            selfEvaluation: data.selfEvaluation,
            documentUrl: data.documentUrl
        };

        setEmployees(prev => prev.map(emp => 
            emp.id === data.employeeId 
                ? { ...emp, evaluations: [...emp.evaluations, newEvaluation] }
                : emp
        ));
        
        setView('evaluations_list');
    };

    // --- Navigation ---
    const renderContent = () => {
        switch (view) {
            case 'employees_list':
                return (
                    <EmployeeList 
                        employees={employees} 
                        onSelectEmployee={handleSelectEmployee}
                        onAddEmployee={handleAddEmployee}
                        onDeleteEmployee={handleDeleteEmployee}
                    />
                );
            case 'employees_detail':
                return selectedEmployee ? (
                    <EmployeeDetail 
                        employee={selectedEmployee} 
                        onBack={handleBackToEmployeeList} 
                    />
                ) : null;
            case 'departments_list':
                return (
                    <DepartmentList 
                        employees={employees}
                        departmentsMetadata={deptMetadata}
                        onSelectDepartment={handleSelectDepartment}
                    />
                );
            case 'departments_detail':
                const metadata = deptMetadata.find(m => m.id === selectedDepartment);
                const deptEmployees = employees.filter(e => e.department === selectedDepartment);
                return (selectedDepartment && metadata) ? (
                    <DepartmentDetail 
                        department={selectedDepartment}
                        metadata={metadata}
                        employees={deptEmployees}
                        allEmployees={employees}
                        onBack={handleBackToDeptList}
                        onUpdateManager={handleUpdateManager}
                    />
                ) : null;
            case 'recruitment_list':
                return (
                    <RecruitmentList 
                        jobs={jobs}
                        candidates={candidates}
                        onSelectJob={handleSelectJob}
                        onCreateJob={handleCreateJob}
                    />
                );
            case 'recruitment_detail':
                const jobCandidates = candidates.filter(c => c.jobId === selectedJob?.id);
                return selectedJob ? (
                    <JobDetail 
                        job={selectedJob}
                        candidates={jobCandidates}
                        employees={employees}
                        onBack={handleBackToRecruitment}
                        onUpdateStatus={handleUpdateCandidateStatus}
                        onUpdateRecruiter={handleUpdateRecruiter}
                        onAddCandidate={handleAddCandidate}
                        onCloseJob={handleCloseJob}
                    />
                ) : null;
            case 'trainings_list':
                return (
                    <TrainingList 
                        trainings={trainings}
                        onSelectTraining={handleSelectTraining}
                        onCreateTraining={handleCreateTraining}
                    />
                );
            case 'trainings_detail':
                return selectedTraining ? (
                    <TrainingDetail 
                        training={selectedTraining}
                        allEmployees={employees}
                        onBack={handleBackToTrainings}
                        onAddParticipant={handleAddParticipant}
                        onRemoveParticipant={handleRemoveParticipant}
                    />
                ) : null;
            case 'evaluations_list':
                return (
                    <EvaluationList 
                        employees={employees}
                        onSelectEvaluation={handleSelectEvaluation}
                        onAddEvaluation={() => setView('evaluations_form')}
                    />
                );
            case 'evaluations_form':
                return (
                    <EvaluationForm 
                        employees={employees}
                        onSubmit={handleAddEvaluation}
                        onCancel={() => setView('evaluations_list')}
                    />
                );
            case 'evaluations_detail':
                return selectedEvaluation ? (
                    <EvaluationDetail 
                        evaluation={selectedEvaluation.evaluation}
                        employee={selectedEvaluation.employee}
                        onBack={handleBackToEvaluations}
                    />
                ) : null;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">HR</div>
                    <span className="text-xl font-bold text-gray-800 tracking-tight">HR Pro</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Principal</div>
                    <button 
                        onClick={() => setView('employees_list')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left
                            ${view.includes('employees') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span>Colaboradores</span>
                    </button>
                    <button 
                         onClick={() => setView('departments_list')}
                         className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left
                            ${view.includes('departments') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`}
                    >
                        <Building2 className="w-5 h-5" />
                        <span>Departamentos</span>
                    </button>
                    <button 
                         onClick={() => setView('recruitment_list')}
                         className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left
                            ${view.includes('recruitment') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`}
                    >
                        <Briefcase className="w-5 h-5" />
                        <span>Recrutamento</span>
                    </button>
                    <button 
                         onClick={() => setView('trainings_list')}
                         className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left
                            ${view.includes('trainings') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`}
                    >
                        <GraduationCap className="w-5 h-5" />
                        <span>Formações</span>
                    </button>
                    <button 
                         onClick={() => setView('evaluations_list')}
                         className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-left
                            ${view.includes('evaluations') ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-600'}`}
                    >
                        <Star className="w-5 h-5" />
                        <span>Avaliações</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left">
                        <LogOut className="w-5 h-5" />
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 h-screen flex flex-col overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="md:hidden font-bold text-xl text-brand-600">HR Pro</div>
                    <div className="flex-1"></div> {/* Spacer */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                <img src="https://picsum.photos/100/100" alt="Admin" />
                             </div>
                             <div className="text-sm hidden sm:block">
                                 <p className="font-medium text-gray-700">Admin User</p>
                                 <p className="text-xs text-gray-500">Gestor RH</p>
                             </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-6 overflow-hidden">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default App;