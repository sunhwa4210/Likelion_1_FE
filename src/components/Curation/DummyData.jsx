// 테스트용 더미 데이터 페이지입니다. 
 
// 더미 데이터용 이미지 
import img1 from "./assets/apple.jpg";
import img2 from "./assets/banana.jpg";
import img3 from "./assets/beauty.jpg";

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
        detailContent: [
            // 상세 페이지 본문을 배열로 분할하여 구성 (이미지처럼 단락별로)
            'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
            'Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed. Sapien imperdiet accumsan habitant in vestibulum nisi ante bibendum massa.',
            'Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar.'
        ],
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
        isBookmarked: true,
        detailContent: [
            'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
            'Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed. Sapien imperdiet accumsan habitant in vestibulum nisi ante bibendum massa.',
            'Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar.'

        ]
    },
    {
        id: 3,
        imageUrl: "",
        bestCalumBadge: true,
        fieldBadges: ['경제', '기계'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 80,
        isBookmarked: true,
        detailContent: [
            'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
            'Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed. Sapien imperdiet accumsan habitant in vestibulum nisi ante bibendum massa.',
            'Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar.'
        ]
    }
]
