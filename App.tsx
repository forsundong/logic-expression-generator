
import React, { useState, useEffect } from 'react';
import { AnswerRow, ToastMessage } from './types';
import { generateExpression } from './utils/logicGenerator';
import Toast from './components/Toast';

const App: React.FC = () => {
  // --- State ---
  const [blankCount, setBlankCount] = useState<number>(2);
  const [rows, setRows] = useState<AnswerRow[]>([
    { id: '1', blank1: '', blank2: '' }
  ]);
  const [result, setResult] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // --- Helpers ---
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Handlers ---
  const handleBlankCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val)) return;
    
    const count = Math.min(Math.max(val, 1), 10);
    setBlankCount(count);

    // Adjust rows to match new blank count
    setRows(prevRows => prevRows.map(row => {
      // Use explicit type casting to avoid TS7053
      const newRow = { ...row } as AnswerRow;
      
      // Add missing blanks
      for (let i = 1; i <= count; i++) {
        const key = `blank${i}`;
        if (newRow[key] === undefined) {
          newRow[key] = '';
        }
      }
      
      // Remove excess blanks
      Object.keys(newRow).forEach(key => {
        if (key.startsWith('blank')) {
          const num = parseInt(key.replace('blank', ''));
          if (num > count) {
            delete newRow[key];
          }
        }
      });
      
      return newRow;
    }));
  };

  const handleInputChange = (rowId: string, blankKey: string, value: string) => {
    setRows(prevRows => prevRows.map(row => 
      row.id === rowId ? { ...row, [blankKey]: value } : row
    ));
  };

  const addRow = () => {
    // Cast to AnswerRow immediately to allow dynamic indexing in the loop
    const newRow = { id: Math.random().toString(36).substring(2, 11) } as AnswerRow;
    for (let i = 1; i <= blankCount; i++) {
      newRow[`blank${i}`] = '';
    }
    setRows(prev => [...prev, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) {
      addToast("至少需要保留一个答案组", "info");
      return;
    }
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const clearAll = () => {
    const resetRows = rows.map(row => {
      const newRow = { id: row.id } as AnswerRow;
      for (let i = 1; i <= blankCount; i++) {
        newRow[`blank${i}`] = '';
      }
      return newRow;
    });
    setRows(resetRows);
    addToast("已清空所有内容", "success");
  };

  const copyToClipboard = () => {
    if (!result || result === "()") return;
    navigator.clipboard.writeText(result).then(() => {
      addToast("结果已复制到剪贴板", "success");
    }).catch(() => {
      addToast("复制失败", "error");
    });
  };

  // --- Real-time Generation ---
  useEffect(() => {
    const generated = generateExpression(rows, blankCount);
    setResult(generated);
  }, [rows, blankCount]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
        {toasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <header className="mb-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">多解逻辑表达式生成器</h1>
          </div>
          <p className="text-slate-500 max-w-2xl">
            快速生成标准化的复合逻辑判定字符串，支持数值识别与多种解题路径配置。
          </p>
        </header>

        {/* Configuration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label htmlFor="blankCount" className="text-sm font-semibold text-slate-700">空格数量设置 (1-10):</label>
              <input
                id="blankCount"
                type="number"
                min="1"
                max="10"
                value={blankCount}
                onChange={handleBlankCountChange}
                className="w-20 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                添加答案组
              </button>
              <button 
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-md font-medium transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                全部清空
              </button>
            </div>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">组别</th>
                  {Array.from({ length: blankCount }).map((_, idx) => (
                    <th key={idx} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[150px]">
                      空格 {idx + 1}
                    </th>
                  ))}
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((row, rowIdx) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-slate-400">#{rowIdx + 1}</span>
                    </td>
                    {Array.from({ length: blankCount }).map((_, colIdx) => {
                      const blankKey = `blank${colIdx + 1}`;
                      return (
                        <td key={colIdx} className="px-6 py-4">
                          <input
                            type="text"
                            value={row[blankKey] || ''}
                            onChange={(e) => handleInputChange(row.id, blankKey, e.target.value)}
                            placeholder="输入数值或算式"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:border-blue-400 focus:ring-1 focus:ring-blue-400 outline-none transition-all bg-transparent"
                          />
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => removeRow(row.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="删除该行"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div className="p-12 text-center text-slate-400 italic">
              当前暂无答案组，请点击“添加答案组”开始。
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-slate-900 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">生成结果</h3>
            </div>
            <button 
              onClick={copyToClipboard}
              disabled={!result || result === "()"}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              一键复制
            </button>
          </div>
          <div className="p-6">
            <div className="bg-slate-800/50 rounded-lg p-6 min-h-[100px] flex items-center justify-center text-center">
              {result && result !== "()" ? (
                <code className="text-emerald-400 font-mono text-lg break-all selection:bg-emerald-500/30">
                  {result}
                </code>
              ) : (
                <span className="text-slate-500 italic text-sm">请输入答案数据以生成表达式...</span>
              )}
            </div>
          </div>
          <div className="px-6 py-3 bg-slate-900/80 text-[10px] text-slate-500 font-mono flex gap-4 uppercase tracking-tighter overflow-x-auto whitespace-nowrap">
            <span>Intra-row AND: 且</span>
            <span>Inter-row OR: 或</span>
            <span>Numeric check: isNumber()</span>
            <span>String wrapper: ""</span>
            <span>Outer wrapper: ()</span>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 mb-8 border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs">
          <p>© 2024 Logic Expression Generator. Built for automated scoring excellence.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-blue-500 cursor-help transition-colors">使用说明</span>
            <span className="hover:text-blue-500 cursor-help transition-colors">技术文档</span>
            <span className="hover:text-blue-500 cursor-help transition-colors">版本信息 v1.0.2</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
