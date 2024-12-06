import React, { useState } from 'react';
import useMarathons from '../hooks/useMarathons';
import { Link } from 'react-router-dom';
import MarathonCard from '../components/MarathonCard';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export default function Marathons() {
  const [event, setEvent] = useState('');
  const [region, setRegion] = useState(''); 
  const [year, setYear] = useState(''); 
  const [month, setMonth] = useState('');


  const { marathonsQuery } = useMarathons();
  const { data: marathons, isLoading, isError } = marathonsQuery;


  const filteredMarathons = marathons?.filter(marathon => {
    const marathonDate = dayjs(marathon.date, 'YYYYMMDD');  // 'YYYYMMDD' 형식으로 dayjs 객체 생성
    const marathonYear = marathonDate.year();
    const marathonMonth = marathonDate.month() + 1; // 월은 0부터 시작하므로 +1 해줍니다.
    const today = dayjs();
    
    // 필터가 없을 경우 오늘 이후의 대회만 필터링
    
    if (event === '' && year === '' && month === '' && region === '' ) {
      return marathonDate.isSameOrAfter(today, 'day');
    }
    
    // 필터가 있을 경우, 해당 조건들에 맞는 대회들만 반환
    return (
      (event === '' || marathon.events.includes(event)) &&
      (year === '' || String(marathonYear) === year) &&
      (month === '' || String(marathonMonth) === month) &&
      (region === '' || marathon.region.includes(region))
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header with Filters */}
      <header className="p-6 bg-white shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">마라톤 목록</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* 카테고리 선택 */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">거리</label>
              <select
                className="px-4 py-2 bg-gray-200 rounded-md"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
              >
                <option value=''>전체</option>
                <option value="Full">Full</option>
                <option value="Half">Half</option>
                <option value="10km">10km</option>
                <option value="5km">5km</option>
              </select>
            </div>
            {/* 년/월 선택 */}
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">연도</label>
              <select
                className="px-4 py-2 bg-gray-200 rounded-md"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">전체</option>
                <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}년</option>
                <option value={new Date().getFullYear()}>{new Date().getFullYear()}년</option>
                <option value={new Date().getFullYear() + 1}>{new Date().getFullYear() + 1}년</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">월</label>
              <select
                className="px-4 py-2 bg-gray-200 rounded-md"
                value={month}
                onChange={(e) => setMonth((e.target.value))}
              >
                  <option value=''>전체</option>
                  <option value={1}>1월</option>
                  <option value={2}>2월</option>
                  <option value={3}>3월</option>
                  <option value={4}>4월</option>
                  <option value={5}>5월</option>
                  <option value={6}>6월</option>
                  <option value={7}>7월</option>
                  <option value={8}>8월</option>
                  <option value={9}>9월</option>
                  <option value={10}>10월</option>
                  <option value={11}>11월</option>
                  <option value={12}>12월</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-2">지역</label>
              <input
                type="text"
                placeholder="지역"
                className="px-4 py-2 bg-gray-200 rounded-md"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Race Events */}
      <main className="container mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMarathons?.map((marathon) => (
          <MarathonCard key={marathon.id} marathon={marathon} />
        ))}
      </main>
      {/* Add Event Link */}
      <div className="fixed bottom-20 right-4">
        <Link to='/marathons/new'>
          <button className="px-6 py-3 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 transition duration-300">
            추가하기
          </button>
        </Link>
      </div>
    </div>
  );
}

