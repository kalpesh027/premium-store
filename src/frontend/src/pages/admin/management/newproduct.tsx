import { X, Plus, Minus } from "lucide-react"

import { type FormEvent,useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "../../../components/admin/AdminSidebar"
import { useNewProductMutation } from "../../../redux/api/productAPI"
import type { RootState } from "../../../redux/store"
import { responseToast } from "../../../utils/features"
import { ImageUpload } from "../../../components/image-upload"

const NewProduct = () => {
  const { user } = useSelector((state: RootState) => state.userReducer)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [price, setPrice] = useState<number>(1000)
  const [stock, setStock] = useState<number>(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])

  const [description, setDescription] = useState<string>("")
  const [salePrice, setSalePrice] = useState<number>(0)
  const [subcategories, setSubcategories] = useState<string[]>([])
  const [variants, setVariants] = useState<
    Array<{
      color: { name: string; code: string }
      sizes: Array<{ size: string; stock: number }>
    }>
  >([])
  const [returnPolicy, setReturnPolicy] = useState<{
    allowed: boolean
    daysLimit: number
  }>({
    allowed: true,
    daysLimit: 7,
  })

  const [newProduct] = useNewProductMutation();
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return
    setIsLoading(true)
    try {
      if (!name || !price || stock < 0 || !category || !description) {
        throw new Error("Please fill all the fields")
      }
      if (photos.length === 0) {
        throw new Error("Please select at least one photo")
      }
      if (returnPolicy.allowed && (!returnPolicy.daysLimit || returnPolicy.daysLimit <= 0)) {
        throw new Error("Please enter a valid number of return days.")
      }

      const formData = new FormData()

      formData.set("name", name)
      formData.set("price", price.toString())
      formData.set("stock", stock.toString())
      formData.set("category", category)
      formData.set("description", description)
      formData.set("salePrice", salePrice.toString())
      formData.set("returnPolicy[allowed]", returnPolicy.allowed.toString())
      formData.set("returnPolicy[daysLimit]", returnPolicy.daysLimit.toString())

      variants.forEach((variant, variantIndex) => {
        formData.append(`variants[${variantIndex}][color][name]`, variant.color.name)
        formData.append(`variants[${variantIndex}][color][code]`, variant.color.code)

        variant.sizes.forEach((size, sizeIndex) => {
          formData.append(`variants[${variantIndex}][sizes][${sizeIndex}][size]`, size.size)
          formData.append(`variants[${variantIndex}][sizes][${sizeIndex}][stock]`, size.stock.toString())
        })
      })

      photos.forEach((file) => {
        formData.append("photos", file)
      })

      const res = await newProduct({ id: user?._id!, formData })

      responseToast(res, navigate, "/admin/product")
    } catch (error) {
      console.error(error)
      // Add error handling here, e.g., show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">New Product</h2>
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Product name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  salePrice
                </label>
                <input
                  type="number"
                  id="salePrice"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Sale Price"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter description here"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. laptop, camera etc"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Subcategories</label>
                <div className="flex flex-wrap gap-2">
                  {subcategories.map((subcat, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                      <span className="text-sm">{subcat}</span>
                      <button
                        type="button"
                        onClick={() => setSubcategories(subcategories.filter((_, i) => i !== index))}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add subcategory"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const value = e.currentTarget.value.trim()
                      if (value && !subcategories.includes(value)) {
                        setSubcategories([...subcategories, value])
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Variants</label>
                {variants.map((variant, variantIndex) => (
                  <div key={variantIndex} className="border p-4 rounded-md mb-4">
                    {/* Color Inputs */}
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={variant.color.name}
                        placeholder="Color Name"
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[variantIndex].color.name = e.target.value
                          setVariants(newVariants)
                        }}
                        className="block w-1/2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                      <input
                        type="text"
                        value={variant.color.code}
                        placeholder="Color Code (e.g., #FFFFFF)"
                        onChange={(e) => {
                          const newVariants = [...variants]
                          newVariants[variantIndex].color.code = e.target.value
                          setVariants(newVariants)
                        }}
                        className="block w-1/2 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>

                    {/* Sizes */}
                    {variant.sizes.map((size, sizeIndex) => (
                      <div key={sizeIndex} className="flex items-center space-x-2 mb-2">
                        <select
                          value={size.size}
                          onChange={(e) => {
                            const newVariants = [...variants]
                            newVariants[variantIndex].sizes[sizeIndex].size = e.target.value
                            setVariants(newVariants)
                          }}
                          className="block w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          <option value="XS">XS</option>
                          <option value="S">S</option>
                          <option value="M">M</option>
                          <option value="L">L</option>
                          <option value="XL">XL</option>
                        </select>
                        <input
                          type="number"
                          value={size.stock}
                          onChange={(e) => {
                            const newVariants = [...variants]
                            newVariants[variantIndex].sizes[sizeIndex].stock = Number(e.target.value)
                            setVariants(newVariants)
                          }}
                          className="block w-1/3 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Stock"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newVariants = [...variants]
                            newVariants[variantIndex].sizes.splice(sizeIndex, 1)
                            setVariants(newVariants)
                          }}
                          className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newVariants = [...variants]
                        newVariants[variantIndex].sizes.push({
                          size: "M",
                          stock: 0,
                        })
                        setVariants(newVariants)
                      }}
                      className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Size
                    </button>

                    {/* Remove Variant */}
                    <button
                      type="button"
                      onClick={() => {
                        const newVariants = [...variants]
                        newVariants.splice(variantIndex, 1)
                        setVariants(newVariants)
                      }}
                      className="mt-4 text-red-500 hover:text-red-700"
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                {/* Add Variant */}
                <button
                  type="button"
                  onClick={() =>
                    setVariants([
                      ...variants,
                      {
                        color: { name: "", code: "" },
                        sizes: [{ size: "M", stock: 0 }],
                      },
                    ])
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-5 w-5 mr-2" /> Add Variant
                </button>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Return Policy</label>
                {/* Checkbox to Enable/Disable Return Policy */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={returnPolicy.allowed}
                    onChange={(e) =>
                      setReturnPolicy((prev) => ({
                        ...prev,
                        allowed: e.target.checked,
                      }))
                    }
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <span className="text-gray-700 font-medium">Returns Allowed</span>
                </div>

                {/* Input for Return Days (only if allowed is true) */}
                {returnPolicy.allowed && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={returnPolicy.daysLimit}
                      onChange={(e) =>
                        setReturnPolicy((prev) => ({
                          ...prev,
                          daysLimit: Number(e.target.value),
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Number of return days"
                    />
                    <span className="text-gray-700">Days</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Photos (Max 5)</label>
                <ImageUpload
                  photos={photos}
                  previews={previews}
                  onPhotosChange={(newPhotos) => {
                    setPhotos(newPhotos)
                    setPreviews(newPhotos.map((file) => URL.createObjectURL(file)))
                  }}
                  maxPhotos={5}
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewProduct

