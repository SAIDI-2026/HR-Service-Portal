import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, Users, Briefcase, FileText, CheckCircle2, Clock, 
  ChevronLeft, Search, RefreshCw, X, LayoutDashboard, SendHorizontal, AlertCircle
} from 'lucide-react';

// تهيئة الاتصال بقاعدة البيانات Supabase
const supabaseUrl = 'https://sbfjvntwfjahhbnliuap.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZmp2bnR3ZmphaGhibmxpdWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTgzOTAsImV4cCI6MjA3MDEzNDM5MH0.ZpD3M5PuT3o-eRnqCmg_UnOMA-pCAJaCdmG4DEG9exs';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // حالات لوحة التحكم (عرض الطلبات)
  const [requests, setRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // نموذج بيانات الطلب
  const [formData, setFormData] = useState({
    description: '',
    priority: 'عادي'
  });

  // مصفوفة الخدمات
  const categories = [
    {
      id: 'hr-dev',
      title: 'تطوير الموارد البشرية',
      description: 'التوظيف، التكوين، تقييم الأداء والمستقبل المهني',
      icon: Users,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      primaryManager: 'مدير الموارد البشرية (DRH)',
      subManager: 'مصلحة تطوير الموارد البشرية (Développement RH)',
      services: [
        'طلب توظيف / احتياج موظف',
        'طلب مشاركة في دورة تكوينية',
        'استفسار حول تقييم الأداء',
        'طلب ترقية أو تطور مهني'
      ]
    },
    {
      id: 'hr-mgmt',
      title: 'تسيير الموارد البشرية',
      description: 'العطل، الغيابات، الرواتب والوثائق الإدارية',
      icon: FileText,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      primaryManager: 'مدير الموارد البشرية (DRH)',
      subManager: 'مصلحة تسيير الموارد البشرية (Gestion RH / Paie)',
      services: [
        'طلب عطلة سنوية أو استثنائية',
        'تبرير غياب / رخصة خروج',
        'طلب وثيقة إدارية (شهادة عمل، كشف أجر)',
        'استفسار حول الرواتب والمنح'
      ]
    },
    {
      id: 'gen-resources',
      title: 'الموارد العامة وخدمات الموظفين',
      description: 'الإقامة، الإطعام، النقل وبيئة العمل',
      icon: Building2,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      primaryManager: 'مدير الموارد العامة (Moyen Général)',
      subManager: 'مصلحة الخدمات واللوجستيك (Services Généraux)',
      services: [
        'طلب أو مشكلة تخص الإقامة',
        'خدمات الإطعام والوجبات',
        'خدمات النقل والترتيبات اللوجستية',
        'مشكلة أو طلب تخص بيئة العمل والمعدات'
      ]
    }
  ];

  // جلب الطلبات من Supabase عند فتح تبويب لوحة التحكم
  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('خطأ في جلب الطلبات:', err.message);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchRequests();
    }
  }, [activeTab]);

  // فتح نافذة تقديم الطلب
  const handleOpenRequestModal = (serviceName, category) => {
    setSelectedService({
      name: serviceName,
      categoryTitle: category.title,
      primaryManager: category.primaryManager,
      subManager: category.subManager
    });
    setFormData({ description: '', priority: 'عادي' });
    setSubmitSuccess(false);
  };

  // إرسال الطلب وحفظه في Supabase
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('requests').insert([
        {
          service_name: selectedService.name,
          category: selectedService.categoryTitle,
          description: formData.description,
          priority: formData.priority,
          primary_manager: selectedService.primaryManager,
          sub_manager: selectedService.subManager,
          status: 'قيد المعالجة'
        }
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => {
        setSelectedService(null);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      alert('حدث خطأ أثناء إرسال الطلب: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" dir="rtl">
      
      {/* الهيدر العلوي */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
            <img 
              src="/logo.png" 
              alt="شعار الشركة" 
              className="h-12 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="border-r border-slate-200 pr-4 mr-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">بوابة خدمات الموارد البشرية</h1>
              <p className="text-xs text-slate-500 font-medium">نظام تقديم الطلبات ومتابعة الأداء</p>
            </div>
          </div>

          {/* تبويبات التنقل */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              الكتالوج والخدمات
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة قيادة المصلحة
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* صفحة الكتالوج */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900">كيف يمكننا مساعدتك اليوم؟</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                اختر الخدمة المطلوبة وسيتكفل النظام بتوجيه طلبك مباشرة للمسؤول أو بديله
              </p>
              
              {/* شريط البحث */}
              <div className="relative max-w-xl mx-auto pt-2">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ابحث عن خدمة (مثال: عطلة، شهادة عمل، نقل...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* شبكة الخدمات */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              {categories.map((cat) => {
                const CategoryIcon = cat.icon;
                const filteredServices = cat.services.filter(s => 
                  s.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (searchQuery && filteredServices.length === 0) return null;

                return (
                  <div key={cat.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center justify-between mb-3">
                          <span className={`p-3 rounded-xl ${cat.badgeColor} border`}>
                            <CategoryIcon className="w-6 h-6" />
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{cat.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                      </div>

                      <div className="p-4 space-y-2">
                        {filteredServices.map((service, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOpenRequestModal(service, cat)}
                            className="w-full text-right p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                          >
                            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                              {service}
                            </span>
                            <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* لوحة التحكم القيادية */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">لوحة متابعة الطلبات المسجلة</h2>
                <p className="text-sm text-slate-500">متابعة حية لجميع الطلبات المرسلة إلى قاعدة البيانات</p>
              </div>
              <button
                onClick={fetchRequests}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>

            {/* جدول عرض الطلبات */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {isLoadingRequests ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  <p>جاري تحميل الطلبات من قاعدة البيانات...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-slate-400" />
                  <p className="font-semibold">لا توجد طلبات مسجلة حتى الآن.</p>
                  <p className="text-xs">جرب تقديم طلب جديد من الكتالوج لمشاهدته هنا.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-4">رقم الطلب</th>
                        <th className="p-4">اسم الخدمة</th>
                        <th className="p-4">الفئة</th>
                        <th className="p-4">التفاصيل</th>
                        <th className="p-4">الأولوية</th>
                        <th className="p-4">المسؤول الموجه له</th>
                        <th className="p-4">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-bold text-slate-900">#{req.id}</td>
                          <td className="p-4 font-semibold text-blue-600">{req.service_name}</td>
                          <td className="p-4 text-slate-600">{req.category}</td>
                          <td className="p-4 text-slate-700 max-w-xs truncate">{req.description}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              req.priority === 'عاجل جداً' ? 'bg-rose-100 text-rose-700' :
                              req.priority === 'مستعجل' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-500">
                            <div>{req.primary_manager}</div>
                            <div className="text-slate-400">{req.sub_manager}</div>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Clock className="w-3.5 h-3.5" />
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* نافذة إرسال الطلب Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
            
            {/* رأس النافذة */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">{selectedService.categoryTitle}</span>
                <h3 className="text-lg font-bold mt-1">{selectedService.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* محتوى النافذة */}
            {submitSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">تم إرسال طلبك بنجاح!</h4>
                <p className="text-sm text-slate-500">تم تسجيل الطلب وسيتم معالجته من طرف المسؤول المحدد مباشرة.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="p-6 space-y-5">
                
                {/* التفاصيل والوصف */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    تفاصيل الطلب / الملاحظات
                  </label>
                  <textarea
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="اكتب التفاصيل الخاصة بطلبك هنا..."
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* الأولوية */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">درجة الأولوية</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="عادي">عادي</option>
                    <option value="مستعجل">مستعجل</option>
                    <option value="عاجل جداً">عاجل جداً</option>
                  </select>
                </div>

                {/* زر الإرسال */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <SendHorizontal className="w-5 h-5 rotate-180" />
                        إرسال الطلب الآن
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}