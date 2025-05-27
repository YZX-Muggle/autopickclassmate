import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function HistoryPage() {
  // 从localStorage获取历史记录
  const [historyData, setHistoryData] = useState(() => {
    return JSON.parse(localStorage.getItem('selectionHistory') || '[]');
  });
  const navigate = useNavigate();

  // 导出历史记录为文本文件
  const exportHistory = () => {
    const historyText = historyData.map(item => 
      `${item.timestamp}: ${item.students.join(', ')}`
    ).join('\n\n');
    
    const blob = new Blob([historyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `课堂点名历史_${new Date().toLocaleDateString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">课堂点名历史记录</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            返回首页
          </button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 space-y-6">
        {/* 记录展示区 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">最近抽选记录</h2>
           <div className="grid gap-4">
             {historyData.length > 0 ? (
               historyData.map((record, index) => (
                 <div 
                   key={index}
                   className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                 >
                   <div className="flex justify-between items-start">
                     <p className="text-gray-500">{record.timestamp}</p>
                     <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                       {record.students.length}人
                     </span>
                   </div>
                   <p className="mt-2 text-2xl font-medium text-gray-800">
                     {record.students.join('、')}
                   </p>
                 </div>
               ))
             ) : (
               <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                 暂无历史记录
               </div>
             )}
           </div>
        </section>

        {/* 导出功能区 */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={exportHistory}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-xl"
          >
            导出为文本文件
          </button>
        </section>
      </main>
    </div>
  );
}
