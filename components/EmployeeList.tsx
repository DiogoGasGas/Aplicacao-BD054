import React, { useState, useMemo } from 'react';
import { Employee, Department } from '../types';
import { SALARY_RANGES } from '../constants';
import { 
    Search, 
    Filter, 
    Plus, 
    MoreHorizontal, 
    Eye, 
    Edit, 
    Trash2, 
    Briefcase,
    Building2,
    Euro
} from 'lucide-react';

interface EmployeeListProps {
    employees: Employee[];
    onSelectEmployee: (employee: Employee) => void;
    onAddEmployee: () => void;
    onDeleteEmployee: (id: string) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({ 
    employees, 
    onSelectEmployee, 
    onAddEmployee,
    onDeleteEmployee
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deptFilter, setDeptFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [salaryFilter, setSalaryFilter] = useState<string>('all');

    const uniqueRoles = useMemo(() => {
        const roles = new Set(employees.map(e => e.role));
        return Array.from(roles);
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = emp.fullName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
            const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
            
            let matchesSalary = true;
            if (salaryFilter === 'low') matchesSalary = emp.financials.netSalary < 2000;
            if (salaryFilter === 'mid') matchesSalary = emp.financials.netSalary >= 2000 && emp.financials.netSalary <= 3000;
            if (salaryFilter === 'high') matchesSalary = emp.financials.netSalary > 3000;

            return matchesSearch && matchesDept && matchesRole && matchesSalary;
        });
    }, [employees, searchTerm, deptFilter, roleFilter, salaryFilter]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header / Actions */}
            <div className="p-6 border-b border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Colaboradores</h2>
                        <p className="text-gray-500 text-sm">Gerir a equipa e visualizar informações</p>
                    </div>
                    <button 
                        onClick={onAddEmployee}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Adicionar Novo
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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

                    <div className="relative">
                        <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all">Todos os Cargos</option>
                            {uniqueRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <Euro className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <select 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                            value={salaryFilter}
                            onChange={(e) => setSalaryFilter(e.target.value)}
                        >
                            {SALARY_RANGES.map(range => (
                                <option key={range.value} value={range.value}>{range.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Colaborador</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Departamento</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Cargo</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Salário Líq.</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-brand-50 transition-colors group cursor-pointer" onClick={() => onSelectEmployee(emp)}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-lg overflow-hidden shrink-0">
                                                {emp.avatarUrl ? <img src={emp.avatarUrl} alt="" className="h-full w-full object-cover" /> : emp.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">{emp.fullName}</div>
                                                <div className="text-xs text-gray-500">ID: {emp.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{emp.role}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                                        {emp.financials.netSalary.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onSelectEmployee(emp); }}
                                                className="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" 
                                                title="Ver Detalhes"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); }}
                                                className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); onDeleteEmployee(emp.id); }}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                    Nenhum colaborador encontrado com os filtros selecionados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;