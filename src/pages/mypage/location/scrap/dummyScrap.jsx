// === 더미 데이터 ===
import img from "./kiwi.jpg";
// ✅ API 호출을 통해 데이터 가져와야 함 
export const DUMMY_SCRAP_DATA = [
    {
        id: 1,
        imageUrl: img,
        insightBadge: true,
        fieldBadges: ['AI', '심리', '철학'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 100,
        isBookmarked: true,
        detailContent: [
            'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed. Sapien imperdiet accumsan habitant in vestibulum nisi ante bibendum massa.',
            'Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar.'
        ]
    },
    {
        id: 2,
        imageUrl: img,
        crossNoteBadge: true,
        fieldBadges: ['AI'],
        content: 'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.',
        likes: 250,
        isBookmarked: true,
        detailContent: [
            'Lorem ipsum dolor sit amet consectetur. Id posuere fermentum duis pellentesque.Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar integer ultrices sed. Sapien imperdiet accumsan habitant in vestibulum nisi ante bibendum massa.Lorem ipsum dolor sit amet consectetur. Faucibus eget ac vitae turpis faucibus cras sit amet. Nulla tellus id morbi duis condimentum. Sed purus elementum orci vestibulum pulvinar.'
        ]
    },
    {
        id: 3,
        imageUrl: img,
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