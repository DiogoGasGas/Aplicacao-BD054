import React, { useMemo } from 'react';
import { Department, Employee, DepartmentMetadata } from '../types';
import { Users, Euro, User, ArrowRight, Building2 } from 'lucide-react';

interface DepartmentListProps {
    employees: Employee[];
    departmentsMetadata: DepartmentMetadata[];
    onSelectDepartment: (dept: Department) => void;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ 
    employees, 
    departmentsMetadata,
    onSelectDepartment
}) => {
    // Helper to get aggregated data for a department
    const getDepartmentData = (dept: Department) => {
        const deptEmployees = employees.filter(e => e.department === dept);
        const count = deptEmployees.length;
        const totalSalary = deptEmployees.reduce((sum, e) => sum + e.financials.baseSalaryGross, 0);
        const avgSalary = count > 0 ? totalSalary / count : 0;
        
        const metadata = departmentsMetadata.find(m => m.id === dept);
        const manager = metadata?.managerId ? employees.find(e => e.id === metadata.managerId) : null;

        return {
            count,
            avgSalary,
            manager,
            description: metadata?.description || 'Sem descrição disponível.'
        };
    };

    const departments = Object.values(Department);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
             <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800">Departamentos</h2>
                <p className="text-gray-500 text-sm">Visão geral da estrutura organizacional</p>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {departments.map((dept) => {
                        const data = getDepartmentData(dept);
                        return (
                            <div key={dept} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-brand-50 p-3 rounded-lg">
                                            <Building2 className="w-6 h-6 text-brand-600" />
                                        </div>
                                        {data.count > 0 && (
                                            <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium border border-green-100">
                                                Ativo
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{dept}</h3>
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{data.description}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <User className="w-4 h-4" />
                                                <span>Responsável:</span>
                                            </div>
                                            <span className="font-medium text-gray-900 truncate max-w-[120px]" title={data.manager?.fullName || 'N/A'}>
                                                {data.manager ? data.manager.fullName : 'Não atribuído'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-4 h-4" />
                                                <span>Colaboradores:</span>
                                            </div>
                                            <span className="font-medium text-gray-900">{data.count}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Euro className="w-4 h-4" />
                                                <span>Média Salarial:</span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {data.avgSalary.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                                    <button 
                                        onClick={() => onSelectDepartment(dept)}
                                        className="w-full flex items-center justify-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors"
                                    >
                                        Ver Detalhes <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DepartmentList;