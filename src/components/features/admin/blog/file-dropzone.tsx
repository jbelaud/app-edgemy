'use client'

import {Copy, File, Upload, X} from 'lucide-react'
import * as React from 'react'
import {useDropzone} from 'react-dropzone'
import {toast} from 'sonner'

import FilePreviewCard from '@/components/features/admin/blog/file-image-preview-card'
import {Button} from '@/components/ui/button'
import {Progress} from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {FileResponse} from '@/services/types/domain/file-types'

export interface FileWithPreview extends File {
  preview?: string
}

interface FileDropzoneProps {
  defaultFiles?: FileResponse[]
  onFilesSelected: (files: File[]) => void
  onFilesServerSelectedToRemove: (files: FileResponse) => void
  disabled?: boolean
  disabledMessage?: string
}

export function FileDropzone({
  onFilesSelected,
  defaultFiles = [],
  onFilesServerSelectedToRemove,
  disabled = true,
  disabledMessage = 'Uploading files is disabled',
}: FileDropzoneProps) {
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [uploadProgress, setUploadProgress] = React.useState<{
    [key: string]: number
  }>({})

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (disabled) {
        toast.error(disabledMessage)
        return
      }
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
      setFiles((prev) => [...prev, ...newFiles])
      onFilesSelected(acceptedFiles)

      // Simulate upload progress for each file
      for (const file of acceptedFiles) {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: progress,
          }))
          if (progress >= 100) {
            clearInterval(interval)
          }
        }, 200)
      }
    },
    [disabled, disabledMessage, onFilesSelected]
  )

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 1_048_576, // 1MB in bytes
    onDropRejected: (fileRejections) => {
      for (const fileRejection of fileRejections) {
        if (
          fileRejection.errors.some((error) => error.code === 'file-too-large')
        ) {
          toast.error(
            `File ${fileRejection.file.name} is too large. Maximum size is 1MB.`
          )
        }
      }
    },
  })

  const removeFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name))
    setUploadProgress((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {[name]: _, ...rest} = prev
      return rest
    })
  }

  const removeFileFromServer = (file: FileResponse) => {
    onFilesServerSelectedToRemove(file)
  }

  React.useEffect(() => {
    // Cleanup previews on unmount
    return () => {
      for (const file of files) {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      }
    }
  }, [files])

  React.useEffect(() => {
    if (defaultFiles && defaultFiles.length > 0) {
      setFiles((prevFiles) => {
        // Créer une map des fichiers serveur par taille et type pour la correspondance
        const serverFileMap = new Map()
        defaultFiles.forEach((serverFile) => {
          const key = `${serverFile.size}-${serverFile.type}`
          serverFileMap.set(key, serverFile)
        })

        // Filtrer les fichiers locaux qui ont une correspondance sur le serveur
        return prevFiles.filter((localFile) => {
          const localKey = `${localFile.size}-${localFile.type}`
          const hasServerMatch = serverFileMap.has(localKey)

          // Si on trouve une correspondance, supprimer le fichier local
          if (hasServerMatch) {
            // Nettoyer l'URL de preview
            if (localFile.preview) {
              URL.revokeObjectURL(localFile.preview)
            }
            // Supprimer du uploadProgress
            setUploadProgress((prev) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const {[localFile.name]: _, ...rest} = prev
              return rest
            })
            return false // Supprimer ce fichier local
          }
          return true // Garder ce fichier local
        })
      })
    }
  }, [defaultFiles])

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`rounded-lg border-2 border-dashed p-8 ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'} hover:border-primary hover:bg-primary/5 flex cursor-pointer flex-col items-center justify-center gap-2 text-center transition-colors duration-200`}
      >
        <input {...getInputProps()} />
        <Upload className="text-muted-foreground h-8 w-8" />
        <div>
          <p className="text-sm font-medium">
            {isDragActive
              ? 'Drop the files here...'
              : 'Drag & drop files here, or click to select files'}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Supports images files
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, id) => (
            <div
              key={id}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <File className="h-8 w-8 shrink-0 text-blue-500" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(file.size)}
                </p>
                <Progress
                  value={uploadProgress[file.name] || 0}
                  className="mt-2 h-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {defaultFiles?.length > 0 && (
        <div className="space-y-2">
          {defaultFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-4 rounded-lg border p-4"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <File className="h-8 w-8 shrink-0 text-green-500" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-secondary">
                    <FilePreviewCard file={file} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        navigator.clipboard.writeText(file.url || '')
                        toast.success('Link copied to clipboard')
                      }}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault()
                        removeFileFromServer(file)
                      }}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">
                  {formatFileSize(file.size || 0)}
                </p>
                <Progress
                  value={uploadProgress[file.name] || 0}
                  className="mt-2 h-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
