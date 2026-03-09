export interface Author {
  id: string
  name: string
  slug: string
  role: string
  bio: string
  image: string
  postCount?: number
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}