import React, { useState, useMemo } from 'react';
import { Employee, Evaluation } from '../types';
import { 
    Search, 
    Filter, 
    Plus, 
    Calendar, 
    User, 
    Star, 
    ArrowRight,
    FileText
} from 'lucide-react';

interface ExtendedEvaluation extends Evaluation {
    employeeId: string;
    employeeName: string;
    employeeAvatar?: string;
}

interface EvaluationListProps {
    employees: Employee[];
    onSelectEvaluation: (evaluation: Evaluation, employee: Employee) => void;
    onAddEvaluation: () => void;
}

const EvaluationList: React.FC<EvaluationListProps> = ({ 
    employees, 
    onSelectEvaluation, 
    onAddEvaluation 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [reviewerFilter, setReviewerFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Flatten evaluations from all employees into a single list
    const allEvaluations: ExtendedEvaluation[] = useMemo(() => {
        return employees.flatMap(emp => 
            emp.evaluations.map(ev => ({
                ...ev,
                employeeId: emp.id,
                employeeName: emp.fullName,
                employeeAvatar: emp.avatarUrl
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [employees]);

    const filteredEvaluations = useMemo(() => {
        return allEvaluations.filter(ev => {
            const matchesEmployee = ev.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesReviewer = reviewerFilter ? ev.reviewer.toLowerCase().includes(reviewerFilter.toLowerCase()) : true;
            
            let matchesDate = true;
            if (startDate && endDate) {
                const evalDate = new Date(ev.date);
                const start = new Date(startDate);
                const end = new Date(endDate);
                matchesDate = evalDate >= start && evalDate <= end;
            }

            return matchesEmployee && matchesReviewer && matchesDate;
        });
    }, [allEvaluations, searchTerm, reviewerFilter, startDate, endDate]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Avaliações de Desempenho</h2>
                        <p className="text-gray-500 text-sm">Histórico e gestão de avaliações</p>
                    </div>
                    <button 
                        onClick={onAddEvaluation}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Avaliação
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Funcionário..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                         <input
                            type="text"
                            placeholder="Avaliador..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={reviewerFilter}
                            onChange={(e) => setReviewerFilter(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-500"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="date"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-500"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Funcionário</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Avaliador</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nota</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEvaluations.map((ev) => (
                            <tr key={`${ev.employeeId}-${ev.id}`} className="hover:bg-brand-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                            {ev.employeeAvatar ? (
                                                <img src={ev.employeeAvatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-500 text-xs">
                                                    {ev.employeeName.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="font-medium text-gray-900">{ev.employeeName}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {ev.reviewer}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {new Date(ev.date).toLocaleDateString('pt-PT')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="font-bold text-gray-800">{ev.score.toFixed(1)}</span>
                                        <span className="text-xs text-gray-400">/ 5</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => {
                                            const emp = employees.find(e => e.id === ev.employeeId);
                                            if (emp) onSelectEvaluation(ev, emp);
                                        }}
                                        className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center justify-end gap-1 ml-auto"
                                    >
                                        Ver Detalhes <ArrowRight className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredEvaluations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    Nenhuma avaliação encontrada com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EvaluationList;