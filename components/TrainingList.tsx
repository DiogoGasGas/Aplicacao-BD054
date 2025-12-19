import React, { useState } from 'react';
import { TrainingProgram, TrainingProgramStatus } from '../types';
import { 
    Calendar, 
    Users, 
    MoreHorizontal, 
    Plus, 
    Search,
    BookOpen,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';

interface TrainingListProps {
    trainings: TrainingProgram[];
    onSelectTraining: (training: TrainingProgram) => void;
    onCreateTraining: () => void;
}

const TrainingList: React.FC<TrainingListProps> = ({ 
    trainings, 
    onSelectTraining, 
    onCreateTraining 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredTrainings = trainings.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusConfig = (status: TrainingProgramStatus) => {
        switch (status) {
            case 'Planned': return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Planeada' };
            case 'In Progress': return { color: 'bg-yellow-100 text-yellow-800', icon: BookOpen, label: 'Em Curso' };
            case 'Completed': return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Concluída' };
            case 'Cancelled': return { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Cancelada' };
            default: return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: status };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Formações</h2>
                        <p className="text-gray-500 text-sm">Catálogo de formações e desenvolvimento</p>
                    </div>
                    <button 
                        onClick={onCreateTraining}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Criar Nova Formação
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar formações..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                         <select 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Estados</option>
                            <option value="Planned">Planeada</option>
                            <option value="In Progress">Em Curso</option>
                            <option value="Completed">Concluída</option>
                            <option value="Cancelled">Cancelada</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredTrainings.map(training => {
                        const statusConfig = getStatusConfig(training.status);
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div key={training.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig.color}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {statusConfig.label}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{training.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{training.description}</p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <BookOpen className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">{training.provider}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>
                                                {new Date(training.startDate).toLocaleDateString('pt-PT')}
                                                {training.startDate !== training.endDate && ` - ${new Date(training.endDate).toLocaleDateString('pt-PT')}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 rounded-b-xl flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Users className="w-4 h-4" />
                                        <span>{training.enrolledEmployeeIds.length} Aderentes</span>
                                    </div>
                                    <button 
                                        onClick={() => onSelectTraining(training)}
                                        className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1"
                                    >
                                        Ver Detalhes <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredTrainings.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            Nenhuma formação encontrada.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainingList;