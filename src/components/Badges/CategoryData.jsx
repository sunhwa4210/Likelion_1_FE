// 버튼 목록들을 따로 정의해둔 페이지입니다. 
import React from "react";

// 색상 그룹 매핑 정의 
// X표시가 없고 테두리 및 필드 색 변화만 있는 카테고리는 해당 배열에서 가져다 쓰시면 됩니다. 
export const COLOR_THEMES = {
    type: {
        backgroundColor: '#FFFFFF', // 활성화 시 배경색 
        borderColor: '#224279', // 활성화 시 테두리 및 글자색 
        borderThick: '1px solid' // 활성화 시 테두리 두께 변화 
    },
   
    humanities: {
        backgroundColor: 'rgba(41, 134, 230, 0.10)', // 활성화 시 배경색 
        borderColor: '#2986E6', // 활성화 시 테두리 및 글자색 
        borderThick: '1px solid' // 활성화 시 테두리 두께 변화 
    },
    science: {
        backgroundColor: 'rgba(254, 129, 123, 0.10)',
        borderColor: '#FE817B',
        borderThick: '1px solid'
    },
    tech: {
        backgroundColor: 'rgba(195, 104, 57, 0.10)',
        borderColor: '#C36839',
        borderThick: '1px solid'
    },
    economy: {
        backgroundColor: 'rgba(149, 130, 255, 0.10)',
        borderColor: '#9582FF',
        borderThick: '1px solid'
    },
    art: {
        backgroundColor: 'rgba(115, 198, 47, 0.10)',
        borderColor: '#73C62F',
        borderThick: '1px solid'
    },
    sport: {
        backgroundColor: 'rgba(253, 136, 217, 0.10)',
        borderColor: '#FD88D9',
        borderThick: '1px solid'
    },
};

export const categories = [
    { label: '인사이트 ', colorKey: 'type' },
    { label: '크로스노트', colorKey: 'type' },
    { label: '베스트칼럼', colorKey: 'type' },

    { label: '인문사회 전체', colorKey: 'humanities', type:'all', num:'1'},
    { label: '철학', colorKey: 'humanities',  type:'sub',num:'2'},
    { label: '역사', colorKey: 'humanities', type:'sub',num:'3'},
    { label: '사회학', colorKey: 'humanities', type:'sub',num:'4'},
    { label: '언어', colorKey: 'humanities', type:'sub',num:'5'},
    { label: '심리', colorKey: 'humanities', type:'sub',num:'6' },

    { label: '자연과학 전체', colorKey: 'science', type:'all',num:'1'},
    { label: '수학', colorKey: 'science', type:'sub',num:'2'},
    { label: '물리', colorKey: 'science', type:'sub', num:'3'},
    { label: '화학', colorKey: 'science', type:'sub',num:'4'},
    { label: '생물', colorKey: 'science', type:'sub',num:'5'},
    { label: '의료', colorKey: 'science', type:'sub', num:'6'},

    { label: '공학·기술 전체', colorKey: 'tech', type:'all',num:'1'},
    { label: 'IT', colorKey: 'tech', type:'sub',num:'2'},
    { label: 'AI', colorKey: 'tech', type:'sub',num:'3'},
    { label: '전자', colorKey: 'tech', type:'sub',num:'4'},
    { label: '기계', colorKey: 'tech', type:'sub',num:'5'},
    { label: '산업공학', colorKey: 'tech', type:'sub',num:'6'},

    { label: '경제·경영 전체', colorKey: 'economy', type:'all',num:'1'},
    { label: '경제', colorKey: 'economy', type:'sub',num:'2'},
    { label: '마케팅', colorKey: 'economy', type:'sub',num:'3'},
    { label: '비즈니스', colorKey: 'economy', type:'sub',num:'4'},

    { label: '예술·문화 전체', colorKey: 'art', type:'all',num:'1'},
    { label: '미술', colorKey: 'art', type:'sub',num:'2'},
    { label: '음악', colorKey: 'art', type:'sub',num:'3'},
    { label: '문학', colorKey: 'art', type:'sub',num:'4'},
    { label: 'UI/UX', colorKey: 'art', type:'sub',num:'5'},
    { label: '건축', colorKey: 'art', type:'sub',num:'6'},
    { label: '영화', colorKey: 'art', type:'sub',num:'7'},

    { label: '스포츠·라이프스타일 전체', colorKey: 'sport', type:'all',num:'1'},
    { label: '건강', colorKey: 'sport', type:'sub',num:'2'},
    { label: '스포츠', colorKey: 'sport', type:'sub',num:'3'},
    { label: '여행', colorKey: 'sport', type:'sub',num:'4'},
    { label: '생활', colorKey: 'sport', type:'sub',num:'5'},
    { label: '환경', colorKey: 'sport', type:'sub',num:'6'},
];