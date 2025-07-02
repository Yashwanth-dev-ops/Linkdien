import { create } from 'zustand'

interface ProfileData {
  id: string
  headline: string
  summary: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    school: string
    degree: string
    field: string
    year: string
  }>
  skills: string[]
  connections: number
  profileViews: number
  lastUpdated: string
}

interface OptimizationScore {
  overall: number
  headline: number
  summary: number
  experience: number
  skills: number
  completeness: number
  engagement: number
}

interface ProfileState {
  profileData: ProfileData | null
  currentScore: OptimizationScore | null
  previousScore: OptimizationScore | null
  isLoading: boolean
  error: string | null
  setProfileData: (data: ProfileData) => void
  setCurrentScore: (score: OptimizationScore) => void
  setPreviousScore: (score: OptimizationScore) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  profileData: null,
  currentScore: null,
  previousScore: null,
  isLoading: false,
  error: null,
  setProfileData: (data) => set({ profileData: data }),
  setCurrentScore: (score) => set({ currentScore: score }),
  setPreviousScore: (score) => set({ previousScore: score }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error })
}))