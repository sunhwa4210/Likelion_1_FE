import React, { useState, useEffect } from 'react';
import CheckIcon from './component/checkIcon';
import FilterIcon from '../../components/icons/FilterIcon';
import LogoIcon from './component/logoIcon';
import styles from './ReportRadar.module.css';


import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Text,
} from 'recharts';

// === 더미 API 호출 함수 ===
const fetchChartDataFromAPI = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        radarData: [
          { subject: '인문사회', value: 35, fullMark: 50, color: '#2986E6' },
          { subject: '공학·기술', value: 10, fullMark: 50, color: '#C36839' },
          { subject: '예술·문화', value: 32, fullMark: 50, color: '#73C62F' },
          { subject: '스포츠·\n라이프스타일', value: 15, fullMark: 50, color: '#FD88D9' },
          { subject: '경제·경영', value: 20, fullMark: 50, color: '#9582FF' },
          { subject: '자연과학', value: 50, fullMark: 50, color: '#FE817B' },
        ],
        analysisResults: [
          '자연과학 분야를 가장 많이 공부했어요!',
          '공학·기술과 경제·경영 분야는 많이 보지 못했어요.',
          '에서 해당 분야를 골라 다양한 지식을 접해보세요!'
        ],
        userName: '슈니',
        maxScore: 50,
      });
    }, 1000);
  });
};

// 커스텀 축 제목 컴포넌트 
const CustomPolarAngleAxisTick = ({ x, y, payload, data }) => {
  const dataItem = data.find(d => d.subject === payload.value);
  const color = dataItem ? dataItem.color : '#000';
  let dxOffset = 0;
  let dyOffset = 0;

  switch (payload.index) {
    case 0: 
      dyOffset = -6; // 오른쪽 이동 
      dxOffset = 2; // 아래 이동 
      break;
    case 1: 
      dxOffset = 25;
      dyOffset = 0; 
      break;
    case 2: 
      dxOffset = 25;
      dyOffset = 0;
      break;
    case 3: 
      dxOffset = 0;
      dyOffset = -6;
      break;
    case 4:
      dxOffset = -25; 
      dyOffset = 0; 
      break; 
    case 5:
      dxOffset = -25;
      dyOffset = 0;
      break;  
  }

  return (
    <Text
      x={x}
      y={y}
      width={100}
      height={30}
      textAnchor="middle"
      verticalAnchor="middle"
      fill={color}
      fontSize={14}      
      fontWeight="bold"

      dx={dxOffset}
      dy={dyOffset}

      className={styles.radarAxisLabel}
      style={{ transform: payload.index === 3 ? 'translateY(15px)' : '' }}
    >
      {payload.value}
    </Text>
  );
};

// 메인 컴포넌트
const ReportRadar = () => {
  const [chartData, setChartData] = useState([]);
  const [analysis, setAnalysis] = useState([]);
  const [userName, setUserName] = useState('사용자');
  const [maxScore, setMaxScore] = useState(50);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 데이터 로딩 로직
    const loadData = async () => {
      try {
        const result = await fetchChartDataFromAPI();
        setChartData(result.radarData);
        setAnalysis(result.analysisResults);
        setUserName(result.userName);
        setMaxScore(result.maxScore);
        setIsLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 데 실패했습니다:", error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className={styles.radarLoading}>데이터를 불러오는 중입니다...</div>;
  }
  
  if (!chartData || chartData.length === 0) {
      return <div className={styles.radarNoData}>표시할 데이터가 없습니다.</div>;
  }

  // 10, 20, 30, 40, 50을 명시하는 ticks 배열 정의
  const customTicks = [0, 10, 20, 30, 40, 50];

  const headerText = (
      <>
          <span className={styles.radarHeaderLogoWrapper}>
              <LogoIcon className={styles.radarHeaderLogo} /> 
              &nbsp;에서&nbsp;
          </span>
          {userName} 님의 지식 선호도를 분석했어요
      </>
  );

  return (
    <div>
    <div className={styles.radarHeader}>
        <h2 className={styles.radarTitle}>{userName} 님의 지식 리포트</h2>
        <p className={styles.radarSubtitle}>
          {headerText}
        </p>
    </div>

    <div className={styles.radarChartContainer}>
      
      {/* Recharts 컴포넌트 */}
      <ResponsiveContainer width="100%" height="80%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%" 
          data={chartData}
          margin={{ top: 10, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid stroke="#E6E6E6" stroke-width="1px" radialLines={false} />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomPolarAngleAxisTick data={chartData} />}
          />

          <PolarRadiusAxis 
            angle={90} 
            domain={[0, maxScore]}
            ticks={customTicks}
            className={styles.radarRadiusAxisTick}
            axisLine={false}
            tickFormatter={(value) => (value === 0 ? '' : value)}

            tick={(props) => {
            const { payload, x, y } = props;
            if (payload.value === 0) return null; // 0은 렌더링에서 완전히 제외
            
            return (
                <Text
                    x={x}
                    y={y}
                    dx={-4} 
                    dy={10}  
                    fontSize={7}
                    fontWeight="bold"
                    fill='#E6E6E6'
                    fillOpacity={0.8}
                >
                    {payload.value}
                </Text>
            );
        }}
          />
          
          <Radar
            name={`${userName} 님의 선호도`}
            dataKey="value"
            stroke="#209b86"
            strokeWidth={2}
            fill="#209b86"
            fillOpacity={0.6}
            dot={false}
            activeDot={false}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 분석 결과 텍스트 */}
      <div className={styles.radarAnalysisSection}>
        {analysis.map((line, index) => {
          // 0번, 1번 인덱스는 CheckIcon, 나머지는 FilterIcon (현재는 2번 인덱스만 해당)
          const isPrimaryLine = index < 2; 
          const IconComponent = isPrimaryLine ? CheckIcon : FilterIcon;
          const iconClassName = isPrimaryLine ? styles.checkIcon : styles.filterIcon;

          return (
            <div 
              key={index} 
              className={`${styles.radarAnalysisLine} ${isPrimaryLine ? styles.primary : styles.tip}`}
            >
              <span className={styles.icon}>
                <IconComponent className={iconClassName} />
              </span> 
              {line}
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
};

export default ReportRadar;