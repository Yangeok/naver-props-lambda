import React from 'react';

interface MarkerContentProps {
  title: string;
  amount: number;
  approvalYear: string;
  link1: string;
  link2: string;
  area: string;
  size: string;
  floorInfo: string;
  roomInfo: string;
  subway: string;
  subwayLine: string;
  length: string;
  additionalInfo: string;
  date: string;
  firstDate?: string;
}

const MarkerContent: React.FC<MarkerContentProps> = ({
  title,
  amount,
  approvalYear,
  link1,
  link2,
  area,
  size,
  floorInfo,
  roomInfo,
  subway,
  subwayLine,
  length,
  additionalInfo,
  date,
  firstDate,
}) => {
  return (
    <div style={{ width: '400px' }}>
      <div>
        {title} {amount}억 ({approvalYear}년 승인)
        <a href={link1} target="_blank" rel="noopener noreferrer">
          <img
            src="https://t1.daumcdn.net/localimg/localimages/07/common/kakaomap_favicon.ico"
            style={{ verticalAlign: 'bottom', width: '24px', height: '24px' }}
            alt="Kakao Map Favicon"
          />
        </a>
        <a href={link2} target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.naver.com/favicon.ico"
            style={{ verticalAlign: 'bottom', width: '24px', height: '24px' }}
            alt="Naver Favicon"
          />
        </a>
      </div>
      <div>
        {area} {size}m² {approvalYear} {floorInfo}세대
      </div>
      <div>
        {floorInfo}/{roomInfo}층 방/화장실 {roomInfo}/{roomInfo}개
      </div>
      <div>
        {subway && `${subwayLine} (${subway}) ${length}m`}
      </div>
      <div>{additionalInfo}</div>
      <div>
        {date} 등록
        {firstDate && date !== firstDate ? ` (${firstDate} 최초 등록)` : ''}
      </div>
    </div>
  );
};

export default MarkerContent;
