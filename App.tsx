
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import { fetchPoliciesByDate } from './services/geminiService';
import { PolicyItem, GroundingSource, LoadingStatus } from './types';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [status, setStatus] = useState<LoadingStatus>(LoadingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const loadPolicies = useCallback(async (date: string) => {
    setStatus(LoadingStatus.LOADING);
    setError(null);
    try {
      const data = await fetchPoliciesByDate(date);
      setPolicies(data.policies);
      setSources(data.sources);
      setStatus(LoadingStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "获取政策信息失败，请稍后重试。");
      setStatus(LoadingStatus.ERROR);
    }
  }, []);

  useEffect(() => {
    loadPolicies(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              日期选择
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择发布日期</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500">
                AI 将为您搜索该日期前后的重要政策变动。
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h4 className="font-bold text-blue-900 text-sm mb-2 uppercase tracking-wider">快捷检索建议</h4>
            <div className="flex flex-wrap gap-2">
              {['2024年两会政策', '养老金新规', '楼市新政', '科技创新', '数字经济'].map((tag) => (
                <button 
                  key={tag}
                  className="text-xs bg-white text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Results Area */}
        <section className="lg:col-span-9 space-y-6">
          {status === LoadingStatus.LOADING && (
            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center space-y-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">正在检索权威渠道并总结政策要点...</p>
            </div>
          )}

          {status === LoadingStatus.ERROR && (
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 flex items-start space-x-3">
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-800 font-bold">出错了</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={() => loadPolicies(selectedDate)}
                  className="mt-3 text-sm font-semibold text-red-600 hover:text-red-800 underline"
                >
                  重试一次
                </button>
              </div>
            </div>
          )}

          {status === LoadingStatus.SUCCESS && policies.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-bold text-gray-900">未找到相关政策</h3>
              <p className="text-gray-500 max-w-sm mx-auto mt-2">在该特定日期没有检索到显著的全国性政策更新。您可以尝试切换其他日期。</p>
            </div>
          )}

          {status === LoadingStatus.SUCCESS && policies.length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedDate} <span className="text-gray-400 font-normal">政策概况</span>
                </h2>
                <span className="text-sm text-gray-500">找到 {policies.length} 项相关动态</span>
              </div>

              {policies.map((policy) => (
                <div key={policy.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center space-x-2 mb-2">
                        {policy.category && (
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded border border-red-100">
                            {policy.category}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{policy.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                        {policy.title}
                      </h3>
                      <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                        {policy.summary}
                      </div>
                    </div>
                    {policy.department && (
                      <div className="flex-shrink-0">
                        <div className="bg-gray-50 px-3 py-1 rounded text-xs text-gray-500 font-medium border border-gray-100">
                          {policy.department}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Grounding Sources */}
              {sources.length > 0 && (
                <div className="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    参考来源与权威链接
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all text-sm group"
                      >
                        <span className="text-gray-400 mr-2 font-mono">{idx + 1}.</span>
                        <span className="text-gray-700 font-medium truncate group-hover:text-red-700">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default App;
