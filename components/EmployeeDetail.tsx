import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { 
    User, 
    CreditCard, 
    Plane, 
    GraduationCap, 
    Star, 
    History, 
    Users, 
    CalendarX, 
    ArrowLeft,
    Download,
    Mail,
    Phone,
    MapPin,
    Plus,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmployeeDetailProps {
    employee: Employee;
    onBack: () => void;
}

type TabType = 'personal' | 'remuneration' | 'vacations' | 'trainings' | 'evaluations' | 'history' | 'dependents' | 'absences';

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employee, onBack }) => {
    const [activeTab, setActiveTab] = useState<TabType>('personal');

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatCurrency = (val: number) => val.toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' });

    // --- Tab Components ---

    const PersonalTab = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados Básicos</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Nome Completo</span>
                            <span className="font-medium text-gray-900">{employee.fullName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">NIF</span>
                            <span className="font-medium text-gray-900">{employee.nif}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Data Nascimento</span>
                            <span className="font-medium text-gray-900">
                                {new Date(employee.birthDate).toLocaleDateString('pt-PT')} ({calculateAge(employee.birthDate)} anos)
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Empresa</h3>
                    <div className="space-y-4">
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">ID</span>
                            <span className="font-medium text-gray-900">{employee.id}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Departamento</span>
                            <span className="font-medium text-gray-900">{employee.department}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Cargo Atual</span>
                            <span className="font-medium text-gray-900">{employee.role}</span>
                        </div>
                         <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-500">Data Admissão</span>
                            <span className="font-medium text-gray-900">{new Date(employee.admissionDate).toLocaleDateString('pt-PT')}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Contactos & Morada</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <span>{employee.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span>{employee.phone}</span>
                        </div>
                        <div className="flex items-start gap-3 text-gray-700">
                            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                            <span>{employee.address}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const RemunerationTab = () => (
        <div className="space-y-6 animate-fade-in">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500 font-medium">Salário Bruto</span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(employee.financials.baseSalaryGross)}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-sm text-gray-500 font-medium">Descontos</span>
                    <div className="text-2xl font-bold text-red-500 mt-1">-{formatCurrency(employee.financials.deductions)}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm bg-blue-50">
                    <span className="text-sm text-blue-600 font-medium">Salário Líquido</span>
                    <div className="text-2xl font-bold text-blue-700 mt-1">{formatCurrency(employee.financials.netSalary)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Benefits */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefícios Ativos</h3>
                    <div className="space-y-3">
                        {employee.financials.benefits.length > 0 ? (
                            employee.financials.benefits.map(b => (
                                <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-700">{b.type}</span>
                                    <span className="font-semibold text-green-600">+{formatCurrency(b.value)}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">Sem benefícios ativos.</p>
                        )}
                        <div className="pt-3 border-t border-gray-100 flex justify-between">
                            <span className="font-semibold text-gray-800">Total Benefícios</span>
                            <span className="font-bold text-green-700">
                                +{formatCurrency(employee.financials.benefits.reduce((acc, curr) => acc + curr.value, 0))}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Salary History */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico Salarial</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-100">
                                    <th className="pb-2">Data</th>
                                    <th className="pb-2">Motivo</th>
                                    <th className="pb-2 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {employee.financials.history.map((h, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2">{new Date(h.date).toLocaleDateString('pt-PT')}</td>
                                        <td className="py-2">{h.reason}</td>
                                        <td className="py-2 text-right font-medium">{formatCurrency(h.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div className="h-64 bg-white p-6 rounded-xl border border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução Salarial</h3>
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={employee.financials.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(val) => new Date(val).getFullYear().toString()} />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Salário" />
                    </BarChart>
                 </ResponsiveContainer>
            </div>
        </div>
    );

    const VacationsTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border border-green-100">
                    <div className="flex justify-between items-center">
                        <span className="text-green-800 font-medium">Dias Disponíveis</span>
                        <Plane className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-900 mt-2">
                        {employee.vacations.totalDays - employee.vacations.usedDays}
                        <span className="text-sm font-normal text-green-700 ml-1">dias</span>
                    </div>
                    <div className="text-xs text-green-700 mt-1">De um total de {employee.vacations.totalDays} dias/ano</div>
                 </div>
                 
                 <div className="bg-white p-6 rounded-xl border border-gray-200 flex flex-col justify-center items-start">
                     <button className="bg-brand-600 hover:bg-brand-700 text-white w-full py-3 rounded-lg font-medium shadow-sm transition-colors flex justify-center items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Solicitar Férias
                     </button>
                     <p className="text-xs text-gray-500 mt-2 text-center w-full">Requer aprovação do gestor</p>
                 </div>
             </div>

             <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Histórico de Ausências</h3>
                <div className="overflow-hidden rounded-lg border border-gray-100">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-gray-500 font-medium">Início</th>
                                <th className="px-4 py-3 text-gray-500 font-medium">Fim</th>
                                <th className="px-4 py-3 text-gray-500 font-medium">Duração</th>
                                <th className="px-4 py-3 text-gray-500 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employee.vacations.history.length > 0 ? (
                                employee.vacations.history.map(v => (
                                    <tr key={v.id}>
                                        <td className="px-4 py-3">{new Date(v.startDate).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-4 py-3">{new Date(v.endDate).toLocaleDateString('pt-PT')}</td>
                                        <td className="px-4 py-3">{v.daysUsed} dias</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                                ${v.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                  v.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                {v.status === 'Approved' ? 'Aprovado' : v.status === 'Pending' ? 'Pendente' : 'Rejeitado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">Sem registo de férias.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );

    const TrainingsTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Minhas Formações</h3>
                    <button className="text-sm text-brand-600 hover:text-brand-700 font-medium">Ver catálogo disponível</button>
                </div>
                <div className="grid gap-4">
                    {employee.trainings.map(t => (
                        <div key={t.id} className="border border-gray-100 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-200 transition-colors bg-gray-50/50">
                            <div>
                                <h4 className="font-semibold text-gray-900">{t.title}</h4>
                                <div className="text-sm text-gray-500 mt-1 flex gap-3">
                                    <span>{t.provider}</span>
                                    <span>•</span>
                                    <span>{new Date(t.date).toLocaleDateString('pt-PT')}</span>
                                </div>
                            </div>
                            <div>
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
                                    ${t.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                      t.status === 'Enrolled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {t.status === 'Completed' && <CheckCircle className="w-3 h-3" />}
                                    {t.status === 'Enrolled' && <Clock className="w-3 h-3" />}
                                    {t.status === 'Completed' ? 'Concluído' : t.status === 'Enrolled' ? 'Inscrito' : 'Disponível'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {employee.trainings.length === 0 && <p className="text-gray-500 text-center py-4">Sem formações registadas.</p>}
                </div>
             </div>
        </div>
    );

    const EvaluationsTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end">
                <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors">
                    Nova Avaliação
                </button>
            </div>
            {employee.evaluations.map(e => (
                <div key={e.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900 text-lg">
                                    {e.type === 'Manager' ? 'Avaliação de Gestor' : e.type === 'Self' ? 'Autoavaliação' : 'Avaliação de Pares'}
                                </h4>
                                <span className="text-sm text-gray-500">| {new Date(e.date).toLocaleDateString('pt-PT')}</span>
                            </div>
                            <p className="text-sm text-gray-500">Avaliador: <span className="font-medium text-gray-700">{e.reviewer}</span></p>
                        </div>
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                            <span className="font-bold text-yellow-700 text-lg">{e.score.toFixed(1)}</span>
                            <span className="text-xs text-yellow-600">/ 5.0</span>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm italic border border-gray-100">
                        "{e.comments}"
                    </div>
                </div>
            ))}
             {employee.evaluations.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
                    <Star className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Ainda não existem avaliações registadas.</p>
                </div>
             )}
        </div>
    );

    const HistoryTab = () => (
        <div className="space-y-6 animate-fade-in">
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 py-2">
                {employee.jobHistory.map((h, idx) => (
                    <div key={idx} className="relative pl-8">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 
                            ${h.isInternal ? 'bg-brand-500 border-white ring-2 ring-brand-100' : 'bg-gray-400 border-white'}`}></div>
                        <h4 className="font-bold text-gray-900">{h.role}</h4>
                        <div className="text-sm font-medium text-brand-700 mb-1">{h.company}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {new Date(h.startDate).toLocaleDateString('pt-PT')} - {h.endDate ? new Date(h.endDate).toLocaleDateString('pt-PT') : 'Presente'}
                        </div>
                        {h.isInternal && <span className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">Promoção Interna</span>}
                    </div>
                ))}
                 {employee.jobHistory.length === 0 && <p className="pl-8 text-gray-500">Sem histórico profissional disponível.</p>}
            </div>
        </div>
    );

    const DependentsTab = () => (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-end">
                <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Adicionar Dependente
                </button>
            </div>
            <div className="grid gap-4">
                {employee.dependents.map(d => (
                    <div key={d.id} className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                {d.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">{d.name}</div>
                                <div className="text-sm text-gray-500">{d.relationship} • {calculateAge(d.birthDate)} anos</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">{new Date(d.birthDate).toLocaleDateString('pt-PT')}</div>
                    </div>
                ))}
                {employee.dependents.length === 0 && (
                     <div className="text-center py-10 bg-white rounded-xl border border-gray-200 border-dashed">
                        <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Sem dependentes registados.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const AbsencesTab = () => (
         <div className="space-y-6 animate-fade-in">
             <div className="flex justify-end">
                <button className="bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200">
                    Registar Falta
                </button>
            </div>
            <div className="overflow-hidden bg-white rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Data</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Motivo</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {employee.absences.map(a => (
                            <tr key={a.id}>
                                <td className="px-6 py-4">{new Date(a.date).toLocaleDateString('pt-PT')}</td>
                                <td className="px-6 py-4">{a.reason}</td>
                                <td className="px-6 py-4">
                                    {a.justified ? (
                                        <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
                                            <CheckCircle className="w-3 h-3" /> Justificada
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded text-xs">
                                            <XCircle className="w-3 h-3" /> Injustificada
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                         {employee.absences.length === 0 && (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">Sem registo de faltas.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
         </div>
    );

    const renderTabContent = () => {
        switch(activeTab) {
            case 'personal': return <PersonalTab />;
            case 'remuneration': return <RemunerationTab />;
            case 'vacations': return <VacationsTab />;
            case 'trainings': return <TrainingsTab />;
            case 'evaluations': return <EvaluationsTab />;
            case 'history': return <HistoryTab />;
            case 'dependents': return <DependentsTab />;
            case 'absences': return <AbsencesTab />;
            default: return <PersonalTab />;
        }
    };

    const tabs: {id: TabType, label: string, icon: any}[] = [
        { id: 'personal', label: 'Info. Pessoais', icon: User },
        { id: 'remuneration', label: 'Remuneração', icon: CreditCard },
        { id: 'vacations', label: 'Férias', icon: Plane },
        { id: 'trainings', label: 'Formações', icon: GraduationCap },
        { id: 'evaluations', label: 'Avaliações', icon: Star },
        { id: 'history', label: 'Histórico', icon: History },
        { id: 'dependents', label: 'Dependentes', icon: Users },
        { id: 'absences', label: 'Faltas', icon: CalendarX },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Voltar à lista
                </button>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold ring-4 ring-white shadow-sm overflow-hidden">
                             {employee.avatarUrl ? <img src={employee.avatarUrl} alt="" className="h-full w-full object-cover" /> : employee.fullName.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{employee.fullName}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span>{employee.role}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{employee.department}</span>
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                        <Download className="w-4 h-4" /> Exportar Ficha
                    </button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-gray-200 px-6 overflow-x-auto hide-scrollbar">
                <nav className="flex space-x-1" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                                flex items-center gap-2 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'border-brand-600 text-brand-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brand-600' : 'text-gray-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-white p-6 md:p-8">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default EmployeeDetail;