
import axios from "axios";
import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../components/Modal/ModalProvider'; 
import { presets } from '../../components/Modal/presets';
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

//컴포넌트 import
import Header from "../../components/Header/Header";
import InputField from "../../components/InputField";
import GenderSelector from "../../components/GenderSelector/GenderSelector";
import CategoryFilter from "../../components/Filter/CategoryFilter";
import styles from "./signup.module.css";


export default function Signup() {
  //const API_BASE = process.env.REACT_APP_API_URL || "";
  const API_BASE="";

  //현재 단계
  const [step,setStep]=useState(1);
  //로딩,에러 상태
  const [loading, setLoading]=useState(false);
  //서버에 보낼 데이터 
  const [formData,setFormData]=useState({
    signup: {name:'',email:'',password:'',passwordCheck:''},
    basic: {gender:null, birthdate:''},
    interests:[],
    expertise:[],
    curationLevel: null,
  })
  //step별 완료 상태
  const [isStep1Complete, setIsStep1Complete] = useState(false);
  const [isStep2Complete, setIsStep2Complete] = useState(false);
  const [isStep3Complete, setIsStep3Complete] = useState(false);
  const [isStep4Complete, setIsStep4Complete] = useState(false);


  
  const [error, setError]=useState("");
  const [gender, setGender] = useState(null);          // "MALE" | "FEMALE"
  //모달 사용
  const {open} = useModal();
  const nav = useNavigate();
  const { loginLocal } = useAuth();

//step1에서 회원 가입
  const handleStep1 =  (e) => {
    e.preventDefault();
    setError("");

    //form 입력값 가져오기
    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const passwordCheck = form.passwordCheck.value;

    if (!name||!email||!password||!passwordCheck){
      setError('모든 값을 입력해주세요.');
      return;
    }
    if (password !==passwordCheck){
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setFormData((prev)=>({
      ...prev,
      signup: {name, email, password, passwordCheck},
    }))
    
    setStep(2);
      };

    //모든 필드 선택이 완료되었는지 확인 핸들러  
    const handleStep1Change = (e) => {
    const form = e.currentTarget;
    const name = form.name?.value.trim();
    const email = form.email?.value.trim();
    const password = form.password?.value;
    const passwordCheck = form.passwordCheck?.value;

    const complete = !!name && !!email && !!password && !!passwordCheck;
    setIsStep1Complete(complete);
  };

  //(중간 스탭)구글 온보딩 (진입화면에서 '구글계정으로 계속' -> 구글 소셜 회원가입 -> '구글온보딩'(추가정보 입력, 구글계정으로 회원가입 하는 경우에만 렌더링))
  //구글 소셜 회원가입인 경우에만 signup페이지에서 바로 해당 부분 렌더링하면 될듯 (sep1 건너뛰고)
  //step2  구글 온보딩 회원 정보 (구글 소셜 회원가입의 경우)
  const handleStep2 =  (e) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const birthdate=form.birthdate.value.trim();

    if (!gender||!birthdate){
      setError('성별과 생년월일을 모두 입력해주세요.');
      return;
    }

    setFormData((prev)=> ({
      ...prev,
      basic: {gender, birthdate},
    }));

    setStep(3);
  }

  // step2: gender + birthdate 둘 다 있는지 체크
  const handleStep2Input = (e) => {
    const form = e.currentTarget;
    const birthdate = form.birthdate?.value.trim();
    const complete = !!gender && !!birthdate;
    setIsStep2Complete(complete);
  };


  //step3 관심분야 선택 
  //(진입화면에서 '카카오계정으로 게속' -> 카카오 소셜 회원가입 -> 바로 step 3으로 진입)
  const handleStep3 = (e) => {
    e.preventDefault();
    setError("");
    setStep(4);
  } 

  //step4 전문분야 선택
   const handleStep4 = (e) => {
    e.preventDefault();
    setError("");
    setStep(5);
  }

  //step5 큐레이션 수준 선택, post 작업
  const handleStep5 = async (e) => {
    e.preventDefault();
    setError("");
    
    
    if (!formData.curationLevel) {
    setError('큐레이션 수준을 선택해주세요.');
    return;
    }

    setStep(6);

    const {signup, basic, interests, expertise, curationLevel} = formData;

    try{
      setLoading(true);
      
      //1.회원가입
      await axios.post(`${API_BASE}/auth/local/signup`, signup);
      //1-1. 자동 회원가입
      const loginRes = await loginLocal(signup.email, signup.password);
      const {accessToken} = loginRes;

      const authConfig={
        headers:{Authorization: `Bearer ${accessToken}`},
      };

      //2.추가정보
      await axios.post('/onboarding/basic',
        { gender: basic.gender, birthdate: basic.birthdate },
        authConfig
      );
      //3.관심분야
      await axios.post(
       `${API_BASE}/onboarding/interests`,
        { interestNames: interests },
        authConfig
      );
      //4.전문분야
      await axios.post(
        `${API_BASE}/onboarding/expertise`,
        { expertiseNames: expertise },
        authConfig
      );
      //5.큐레이션 수준
      await axios.post(
      `${API_BASE}/onboarding/curation`,
      { curationLevel },
      authConfig
     );
    } catch (err) {setError(err.response?.data?.message||err.message);}
    finally{setLoading(false);
      console.log(formData);
    }

    }

    //step6: 메인 큐레이션 화면으로 이동
    const handleStep6 =  (e) => {
    e.preventDefault();
    setError("");

    nav('/curation/personal');
    
    }
  

  //헤더 컴포넌트에 보낼 onBack함수
  //step1, step2, step3의 경우 백버튼 누르면, '회원가입을 그만두시겠어요?' 모달 뜨고, 모달의 취소 버튼 누르면 진입화면으로 이동
  const onBackLogin = async () => {
    const res = await open(presets.exitOrContinue());
    if (res === 'exit') nav('/Login');          
    // 'stay'면 아무 것도 안 함
  };

  //step4,5,6의 경우 백버튼 누르면 이전 step으로 이동 setStep(step-1)
  const onBackStep =()=> {setStep(step - 1);}

  const handleSelectCuration = (level) => {
    setFormData(prev => ({...prev, curationLevel:level,}));
  };

//URL에서 스탭 읽어서 리디액션
  const [params]=useSearchParams();
  const initialStep = params.get("step");

  useEffect(()=> {
    if (initialStep){setStep(Number(initialStep));}
  },[]);

  return (
    <div className="app-wrapper">
      {/* sep1 로컬 회원가입 */}
      {step === 1 && (
      <div className={styles.step1}>
        <Header title="회원가입" onBack={onBackLogin}/>

        <form onSubmit={handleStep1}  onChange={handleStep1Change}>
          <div className={styles.formBox}>
          <InputField id="name"/>
          <InputField id="email"/>
          <InputField
            id="signPassword"
            value={formData.signup.password}
            onChangeValue={(val) =>
              setFormData(prev => ({
                ...prev,
                signup: { ...prev.signup, password: val },
              }))
            }
          />
          <InputField
            id="passwordCheck"
            value={formData.signup.passwordCheck}
            onChangeValue={(val) =>
              setFormData(prev => ({
                ...prev,
                signup: { ...prev.signup, passwordCheck: val },
              }))
            }
            compareValue={formData.signup.password}
          />
          </div>

          <div className={styles.signBtnBox}>
          <button
                type="submit"
                className={`${styles.nextBtn} ${
                  isStep1Complete ? styles.isActive : ""
                }`}
              >
            <p>다음</p>
          </button>
          </div>

        </form>
      </div>)}

      {step === 2 && (
      <div className={styles.step2}>
        <Header title="회원가입" onBack={onBackLogin}/>

       <div className={styles.textBox}>
          <h1>추가 정보를 입력해주세요</h1>
          <p>더욱 정확하고 맞춤화 된 큐레이션을 제공할 수 있어요</p>
        </div>

        <form onSubmit={handleStep2} onInput={handleStep2Input}>
          <div className={styles.formBox}>
          <GenderSelector value={gender} onChange={(val) => {
          setGender(val);
          const form = document.querySelector('.step2 form');
          const birthdate = form?.birthdate?.value.trim() || '';
          setIsStep2Complete(!!val && !!birthdate)
        }} />
          <InputField id="birthdate"/>  
          </div>

          <div className={styles.signBtnBox}>
          <button
                type="submit"
                className={`${styles.nextBtn} ${
                  isStep2Complete ? styles.isActive : ""
                }`}
              >
            <p>다음</p>
          </button>   
          </div>

        </form>
      </div>
      )}

      {step === 3 && (
        <div className={styles.step3}>
          <Header title="회원가입" onBack={onBackLogin}/>
          <div className={styles.textBox}>
            <h1>관심 분야를 선택해주세요</h1>
            <p>요즘 관심있는 분야를 큐레이션으로 제공해드려요<br/>관심 분야는 언제든지 변경할 수 있어요</p>
          </div>

        <div className={styles.formBox}>
          <form onSubmit={handleStep3}>
            <CategoryFilter
              variant="interest"
              onChange={({selectedList, selectedCount}) => {
                setFormData(prev => ({ ...prev, interests: selectedList }));
                setIsStep3Complete(selectedCount>0);
              }}
            />

             <div className={styles.signBtnBox}>
             <button
                  type="submit"
                  className={`${styles.nextBtn} ${
                    isStep3Complete ? styles.isActive : ""
                  }`}
                  disabled={!isStep3Complete}
                >
              <p>다음</p>
            </button>   
            </div>
          </form>
        </div>
          
        </div>
      )}

      {step === 4 && (
        <div className={styles.step4}>
          <Header title="회원가입" onBack={onBackStep}/>
          <div className={styles.textBox}>
            <h1>전문 분야를 선택해주세요</h1>
            <p>현재 전공이나 전문적으로 배우고 있는 분야의<br/>더 깊은 지식을 큐레이션으로 알려드릴게요<br/>전문 분야는 언제든지 변경할 수 있어요</p>
          </div>
          
        <div className={styles.formBox}>
          <form onSubmit={handleStep4}>
           <CategoryFilter
              variant="specialty"
              onChange={({selectedList, selectedCount}) => {
                setFormData(prev => ({ ...prev, expertise: selectedList }));
                setIsStep4Complete(selectedCount>0&&selectedCount<5);
              }}
            />

          <div className={styles.signBtnBox}>
            <button
              type="submit"
              className={`${styles.nextBtn} ${
                isStep4Complete ? styles.isActive : ""
              }`}
              disabled={!isStep4Complete}
            >
              <p>다음</p>
            </button>   
            </div>
          </form>
        </div>
        </div>
      )}

      {step === 5 && (
        <div className={styles.step5}>
          <Header title="회원가입" onBack={onBackStep}/>
          <div className={styles.textBox}>
            <h1>큐레이션 수준을 선택해주세요</h1>
            <p>내가 받을 지식의 깊이를 정할 수 있어요<br/>큐레이션 수준은 언제든지 변경할 수 있어요</p>
          </div>


            <form onSubmit={handleStep5}>
              <div className={styles.formBox}>  
              <div className={styles.btnWrapper}>
              <button
                  type="button"
                  className={`${styles.cu} ${
                    formData.curationLevel === "LEVEL_1"
                      ? styles.isActive
                      : ""
                  }`}
                  onClick={() => handleSelectCuration("LEVEL_1")}
                >
                  <p>A : 일반/기초</p>
                </button>

                <div className={styles.explain}>
                  
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="14" height="14" rx="7" fill="#39A2A5"/>
                  <path d="M9.66659 5L5.99992 8.66667L4.33325 7" stroke="#F7FCF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
            
                  <p>내가 선택한 관심/전문 분야에 대해<br/>알기 쉬운 내용으로 구성된 큐레이션을 받을 수 있어요</p>
                </div>
                <div className={styles.explain}>
              
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="14" height="14" rx="7" fill="#39A2A5"/>
                  <path d="M9.66659 5L5.99992 8.66667L4.33325 7" stroke="#F7FCF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                
                  <p><span style={{ fontWeight: 500 }}>이런 분께 추천해요!</span><br/>선택한 관심/전문 분야에 대해 아직 입문자인 경우</p>
                </div>
              </div>

              <div className={styles.btnWrapper}>
                <button
                  type="button"
                  className={`${styles.cu} ${
                    formData.curationLevel === "LEVEL_2"
                      ? styles.isActive
                      : ""
                  }`}
                  onClick={() => handleSelectCuration("LEVEL_2")}
                >
                  <p>B : 전문/심화</p>
                </button>

                <div className={styles.explain}>

                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="14" height="14" rx="7" fill="#39A2A5"/>
                  <path d="M9.66659 5L5.99992 8.66667L4.33325 7" stroke="#F7FCF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  <p>내가 선택한 관심/전문 분야에 대해<br/>더 깊이 있고 심화된 지식을 큐레이션으로 받을 수 있어요</p>
                </div>

                <div className={styles.explain}>

                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="14" height="14" rx="7" fill="#39A2A5"/>
                  <path d="M9.66659 5L5.99992 8.66667L4.33325 7" stroke="#F7FCF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>

                  <p><span style={{ fontWeight: 500 }}>이런 분께 추천해요!</span><br/>선택한 관심/전문 분야의 전공자 또는 전문가인 경우</p>
                </div>
              </div>
              </div>

              <div className={styles.signBtnBox}>
              <button
                  type="submit"
                  className={`${styles.nextBtn} ${
                    formData.curationLevel ? styles.isActive : ""
                  }`}
                >
                <p>다음</p>
              </button>
              </div>

            </form>
            </div>
      )}

      {step === 6 && (
       
       <div className={styles.step6Page}>
        <Header title="회원가입" onBack={onBackStep}/>
        {loading?(
          <div className={styles.completeWrapper}>
            <div></div>
            <div className={styles.completeBox}>
              <div className={styles.spinner} />

              <div className={styles.tBoxWrapper}>
              <h1>정보를 등록 중입니다</h1>
                <div className={styles.tBox}>
                  <p>잠시만 기다려 주세요</p>
                </div>
                </div>      
            </div> 
            
            <div className={styles.signBtnBox}>
                <button
                  type="submit"
                  className={styles.nextBtn}
                  disabled
                >
              <p>시작하기</p>
            </button>
            </div>
          </div>
        ):(
          <div className={styles.completeWrapper}>
            <div></div>
            <div className={styles.completeBox}>
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3.04878 25C3.04878 12.8766 12.8766 3.04878 25 3.04878C37.1234 3.04878 46.9512 12.8766 46.9512 25C46.9512 37.1234 37.1234 46.9512 25 46.9512C12.8766 46.9512 3.04878 37.1234 3.04878 25ZM25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0ZM37.9682 19.6755C38.5635 19.0802 38.5635 18.1149 37.9682 17.5196C37.3729 16.9243 36.4076 16.9243 35.8123 17.5196L22.598 30.734C22.241 31.091 21.6616 31.0912 21.3042 30.7338L15.4072 24.8367C14.8119 24.2414 13.8466 24.2414 13.2513 24.8367C12.656 25.432 12.656 26.3973 13.2513 26.9926L19.1484 32.8896C20.696 34.4372 23.2058 34.4379 24.7538 32.8898L37.9682 19.6755Z" fill="#39A2A5"/>
              </svg>

              <div className={styles.tBoxWrapper}>
              <h1>회원가입이 완료되었습니다</h1>
                <div className={styles.tBox}>
                  <svg width="70" height="8" viewBox="0 0 70 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_223_4861)">
                  <path d="M6.79588 2.82382H5.21631C5.18748 2.61894 5.12858 2.43694 5.03961 2.27785C4.95064 2.11635 4.83646 1.97895 4.69701 1.86566C4.55755 1.75237 4.39648 1.66559 4.21375 1.60533C4.03342 1.54507 3.8375 1.51494 3.62592 1.51494C3.24365 1.51494 2.91067 1.61015 2.62697 1.80058C2.34327 1.9886 2.12328 2.26339 1.96701 2.62496C1.81073 2.98412 1.7326 3.42042 1.7326 3.93385C1.7326 4.46174 1.81073 4.90527 1.96701 5.26443C2.12569 5.6236 2.34687 5.89476 2.63057 6.07796C2.91427 6.26116 3.24245 6.35276 3.6151 6.35276C3.82426 6.35276 4.01783 6.32502 4.19573 6.2696C4.37602 6.21414 4.53594 6.13342 4.67536 6.02734C4.81481 5.91887 4.93022 5.78749 5.02158 5.63323C5.11534 5.47894 5.18026 5.30298 5.21631 5.10534L6.79588 5.11258C6.75501 5.45243 6.65284 5.78025 6.48934 6.09604C6.32826 6.40938 6.11068 6.69022 5.83659 6.93851C5.56494 7.18436 5.24036 7.3796 4.86291 7.52425C4.48784 7.66647 4.06349 7.73756 3.58986 7.73756C2.9311 7.73756 2.34207 7.58811 1.82275 7.28923C1.30585 6.99033 0.897126 6.55763 0.596601 5.9912C0.298476 5.42473 0.149414 4.73894 0.149414 3.93385C0.149414 3.12634 0.30088 2.43935 0.603811 1.8729C0.906744 1.30643 1.31787 0.874962 1.83718 0.578475C2.35649 0.279576 2.94072 0.130127 3.58986 0.130127C4.01783 0.130127 4.41451 0.190389 4.77996 0.310912C5.1478 0.431435 5.47357 0.607398 5.75727 0.838805C6.04097 1.0678 6.27175 1.34862 6.44969 1.68126C6.62999 2.01391 6.7454 2.39476 6.79588 2.82382ZM7.91567 7.63633V0.231367H10.8296C11.3873 0.231367 11.8634 0.331401 12.2577 0.531471C12.6544 0.729129 12.9561 1.00995 13.1629 1.37393C13.372 1.7355 13.4766 2.16095 13.4766 2.65027C13.4766 3.14201 13.3708 3.56505 13.1593 3.91938C12.9477 4.27131 12.6412 4.54127 12.2396 4.72931C11.8406 4.91731 11.3573 5.01131 10.7899 5.01131H8.83887V3.75305H10.5375C10.8356 3.75305 11.0832 3.71207 11.2804 3.63013C11.4775 3.54817 11.6242 3.42524 11.7203 3.26133C11.8189 3.09741 11.8682 2.89373 11.8682 2.65027C11.8682 2.40441 11.8189 2.1971 11.7203 2.02837C11.6242 1.85964 11.4763 1.73188 11.2768 1.64511C11.0796 1.55592 10.8308 1.51133 10.5303 1.51133H9.47721V7.63633H7.91567ZM11.9043 4.26651L13.7399 7.63633H12.0161L10.2201 4.26651H11.9043ZM21.3673 3.93385C21.3673 4.74134 21.2146 5.42833 20.9093 5.9948C20.6063 6.56127 20.1928 6.99393 19.6687 7.29284C19.147 7.58931 18.5603 7.73756 17.9088 7.73756C17.2525 7.73756 16.6634 7.58811 16.1417 7.28923C15.62 6.99033 15.2077 6.55763 14.9048 5.9912C14.6018 5.42473 14.4503 4.73894 14.4503 3.93385C14.4503 3.12634 14.6018 2.43935 14.9048 1.8729C15.2077 1.30643 15.62 0.874962 16.1417 0.578475C16.6634 0.279576 17.2525 0.130127 17.9088 0.130127C18.5603 0.130127 19.147 0.279576 19.6687 0.578475C20.1928 0.874962 20.6063 1.30643 20.9093 1.8729C21.2146 2.43935 21.3673 3.12634 21.3673 3.93385ZM19.7841 3.93385C19.7841 3.41077 19.706 2.96966 19.5497 2.6105C19.3958 2.25134 19.1782 1.97896 18.897 1.79335C18.6157 1.60774 18.2863 1.51494 17.9088 1.51494C17.5313 1.51494 17.202 1.60774 16.9207 1.79335C16.6394 1.97896 16.4206 2.25134 16.2643 2.6105C16.1105 2.96966 16.0335 3.41077 16.0335 3.93385C16.0335 4.45691 16.1105 4.89804 16.2643 5.2572C16.4206 5.61636 16.6394 5.88873 16.9207 6.07433C17.202 6.25996 17.5313 6.35276 17.9088 6.35276C18.2863 6.35276 18.6157 6.25996 18.897 6.07433C19.1782 5.88873 19.3958 5.61636 19.5497 5.2572C19.706 4.89804 19.7841 4.45691 19.7841 3.93385ZM26.5307 2.36102C26.5018 2.06935 26.378 1.84277 26.1592 1.68126C25.9404 1.51976 25.6435 1.43901 25.2684 1.43901C25.0136 1.43901 24.7984 1.47517 24.6229 1.54748C24.4474 1.61739 24.3127 1.71501 24.219 1.84035C24.1276 1.9657 24.082 2.10792 24.082 2.26701C24.0771 2.39958 24.1048 2.51529 24.1649 2.61411C24.2274 2.71294 24.3127 2.79851 24.4209 2.87083C24.5291 2.94073 24.6542 3.0022 24.796 3.05523C24.9379 3.10585 25.0893 3.14924 25.2504 3.18539L25.914 3.34449C26.2362 3.4168 26.5319 3.51322 26.8011 3.63374C27.0704 3.75425 27.3036 3.90251 27.5008 4.07847C27.6979 4.25444 27.8506 4.46174 27.9588 4.70036C28.0694 4.93902 28.1259 5.21262 28.1283 5.52113C28.1259 5.97433 28.0105 6.3672 27.7821 6.69985C27.5561 7.03011 27.2291 7.2868 26.8011 7.47C26.3756 7.6508 25.8623 7.7412 25.2612 7.7412C24.665 7.7412 24.1457 7.6496 23.7033 7.4664C23.2633 7.2832 22.9195 7.012 22.6719 6.65287C22.4267 6.29127 22.298 5.84414 22.286 5.31142H23.7971C23.8139 5.55971 23.8848 5.76702 24.0098 5.93334C24.1372 6.09723 24.3068 6.22138 24.5183 6.30574C24.7323 6.38771 24.9739 6.42869 25.2432 6.42869C25.5076 6.42869 25.7373 6.39011 25.932 6.31298C26.1292 6.23585 26.2818 6.12858 26.39 5.9912C26.4982 5.85378 26.5523 5.69589 26.5523 5.51753C26.5523 5.3512 26.503 5.21138 26.4044 5.09811C26.3083 4.9848 26.1664 4.8884 25.9789 4.80883C25.7938 4.72931 25.5665 4.65698 25.2973 4.59189L24.4931 4.38942C23.8704 4.23756 23.3787 4.00014 23.0181 3.67713C22.6574 3.35413 22.4784 2.91904 22.4807 2.37186C22.4784 1.92351 22.5974 1.53181 22.8378 1.19676C23.0806 0.861704 23.4136 0.600169 23.8367 0.412151C24.2599 0.224135 24.7407 0.130127 25.2793 0.130127C25.8274 0.130127 26.3059 0.224135 26.7146 0.412151C27.1257 0.600169 27.4454 0.861704 27.6739 1.19676C27.9023 1.53181 28.0201 1.9199 28.0273 2.36102H26.5307ZM33.1852 2.36102C33.1564 2.06935 33.0326 1.84277 32.8138 1.68126C32.595 1.51976 32.2981 1.43901 31.923 1.43901C31.6682 1.43901 31.453 1.47517 31.2775 1.54748C31.102 1.61739 30.9674 1.71501 30.8736 1.84035C30.7822 1.9657 30.7365 2.10792 30.7365 2.26701C30.7317 2.39958 30.7594 2.51529 30.8195 2.61411C30.882 2.71294 30.9674 2.79851 31.0755 2.87083C31.1837 2.94073 31.3088 3.0022 31.4506 3.05523C31.5925 3.10585 31.7439 3.14924 31.905 3.18539L32.5686 3.34449C32.8907 3.4168 33.1865 3.51322 33.4557 3.63374C33.725 3.75425 33.9582 3.90251 34.1554 4.07847C34.3525 4.25444 34.5052 4.46174 34.6133 4.70036C34.724 4.93902 34.7805 5.21262 34.7829 5.52113C34.7805 5.97433 34.6651 6.3672 34.4366 6.69985C34.2106 7.03011 33.8837 7.2868 33.4557 7.47C33.0302 7.6508 32.5169 7.7412 31.9158 7.7412C31.3196 7.7412 30.8003 7.6496 30.3579 7.4664C29.9179 7.2832 29.5741 7.012 29.3265 6.65287C29.0812 6.29127 28.9526 5.84414 28.9406 5.31142H30.4516C30.4685 5.55971 30.5394 5.76702 30.6644 5.93334C30.7918 6.09723 30.9613 6.22138 31.1729 6.30574C31.3869 6.38771 31.6285 6.42869 31.8978 6.42869C32.1623 6.42869 32.3918 6.39011 32.5866 6.31298C32.7837 6.23585 32.9364 6.12858 33.0446 5.9912C33.1528 5.85378 33.2069 5.69589 33.2069 5.51753C33.2069 5.3512 33.1576 5.21138 33.059 5.09811C32.9629 4.9848 32.821 4.8884 32.6335 4.80883C32.4483 4.72931 32.2212 4.65698 31.9519 4.59189L31.1477 4.38942C30.525 4.23756 30.0333 4.00014 29.6727 3.67713C29.3121 3.35413 29.1329 2.91904 29.1353 2.37186C29.1329 1.92351 29.252 1.53181 29.4923 1.19676C29.7352 0.861704 30.0682 0.600169 30.4913 0.412151C30.9145 0.224135 31.3953 0.130127 31.9339 0.130127C32.482 0.130127 32.9605 0.224135 33.3692 0.412151C33.7803 0.600169 34.1001 0.861704 34.3284 1.19676C34.5569 1.53181 34.6747 1.9199 34.6819 2.36102H33.1852ZM49.2706 0.231367V7.63633H47.9217L44.7082 2.97569H44.6542V7.63633H43.0928V0.231367H44.4631L47.6511 4.8884H47.7161V0.231367H49.2706ZM57.3478 3.93385C57.3478 4.74134 57.1951 5.42833 56.8897 5.9948C56.5868 6.56127 56.1734 6.99393 55.6493 7.29284C55.1274 7.58931 54.5409 7.73756 53.8891 7.73756C53.233 7.73756 52.644 7.58811 52.1221 7.28923C51.6005 6.99033 51.1881 6.55763 50.8853 5.9912C50.5821 5.42473 50.4308 4.73894 50.4308 3.93385C50.4308 3.12634 50.5821 2.43935 50.8853 1.8729C51.1881 1.30643 51.6005 0.874962 52.1221 0.578475C52.644 0.279576 53.233 0.130127 53.8891 0.130127C54.5409 0.130127 55.1274 0.279576 55.6493 0.578475C56.1734 0.874962 56.5868 1.30643 56.8897 1.8729C57.1951 2.43935 57.3478 3.12634 57.3478 3.93385ZM55.7646 3.93385C55.7646 3.41077 55.6863 2.96966 55.53 2.6105C55.3762 2.25134 55.1586 1.97896 54.8775 1.79335C54.596 1.60774 54.2667 1.51494 53.8891 1.51494C53.5119 1.51494 53.1822 1.60774 52.9011 1.79335C52.6197 1.97896 52.401 2.25134 52.2447 2.6105C52.0909 2.96966 52.014 3.41077 52.014 3.93385C52.014 4.45691 52.0909 4.89804 52.2447 5.2572C52.401 5.61636 52.6197 5.88873 52.9011 6.07433C53.1822 6.25996 53.5119 6.35276 53.8891 6.35276C54.2667 6.35276 54.596 6.25996 54.8775 6.07433C55.1586 5.88873 55.3762 5.61636 55.53 5.2572C55.6863 4.89804 55.7646 4.45691 55.7646 3.93385ZM57.886 1.52217V0.231367H63.9517V1.52217H61.6907V7.63633H60.1471V1.52217H57.886ZM64.9506 7.63633V0.231367H69.9275V1.52217H66.5123V3.28663H69.6714V4.57745H66.5123V6.34553H69.942V7.63633H64.9506Z" fill="#191919"/>
                  <path d="M37.2973 0.231445L38.7869 2.7552H38.8446L40.3411 0.231445H42.1045L39.8507 3.93393L42.1553 7.6364H40.3592L38.8446 5.10902H38.7869L37.2723 7.6364H35.4834L37.795 3.93393L35.5267 0.231445H37.2973Z" fill="#39A2A5"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_223_4861">
                  <rect width="70" height="8" fill="white"/>
                  </clipPath>
                  </defs>
                  </svg>

                  <p>에서 나의 인사이트를 넓혀보세요!</p>
                </div>
                </div>      
            </div> 
            
            <div className={styles.signBtnBox}>
            <button
                  type="submit"
                  className={`${styles.nextBtn} ${styles.isActive}`}
                  onClick={handleStep6}
                >
              <p>시작하기</p>
            </button>
            </div>
          </div>


          
        )}  
      </div>
      )} 

    </div>
  );
};