"use client"

import { useReducer, useCallback } from "react"
import type { Section, ThemeConfig } from "@/types"

export type BuilderState = {
  id: string
  slug: string
  groomName: string
  brideName: string
  eventDate: string
  eventVenue: string
  eventAddress: string
  eventTime: string
  musicUrl: string
  themeSlug: string
  sections: Section[]
  themeConfig: ThemeConfig
  activeSection: string | null
  isMobilePreview: boolean
  isDirty: boolean
  isSaving: boolean
}

type Action =
  | { type: "SET_FIELD"; field: keyof BuilderState; value: unknown }
  | { type: "TOGGLE_SECTION"; id: string }
  | { type: "UPDATE_SECTION_CONTENT"; id: string; content: Record<string, unknown> }
  | { type: "UPDATE_THEME_CONFIG"; config: Partial<ThemeConfig> }
  | { type: "SELECT_SECTION"; id: string | null }
  | { type: "TOGGLE_PREVIEW_MODE" }
  | { type: "REORDER_SECTIONS"; sections: Section[] }
  | { type: "MARK_SAVED" }

function builderReducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, isDirty: true }

    case "TOGGLE_SECTION":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id ? { ...s, visible: !s.visible } : s
        ),
        isDirty: true,
      }

    case "UPDATE_SECTION_CONTENT":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.id
            ? { ...s, content: { ...s.content, ...action.content } }
            : s
        ),
        isDirty: true,
      }

    case "UPDATE_THEME_CONFIG":
      return {
        ...state,
        themeConfig: { ...state.themeConfig, ...action.config },
        isDirty: true,
      }

    case "SELECT_SECTION":
      return { ...state, activeSection: action.id }

    case "TOGGLE_PREVIEW_MODE":
      return { ...state, isMobilePreview: !state.isMobilePreview }

    case "MARK_SAVED":
      return { ...state, isDirty: false, isSaving: false }

    case "REORDER_SECTIONS":
      return { ...state, sections: action.sections, isDirty: true }

    default:
      return state
  }
}

export function useBuilder(initial: Omit<BuilderState, "activeSection" | "isMobilePreview" | "isDirty" | "isSaving">) {
  const [state, dispatch] = useReducer(builderReducer, {
    ...initial,
    activeSection: null,
    isMobilePreview: true,
    isDirty: false,
    isSaving: false,
  })

  const setField = useCallback(
    (field: keyof BuilderState, value: unknown) =>
      dispatch({ type: "SET_FIELD", field, value }),
    []
  )

  const toggleSection = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_SECTION", id }),
    []
  )

  const updateSectionContent = useCallback(
    (id: string, content: Record<string, unknown>) =>
      dispatch({ type: "UPDATE_SECTION_CONTENT", id, content }),
    []
  )

  const updateThemeConfig = useCallback(
    (config: Partial<ThemeConfig>) =>
      dispatch({ type: "UPDATE_THEME_CONFIG", config }),
    []
  )

  const selectSection = useCallback(
    (id: string | null) => dispatch({ type: "SELECT_SECTION", id }),
    []
  )

  const togglePreviewMode = useCallback(
    () => dispatch({ type: "TOGGLE_PREVIEW_MODE" }),
    []
  )

  const reorderSections = useCallback(
    (sections: Section[]) => dispatch({ type: "REORDER_SECTIONS", sections }),
    []
  )

  const save = useCallback(async () => {
    dispatch({ type: "SET_FIELD", field: "isSaving", value: true })
    const { id, slug, groomName, brideName, eventDate, eventVenue, eventAddress, eventTime, musicUrl, themeSlug, sections, themeConfig } = state

    await fetch(`/api/invitations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug, groomName, brideName, eventDate, eventVenue, eventAddress, eventTime, musicUrl, themeSlug, sections, themeConfig,
      }),
    })

    dispatch({ type: "MARK_SAVED" })
  }, [state])

  return {
    state,
    setField,
    toggleSection,
    updateSectionContent,
    updateThemeConfig,
    selectSection,
    togglePreviewMode,
    reorderSections,
    save,
  }
}
