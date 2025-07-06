'use client'

import { useState, useEffect } from 'react'
import { TimeFilter, KPIType } from '@/types/dashboard'
import { TargetsService } from '@/lib/targets-service'

export function useTargets(timeFilter: TimeFilter, date?: Date) {
  const [targets, setTargets] = useState<Record<KPIType, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTargets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const currentTargets = await TargetsService.getCurrentTargets(timeFilter, date)
        setTargets(currentTargets)
      } catch (err) {
        console.error('Error loading targets:', err)
        setError(err instanceof Error ? err.message : 'Failed to load targets')
      } finally {
        setLoading(false)
      }
    }

    loadTargets()
  }, [timeFilter, date])

  return {
    targets,
    loading,
    error,
    refetch: () => {
      const loadTargets = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const currentTargets = await TargetsService.getCurrentTargets(timeFilter, date)
          setTargets(currentTargets)
        } catch (err) {
          console.error('Error loading targets:', err)
          setError(err instanceof Error ? err.message : 'Failed to load targets')
        } finally {
          setLoading(false)
        }
      }
      loadTargets()
    }
  }
}

export function useYTDTargets(year?: number) {
  const [targets, setTargets] = useState<Record<KPIType, number> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTargets = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const ytdTargets = await TargetsService.getYTDTargets(year)
        setTargets(ytdTargets)
      } catch (err) {
        console.error('Error loading YTD targets:', err)
        setError(err instanceof Error ? err.message : 'Failed to load YTD targets')
      } finally {
        setLoading(false)
      }
    }

    loadTargets()
  }, [year])

  return {
    targets,
    loading,
    error,
    refetch: () => {
      const loadTargets = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const ytdTargets = await TargetsService.getYTDTargets(year)
          setTargets(ytdTargets)
        } catch (err) {
          console.error('Error loading YTD targets:', err)
          setError(err instanceof Error ? err.message : 'Failed to load YTD targets')
        } finally {
          setLoading(false)
        }
      }
      loadTargets()
    }
  }
}