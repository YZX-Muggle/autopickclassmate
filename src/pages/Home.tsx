import { useState, useEffect, useCallback } from 'react';
import { FixedSizeGrid } from 'react-window';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Home() {
  const navigate = useNavigate();
  const [studentList, setStudentList] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedCount, setSelectedCount] = useState(1);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);




  // 解析学生名单
  const parseStudentList = useCallback((text: string) => {
    if (text.includes(',')) {
      return text.split(',').map(s => s.trim()).filter(s => s);
    } else {
      return text.split('\n').map(s => s.trim()).filter(s => s);
    }
  }, []);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    setStudentList(parseStudentList(e.target.value));
  };

  // 随机选择学生
  const selectStudents = useCallback(() => {
    if (studentList.length === 0) return;
    
    // 使用相同的随机算法保持一致性
    const shuffled = [...studentList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const result = shuffled.slice(0, selectedCount);
    setSelectedStudents(result);
    setCurrentIndex(0);
    
    // 保存到历史记录
    const history = JSON.parse(localStorage.getItem('selectionHistory') || '[]');
    history.unshift({
      timestamp: new Date().toLocaleString(),
      students: result
    });
    localStorage.setItem('selectionHistory', JSON.stringify(history.slice(0, 20)));
  }, [studentList, selectedCount]);


  // 开始抽选
  const toggleSelection = () => {
    if (isSelecting) return;
    
    setIsSelecting(true);
    setSelectedStudents([]);
    
    // 3秒后自动停止
    const timer = setTimeout(() => {
      setIsSelecting(false);
      selectStudents();
      setShowResult(true);
    }, 3000);

    return () => clearTimeout(timer);
  };



  // 重置抽选人数
  const resetCount = () => {
    setSelectedCount(1);
  };

  // 清空学生名单
  const clearList = () => {
    setInputText('');
    setStudentList([]);
    setSelectedStudents([]);
    setIsSelecting(false);
  };
  


  // 动画效果
  useEffect(() => {
    if (!isSelecting || studentList.length === 0) return;

    // 使用相同的随机算法保持一致性
    const interval = setInterval(() => {
      const shuffled = [...studentList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setSelectedStudents(shuffled.slice(0, selectedCount));
    }, 100);

    return () => clearInterval(interval);
  }, [isSelecting, studentList, selectedCount]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">课堂随机点名系统</h1>
          <button 
            onClick={() => navigate('/history')}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            历史记录
          </button>
        </div>
      </nav>

      <main className="flex-1 container mx-auto p-4 space-y-6">

        {/* 名单输入区 */}
        <section className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">学生名单</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const class3List = `1 陈柏年
2 陈杰锐
3 单梓涛
4 邓晓霖
5 冯颢天
6 甘宝欣
7 高梓俊
8 古颖怡
9 郭威远
10 黄晓斌
11 黄晓谕
12 黄子森
13 李豪
14 李颖欣
15 梁子淇
16 林浩谦
17 林嘉辉
18 林钰婷
19 卢紫晴
20 马嘉骏
21 麦子健
22 苗洗赫
23 欧晓彤
24 阮翊
25 汤佩熙
27 吴国与
28 吴晓晴
29 吴欣琪
30 吴展希
31 吴子濠
32 谢蕊晴
33 徐灿标
34 徐逸轩
35 徐泳茵
36 杨恺澄
38 杨子轩
39 郑兆轩
40 郑紫滢
41 钟昊言
42 周雨彤
43 周梓淇
44 周梓轩
45 朱雨婷
46 刘珺龄`;
                    setInputText(class3List);
                    setStudentList(class3List.split('\n').map(s => s.trim()).filter(s => s));
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  三(3)班名单
                </button>
                <button
                  onClick={clearList}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  清空名单
                </button>
              </div>
            </div>

          <textarea
            value={inputText}
            onChange={handleInputChange}
            placeholder="请输入学生名单，每行一个姓名或用逗号分隔"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
            style={{ fontSize: '1.2rem' }}
          />
          <p className="mt-2 text-gray-500">已录入 {studentList.length} 名学生</p>
        </section>


        {/* 抽选控制区 */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">抽选设置</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <label htmlFor="count" className="text-gray-700">抽选人数:</label>
              <div className="flex items-center">
                <button
                  onClick={() => setSelectedCount(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <i class="fa-solid fa-minus"></i>
                </button>
                <input
                  id="count"
                  type="number"
                  min="1"
                  max={studentList.length || 10}
                  value={selectedCount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      setSelectedCount('');
                      return;
                    }
                    const num = parseInt(value);
                    if (!isNaN(num)) {
                      setSelectedCount(Math.max(1, Math.min(num, studentList.length || 10)));
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setSelectedCount(1);
                    }
                  }}
                  className="w-16 p-2 border border-gray-300 rounded-lg mx-2 text-center"
                />
                <button
                  onClick={() => setSelectedCount(prev => Math.min(studentList.length || 10, prev + 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <i class="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>


            <button
              onClick={toggleSelection}
              disabled={isSelecting}
              className={cn(
                "px-6 py-3 rounded-lg font-medium text-white transition-colors",
                isSelecting ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              )}
            >
              {isSelecting ? "抽选中..." : "开始抽选"}
            </button>

            <button
              onClick={resetCount}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              重置人数
            </button>
            

  
          </div>
        </section>

        {/* 结果显示区 */}
        {showResult && selectedStudents.length > 0 && (
          <section className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50 p-4">
            <AnimatePresence>
              <motion.div
                key={selectedStudents.join(',')}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl h-full flex flex-col py-8"
              >
                <h2 className="text-white text-4xl md:text-5xl font-bold mb-8 text-center">抽选结果</h2>
                <div className="flex-1 px-4 pb-8 flex items-center justify-center">
                  {selectedStudents.length <= 3 ? (
                    <div className="space-y-8 w-full max-w-md">
                      {selectedStudents.map((student, index) => (
                        <div 
                          key={index}
                          className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm flex items-center justify-center"
                        >
                          <p className="text-white text-5xl font-bold text-center">
                            {student}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FixedSizeGrid
                      columnCount={3}
                      columnWidth={300}
                      height={600}
                      rowCount={Math.ceil(selectedStudents.length / 3)}
                      rowHeight={200}
                      width={900}
                      className="mx-auto"
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * 3 + columnIndex;
                        if (index >= selectedStudents.length) return null;
                        return (
                          <div 
                            style={style}
                            className="bg-white bg-opacity-20 p-6 rounded-xl backdrop-blur-sm flex items-center justify-center h-[180px] mx-3 break-words"
                          >
                            <p className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center max-w-full">
                              {selectedStudents[index]}
                            </p>
                          </div>
                        );
                      }}
                    </FixedSizeGrid>
                  )}
                </div>
                <div className="text-center pt-4 pb-8">
                  <button
                    onClick={() => {
                      setSelectedStudents([]);
                      setIsSelecting(false);
                      setShowResult(false);
                    }}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-xl"
                  >
                    关闭
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </section>
        )}
      </main>
    </div>
  );
}