import { useState } from 'react'
import searchIcon from '../assets/search.svg'

export function SearchButton() {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setIsSelected((prev) => !prev)}
      className={`flex h-9 w-9 shrink-0 items-center justify-center ${
        isSelected ? 'rounded-lg bg-purple-50' : 'rounded-[14px] bg-gray-50'
        // is Selected 시 검섹 페이지 열리는걸로 변경 
      }`}>
      <img src={searchIcon} alt="search" className="h-4 w-4" />
    </button>
  )
}
