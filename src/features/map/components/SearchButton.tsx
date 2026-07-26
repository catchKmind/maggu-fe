import searchIcon from '../assets/search.svg'

export function SearchButton() {
  return (
    <button
      type="button"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white"
    >
      <img src={searchIcon} alt="search" className="h-4 w-4" />
    </button>
  )
}
