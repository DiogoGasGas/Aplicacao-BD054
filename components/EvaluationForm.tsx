import React, { useState } from 'react';
import { Employee, Evaluation } from '../types';
import { X, Save, Upload, FileText } from 'lucide-react';

interface EvaluationFormProps {
    employees: Employee[];
    onSubmit: (data: any) => void;
    onCancel: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ employees, onSubmit, onCancel }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [evaluatorId, setEvaluatorId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [score, setScore] = useState(0);
    const [comments, setComments] = useState('');
    const [selfEvaluation, setSelfEvaluation] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Find evaluator name
        const evaluator = employees.find(e => e.id === evaluatorId);
        
        const evaluationData = {
            employeeId,
            date,
            score: Number(score),
            reviewer: evaluator ? evaluator.fullName : 'Externo/Desconhecido',
            comments,
            selfEvaluation,
            type: 'Manager', // Defaulting to Manager for this form
            documentUrl: file ? URL.createObjectURL(file) : undefined
        };

        onSubmit(evaluationData);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Nova Avaliação de Desempenho</h2>
                <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Funcionário Avaliado</label>
                        <select 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                        >
                            <option value="">Selecione um funcionário...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.department}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Avaliador</label>
                        <select 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            value={evaluatorId}
                            onChange={(e) => setEvaluatorId(e.target.value)}
                        >
                            <option value="">Selecione o avaliador...</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Data da Avaliação</label>
                        <input 
                            type="date" 
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Avaliação Global (0-5)</label>
                        <input 
                            type="number" 
                            min="0" 
                            max="5" 
                            step="0.1"
                            required
                            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                            value={score}
                            onChange={(e) => setScore(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Critérios e Comentários do Avaliador</label>
                    <textarea 
                        required
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        placeholder="Descreva os pontos fortes, áreas de melhoria e feedback geral..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Autoavaliação do Funcionário</label>
                    <textarea 
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        placeholder="Comentários do funcionário sobre o seu próprio desempenho..."
                        value={selfEvaluation}
                        onChange={(e) => setSelfEvaluation(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Anexar Documento (PDF)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                            {file ? file.name : "Clique para fazer upload ou arraste o ficheiro"}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Guardar Avaliação
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EvaluationForm;