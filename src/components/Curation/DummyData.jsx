// 테스트용 더미 데이터 페이지입니다. 

// <-- 더미 데이터 --> 
// 실제로는 API 호출을 통해 데이터 가져와야 합니다.
export const DUMMY_CURATION_DATA = [
    {
        id: 1,
        imageUrl: "",
        insightBadge: true,
        fieldBadges: ['예술', '철학', '심리'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 100,
        isBookmarked: true,
        embedType: "youtube",         // 'youtube' | 'link' | null
        embedUrl: "https://youtu.be/SbJqR-S25vs?si=txB9HszqGvqImXep",
    },
    {
        id: 2,
        imageUrl: "",
        crossNoteBadge: true,
        fieldBadges: ['AI'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 250,
        isBookmarked: false
    },
    {
        id: 3,
        imageUrl: "",
        bestCalumBadge: true,
        fieldBadges: ['경제', '기계'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 80,
        isBookmarked: false
    }
]
