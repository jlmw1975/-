
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">中国政策速递</h1>
                <p className="text-xs text-gray-500 font-medium">China Policy Express • AI-Powered</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors">最新政策</a>
              <a href="#" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors">解读分析</a>
              <a href="#" className="text-gray-600 hover:text-red-600 text-sm font-medium transition-colors">关于平台</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} 中国政策速递. 基于 Gemini AI 技术驱动.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            声明：本平台内容由 AI 检索并总结，仅供参考，请以政府官方发布的原件为准。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
