import searchIcon from '../assets/search.svg'

interface SearchButtonProps {
  onClick?: () => void
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[14px] bg-gray-50"
    >
      <img src={searchIcon} alt="search" className="h-4 w-4" />
    </button>
  )
}
