import { useState } from 'react';
import './InputField.css';

//사용하는 input의 id만을 props로 받음 
//id 목록: loginId, loginPassword, name, email, signPassword, passwordCheck, birth
export default function InputField({id}) {
    const [birthValue, setBirthValue] = useState(''); //생년월일 필드 입력 제어를 위함

    //입력 필드 상태 제어를 위함
    const [value,setValue]=useState('');
    const [focused,setFocused]=useState(false);
    const [error, setError]=useState('');
    const [signPasswordValue, setSignPasswordValue] = useState('');

    const fieldData={
        name:'',
        placeholder:'',
        type:'text',
        label: null
    };

    //id에 따라 fieldData의 값이 달라짐
    switch(id){
        case 'loginId':
            fieldData.name ='userId';
            fieldData.placeholder='아이디';
            fieldData.type='text';
            break;
        case 'loginPassword':
            fieldData.name ='userPassword';
            fieldData.placeholder='비밀번호';
            fieldData.type='password';
            break;
        case 'name':
            fieldData.name ='userName';
            fieldData.placeholder='김슈니';
            fieldData.type='text';
            fieldData.label='이름';
            break;
        case 'email':
            fieldData.name ='userEmail';
            fieldData.placeholder='crossnote@gmail.com';
            fieldData.type='email';            
            fieldData.label='이메일';

            break;
        case 'signPassword':
            fieldData.name ='signPassword';
            fieldData.placeholder='영문, 숫자 포함 6자리 이상';
            fieldData.type='password';                        
            fieldData.label='비밀번호';

            break;
        case 'passwordCheck':
            fieldData.name ='passwordCheck';
            fieldData.placeholder='영문, 숫자 포함 6자리 이상';
            fieldData.type='password';            
            fieldData.label='비밀번호 재확인';

            break;
        case 'birth':
            fieldData.name ='birth';
            fieldData.placeholder='2001-03-17';
            fieldData.type='text';            
            fieldData.label='생년월일';

            
            break;
        default:
            console.warn(`알 수 없는 id: ${id}`);
            return null;
    }

    //입력값 검증 함수 (추후 기획측에서 검증 조건 나오면 그에 따라 수정할 예정)
    const validate= (fieldId,v) => {
        if(fieldId === 'email' && v) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return '올바른 이메일 형식이 아닙니다';
        }
        if(fieldId === 'signPassword' && v){
            const ok = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
            if (!ok) return '비밀번호는 영문과 숫자를 포함한 6자리 이상이어야 합니다'; 
        }
        if (fieldId === 'passwordCheck' && v) {
        if (v !== signPasswordValue)
            return '비밀번호가 일치하지 않습니다';
        }
        if (fieldId === 'birth' && v) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v))
            return 'YYYY-MM-DD 형식으로 입력하세요';
        }

        return '';
    }; 

    //입력 핸들러
    const handleChange = (e) => {
        const v = e.target.value;
        setValue(v);

        if (id==='signPassword'){
            setSignPasswordValue(v);
        }
        setError(validate(id,v));
    }

    //상태
    const hasValue = id === 'birth' ? !!birthValue : !!value;
    const status = error
        ? 'is-error'
        : focused
        ? 'is-input'
        : hasValue
        ? 'is-success'
        : 'is-default'; 

    //생년월일 입력 제어 함수(yyyy-mm-dd 형식)
    const handleBirthInput = (e) => {
        let input = e.target.value.replace(/[^0-9]/g,''); 

        if (input.length>4 &&input.length<=6){
            input = input.slice(0,4)+'-'+input.slice(4);
        } //년도-월 
        else if (input.length>6){
            input= input.slice(0,4)+'-'+input.slice(4,6)+'-'+input.slice(6,8);
        }
        input = input.slice(0, 10);
        setBirthValue(input);
        setError(validate('birth', input));
    }

  return (
    <div className= {`input-wrap ${status}`}>
        {fieldData.label && (
        <label htmlFor={id} className="input-label">
          {fieldData.label}
        </label>
      )}

        {/* birth 전용 input */}
        {id === 'birth' ? (
            <input id={id} name={fieldData.name} placeholder={fieldData.placeholder} type={fieldData.type}
                className="input-field" value={birthValue} onInput={handleBirthInput} maxLength="10"
                onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/> )
                :(<input id={id} name={fieldData.name} placeholder={fieldData.placeholder} type={fieldData.type} 
                  className="input-field" value={value} onChange={handleChange} onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)} autoComplete="on"/> )
            }

        <div className='helper'>{error||''}</div>
    </div>
   );
}
