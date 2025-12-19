import React, { useState } from 'react';
import { TrainingProgram, Employee } from '../types';
import { 
    ArrowLeft, 
    Calendar, 
    BookOpen, 
    Users, 
    Plus, 
    Trash2, 
    Upload,
    MoreHorizontal,
    Search
} from 'lucide-react';

interface TrainingDetailProps {
    training: TrainingProgram;
    allEmployees: Employee[];
    onBack: () => void;
    onAddParticipant: (trainingId: string, employeeId: string) => void;
    onRemoveParticipant: (trainingId: string, employeeId: string) => void;
}

const TrainingDetail: React.FC<TrainingDetailProps> = ({ 
    training, 
    allEmployees, 
    onBack,
    onAddParticipant,
    onRemoveParticipant
}) => {
    const [isAdding, setIsAdding] = useState(false);
    const [selectedEmployeeToAdd, setSelectedEmployeeToAdd] = useState('');

    const enrolledEmployees = allEmployees.filter(e => training.enrolledEmployeeIds.includes(e.id));
    const availableEmployees = allEmployees.filter(e => !training.enrolledEmployeeIds.includes(e.id));

    const handleAdd = () => {
        if (selectedEmployeeToAdd) {
            onAddParticipant(training.id, selectedEmployeeToAdd);
            setSelectedEmployeeToAdd('');
            setIsAdding(false);
        }
    };

    const handleUploadCertificate = (empName: string) => {
        alert(`Simulação: Upload de certificado para ${empName}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar às formações
                </button>

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900 mb-2">{training.title}</h1>
                         <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {training.provider}</span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> 
                                {new Date(training.startDate).toLocaleDateString('pt-PT')} - {new Date(training.endDate).toLocaleDateString('pt-PT')}
                            </span>
                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium border
                                ${training.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-blue-100 text-blue-800 border-blue-200'}
                             `}>
                                 {training.status === 'Completed' ? 'Concluída' : training.status === 'Planned' ? 'Planeada' : training.status === 'In Progress' ? 'Em Curso' : 'Cancelada'}
                             </span>
                        </div>
                        <p className="text-gray-600 max-w-3xl">{training.description}</p>
                    </div>
                </div>
            </div>

            {/* Participants Section */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-500" />
                            Participantes Inscritos ({enrolledEmployees.length})
                        </h3>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            {!isAdding ? (
                                <button 
                                    onClick={() => setIsAdding(true)}
                                    className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 w-full sm:w-auto justify-center"
                                >
                                    <Plus className="w-4 h-4" /> Adicionar Participante
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <select 
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-1.5 flex-1"
                                        value={selectedEmployeeToAdd}
                                        onChange={(e) => setSelectedEmployeeToAdd(e.target.value)}
                                    >
                                        <option value="">Selecione...</option>
                                        {availableEmployees.map(emp => (
                                            <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={handleAdd}
                                        disabled={!selectedEmployeeToAdd}
                                        className="text-green-600 hover:bg-green-50 p-1.5 rounded disabled:opacity-50"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                     <button 
                                        onClick={() => setIsAdding(false)}
                                        className="text-gray-500 hover:bg-gray-100 p-1.5 rounded"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Nome</th>
                                    <th className="px-6 py-3 font-medium">Departamento</th>
                                    <th className="px-6 py-3 font-medium">Cargo</th>
                                    <th className="px-6 py-3 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {enrolledEmployees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{emp.fullName}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.department}</td>
                                        <td className="px-6 py-4 text-gray-600">{emp.role}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleUploadCertificate(emp.fullName)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center gap-1 text-xs font-medium"
                                                    title="Upload Certificado"
                                                >
                                                    <Upload className="w-3 h-3" /> Certificado
                                                </button>
                                                <button 
                                                    onClick={() => onRemoveParticipant(training.id, emp.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {enrolledEmployees.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Sem participantes inscritos.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainingDetail;