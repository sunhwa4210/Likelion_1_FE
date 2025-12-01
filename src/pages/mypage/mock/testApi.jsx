import { mockUserProfile } from "../mock/testUser";

export async function fetchUserProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockUserProfile);
        }, 500);
    });
    // ✅ 백엔드 연결 후: 실제 fetch 또는 axios 요청으로 대체 필요
}

// ✅ 프로필 이미지 업로드를 위한 가상의 함수
export const uploadProfileImage = async (file) => {
    console.log(`[API Mock] 파일 업로드 요청: ${file.name}`);

    // ✅ 여기에 axios 또는 fetch를 이용한 POST 요청 코드가 들어가야 할 듯 

    
    // 3초 대기 후 성공 응답을 반환하는 Mockup (실제 네트워크 지연 시뮬레이션)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 성공했다고 가정하고, 임시 URL을 반환
    const tempImageUrl = URL.createObjectURL(file);

    return {
        // 백엔드에서 받은 새로운 프로필 이미지 URL
        profileImageUrl: tempImageUrl, 
        message: "Upload successful"
    };
    
    // 에러를 테스트용 
    // throw new Error("Server upload failed");
};