import React, { useState, useEffect } from 'react';
import { Department, Employee } from '../types';
import { X, Save } from 'lucide-react';

interface EmployeeFormProps {
    onClose: () => void;
    onSave: (employee: NewEmployeeData, id?: string) => Promise<void>;
    employee?: Employee | null; // Se fornecido, é modo edição
}

export interface NewEmployeeData {
    nif: string;
    primeiro_nome: string;
    ultimo_nome: string;
    email: string;
    num_telemovel: string;
    data_nascimento: string;
    cargo: string;
    id_depart: number;
    salario_bruto?: number;
    nome_rua?: string;
    nome_localidade?: string;
    codigo_postal?: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onClose, onSave, employee }) => {
    const isEditMode = !!employee;
    
    const [formData, setFormData] = useState<NewEmployeeData>({
        nif: '',
        primeiro_nome: '',
        ultimo_nome: '',
        email: '',
        num_telemovel: '',
        data_nascimento: '',
        cargo: '',
        id_depart: 1,
        salario_bruto: undefined,
        nome_rua: '',
        nome_localidade: '',
        codigo_postal: ''
    });

    // Carregar dados do colaborador se for modo edição
    useEffect(() => {
        if (employee) {
            const nameParts = employee.fullName.split(' ');
            const primeiroNome = nameParts[0] || '';
            const ultimoNome = nameParts.slice(1).join(' ') || '';

            // Mapear nome do departamento para ID
            const deptMap: Record<string, number> = {
                'Recursos Humanos': 1,
                'Tecnologia da Informação': 2,
                'Financeiro': 3,
                'Marketing': 4,
                'Vendas': 5,
                'Qualidade': 6,
                'Atendimento ao Cliente': 7,
                'Jurídico': 8
            };

            setFormData({
                nif: employee.nif || '',
                primeiro_nome: primeiroNome,
                ultimo_nome: ultimoNome,
                email: employee.email || '',
                num_telemovel: employee.phone || '',
                data_nascimento: employee.birthDate || '',
                cargo: employee.role || '',
                id_depart: deptMap[employee.department] || 1,
                nome_rua: '',
                nome_localidade: '',
                codigo_postal: ''
            });
        }
    }, [employee]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'id_depart' ? parseInt(value) : 
                    name === 'salario_bruto' ? (value ? parseFloat(value) : undefined) : 
                    value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await onSave(formData, employee?.id);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao guardar colaborador');
        } finally {
            setLoading(false);
        }
    };

    const departments = [
        { id: 1, name: 'Recursos Humanos' },
        { id: 2, name: 'Tecnologia da Informação' },
        { id: 3, name: 'Financeiro' },
        { id: 4, name: 'Marketing' },
        { id: 5, name: 'Vendas' },
        { id: 6, name: 'Qualidade' },
        { id: 7, name: 'Atendimento ao Cliente' },
        { id: 8, name: 'Jurídico' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Informações Pessoais */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações Pessoais</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Primeiro Nome *
                                </label>
                                <input
                                    type="text"
                                    name="primeiro_nome"
                                    value={formData.primeiro_nome}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Último Nome *
                                </label>
                                <input
                                    type="text"
                                    name="ultimo_nome"
                                    value={formData.ultimo_nome}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    NIF *
                                </label>
                                <input
                                    type="text"
                                    name="nif"
                                    value={formData.nif}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{9}"
                                    maxLength={9}
                                    disabled={isEditMode}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                {isEditMode && (
                                    <p className="text-xs text-gray-500 mt-1">NIF não pode ser alterado</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data de Nascimento *
                                </label>
                                <input
                                    type="date"
                                    name="data_nascimento"
                                    value={formData.data_nascimento}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contacto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Telemóvel *
                                </label>
                                <input
                                    type="tel"
                                    name="num_telemovel"
                                    value={formData.num_telemovel}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{9}"
                                    maxLength={9}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Morada */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Morada</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rua
                                </label>
                                <input
                                    type="text"
                                    name="nome_rua"
                                    value={formData.nome_rua}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Localidade
                                </label>
                                <input
                                    type="text"
                                    name="nome_localidade"
                                    value={formData.nome_localidade}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Código Postal
                                </label>
                                <input
                                    type="text"
                                    name="codigo_postal"
                                    value={formData.codigo_postal}
                                    onChange={handleChange}
                                    pattern="[0-9]{4}-[0-9]{3}"
                                    placeholder="0000-000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Informação Profissional */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Informação Profissional</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cargo *
                                </label>
                                <input
                                    type="text"
                                    name="cargo"
                                    value={formData.cargo}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Departamento *
                                </label>
                                <select
                                    name="id_depart"
                                    value={formData.id_depart}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                >
                                    {departments.map(dept => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Salário Bruto (€)
                                </label>
                                <input
                                    type="number"
                                    name="salario_bruto"
                                    value={formData.salario_bruto || ''}
                                    onChange={handleChange}
                                    min="0"
                                    step="0.01"
                                    placeholder="Ex: 2500.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">Salário líquido: {formData.salario_bruto ? (formData.salario_bruto * 0.77).toFixed(2) : '0.00'}€</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4" />
                            {loading ? 'A guardar...' : isEditMode ? 'Atualizar Colaborador' : 'Guardar Colaborador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
