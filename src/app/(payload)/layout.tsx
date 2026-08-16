import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'
import type { ServerFunctionClient } from 'payload'

import { importMap } from './admin/importMap'

type Args = {
  children: React.ReactNode
}

// The server action Payload's admin UI uses for its internal RPC calls
// (saving documents, running validations, etc.) — bound here to our config
// and import map, same pattern Payload's own generated templates use.
const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

// RootLayout (from @payloadcms/next) renders the complete <html>/<body>
// document itself — same role for the /admin subtree that
// app/[locale]/layout.tsx plays for the public site. The two are siblings,
// not nested, which is why /admin stays completely locale-agnostic (also
// enforced by middleware.ts excluding it from locale detection).
const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
