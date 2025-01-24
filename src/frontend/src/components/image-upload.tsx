
import { X, Upload } from "lucide-react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploadProps {
  photos: File[]
  previews: string[]
  onPhotosChange: (photos: File[]) => void
  maxPhotos?: number
}

export function ImageUpload({ photos, previews, onPhotosChange, maxPhotos = 5 }: ImageUploadProps) {
  const [mainPhotoIndex, setMainPhotoIndex] = useState(0)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPhotos = [...photos, ...acceptedFiles].slice(0, maxPhotos)
      onPhotosChange(newPhotos)
    },
    [photos, maxPhotos, onPhotosChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxPhotos - photos.length,
    disabled: photos.length >= maxPhotos,
  })

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
    if (index === mainPhotoIndex) {
      setMainPhotoIndex(0)
    } else if (index < mainPhotoIndex) {
      setMainPhotoIndex(mainPhotoIndex - 1)
    }
  }

  const handleSetMainPhoto = (index: number) => {
    setMainPhotoIndex(index)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main Image Display */}
        <div className="flex-1 min-h-[300px] lg:min-h-[400px] relative rounded-lg overflow-hidden border bg-gray-50">
          {previews.length > 0 ? (
            <img
              src={previews[mainPhotoIndex] || "/placeholder.svg"}
              alt="Main product"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No main image selected</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[400px] lg:w-24">
          {previews.map((preview, index) => (
            <div
              key={index}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer
                ${index === mainPhotoIndex ? "border-primary" : "border-gray-200"}`}
              onClick={() => handleSetMainPhoto(index)}
            >
              <img
                src={preview || "/placeholder.svg"}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemovePhoto(index)
                }}
                className="absolute top-0.5 right-0.5 bg-white rounded-full p-0.5 shadow-md hover:bg-gray-100"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          ))}

          {/* Upload Zone */}
          {photos.length < maxPhotos && (
            <div
              {...getRootProps()}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed
                ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
                flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5`}
            >
              <input {...getInputProps()} />
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Drag & Drop Zone - Only shown when no images */}
      {previews.length === 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center
            ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300"}
            cursor-pointer hover:border-primary hover:bg-primary/5`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag & drop product images here, or click to select files</p>
          <p className="text-xs text-gray-500 mt-1">Maximum {maxPhotos} images. Supports PNG, JPG, JPEG, WEBP</p>
        </div>
      )}
    </div>
  )
}

