// app/actions/incrementViews.ts
'use server'

import { writeClient } from '@/sanity/lib/write-client'

export async function incrementViews(id: string, currentViews: number) {
  try {
    await writeClient.patch(id).set({ views: currentViews + 1 }).commit()
    console.log('✅ View count updated')
  } catch (err) {
    console.error('❌ Failed to update views', err)
  }
}
