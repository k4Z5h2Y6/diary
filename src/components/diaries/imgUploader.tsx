'use client'
import React, { useEffect, useState } from 'react'
import { Database } from '../../consts/database.types'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { DiariesType } from '@/consts/diaries.types'
type Diaries = DiariesType['public']['Tables']['diaries']['Row']

export default function ImgUplader({
  uid,
  size,
  onUpload,
}: {
  uid: string
  size: number
  onUpload: (url: string) => void
}) {
  const supabase = createClientComponentClient<DiariesType>()
  const [ImgUrl, setImgUrl] = useState<Diaries['diary_img_url']>()
  const [uploading, setUploading] = useState(false)

  const uploadDiaryImg: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${uid}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('diary_img').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert('Error uploading diary_img!')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {ImgUrl ? (
        <Image
          width={size}
          height={size}
          src={ImgUrl}
          alt="DiaryImage"
          className="diaryImage"
          style={{ height: size, width: size }}
        />
      ) : (
        <div className="" style={{ height: size, width: size }} />
      )}
      <div style={{ width: size }}>
        <label className="" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadDiaryImg}
          disabled={uploading}
        />
      </div>
    </div>
  )
}