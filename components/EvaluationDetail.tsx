import React from 'react';
import { Evaluation, Employee } from '../types';
import { ArrowLeft, Download, Calendar, User, Star, FileText } from 'lucide-react';

interface EvaluationDetailProps {
    evaluation: Evaluation;
    employee: Employee;
    onBack: () => void;
}

const EvaluationDetail: React.FC<EvaluationDetailProps> = ({ evaluation, employee, onBack }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Avaliação</h1>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span className="font-medium text-brand-600">{employee.fullName}</span>
                            <span>•</span>
                            <span>{employee.role}</span>
                        </div>
                    </div>
                    {evaluation.documentUrl && (
                        <button 
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                            onClick={() => alert(`Downloading: ${evaluation.documentUrl}`)}
                        >
                            <Download className="w-4 h-4" />
                            Documento Anexo
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Summary Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                             <div className="text-sm text-yellow-800 font-medium mb-1">Nota Global</div>
                             <div className="flex items-center gap-2">
                                <span className="text-4xl font-bold text-yellow-600">{evaluation.score.toFixed(1)}</span>
                                <Star className="w-6 h-6 text-yellow-500 fill-current" />
                             </div>
                             <div className="text-xs text-yellow-600 mt-1">Escala de 0 a 5</div>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">Data da Avaliação</div>
                                    <div className="font-medium">{new Date(evaluation.date).toLocaleDateString('pt-PT')}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <User className="w-5 h-5 text-gray-400" />
                                <div>
                                    <div className="text-xs text-gray-500">Avaliador</div>
                                    <div className="font-medium">{evaluation.reviewer}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* Reviewer Comments */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-brand-600" />
                                Avaliação do Gestor
                            </h3>
                            <div className="prose prose-sm text-gray-600">
                                {evaluation.comments}
                            </div>
                        </div>

                         {/* Self Evaluation */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Autoavaliação
                            </h3>
                             <div className="prose prose-sm text-gray-600">
                                {evaluation.selfEvaluation || <span className="text-gray-400 italic">Não preenchida.</span>}
                            </div>
                        </div>
                    </div>

                    {/* Employee History Preview */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm opacity-75">
                         <h3 className="font-semibold text-gray-800 mb-4">Histórico Recente</h3>
                         <div className="space-y-2">
                            {employee.evaluations.filter(e => e.id !== evaluation.id).slice(0, 3).map(prev => (
                                <div key={prev.id} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                                    <span className="text-sm font-medium">{new Date(prev.date).toLocaleDateString('pt-PT')}</span>
                                    <span className="text-sm text-gray-600">{prev.reviewer}</span>
                                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1">
                                        {prev.score} <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    </span>
                                </div>
                            ))}
                            {employee.evaluations.length <= 1 && (
                                <p className="text-sm text-gray-400">Sem histórico anterior.</p>
                            )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvaluationDetail;