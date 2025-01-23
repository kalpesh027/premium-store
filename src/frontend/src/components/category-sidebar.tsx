import { ChevronRight } from 'lucide-react'
import { Link } from "react-router-dom"

const categories = [
  { name: "Woman's Fashion", hasSubmenu: true },
  { name: "Men's Fashion", hasSubmenu: true },
  { name: "Electronics", hasSubmenu: false },
  { name: "Home & Lifestyle", hasSubmenu: false },
  { name: "Medicine", hasSubmenu: false },
  { name: "Sports & Outdoor", hasSubmenu: false },
  { name: "Baby's & Toys", hasSubmenu: false },
  { name: "Groceries & Pets", hasSubmenu: false },
  { name: "Health & Beauty", hasSubmenu: false },
]

export default function CategorySidebar() {
  return (
    <div className="w-64 bg-white">
      <nav className="flex flex-col space-y-1">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/category/${category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-100 transition-colors"
          >
            {category.name}
            {category.hasSubmenu && (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  )
}

