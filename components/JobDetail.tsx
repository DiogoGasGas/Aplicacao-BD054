import React, { useState } from 'react';
import { JobOpening, Candidate, CandidateStatus, Employee } from '../types';
import { 
    ArrowLeft, 
    Calendar, 
    Users, 
    FileText, 
    Download, 
    MoreHorizontal,
    Plus,
    Briefcase,
    Mail,
    Phone,
    UserCheck,
    X,
    Check
} from 'lucide-react';

interface JobDetailProps {
    job: JobOpening;
    candidates: Candidate[];
    employees: Employee[];
    onBack: () => void;
    onUpdateStatus: (candidateId: string, status: CandidateStatus) => void;
    onUpdateRecruiter: (candidateId: string, recruiterId: string) => void;
    onAddCandidate: (jobId: string) => void;
    onCloseJob: (jobId: string) => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ 
    job, 
    candidates, 
    employees,
    onBack, 
    onUpdateStatus,
    onUpdateRecruiter,
    onAddCandidate,
    onCloseJob
}) => {
    // Helper to get status display info
    const getStatusInfo = (status: CandidateStatus) => {
        switch (status) {
            case 'Submitted': return { label: 'Submetido', color: 'bg-gray-100 text-gray-800' };
            case 'Screening': return { label: 'Em Análise', color: 'bg-blue-100 text-blue-800' };
            case 'Interview': return { label: 'Entrevista', color: 'bg-purple-100 text-purple-800' };
            case 'Hired': return { label: 'Contratado', color: 'bg-green-100 text-green-800' };
            case 'Rejected': return { label: 'Rejeitado', color: 'bg-red-100 text-red-800' };
            default: return { label: status, color: 'bg-gray-100' };
        }
    };

    const handleDownloadCV = (c: Candidate) => {
        alert(`A simular download do CV de ${c.name}...`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar às vagas
                </button>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                             <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border 
                                ${job.status === 'Open' ? 'bg-green-100 text-green-800 border-green-200' : 
                                  job.status === 'Suspended' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                                  'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                {job.status === 'Open' ? 'Aberta' : job.status === 'Suspended' ? 'Suspensa' : 'Fechada'}
                             </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.department}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Aberta em {new Date(job.openDate).toLocaleDateString('pt-PT')}</span>
                        </div>
                        <p className="mt-3 text-gray-600 max-w-2xl text-sm">{job.description}</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button 
                             onClick={() => onAddCandidate(job.id)}
                             className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Adicionar Candidato
                        </button>
                        {job.status === 'Open' && (
                             <button 
                                onClick={() => onCloseJob(job.id)}
                                className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                Fechar Vaga
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Candidates Table */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            Candidatos ({candidates.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Candidato</th>
                                    <th className="px-6 py-3 font-medium">Estado</th>
                                    <th className="px-6 py-3 font-medium">Recrutador</th>
                                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {candidates.map(candidate => (
                                    <tr key={candidate.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{candidate.name}</div>
                                            <div className="text-xs text-gray-500 flex flex-col gap-0.5 mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {candidate.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {candidate.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select 
                                                value={candidate.status}
                                                onChange={(e) => onUpdateStatus(candidate.id, e.target.value as CandidateStatus)}
                                                className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-brand-500 ${getStatusInfo(candidate.status).color}`}
                                            >
                                                <option value="Submitted">Submetido</option>
                                                <option value="Screening">Em análise</option>
                                                <option value="Interview">Entrevista</option>
                                                <option value="Hired">Contratado</option>
                                                <option value="Rejected">Rejeitado</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group">
                                                <select 
                                                    value={candidate.recruiterId || ''}
                                                    onChange={(e) => onUpdateRecruiter(candidate.id, e.target.value)}
                                                    className="bg-transparent text-gray-700 text-sm border-b border-transparent hover:border-gray-300 focus:border-brand-500 focus:outline-none cursor-pointer w-full max-w-[150px] truncate"
                                                >
                                                    <option value="">Atribuir...</option>
                                                    {employees.map(emp => (
                                                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                                    ))}
                                                </select>
                                                {!candidate.recruiterId && <span className="text-xs text-amber-500 block mt-1">Pendente</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleDownloadCV(candidate)}
                                                    className="p-1.5 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
                                                    title="Download CV"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {candidates.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Sem candidatos registados para esta vaga.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;