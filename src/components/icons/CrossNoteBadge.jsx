// 크로스노트 아이콘 컴포넌트 페이지 
import React from 'react';

// 기본값 정의
const defaultProps = {
    width: 85,
    height: 46,
    badgeColor: '#39A2A5', 
    textColor: 'white', 
};

const CrossNoteBadge = ({
    width = defaultProps.width,
    height = defaultProps.height,
    badgeColor = defaultProps.badgeColor,
    textColor = defaultProps.textColor,
    ...rest // 나머지 SVG 속성
}) => (
    <svg 
        width={width}         // Prop으로 설정
        height={height}       // Prop으로 설정
        viewBox="0 0 85 46"    // viewBox는 고정 (내부 요소 크기 비율 유지)
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        {...rest} // 나머지 props 전달
    >
        <g filter="url(#filter0_d_788_14700)">
            {/* rect의 fill을 badgeColor prop으로 설정 */}
            <rect 
                x="14" 
                y="14" 
                width="57" 
                height="18" 
                rx="2" 
                fill={badgeColor} // 동적 색상
                shape-rendering="crispEdges"
            />
            {/* path의 fill을 textColor prop으로 설정 */}
            <path 
                d="M25.08 19.944H29.752V20.8H25.08V19.944ZM24.328 24.968H31.032V25.84H24.328V24.968ZM29.304 19.944H30.352V20.808C30.352 21.1653 30.3467 21.528 30.336 21.896C30.3253 22.2587 30.296 22.6533 30.248 23.08C30.2 23.5013 30.12 23.9813 30.008 24.52L28.952 24.424C29.0693 23.928 29.152 23.472 29.2 23.056C29.248 22.64 29.2773 22.248 29.288 21.88C29.2987 21.512 29.304 21.1547 29.304 20.808V19.944ZM29.52 21.976V22.76L25 22.984L24.864 22.128L29.52 21.976ZM31.6874 25.032H38.3994V25.896H31.6874V25.032ZM34.5034 23.624H35.5594V25.376H34.5034V23.624ZM32.4474 19.776H37.6394V22.248H33.5114V23.488H32.4554V21.416H36.5834V20.624H32.4474V19.776ZM32.4554 23.072H37.8074V23.92H32.4554V23.072ZM41.7988 19.728H42.7188V20.264C42.7188 20.584 42.6734 20.896 42.5828 21.2C42.4974 21.4987 42.3694 21.7813 42.1988 22.048C42.0281 22.3147 41.8174 22.5573 41.5668 22.776C41.3214 22.9893 41.0388 23.1733 40.7188 23.328C40.3988 23.4827 40.0468 23.5973 39.6628 23.672L39.2068 22.784C39.5374 22.7253 39.8388 22.6373 40.1108 22.52C40.3881 22.3973 40.6308 22.2507 40.8388 22.08C41.0468 21.9093 41.2228 21.7253 41.3668 21.528C41.5108 21.3253 41.6174 21.1173 41.6868 20.904C41.7614 20.6853 41.7988 20.472 41.7988 20.264V19.728ZM42.0068 19.728H42.9348V20.264C42.9348 20.4773 42.9694 20.6933 43.0388 20.912C43.1134 21.1307 43.2201 21.3413 43.3588 21.544C43.5028 21.7413 43.6788 21.9227 43.8868 22.088C44.0948 22.2533 44.3348 22.3973 44.6068 22.52C44.8788 22.6373 45.1854 22.7253 45.5268 22.784L45.0708 23.672C44.6868 23.5973 44.3348 23.4827 44.0148 23.328C43.6948 23.1733 43.4094 22.9893 43.1588 22.776C42.9134 22.5627 42.7028 22.3227 42.5268 22.056C42.3561 21.7893 42.2254 21.504 42.1348 21.2C42.0494 20.896 42.0068 20.584 42.0068 20.264V19.728ZM39.0468 24.936H45.7588V25.808H39.0468V24.936ZM47.1581 22.488H52.4061V23.336H47.1581V22.488ZM46.4061 25.024H53.1181V25.88H46.4061V25.024ZM49.2221 22.992H50.2861V25.264H49.2221V22.992ZM47.1581 19.864H48.2221V22.856H47.1581V19.864ZM54.5495 23.112H59.7575V23.952H54.5495V23.112ZM53.7655 25H60.4775V25.864H53.7655V25ZM54.5495 19.84H59.7015V20.688H55.6295V23.344H54.5495V19.84ZM55.3015 21.472H59.5335V22.296H55.3015V21.472Z" 
                fill={textColor} // 동적 색상
            />
        </g>
        <defs>
            <filter id="filter0_d_788_14700" x="0" y="0" width="85" height="46" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_788_14700"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="5"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0 0.473077 0 0 0 0.1 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_788_14700"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_788_14700" result="shape"/>
            </filter>
        </defs>
    </svg>
);

CrossNoteBadge.displayName = 'CrossNoteBadge'; // 컴포넌트 이름 명시 

export default CrossNoteBadge;