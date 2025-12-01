import React from 'react';
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
const ReportRadar = ({chartData: scores, userName}) => {
  if (!scores || Object.keys(scores).length === 0) {
      return <div className={styles.radarNoData}>표시할 데이터가 없습니다.</div>;
  }

  // Prop으로 받은 scores 데이터를 Recharts 형식에 맞게 변환
  const radarData = Object.keys(scores).map(subject => ({
      subject: subject,
      value: scores[subject],
      fullMark: 50, // API 명세가 없으므로 50으로 임시 고정
      // 색상 로직은 필요시 추가
  }));
    
  // 1. 점수와 과목명(subject) 배열 생성
const scoreEntries = Object.entries(scores).map(([subject, value]) => ({ subject, value }));

// 2. 최대 점수 찾기
const maxValue = scoreEntries.reduce((max, current) => 
    Math.max(max, current.value), -1
);

// 3. 최소 점수 찾기 (0점 제외)
const nonZeroScores = scoreEntries.filter(item => item.value > 0);
const minValue = nonZeroScores.length > 0 
    ? nonZeroScores.reduce((min, current) => 
        Math.min(min, current.value), Infinity
      )
    : null;

// 4. 동점 분야 목록 추출
const mostStudiedItems = scoreEntries.filter(item => item.value === maxValue);
const leastStudiedItems = nonZeroScores.filter(item => item.value === minValue);

// 5. 나열된 분야 이름 문자열 생성 함수
const formatSubjectList = (items) => {
    const subjects = items.map(item => item.subject);
    if (subjects.length === 0) return null;
    if (subjects.length === 1) return subjects[0];
    
    // 마지막 항목에만 '과' 또는 '와'를 붙여 자연스럽게 연결합니다.
    const lastSubject = subjects.pop();
    const prefix = lastSubject.slice(-1).match(/[가-힣]/) && (lastSubject.charCodeAt(lastSubject.length - 1) - 0xac00) % 28 !== 0 ? '와' : '과';

    return `${subjects.join(', ')} ${prefix} ${lastSubject}`;
};

const mostStudiedList = formatSubjectList(mostStudiedItems);
const leastStudiedList = formatSubjectList(leastStudiedItems);

// 6. 동적 텍스트 생성
let analysis = [
    `${userName} 님의 지식 선호도를 분석했어요!`,
];

// 모든 점수가 동일한지 확인
const allScoresEqual = maxValue === minValue && mostStudiedItems.length === scoreEntries.length;

if (allScoresEqual) {
    analysis.push(`모든 분야에서 균형 있게 지식을 탐색했어요!`);
} else {
    // 가장 많이 공부한 분야 (2번째 줄)
    analysis.push(`${mostStudiedList} 분야를 가장 많이 공부했어요!`);

    // 가장 적게 공부한 분야 (3번째 줄)
    // 최대 분야 리스트와 최소 분야 리스트가 동일하지 않을 경우에만 출력 (예: 점수 50, 50, 10일 때 10만 출력)
    const isDifferent = mostStudiedList !== leastStudiedList;

    if (leastStudiedList && isDifferent) {
        analysis.push(`${leastStudiedList} 분야는 조금 더 탐색해 볼 수 있어요.`);
    }
}

  const maxScore = 50;
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
          data={radarData}
          margin={{ top: 10, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid stroke="#E6E6E6" stroke-width="1px" radialLines={false} />
          
          <PolarAngleAxis 
            dataKey="subject" 
            tick={<CustomPolarAngleAxisTick data={radarData} />}
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