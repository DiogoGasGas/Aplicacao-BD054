import React, { useState, useMemo } from 'react';
import { JobOpening, JobStatus, Candidate, Department } from '../types';
import { 
    Briefcase, 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Users, 
    Calendar,
    ArrowRight
} from 'lucide-react';

interface RecruitmentListProps {
    jobs: JobOpening[];
    candidates: Candidate[];
    onSelectJob: (job: JobOpening) => void;
    onCreateJob: () => void;
}

const RecruitmentList: React.FC<RecruitmentListProps> = ({ 
    jobs, 
    candidates, 
    onSelectJob, 
    onCreateJob 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deptFilter, setDeptFilter] = useState<string>('all');

    const getCandidateCount = (jobId: string) => candidates.filter(c => c.jobId === jobId).length;

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
            const matchesDept = deptFilter === 'all' || job.department === deptFilter;
            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [jobs, searchTerm, statusFilter, deptFilter]);

    const getStatusColor = (status: JobStatus) => {
        switch (status) {
            case 'Open': return 'bg-green-100 text-green-800 border-green-200';
            case 'Closed': return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: JobStatus) => {
        switch (status) {
            case 'Open': return 'Aberta';
            case 'Closed': return 'Fechada';
            case 'Suspended': return 'Suspensa';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Recrutamento</h2>
                        <p className="text-gray-500 text-sm">Gestão de vagas e candidaturas</p>
                    </div>
                    <button 
                        onClick={onCreateJob}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Criar Nova Vaga
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar vagas..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <Filter className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Estados</option>
                            <option value="Open">Abertas</option>
                            <option value="Closed">Fechadas</option>
                            <option value="Suspended">Suspensas</option>
                        </select>
                    </div>

                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                        >
                            <option value="all">Todos Departamentos</option>
                            {Object.values(Department).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Vaga</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Departamento</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Candidatos</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <tr key={job.id} className="hover:bg-brand-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{job.title}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            Aberta em: {new Date(job.openDate).toLocaleDateString('pt-PT')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {job.department}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium">{getCandidateCount(job.id)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                                            {getStatusLabel(job.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => onSelectJob(job)}
                                            className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center justify-end gap-1 ml-auto"
                                        >
                                            Ver Candidatos <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    Nenhuma vaga encontrada com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecruitmentList;