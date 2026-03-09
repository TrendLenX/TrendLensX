export interface Author {
  id: string
  name: string
  slug: string
  role: string
  bio: string
  image: string
  social?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
}