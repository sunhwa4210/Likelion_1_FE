// 테스트용 더미 데이터 페이지입니다. 

// 더미 데이터용 이미지 (제가 사진을 따로 폴더에 넣어놓지 않아서 뜨지 않을 겁니다!) 
import img1 from "../../assets/apple.jpg";
import img2 from "../../assets/banana.jpg";
import img3 from "../../assets/beauty.jpg";

// <-- 더미 데이터 --> 
// 실제로는 API 호출을 통해 데이터 가져와야 합니다.
export const DUMMY_CURATION_DATA = [
    {
        id: 1,
        imageUrl: img1,
        insightBadge: true,
        fieldBadges: ['예술', '철학', '심리'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 100,
        isBookmarked: true
    },
    {
        id: 2,
        imageUrl: img2,
        crossNoteBadge: true,
        fieldBadges: ['AI'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 250,
        isBookmarked: false
    },
    {
        id: 3,
        imageUrl: img3,
        bestCalumBadge: true,
        fieldBadges: ['경제', '기계'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 80,
        isBookmarked: false
    }
]
