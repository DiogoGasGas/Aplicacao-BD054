import React, { useMemo, useState } from 'react';
import { Department, Employee, DepartmentMetadata } from '../types';
import { 
    ArrowLeft, 
    Users, 
    Euro, 
    Briefcase, 
    Save, 
    X,
    Building2,
    TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentDetailProps {
    department: Department;
    metadata: DepartmentMetadata;
    employees: Employee[];
    allEmployees: Employee[]; // For manager selection
    onBack: () => void;
    onUpdateManager: (deptId: Department, managerId: string) => void;
}

const DepartmentDetail: React.FC<DepartmentDetailProps> = ({ 
    department, 
    metadata, 
    employees, 
    allEmployees,
    onBack,
    onUpdateManager
}) => {
    const [isEditingManager, setIsEditingManager] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState(metadata.managerId || '');

    const manager = useMemo(() => {
        return allEmployees.find(e => e.id === metadata.managerId);
    }, [metadata.managerId, allEmployees]);

    const stats = useMemo(() => {
        const count = employees.length;
        const totalSalary = employees.reduce((sum, e) => sum + e.financials.baseSalaryGross, 0);
        const avgSalary = count > 0 ? totalSalary / count : 0;
        const totalCost = employees.reduce((sum, e) => sum + e.financials.baseSalaryGross, 0); // Simplified cost
        
        return { count, avgSalary, totalCost };
    }, [employees]);

    const chartData = useMemo(() => {
        return employees.map(e => ({
            name: e.fullName.split(' ')[0], // First name only for chart
            fullName: e.fullName,
            salary: e.financials.baseSalaryGross
        })).sort((a, b) => b.salary - a.salary);
    }, [employees]);

    const handleSaveManager = () => {
        onUpdateManager(department, selectedManagerId);
        setIsEditingManager(false);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar aos Departamentos
                </button>
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-4 bg-brand-100 text-brand-600 rounded-xl">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{department}</h1>
                            <p className="text-gray-500 mt-1 max-w-2xl">{metadata.description}</p>
                        </div>
                    </div>
                    
                    {/* Manager Section */}
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm min-w-[300px]">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gerente Responsável</div>
                        
                        {!isEditingManager ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                         {manager?.avatarUrl ? (
                                             <img src={manager.avatarUrl} alt="" className="w-full h-full object-cover" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                                                 {manager ? manager.fullName.charAt(0) : '?'}
                                             </div>
                                         )}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{manager ? manager.fullName : 'Não Atribuído'}</div>
                                        <div className="text-xs text-gray-500">{manager?.role || '-'}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsEditingManager(true)}
                                    className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                                >
                                    Alterar
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <select 
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                                    value={selectedManagerId}
                                    onChange={(e) => setSelectedManagerId(e.target.value)}
                                >
                                    <option value="">Selecione um gerente...</option>
                                    {allEmployees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.fullName}</option>
                                    ))}
                                </select>
                                <div className="flex gap-2 justify-end">
                                    <button 
                                        onClick={() => setIsEditingManager(false)}
                                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={handleSaveManager}
                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    >
                                        <Save className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium">Total Colaboradores</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Euro className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium">Média Salarial</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.avgSalary.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                         <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 font-medium">Custo Mensal (Bruto)</div>
                            <div className="text-2xl font-bold text-gray-900">
                                {stats.totalCost.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Employee Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
                        <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
                            Equipa ({employees.length})
                        </div>
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-gray-500">Nome</th>
                                        <th className="px-4 py-3 font-medium text-gray-500">Cargo</th>
                                        <th className="px-4 py-3 font-medium text-gray-500 text-right">Salário</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {employees.map(emp => (
                                        <tr key={emp.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{emp.fullName}</td>
                                            <td className="px-4 py-3 text-gray-500">{emp.role}</td>
                                            <td className="px-4 py-3 text-gray-900 text-right">
                                                {emp.financials.baseSalaryGross.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                        </tr>
                                    ))}
                                    {employees.length === 0 && (
                                        <tr><td colSpan={3} className="p-8 text-center text-gray-400">Sem colaboradores neste departamento.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Salary Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col h-[400px]">
                        <div className="mb-4 font-semibold text-gray-800">Distribuição Salarial</div>
                         <div className="flex-1 w-full min-h-0">
                             {employees.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                                        <Tooltip 
                                            cursor={{fill: 'transparent'}}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-white p-2 border border-gray-200 shadow-lg rounded text-xs">
                                                            <p className="font-bold">{data.fullName}</p>
                                                            <p className="text-brand-600">
                                                                {data.salary.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="salary" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`hsl(217, 91%, ${60 + (index * 5)}%)`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                             ) : (
                                 <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                     Dados insuficientes para gráfico.
                                 </div>
                             )}
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DepartmentDetail;